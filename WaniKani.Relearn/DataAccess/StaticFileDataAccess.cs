using System;

namespace WaniKani.Relearn.DataAccess;

public class StaticFileDataAccess(
    IConfiguration configuration
)
{
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

    public async Task SaveKanjiForLevel(int level, string json)
    {
        string path = Path.Combine(configuration["StaticFiles:Path"]!, $"kanji-{level}.json");
        await File.WriteAllTextAsync(path, json);
    }

    public async Task SaveVocabularyForLevel(int level, string json)
    {
        string path = Path.Combine(configuration["StaticFiles:Path"]!, $"vocabulary-{level}.json");
        await File.WriteAllTextAsync(path, json);
    }

    public async Task SaveRadicalsForLevel(int level, string json)
    {
        string path = Path.Combine(configuration["StaticFiles:Path"]!, $"radical-{level}.json");
        await File.WriteAllTextAsync(path, json);
    }

    public async Task SaveKanaVocabularyForLevel(int level, string json)
    {
        string path = Path.Combine(configuration["StaticFiles:Path"]!, $"kana_vocabulary-{level}.json");
        await File.WriteAllTextAsync(path, json);
    }
}
