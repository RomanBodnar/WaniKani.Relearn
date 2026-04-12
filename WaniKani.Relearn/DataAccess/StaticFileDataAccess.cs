using System;
using Newtonsoft.Json;
using WaniKani.Relearn.Model.Subjects;

namespace WaniKani.Relearn.DataAccess;

public class StaticFileDataAccess(
    IConfiguration configuration
) : IDataAccess
{
    public async Task<List<SingleResource<T>>> GetAllSubjects<T>(params int[] levels) where T : Subject
    {
        if (typeof(T) == typeof(Kanji))
        {
            return await GetAllKanji(levels) as List<SingleResource<T>>;
        }
        else if (typeof(T) == typeof(Radical))
        {
            return await GetAllRadicals(levels) as List<SingleResource<T>>;
        }
        else if (typeof(T) == typeof(Vocabulary))
        {
            return await GetAllVocabulary(levels) as List<SingleResource<T>>;
        }
        else if (typeof(T) == typeof(KanaVocabulary))
        {
            return await GetAllKanaVocabulary(levels) as List<SingleResource<T>>;
        }
        else
        {
            throw new ArgumentException($"Unsupported subject type: {typeof(T)}");
        }
    }

    public async Task<List<SingleResource<Radical>>> GetAllRadicals(params int[] levels)
    {
        string prefix = "radical-";
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
            .Select(json => JsonConvert.DeserializeObject<List<SingleResource<Radical>>>(json) ?? [])
            .SelectMany(subjects => subjects.Select(s => s))
            .ToList();
        return subjects;
    }

    public async Task<List<SingleResource<Kanji>>> GetAllKanji(params int[] levels)
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
            .Select(json => JsonConvert.DeserializeObject<List<SingleResource<Kanji>>>(json) ?? [])
            .SelectMany(subjects => subjects.Select(s => s))
            .ToList();
        return subjects;
    }

    public async Task<List<SingleResource<Vocabulary>>> GetAllVocabulary(params int[] levels)
    {
        string prefix = "vocabulary-";
        levels = levels is not [] ? levels : Enumerable.Range(1, 60).ToArray();

        string[] paths = levels
            .Select(level => Path.Combine(configuration["StaticFiles:Path"]!, $"{prefix}{level}.json"))
            .ToArray();
        var fileReadTasks = paths.Select(async path =>
        {
            if (!File.Exists(path))
            {
                throw new FileNotFoundException($"File not found: {path}");
                // todo: return empty list instead of throwing, but need to check how it affects the rest of the code first
                //return "";
            }
            return await File.ReadAllTextAsync(path);
        });

        await Task.WhenAll(fileReadTasks);
        var rawJsons = fileReadTasks.Select(task => task.Result).Where(content => !string.IsNullOrWhiteSpace(content));
        var subjects = rawJsons
            .Select(json => JsonConvert.DeserializeObject<List<SingleResource<Vocabulary>>>(json) ?? [])
            .SelectMany(subjects => subjects.Select(s => s))
            .ToList();
        return subjects;
    }

    public async Task<List<SingleResource<KanaVocabulary>>> GetAllKanaVocabulary(params int[] levels)
    {
        string prefix = "kana_vocabulary-";
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
            .Select(json => JsonConvert.DeserializeObject<List<SingleResource<KanaVocabulary>>>(json) ?? [])
            .SelectMany(subjects => subjects.Select(s => s))
            .ToList();
        return subjects;
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

    public async Task SaveSubjectsForLevel<T>(int level, IEnumerable<SingleResource<T>> subjects) where T : Subject
    {
        string prefix = typeof(T).Name.ToLower() + "-";
        if(typeof(T) == typeof(KanaVocabulary))
        {
            prefix = "kana_vocabulary-";
        }
        var json = JsonConvert.SerializeObject(subjects, Formatting.Indented);
        string path = Path.Combine(configuration["StaticFiles:Path"]!, $"{prefix}{level}.json");
        await File.WriteAllTextAsync(path, json);
    }

    public async Task SaveKanjiForLevel(int level, IEnumerable<SingleResource<Subject>> kanji)
    {
        var json = JsonConvert.SerializeObject(kanji, Formatting.Indented);
        string path = Path.Combine(configuration["StaticFiles:Path"]!, $"kanji-{level}.json");
        await File.WriteAllTextAsync(path, json);
    }

    public async Task SaveVocabularyForLevel(int level, IEnumerable<SingleResource<Subject>> vocabulary)
    {
        var json = JsonConvert.SerializeObject(vocabulary, Formatting.Indented);
        string path = Path.Combine(configuration["StaticFiles:Path"]!, $"vocabulary-{level}.json");
        await File.WriteAllTextAsync(path, json);
    }

    public async Task SaveRadicalsForLevel(int level, IEnumerable<SingleResource<Subject>> radicals)
    {
        var json = JsonConvert.SerializeObject(radicals, Formatting.Indented);
        string path = Path.Combine(configuration["StaticFiles:Path"]!, $"radical-{level}.json");
        await File.WriteAllTextAsync(path, json);
    }

    public async Task SaveKanaVocabularyForLevel(int level, IEnumerable<SingleResource<Subject>> kanaVocabulary)
    {
        var json = JsonConvert.SerializeObject(kanaVocabulary, Formatting.Indented);
        string path = Path.Combine(configuration["StaticFiles:Path"]!, $"kana_vocabulary-{level}.json");
        await File.WriteAllTextAsync(path, json);
    }
}
