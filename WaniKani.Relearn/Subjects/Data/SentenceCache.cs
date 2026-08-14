using Newtonsoft.Json;
using WaniKani.Relearn.Subjects.Data.Models.Reading;
using System.Threading;
using System.Threading.Tasks;
using System.IO;

namespace WaniKani.Relearn.Subjects.Data;

public class SentenceCache(IConfiguration configuration, SentenceExtractor sentenceExtractor)
{
    private List<ReadingSentence> _sentences = [];
    private readonly SemaphoreSlim _semaphore = new(1, 1);
    private bool _isLoaded;

    private async ValueTask EnsureLoadedAsync()
    {
        if (_isLoaded) return;
        await _semaphore.WaitAsync();
        try
        {
            if (_isLoaded) return;

            var dir = configuration["StaticFiles:Path"]!;
            if (!Directory.Exists(dir))
            {
                Directory.CreateDirectory(dir);
            }

            var files = Directory.GetFiles(dir, "context-sentences-*.json");
            if (files.Length == 0)
            {
                await sentenceExtractor.ExtractSentencesAsync();
                files = Directory.GetFiles(dir, "context-sentences-*.json");
            }

            foreach (var file in files.OrderBy(f => f))
            {
                var json = await File.ReadAllTextAsync(file);
                var batch = JsonConvert.DeserializeObject<List<ReadingSentence>>(json) ?? [];
                _sentences.AddRange(batch);
            }
            _sentences = _sentences.OrderBy(s => s.Level).ToList();

            _isLoaded = true;
        }
        finally
        {
            _semaphore.Release();
        }
    }

    public async Task LoadFromFilesAsync()
    {
        await EnsureLoadedAsync();
    }

    public async ValueTask<PageResult<ReadingSentence>> GetSentencesAsync(
        int? page, int? perPage, int? minLevel = null, int? maxLevel = null)
    {
        await EnsureLoadedAsync();
        var query = _sentences.AsEnumerable();
        if (minLevel.HasValue) query = query.Where(s => s.Level >= minLevel.Value);
        if (maxLevel.HasValue) query = query.Where(s => s.Level <= maxLevel.Value);

        var count = query.Count();
        var data = query
            .Skip(((page ?? 1) - 1) * (perPage ?? 10))
            .Take(perPage ?? 10);

        return new PageResult<ReadingSentence>(data, page ?? 1, perPage ?? 10, count);
    }

    public async ValueTask<int> GetCountAsync()
    {
        await EnsureLoadedAsync();
        return _sentences.Count;
    }
}
