using System;
using Newtonsoft.Json;
using WaniKani.Relearn.Model.Reading;

namespace WaniKani.Relearn.DataAccess;

public class SentenceCache(IConfiguration configuration)
{
    private List<ReadingSentence> _sentences = new();

    public void LoadFromFiles()
    {
        var dir = configuration["StaticFiles:Path"]!;
        var files = Directory.GetFiles(dir, "context-sentences-*.json");
        foreach (var file in files.OrderBy(f => f))
        {
            var json = File.ReadAllText(file);
            var batch = JsonConvert.DeserializeObject<List<ReadingSentence>>(json) ?? [];
            _sentences.AddRange(batch);
        }
        _sentences = _sentences.OrderBy(s => s.Level).ToList();
    }

    public PageResult<ReadingSentence> GetSentences(
        int? page, int? perPage, int? minLevel = null, int? maxLevel = null)
    {
        var query = _sentences.AsEnumerable();
        if (minLevel.HasValue) query = query.Where(s => s.Level >= minLevel.Value);
        if (maxLevel.HasValue) query = query.Where(s => s.Level <= maxLevel.Value);

        var count = query.Count();
        var data = query
            .Skip(((page ?? 1) - 1) * (perPage ?? 10))
            .Take(perPage ?? 10);

        return new PageResult<ReadingSentence>(data, page ?? 1, perPage ?? 10, count);
    }

    public int Count => _sentences.Count;
}
