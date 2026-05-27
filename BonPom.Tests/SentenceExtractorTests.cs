using Microsoft.Extensions.Configuration;
using WaniKani.Relearn.Subjects.Data;

namespace BonPom.Tests;

public class SentenceExtractorTests
{
    private readonly SentenceExtractor sentenceExtractor;

    public SentenceExtractorTests()
    {
        var subjectCache = new SubjectCache();
        var configuration = new ConfigurationBuilder().Build();

        

        sentenceExtractor = new SentenceExtractor(
                subjectCache,
                configuration
            );
    }
    [Fact]
    public void TestMorphemeProcessing()
    {

    }
}
