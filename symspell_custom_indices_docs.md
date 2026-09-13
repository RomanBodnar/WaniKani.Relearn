# In-Memory Full-Text Search: SymSpell + Custom Indices

Documentation for improving `SubjectSearchService` in WaniKani.Relearn.

---

## Table of Contents

- [Problem Statement](#problem-statement)
- [Architecture Overview](#architecture-overview)
- [1. Exact/Prefix Dictionary Index](#1-exactprefix-dictionary-index)
- [2. Trie (Prefix Tree)](#2-trie-prefix-tree)
- [3. N-Gram / Trigram Index](#3-n-gram--trigram-index)
- [4. SymSpell (Fuzzy Matching)](#4-symspell-fuzzy-matching)
- [5. Word Normalization](#5-word-normalization)
- [6. Combined Search Pipeline](#6-combined-search-pipeline)
- [7. Integration Points](#7-integration-points)
- [Appendix: Comparison with Alternatives](#appendix-comparison-with-alternatives)

---

## Problem Statement

The current `SubjectSearchService.cs` performs a **linear scan** over all ~9,000 subjects on every search query. For each subject, it calls `.ToLowerInvariant()` on every field, runs `.StartsWith()` and `.Contains()` checks, and computes pairwise Levenshtein distance using a heap-allocated 2D array (`new int[,]`).

**Current cost per search:**

- ~9,000 subjects × ~5 fields = **~45,000 string comparisons**
- Each `.ToLowerInvariant()` allocates a new string on the heap
- Levenshtein distance (`LevenshteinDistance` method) allocates `new int[source.Length + 1, target.Length + 1]` for every candidate
- Full LINQ sort (`.OrderByDescending().ThenBy().ThenBy()`) on all matches

**Target:** Sub-millisecond search with the same scoring semantics, zero per-query heap allocations for indexing lookups.

---

## Architecture Overview

Four components, each handling a different query type:

```
User Query
    │
    ▼
┌──────────────────┐
│  Normalize Query  │  (case fold, NFKC, katakana→hiragana)
└────────┬─────────┘
         │
         ▼
┌────────────────────────────────────────────────┐
│              Search Pipeline                    │
│                                                 │
│  1. Dictionary ──→ Exact match      (score 1000)│
│  2. Trie ────────→ Prefix match     (score 850) │
│  3. Trigram Index → Substring match  (score 700) │
│  4. SymSpell ────→ Fuzzy/typo match  (score 450) │
│                                                 │
│  Merge results, deduplicate, rank by score      │
└────────────────────────────────────────────────┘
         │
         ▼
    Sorted Results
```

All indices are built **once** when `SubjectCache` finishes loading. Queries only perform lookups — no iteration over all subjects.

---

## 1. Exact/Prefix Dictionary Index

### Concept

A `Dictionary<string, List<int>>` mapping every normalized searchable string to the Subject IDs that contain it. Exact lookups become O(1) hash lookups.

### What Gets Indexed

| Source Field | Example Key | Subject IDs |
|:---|:---|:---|
| `Subject.Characters` | `"水"` | `[440]` |
| `Subject.Slug` | `"water"` | `[440]` |
| `Meaning.Meaning` (primary) | `"water"` | `[440, 2983]` |
| `AuxiliaryMeaning.Meaning` | `"h2o"` | `[440]` |
| `KanjiReading.Reading` | `"すい"` | `[440]` |
| `VocabularyReading.Reading` | `"みず"` | `[440]` |

### C# Implementation

```csharp
public class ExactIndex
{
    private readonly Dictionary<string, List<int>> _index = new(StringComparer.Ordinal);

    public void Add(string? text, int subjectId)
    {
        if (string.IsNullOrEmpty(text)) return;
        var key = Normalize(text);  // see §5 Normalization
        if (!_index.TryGetValue(key, out var list))
        {
            list = new List<int>();
            _index[key] = list;
        }
        if (!list.Contains(subjectId))
            list.Add(subjectId);
    }

    /// <summary>
    /// O(1) exact lookup. Returns null if no match.
    /// </summary>
    public List<int>? ExactLookup(string query)
        => _index.GetValueOrDefault(Normalize(query));
}
```

### Limitation

A Dictionary only handles **exact** matches. Typing `"wat"` returns nothing because that key doesn't exist. This is what the Trie solves.

---

## 2. Trie (Prefix Tree)

### Concept

A tree where each edge represents one character, and paths from root to marked nodes spell out stored words. Prefix search is walking edges — cost depends only on query length, not dataset size.

### How It Works

Given indexed words: `"water"`, `"waterfall"`, `"mountain"`, `"mouth"`, `"moon"`:

```
        (root)
       /   |   \
      w    m    ...
      |    |
      a    o
      |   / \
      t  u   o
      |  |   |
      e  n   n  ← "moon" endpoint
      |  |
      r  t
      |  |  \
   (water) a   h  ← "mouth" endpoint
      |    |
      f    i
      |    |
      a    n  ← "mountain" endpoint
      |
      l
      |
      l  ← "waterfall" endpoint
```

**Searching for `"mou"`:** Walk root → m → o → u (3 steps). Then collect all words in the subtree: `"mouth"`, `"mountain"`. Independent of total dictionary size.

### C# Implementation

```csharp
public class TrieNode
{
    public Dictionary<char, TrieNode> Children { get; } = new();
    public bool IsEndOfWord { get; set; }
    public List<int> SubjectIds { get; } = new();
}

public class PrefixTrie
{
    private readonly TrieNode _root = new();

    /// <summary>
    /// Insert a word associated with a Subject ID.
    /// </summary>
    public void Insert(string? word, int subjectId)
    {
        if (string.IsNullOrEmpty(word)) return;
        var normalized = Normalize(word);  // see §5

        var node = _root;
        foreach (var ch in normalized)
        {
            if (!node.Children.TryGetValue(ch, out var child))
            {
                child = new TrieNode();
                node.Children[ch] = child;
            }
            node = child;
        }
        node.IsEndOfWord = true;
        if (!node.SubjectIds.Contains(subjectId))
            node.SubjectIds.Add(subjectId);
    }

    /// <summary>
    /// Find all Subject IDs whose indexed word starts with the given prefix.
    /// Complexity: O(L + K) where L = prefix length, K = results in subtree.
    /// </summary>
    public List<int> SearchByPrefix(string prefix)
    {
        var normalized = Normalize(prefix);

        // Step 1: Walk to the prefix node
        var node = _root;
        foreach (var ch in normalized)
        {
            if (!node.Children.TryGetValue(ch, out node))
                return new List<int>();  // no path exists
        }

        // Step 2: Collect all Subject IDs in the subtree
        var results = new List<int>();
        CollectAll(node, results);
        return results;
    }

    private static void CollectAll(TrieNode node, List<int> results)
    {
        if (node.IsEndOfWord)
            results.AddRange(node.SubjectIds);
        foreach (var child in node.Children.Values)
            CollectAll(child, results);
    }
}
```

### Optimization: Radix Tree (Compressed Trie)

A plain Trie creates one node per character. A **Radix Tree** compresses chains of single-child nodes into one node with a multi-character label:

```
Before: root → m → o → u → n → t → a → i → n
After:  root → "mountain"
```

Same lookup semantics, significantly less memory. Relevant if indexing thousands of long English words.

### Limitation

A Trie handles exact and prefix queries. But if a user searches `"ater"` hoping to find `"water"`, the Trie has no edge from root for `'a'` leading to that word. For arbitrary **substring** matching, use a Trigram Index.

---

## 3. N-Gram / Trigram Index

### Concept

Break every indexed string into overlapping 3-character slices (trigrams), and map each slice to the Subject IDs containing it. Substring search becomes an **intersection of posting lists**.

### How Indexing Works

Take the meaning `"mountain"` (Subject #765). Extract every 3-character window:

```
"mountain" → ["mou", "oun", "unt", "nta", "tai", "ain"]
```

Each trigram gets an entry in the index pointing back to Subject #765. After indexing all subjects:

| Trigram | Posting List (Subject IDs) |
|:---|:---|
| `"mou"` | {765, 441, 450} |
| `"oun"` | {765, 448} |
| `"unt"` | {765, 448} |
| `"nta"` | {765, 448} |
| `"tai"` | {765, 448} |
| `"ain"` | {765, 448} |
| `"wat"` | {440, 449} |
| `"ate"` | {440, 449} |
| `"ter"` | {440, 449} |
| ... | ... |

### How Querying Works

User searches `"ount"`:

1. Extract query trigrams: `["oun", "unt"]`
2. Look up posting list for `"oun"` → `{765, 448}`
3. Look up posting list for `"unt"` → `{765, 448}`
4. **Intersect** → `{765, 448}` (candidates)
5. **Post-verify**: check `"mountain".Contains("ount")` ✓, `"mountain range".Contains("ount")` ✓
6. Return verified matches

### Why N-Grams Are Good for Japanese

Japanese has no spaces between words. Traditional tokenizers (MeCab) are complex. N-grams just slide a window — they work on any script identically:

```
"食べ物" → ["食べ", "べ物"]   (bigrams)
"食べる" → ["食べ", "べる"]   (bigrams)
```

Searching for `"食べ"` finds both because both produce the bigram `"食べ"`.

> **Note:** For Japanese/CJK text, **bigrams** (n=2) are more appropriate than trigrams because many Japanese words are only 2 characters long.

### C# Implementation

```csharp
public class TrigramIndex
{
    private readonly Dictionary<string, HashSet<int>> _index = new(StringComparer.Ordinal);
    private readonly int _n;

    /// <param name="n">N-gram size. Use 3 for English, 2 for Japanese/CJK.</param>
    public TrigramIndex(int n = 3)
    {
        _n = n;
    }

    /// <summary>
    /// Index a text value associated with a Subject ID.
    /// </summary>
    public void Add(string? text, int subjectId)
    {
        if (string.IsNullOrEmpty(text)) return;
        var lower = Normalize(text);  // see §5

        for (int i = 0; i <= lower.Length - _n; i++)
        {
            var ngram = lower.Substring(i, _n);
            if (!_index.TryGetValue(ngram, out var set))
            {
                set = new HashSet<int>();
                _index[ngram] = set;
            }
            set.Add(subjectId);
        }
    }

    /// <summary>
    /// Find candidate Subject IDs that may contain the query as a substring.
    /// Results are candidates — caller must post-verify with .Contains().
    /// Complexity: O(K) where K = size of smallest posting list.
    /// </summary>
    public HashSet<int> Search(string query)
    {
        var lower = Normalize(query);
        if (lower.Length < _n)
            return new HashSet<int>();  // query too short for n-gram matching

        HashSet<int>? result = null;

        for (int i = 0; i <= lower.Length - _n; i++)
        {
            var ngram = lower.Substring(i, _n);
            if (!_index.TryGetValue(ngram, out var set))
                return new HashSet<int>();  // trigram not found → no possible match

            if (result == null)
                result = new HashSet<int>(set);
            else
                result.IntersectWith(set);  // narrow down candidates

            if (result.Count == 0)
                return result;  // early exit
        }

        return result ?? new HashSet<int>();
    }
}
```

### Important: Post-Verification

Trigrams produce **candidates**, not guaranteed matches. The intersection may include false positives for short queries. Always verify with a final `.Contains()` check on the small candidate set:

```csharp
var candidates = trigramIndex.Search(query);
var verified = candidates
    .Where(id => GetSearchableTexts(id).Any(t => t.Contains(query)))
    .ToList();
```

---

## 4. SymSpell (Fuzzy Matching)

### Concept

SymSpell replaces the hand-written `LevenshteinDistance` method with a pre-computed delete-variant dictionary. Instead of computing edit distance against every candidate at query time, it pre-generates all deletion variants at index time, so lookup is a simple hash table check.

**Performance:** ~0.03ms per word (edit distance 2). 1,000,000x faster than brute-force Levenshtein.

### NuGet Package

```xml
<PackageReference Include="SymSpell" Version="6.7.3" />
```

### C# Implementation

```csharp
using SymSpell;

public class FuzzyIndex
{
    private readonly SymSpell _symSpell;
    private readonly Dictionary<string, List<int>> _wordToSubjectIds = new(StringComparer.Ordinal);

    public FuzzyIndex()
    {
        _symSpell = new SymSpell(
            initialCapacity: 20000,
            maxDictionaryEditDistance: 2  // max typos to tolerate
        );
    }

    /// <summary>
    /// Index a word associated with a Subject ID.
    /// Call for each meaning, slug, reading of each subject.
    /// </summary>
    public void Add(string? text, int subjectId)
    {
        if (string.IsNullOrEmpty(text)) return;
        var word = Normalize(text);

        _symSpell.CreateDictionaryEntry(word, 1);

        if (!_wordToSubjectIds.TryGetValue(word, out var list))
        {
            list = new List<int>();
            _wordToSubjectIds[word] = list;
        }
        if (!list.Contains(subjectId))
            list.Add(subjectId);
    }

    /// <summary>
    /// Find subjects whose indexed words are within editDistance of the query.
    /// Returns (SubjectId, EditDistance, MatchedTerm) tuples.
    /// </summary>
    public List<(int SubjectId, int Distance, string Term)> Lookup(
        string query,
        int maxEditDistance = 2,
        SymSpell.Verbosity verbosity = SymSpell.Verbosity.Closest)
    {
        var normalized = Normalize(query);
        var suggestions = _symSpell.Lookup(normalized, verbosity, maxEditDistance);

        var results = new List<(int, int, string)>();
        foreach (var suggestion in suggestions)
        {
            if (_wordToSubjectIds.TryGetValue(suggestion.term, out var ids))
            {
                foreach (var id in ids)
                    results.Add((id, suggestion.distance, suggestion.term));
            }
        }

        return results;
    }
}
```

### SymSpell Verbosity Modes

| Mode | Behavior |
|:---|:---|
| `Top` | Returns only the single best suggestion (smallest edit distance, highest frequency) |
| `Closest` | Returns all suggestions at the smallest edit distance found |
| `All` | Returns all suggestions within maxEditDistance |

For search, `Closest` is usually the right choice — it returns all equally-good corrections without flooding results with distant matches.

---

## 5. Word Normalization

All indices must normalize text identically at **index time** and **query time**. If both sides produce the same output, they match.

### Normalization Pipeline

```csharp
/// <summary>
/// Standard normalization applied to all text before indexing or querying.
/// </summary>
public static string Normalize(string text)
{
    // 1. Unicode compatibility normalization (NFKC)
    //    Fullwidth → ASCII (Ａ → A), compatibility chars unified (ﬁ → fi)
    //    Halfwidth katakana → fullwidth (ｶ → カ)
    var result = text.Normalize(NormalizationForm.FormKC);

    // 2. Case folding
    result = result.ToLowerInvariant();

    // 3. Strip hyphens (slugs use them: "mouth-opening" → "mouth opening")
    result = result.Replace('-', ' ');

    // 4. Trim whitespace
    result = result.Trim();

    return result;
}
```

### Japanese-Specific Normalization

Apply on top of standard normalization for reading fields:

```csharp
/// <summary>
/// Converts all Katakana to Hiragana so タベル matches たべる.
/// Katakana and Hiragana are offset by exactly 0x60 in Unicode.
/// </summary>
public static string KatakanaToHiragana(string text)
{
    var chars = text.ToCharArray();
    for (int i = 0; i < chars.Length; i++)
    {
        // Katakana range: U+30A1 (ァ) to U+30F6 (ヶ)
        if (chars[i] >= '\u30A1' && chars[i] <= '\u30F6')
            chars[i] = (char)(chars[i] - 0x60);
    }
    return new string(chars);
}

/// <summary>
/// Full normalization for Japanese text fields (readings, characters).
/// </summary>
public static string NormalizeJapanese(string text)
{
    var result = Normalize(text);        // standard pipeline
    result = KatakanaToHiragana(result); // katakana → hiragana
    return result;
}
```

### Unicode Normalization Forms Reference

| Form | Name | Effect | Use Case |
|:---|:---|:---|:---|
| **NFC** | Composed | `e + ◌́` → `é` | Default for most text |
| **NFD** | Decomposed | `é` → `e + ◌́` | Accent-insensitive search |
| **NFKC** | Compat. Composed | `ﬁ` → `fi`, `Ａ` → `A`, `ｶ` → `カ` | **Recommended for search** |
| **NFKD** | Compat. Decomposed | Same as NFKC but decomposed | Currently used in SubjectCache |

> **Note:** The current code uses NFKD in `SubjectCache.cs`. NFKC is preferred for search because it normalizes compatibility variants AND keeps characters composed (simpler string comparisons).

### What NOT to Normalize

- **Don't stem** WaniKani meanings — they're already in dictionary form (`"water"`, not `"watering"`)
- **Don't remove stop words** at index time — meanings like `"to eat"` would lose the `"to"` and become just `"eat"`, making the slug redundant. Remove stop words at **query time** only if needed.

---

## 6. Combined Search Pipeline

### Search Flow

```csharp
public class SubjectSearchService
{
    private readonly SubjectCache _cache;
    private readonly ExactIndex _exactIndex;
    private readonly PrefixTrie _prefixTrie;
    private readonly TrigramIndex _trigramIndex;     // n=3 for English text
    private readonly TrigramIndex _bigramIndex;      // n=2 for Japanese text
    private readonly FuzzyIndex _fuzzyIndex;

    public async ValueTask<IEnumerable<Subject>> SearchAsync(
        string query, SubjectType[]? types = null,
        int? page = null, int? perPage = null)
    {
        if (string.IsNullOrWhiteSpace(query))
            return Enumerable.Empty<Subject>();

        var normalizedQuery = Normalize(query);
        var scored = new Dictionary<int, double>();  // subjectId → best score

        // ── Phase 1: Exact match (score 1000) ──
        var exactHits = _exactIndex.ExactLookup(normalizedQuery);
        if (exactHits != null)
            foreach (var id in exactHits)
                UpdateScore(scored, id, 1000);

        // ── Phase 2: Prefix match (score 850) ──
        var prefixHits = _prefixTrie.SearchByPrefix(normalizedQuery);
        foreach (var id in prefixHits)
            UpdateScore(scored, id, 850);

        // ── Phase 3: Substring match via trigrams (score 700) ──
        if (normalizedQuery.Length >= 3)
        {
            var trigramCandidates = _trigramIndex.Search(normalizedQuery);
            foreach (var id in trigramCandidates)
            {
                // Post-verify: confirm actual substring match
                var texts = GetSearchableTexts(id);
                if (texts.Any(t => t.Contains(normalizedQuery)))
                    UpdateScore(scored, id, 700);
            }
        }

        // Also try bigram index for Japanese queries
        if (ContainsJapanese(normalizedQuery) && normalizedQuery.Length >= 2)
        {
            var bigramCandidates = _bigramIndex.Search(
                NormalizeJapanese(normalizedQuery));
            foreach (var id in bigramCandidates)
                UpdateScore(scored, id, 700);
        }

        // ── Phase 4: Fuzzy match via SymSpell (score 450–350) ──
        if (scored.Count < 10 && normalizedQuery.Length >= 3)
        {
            var fuzzyHits = _fuzzyIndex.Lookup(normalizedQuery, maxEditDistance: 2);
            foreach (var (id, distance, _) in fuzzyHits)
                UpdateScore(scored, id, 450 - (distance * 50));
        }

        // ── Boost primary meanings ──
        foreach (var (id, score) in scored.ToList())
        {
            var subject = await _cache.TryGetAsync(id);
            if (subject == null) continue;
            if (subject.Meanings.Any(m =>
                m.Primary && Normalize(m.Meaning) == normalizedQuery))
                scored[id] = score * 1.1;
        }

        // ── Sort and paginate ──
        var sorted = scored
            .OrderByDescending(kv => kv.Value)
            .Select(kv => _cache.TryGetAsync(kv.Key).Result)
            .Where(s => s != null)
            .Where(s => types is not { Length: > 0 }
                || types.Select(t => t.ToSnakeCaseString()).Contains(s!.Object))
            .ToList();

        if (page.HasValue || perPage.HasValue)
        {
            int p = page ?? 1;
            int take = perPage ?? 100;
            return sorted.Skip((p - 1) * take).Take(take)!;
        }

        return sorted!;
    }

    private static void UpdateScore(Dictionary<int, double> scored, int id, double score)
    {
        if (!scored.TryGetValue(id, out var existing) || score > existing)
            scored[id] = score;
    }

    private IEnumerable<string> GetSearchableTexts(int subjectId)
    {
        var subject = _cache.TryGetAsync(subjectId).Result;
        if (subject == null) yield break;

        if (!string.IsNullOrEmpty(subject.Characters))
            yield return Normalize(subject.Characters);
        if (!string.IsNullOrEmpty(subject.Slug))
            yield return Normalize(subject.Slug);
        foreach (var m in subject.Meanings)
            if (!string.IsNullOrEmpty(m.Meaning))
                yield return Normalize(m.Meaning);
    }

    private static bool ContainsJapanese(string text)
        => text.Any(c =>
            (c >= '\u3040' && c <= '\u309F') ||  // Hiragana
            (c >= '\u30A0' && c <= '\u30FF') ||  // Katakana
            (c >= '\u4E00' && c <= '\u9FFF'));    // CJK Unified Ideographs
}
```

### Scoring Summary

| Match Type | Score | Condition |
|:---|:---|:---|
| Exact character match | 1000 | `subject.Characters == query` |
| Exact meaning/slug match | 1000 | via Dictionary exact lookup |
| Prefix match | 850 | via Trie |
| Substring match | 700 | via Trigram/Bigram index + post-verify |
| Fuzzy (distance 1) | 400 | via SymSpell |
| Fuzzy (distance 2) | 350 | via SymSpell |
| Primary meaning multiplier | ×1.1 | Applied on top of any score |

---

## 7. Integration Points

### Files to Modify

| File | Change |
|:---|:---|
| `WaniKani.Relearn.csproj` | Add `<PackageReference Include="SymSpell" Version="6.7.3" />` |
| `ServiceCollectionExtensions.cs` | Register index classes as Singletons |
| `SubjectCache.cs` | Call `BuildIndices()` after `_isLoaded = true` |
| `SubjectSearchService.cs` | Replace linear scan with index lookups (as shown in §6) |

### Index Build Trigger

In `SubjectCache.cs`, after all subjects are loaded:

```csharp
private async ValueTask EnsureLoadedAsync()
{
    // ... existing loading code ...

    _isLoaded = true;

    // Build search indices
    _searchIndices.Build(_subjects.Values);
}
```

### Memory Overhead

For ~9,000 subjects with ~5 searchable fields each:

| Index | Estimated Memory |
|:---|:---|
| ExactIndex (Dictionary) | ~200 KB (keys + lists) |
| PrefixTrie | ~300 KB (nodes + edges) |
| TrigramIndex (n=3) | ~500 KB (trigram → HashSet) |
| BigramIndex (n=2) | ~200 KB (bigram → HashSet) |
| SymSpell (delete variants) | ~2–5 MB (pre-computed deletes) |
| **Total** | **~3–6 MB** |

This is negligible compared to the subject data itself already in `SubjectCache`.

### Levenshtein Distance Fix (Immediate)

If keeping the current approach temporarily, at minimum fix the heap allocation in `LevenshteinDistance`:

```csharp
// BEFORE: allocates a 2D array on the heap every call
int[,] distance = new int[source.Length + 1, target.Length + 1];

// AFTER: zero-allocation using stack memory
private static int LevenshteinDistance(ReadOnlySpan<char> source, ReadOnlySpan<char> target)
{
    if (source.IsEmpty) return target.Length;
    if (target.IsEmpty) return source.Length;

    if (source.Length > target.Length)
        (source, target) = (target, source);

    Span<int> prev = stackalloc int[source.Length + 1];
    Span<int> curr = stackalloc int[source.Length + 1];

    for (int i = 0; i <= source.Length; i++) prev[i] = i;

    for (int i = 0; i < target.Length; i++)
    {
        curr[0] = i + 1;
        for (int j = 0; j < source.Length; j++)
        {
            int cost = source[j] == target[i] ? 0 : 1;
            curr[j + 1] = Math.Min(
                Math.Min(curr[j] + 1, prev[j + 1] + 1),
                prev[j] + cost);
        }
        curr.CopyTo(prev);
    }

    return prev[source.Length];
}
```

---

## Appendix: Comparison with Alternatives

### SymSpell + Custom Indices vs. Lucene.NET

| | SymSpell + Custom Indices | Lucene.NET |
|:---|:---|:---|
| **Dependencies** | 1 NuGet package (SymSpell) | 3 NuGet packages (still in beta) |
| **Code written** | ~200 lines of C# | ~80 lines of Lucene wiring |
| **Code understood** | Fully owned, fully debuggable | Lucene internals are a black box |
| **Japanese handling** | Custom normalization you control | Needs custom Analyzer work |
| **Scoring control** | Your exact scoring logic | BM25 (generic, not domain-tuned) |
| **Memory** | Indices point to existing objects | Subjects duplicated in Lucene format |
| **API style** | Idiomatic C# | Java-esque (ported from Java Lucene) |
| **Maturity** | Simple data structures (textbook) | Battle-tested but perpetual .NET beta |
| **Performance at 9K docs** | Sub-millisecond | Sub-millisecond |
| **Best for** | Domain-specific search with known schema | General-purpose search over unknown data |

### When Lucene.NET Would Be Better

- You have **millions of documents** with long text bodies
- You need **phrase search** (`"to eat food"` as an exact phrase)
- You need **BM25 ranking** across documents of varying lengths
- You want **zero custom search code** — just declare fields and query

### When Custom Indices Are Better

- You have a **small, fixed schema** (~9K records, ~5 short fields)
- You need **domain-specific scoring** (character match > slug > meaning > reading)
- You work with **bilingual data** requiring custom normalization
- You want to **understand and debug** every part of the search pipeline

---

## Quick Reference: Algorithm Complexities

| Operation | Dictionary | Trie | Trigram Index | SymSpell | Linear Scan (current) |
|:---|:---|:---|:---|:---|:---|
| Build | O(N) | O(N·L) | O(N·L) | O(N·L) | None |
| Exact | **O(1)** | O(L) | O(L) | — | O(N·L) |
| Prefix | ❌ | **O(L+K)** | — | — | O(N·L) |
| Substring | ❌ | ❌ | **O(L+K)** | — | O(N·L²) |
| Fuzzy | ❌ | ❌ | — | **O(1)** | O(N·L²) |

Where: N = number of subjects, L = query/word length, K = number of results.
