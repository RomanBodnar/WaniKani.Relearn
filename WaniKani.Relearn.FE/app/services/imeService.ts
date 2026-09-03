/**
 * Japanese IME Service
 * Fetches Kanji and Katakana conversion candidates for Hiragana input
 * with memory caching and debouncing.
 */

const candidateCache = new Map<string, string[]>();
const MAX_CACHE_ENTRIES = 500;

/**
 * Fetch Kanji conversion candidates for a given Kana string.
 * Uses Google Input Tools API with in-memory caching and resilient fallback.
 */
export async function fetchKanjiCandidates(
  kana: string,
  maxResults: number = 8
): Promise<string[]> {
  const trimmed = kana.trim();
  if (!trimmed) {
    return [];
  }

  // 1. Check in-memory cache
  const cached = candidateCache.get(trimmed);
  if (cached) {
    return cached;
  }

  // 2. Fetch from Google Input Tools API
  const url = `https://inputtools.google.com/request?text=${encodeURIComponent(
    trimmed
  )}&itc=ja-t-i0-und&num=${maxResults}&cp=0&cs=1&ie=utf-8&oe=utf-8&app=translate`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`IME API returned status ${res.status}`);
    }

    const data = await res.json();
    // Google API response format: ["SUCCESS", [["input_word", ["cand1", "cand2", ...]]]]
    if (data && data[0] === "SUCCESS" && Array.isArray(data[1]?.[0]?.[1])) {
      const fetchedCandidates: string[] = data[1][0][1];
      
      // Ensure the original hiragana is included if not already present
      const candidateList = Array.from(
        new Set([...fetchedCandidates, trimmed])
      ).filter(Boolean);

      // Save to cache (prune oldest if cache exceeds limit)
      if (candidateCache.size >= MAX_CACHE_ENTRIES) {
        const firstKey = candidateCache.keys().next().value;
        if (firstKey) candidateCache.delete(firstKey);
      }
      candidateCache.set(trimmed, candidateList);

      return candidateList;
    }
  } catch (err) {
    console.warn("Google IME candidate lookup error:", err);
  }

  // Fallback: return the trimmed kana
  return [trimmed];
}
