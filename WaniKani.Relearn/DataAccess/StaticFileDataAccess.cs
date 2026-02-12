using System;
using WaniKani.Relearn.Model.Subjects;

namespace WaniKani.Relearn.DataAccess;

public class StaticFileDataAccess(
    IConfiguration configuration
) : IDataAccess
{
    public Task<List<Subject>> GetAllRadicals(params int[] levels)
    {
        throw new NotImplementedException();
    }

    public async Task<List<Subject>> GetAllKanji(params int[] levels)
    {
        string prefix = "kanji-";
        levels = levels is not [] ? levels : Enumerable.Range(1, 60).ToArray();

        string[] paths = levels
            .Select(level => Path.Combine(configuration["StaticFiles:Path"]!, $"{prefix}{level}.json"))
            .ToArray();
        var fileReadTasks = paths.Select(async path =>
        {
            if (!File.Exists(path))
            {
                return "";
            }
            return await File.ReadAllTextAsync(path);
        });

        await Task.WhenAll(fileReadTasks);
        var rawJsons = fileReadTasks.Select(task => task.Result).Where(content => !string.IsNullOrWhiteSpace(content));
        var subjects = rawJsons
            .Select(json => JsonSerializer.Deserialize<List<Subject>>(json) ?? [])
            .SelectMany(subjects => subjects.Select(s => s))
            .ToList();
        return subjects;
    }

    public Task<List<Subject>> GetAllVocabulary(params int[] levels)
    {
        throw new NotImplementedException();
    }

    public Task<List<Subject>> GetAllKanaVocabulary(params int[] levels)
    {
        throw new NotImplementedException();
    }

    public async Task<string> GetKanjiForLevel(int level)
    {
        string path = Path.Combine(configuration["StaticFiles:Path"]!, $"kanji-{level}.json");
        if (!File.Exists(path))
        {
            throw new FileNotFoundException($"File not found: {path}");
        }

        return await File.ReadAllTextAsync(path);
    }

    public async Task<string> GetVocabularyForLevel(int level)
    {
        string path = Path.Combine(configuration["StaticFiles:Path"]!, $"vocabulary-{level}.json");
        if (!File.Exists(path))
        {
            throw new FileNotFoundException($"File not found: {path}");
        }

        return await File.ReadAllTextAsync(path);
    }

    public async Task<string> GetRadicalsForLevel(int level)
    {
        string path = Path.Combine(configuration["StaticFiles:Path"]!, $"radicals-{level}.json");
        if (!File.Exists(path))
        {
            throw new FileNotFoundException($"File not found: {path}");
        }

        return await File.ReadAllTextAsync(path);
    }

    public async Task<string> GetKanaVocabularyForLevel(int level)
    {
        string path = Path.Combine(configuration["StaticFiles:Path"]!, $"kana_vocabulary-{level}.json");
        if (!File.Exists(path))
        {
            throw new FileNotFoundException($"File not found: {path}");
        }

        return await File.ReadAllTextAsync(path);
    }

    public async Task SaveKanjiForLevel(int level, IEnumerable<Kanji> kanji)
    {
        var json = JsonSerializer.Serialize(kanji, new JsonSerializerOptions
        {
            WriteIndented = true
        });
        string path = Path.Combine(configuration["StaticFiles:Path"]!, $"kanji-{level}.json");
        await File.WriteAllTextAsync(path, json);
    }

    public async Task SaveVocabularyForLevel(int level, IEnumerable<Vocabulary> vocabulary)
    {
        var json = JsonSerializer.Serialize(vocabulary, new JsonSerializerOptions
        {
            WriteIndented = true
        });
        string path = Path.Combine(configuration["StaticFiles:Path"]!, $"vocabulary-{level}.json");
        await File.WriteAllTextAsync(path, json);
    }

    public async Task SaveRadicalsForLevel(int level, IEnumerable<Radical> radicals)
    {
        var json = JsonSerializer.Serialize(radicals, new JsonSerializerOptions
        {
            WriteIndented = true
        });
        string path = Path.Combine(configuration["StaticFiles:Path"]!, $"radical-{level}.json");
        await File.WriteAllTextAsync(path, json);
    }

    public async Task SaveKanaVocabularyForLevel(int level, IEnumerable<KanaVocabulary> kanaVocabulary)
    {
        var json = JsonSerializer.Serialize(kanaVocabulary, new JsonSerializerOptions
        {
            WriteIndented = true
        });
        string path = Path.Combine(configuration["StaticFiles:Path"]!, $"kana_vocabulary-{level}.json");
        await File.WriteAllTextAsync(path, json);
    }
}
