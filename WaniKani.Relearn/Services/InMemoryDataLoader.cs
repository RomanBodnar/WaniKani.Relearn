using WaniKani.Relearn.DataAccess;

namespace WaniKani.Relearn.Services;

public class InMemoryDataLoader(
    IDataAccess staticFileDataAccess,
    SubjectCache subjectCache,
    ILogger<InMemoryDataLoader> logger) : IHostedService
{
    public async Task StartAsync(CancellationToken cancellationToken)
    {
        logger.LogInformation("Starting in-memory data loader...");
        var kanji = await staticFileDataAccess.GetAllSubjects<Kanji>();
        var vocabulary = await staticFileDataAccess.GetAllSubjects<Vocabulary>();
        var radicals = await staticFileDataAccess.GetAllSubjects<Radical>();
        var kanaVocabulary = await staticFileDataAccess.GetAllSubjects<KanaVocabulary>();

        foreach (var kanjiSubject in kanji)
        {
            subjectCache.AddOrUpdate(kanjiSubject.CopyAsSubject());
        }
        foreach (var vocab in vocabulary)
        {
            subjectCache.AddOrUpdate(vocab.CopyAsSubject());
        }
        foreach (var radical in radicals)
        {
            subjectCache.AddOrUpdate(radical.CopyAsSubject());
        }
        foreach (var kana in kanaVocabulary)
        {
            subjectCache.AddOrUpdate(kana.CopyAsSubject());
        }
        logger.LogInformation("Finished loading {KanjiCount} kanji, {VocabCount} vocabulary, {RadicalCount} radicals, and {KanaVocabCount} kana vocabulary into cache.",
            kanji.Count, vocabulary.Count, radicals.Count, kanaVocabulary.Count);
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}
