using System.Diagnostics;
using Microsoft.Extensions.Logging;
using WaniKani.Relearn.Contracts.Assignments;
using WaniKani.Relearn.Subjects.Data;
using WaniKani.Relearn.Subjects.Data.Models;

namespace WaniKani.Relearn.Subjects.Services;

public class SubjectSearchService(SubjectCache subjectCache, ILogger<SubjectSearchService> logger)
{
    public IEnumerable<Subject> Search(string query, SubjectType[]? types = null, int? page = null, int? perPage = null)
    {
        if (string.IsNullOrWhiteSpace(query))
        {
            logger.LogDebug("Search invoked with empty or whitespace query.");
            return Enumerable.Empty<Subject>();
        }

        var sw = Stopwatch.StartNew();
        var normalizedQuery = query.Trim().ToLowerInvariant();

        var subjects = subjectCache.GetAll();
        var initialCount = subjects.Count();

        if (types is { Length: > 0 })
        {
            var allowedObjects = types.Select(t => t.ToSnakeCaseString()).ToHashSet();
            subjects = subjects.Where(s => allowedObjects.Contains(s.Object));
        }

        var matches = new List<(Subject Subject, double Score)>();

        foreach (var subject in subjects)
        {
            double score = CalculateMatchScore(subject, normalizedQuery);
            if (score > 0)
            {
                matches.Add((subject, score));
            }
        }

        var sorted = matches
            .OrderByDescending(m => m.Score)
            .ThenBy(m => m.Subject.Level)
            .ThenBy(m => m.Subject.Id)
            .Select(m => m.Subject)
            .ToList();

        sw.Stop();

        logger.LogInformation(
            "Subject search for query '{Query}' evaluated {TotalEvaluated} subjects ({TypeFilter}) in {ElapsedMs}ms and found {MatchCount} matches.",
            query,
            initialCount,
            types is { Length: > 0 } ? string.Join(", ", types) : "all types",
            sw.ElapsedMilliseconds,
            sorted.Count
        );

        if (sorted.Count == 0)
        {
            logger.LogInformation("No subjects matched search query '{Query}'.", query);
        }

        if (page.HasValue || perPage.HasValue)
        {
            int p = page ?? 1;
            int take = perPage ?? 100;
            return sorted.Skip((p - 1) * take).Take(take);
        }

        return sorted;
    }

    private static double CalculateMatchScore(Subject subject, string query)
    {
        double maxScore = 0;

        // 1. Check Characters (Exact, Prefix, Substring)
        if (!string.IsNullOrEmpty(subject.Characters))
        {
            var chars = subject.Characters.ToLowerInvariant();
            if (chars == query) return 1000;
            if (chars.StartsWith(query)) maxScore = Math.Max(maxScore, 850);
            else if (chars.Contains(query)) maxScore = Math.Max(maxScore, 700);
        }

        // 2. Check Slug (Exact, Prefix, Substring, Fuzzy)
        if (!string.IsNullOrEmpty(subject.Slug))
        {
            var slug = subject.Slug.ToLowerInvariant();
            maxScore = Math.Max(maxScore, EvaluateTextMatch(slug, query));
        }

        // 3. Check Meanings (Primary, Auxiliary, List)
        foreach (var meaning in subject.Meanings)
        {
            if (!string.IsNullOrEmpty(meaning.Meaning))
            {
                var text = meaning.Meaning.ToLowerInvariant();
                double s = EvaluateTextMatch(text, query);
                if (meaning.Primary) s *= 1.1;
                maxScore = Math.Max(maxScore, s);
            }
        }

        foreach (var aux in subject.AuxiliaryMeanings)
        {
            if (!string.IsNullOrEmpty(aux.Meaning))
            {
                double s = EvaluateTextMatch(aux.Meaning.ToLowerInvariant(), query) * 0.9;
                maxScore = Math.Max(maxScore, s);
            }
        }

        // 4. Check Readings (Kanji & Vocabulary)
        if (subject is Kanji kanji)
        {
            foreach (var reading in kanji.Readings)
            {
                if (!string.IsNullOrEmpty(reading.Reading))
                {
                    var rText = reading.Reading.ToLowerInvariant();
                    double s = EvaluateTextMatch(rText, query);
                    if (reading.Primary) s *= 1.1;
                    maxScore = Math.Max(maxScore, s);
                }
            }
        }
        else if (subject is Vocabulary vocab)
        {
            foreach (var reading in vocab.Readings)
            {
                if (!string.IsNullOrEmpty(reading.Reading))
                {
                    var rText = reading.Reading.ToLowerInvariant();
                    double s = EvaluateTextMatch(rText, query);
                    if (reading.Primary) s *= 1.1;
                    maxScore = Math.Max(maxScore, s);
                }
            }
        }

        return maxScore;
    }

    private static double EvaluateTextMatch(string target, string query)
    {
        if (target == query) return 900;
        if (target.StartsWith(query)) return 750;
        if (target.Contains(query)) return 600;

        // Enforce relative length difference thresholding for fuzzy matching
        int lengthDiff = Math.Abs(target.Length - query.Length);
        int maxAllowedDistance = query.Length switch
        {
            <= 4 => 1,
            <= 7 => 2,
            _ => 3
        };

        int maxAllowedLengthDiff = maxAllowedDistance switch
        {
            1 => 1,
            _ => maxAllowedDistance - 1
        };

        if (query.Length >= 3 && lengthDiff <= maxAllowedLengthDiff)
        {
            int distance = LevenshteinDistance(target, query);

            if (distance <= maxAllowedDistance)
            {
                return 450 - (distance * 50);
            }
        }

        return 0;
    }

    private static int LevenshteinDistance(string source, string target)
    {
        if (string.IsNullOrEmpty(source)) return target?.Length ?? 0;
        if (string.IsNullOrEmpty(target)) return source.Length;

        int[,] distance = new int[source.Length + 1, target.Length + 1];

        for (int i = 0; i <= source.Length; i++) distance[i, 0] = i;
        for (int j = 0; j <= target.Length; j++) distance[0, j] = j;

        for (int i = 1; i <= source.Length; i++)
        {
            for (int j = 1; j <= target.Length; j++)
            {
                int cost = (target[j - 1] == source[i - 1]) ? 0 : 1;
                distance[i, j] = Math.Min(
                    Math.Min(distance[i - 1, j] + 1, distance[i, j - 1] + 1),
                    distance[i - 1, j - 1] + cost);
            }
        }

        return distance[source.Length, target.Length];
    }
}
