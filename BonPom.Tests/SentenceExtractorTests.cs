using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using WaniKani.Relearn;
using WaniKani.Relearn.Services;
using WaniKani.Relearn.Subjects.Data;
using WaniKani.Relearn.Subjects.Data.Models;
using WaniKani.Relearn.Subjects.Data.Models.Reading;

namespace BonPom.Tests;

public class SentenceExtractorTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly SentenceExtractor _sentenceExtractor;
    private readonly SubjectCache _subjectCache;

    public SentenceExtractorTests(WebApplicationFactory<Program> factory)
    {
        var testFactory = factory.WithWebHostBuilder(builder =>
        {
            builder.ConfigureServices(services =>
            {
                var descriptor = services.FirstOrDefault(
                    d => d.ImplementationType == typeof(InMemoryDataLoader));
                if (descriptor != null)
                {
                    services.Remove(descriptor);
                }
            });
        });
        var scope = testFactory.Services.CreateScope();
        _sentenceExtractor = scope.ServiceProvider.GetRequiredService<SentenceExtractor>();
        _subjectCache = scope.ServiceProvider.GetRequiredService<SubjectCache>();
    }

    private Subject AddSubject(int id, string type, string characters)
    {
        var subject = new Subject
        {
            Id = id,
            Object = type,
            Characters = characters,
            MeaningMnemonic = "meaning mnemonic",
            Slug = characters,
            WaniKaniDocumentUrl = "http://example.com"
        };
        _subjectCache.AddOrUpdate(subject);
        return subject;
    }

    [Fact]
    public void ProcessMorphemesInSentence_WithSimpleVocabulary_LinksCorrectly()
    {
        // Arrange
        var subjectId = 2001;
        AddSubject(subjectId, "vocabulary", "犬");

        var sentence = new ReadingSentence
        {
            Ja = "犬がいます。",
            En = "There is a dog.",
            SourceVocabulary = new List<SubjectReference>(),
            KanjiInSentence = new List<SubjectReference>(),
            Morphemes = new List<Morpheme>
            {
                new Morpheme
                {
                    Surface = "犬",
                    Lemma = "犬",
                    Orth = "犬",
                    LemmaReading = "イヌ",
                    Pron = "イヌ",
                    ConjugationForm = "",
                    ConjugationType = "",
                    Pos1 = new PosPart { En = "noun", Ja = "名詞" },
                    Pos2 = new PosPart { En = "*", Ja = "*" },
                    Pos3 = new PosPart { En = "*", Ja = "*" },
                    Pos4 = new PosPart { En = "*", Ja = "*" }
                }
            }
        };

        // Act
        _sentenceExtractor.ProcessMorphemesInSentence(sentence);

        // Assert
        Assert.Single(sentence.Morphemes);
        Assert.Equal(subjectId, sentence.Morphemes[0].SubjectId);
        Assert.Single(sentence.SourceVocabulary);
        Assert.Equal(subjectId, sentence.SourceVocabulary[0].SubjectId);
        Assert.Equal("犬", sentence.SourceVocabulary[0].Characters);
    }

    [Fact]
    public void ProcessMorphemesInSentence_WithMasuVerb_CombinesAndLinksCorrectly()
    {
        // Arrange
        var verbId = 2002;
        AddSubject(verbId, "vocabulary", "行く");

        var sentence = new ReadingSentence
        {
            Ja = "行きます。",
            En = "I go.",
            SourceVocabulary = new List<SubjectReference>(),
            KanjiInSentence = new List<SubjectReference>(),
            Morphemes = new List<Morpheme>
            {
                new Morpheme
                {
                    Surface = "行き",
                    Lemma = "行く",
                    Orth = "行き",
                    LemmaReading = "イク",
                    Pron = "イキ",
                    ConjugationForm = "連用形-一般",
                    ConjugationType = "五段-カ行",
                    Pos1 = new PosPart { En = "verb", Ja = "動詞" },
                    Pos2 = new PosPart { En = "*", Ja = "*" },
                    Pos3 = new PosPart { En = "*", Ja = "*" },
                    Pos4 = new PosPart { En = "*", Ja = "*" }
                },
                new Morpheme
                {
                    Surface = "ます",
                    Lemma = "ます",
                    Orth = "ます",
                    LemmaReading = "マス",
                    Pron = "マス",
                    ConjugationForm = "終止形-一般",
                    ConjugationType = "助動詞-マス",
                    Pos1 = new PosPart { En = "auxiliary verb", Ja = "助動詞" },
                    Pos2 = new PosPart { En = "*", Ja = "*" },
                    Pos3 = new PosPart { En = "*", Ja = "*" },
                    Pos4 = new PosPart { En = "*", Ja = "*" }
                }
            }
        };

        // Act
        _sentenceExtractor.ProcessMorphemesInSentence(sentence);

        // Assert
        Assert.Equal("行く", sentence.Morphemes[1].CombinedForm);
        Assert.Equal(verbId, sentence.Morphemes[1].SubjectId);
        Assert.Contains(sentence.SourceVocabulary, s => s.SubjectId == verbId && s.Characters == "行く");
    }

    [Fact]
    public void ProcessMorphemesInSentence_WithSuruVerb_CombinesAndLinksCorrectly()
    {
        // Arrange
        var suruVerbId = 2003;
        AddSubject(suruVerbId, "vocabulary", "勉強する");

        var sentence = new ReadingSentence
        {
            Ja = "勉強します。",
            En = "I study.",
            SourceVocabulary = new List<SubjectReference>(),
            KanjiInSentence = new List<SubjectReference>(),
            Morphemes = new List<Morpheme>
            {
                new Morpheme
                {
                    Surface = "勉強",
                    Lemma = "勉強",
                    Orth = "勉強",
                    LemmaReading = "ベンキョウ",
                    Pron = "ベンキョウ",
                    ConjugationForm = "",
                    ConjugationType = "",
                    Pos1 = new PosPart { En = "noun", Ja = "名詞" },
                    Pos2 = new PosPart { En = "verbal", Ja = "サ変接続" },
                    Pos3 = new PosPart { En = "*", Ja = "*" },
                    Pos4 = new PosPart { En = "*", Ja = "*" }
                },
                new Morpheme
                {
                    Surface = "します",
                    Lemma = "する",
                    Orth = "し",
                    LemmaReading = "スル",
                    Pron = "シ",
                    ConjugationForm = "連用形-一般",
                    ConjugationType = "サ行変格",
                    Pos1 = new PosPart { En = "verb", Ja = "動詞" },
                    Pos2 = new PosPart { En = "*", Ja = "*" },
                    Pos3 = new PosPart { En = "*", Ja = "*" },
                    Pos4 = new PosPart { En = "*", Ja = "*" }
                }
            }
        };

        // Act
        _sentenceExtractor.ProcessMorphemesInSentence(sentence);

        // Assert
        Assert.Equal("勉強する", sentence.Morphemes[1].CombinedForm);
        Assert.Equal(suruVerbId, sentence.Morphemes[1].SubjectId);
        Assert.Contains(sentence.SourceVocabulary, s => s.SubjectId == suruVerbId && s.Characters == "勉強する");
    }

    [Fact]
    public void ProcessMorphemesInSentence_WithSuruVerbException_DoesNotCombine()
    {
        // Arrange
        var suruId = 2004;
        AddSubject(suruId, "vocabulary", "する");

        var sentence = new ReadingSentence
        {
            Ja = "話をする。",
            En = "Have a talk.",
            SourceVocabulary = new List<SubjectReference>(),
            KanjiInSentence = new List<SubjectReference>(),
            Morphemes = new List<Morpheme>
            {
                new Morpheme
                {
                    Surface = "話を",
                    Lemma = "を",
                    Orth = "を",
                    LemmaReading = "ヲ",
                    Pron = "ヲ",
                    ConjugationForm = "",
                    ConjugationType = "",
                    Pos1 = new PosPart { En = "particle", Ja = "助詞" },
                    Pos2 = new PosPart { En = "*", Ja = "*" },
                    Pos3 = new PosPart { En = "*", Ja = "*" },
                    Pos4 = new PosPart { En = "*", Ja = "*" }
                },
                new Morpheme
                {
                    Surface = "する",
                    Lemma = "する",
                    Orth = "する",
                    LemmaReading = "スル",
                    Pron = "スル",
                    ConjugationForm = "終止形-一般",
                    ConjugationType = "サ行変格",
                    Pos1 = new PosPart { En = "verb", Ja = "動詞" },
                    Pos2 = new PosPart { En = "*", Ja = "*" },
                    Pos3 = new PosPart { En = "*", Ja = "*" },
                    Pos4 = new PosPart { En = "*", Ja = "*" }
                }
            }
        };

        // Act
        _sentenceExtractor.ProcessMorphemesInSentence(sentence);

        // Assert
        Assert.Null(sentence.Morphemes[1].CombinedForm);
        Assert.Equal(suruId, sentence.Morphemes[1].SubjectId);
        Assert.Contains(sentence.SourceVocabulary, s => s.SubjectId == suruId && s.Characters == "する");
    }

    [Fact]
    public void ProcessMorphemesInSentence_WithNounSuffix_CombinesAndLinksCorrectly()
    {
        // Arrange
        var combinedId = 2005;
        AddSubject(combinedId, "vocabulary", "猫ちゃん");

        var sentence = new ReadingSentence
        {
            Ja = "猫ちゃん",
            En = "Kitty",
            SourceVocabulary = new List<SubjectReference>(),
            KanjiInSentence = new List<SubjectReference>(),
            Morphemes = new List<Morpheme>
            {
                new Morpheme
                {
                    Surface = "猫",
                    Lemma = "猫",
                    Orth = "猫",
                    LemmaReading = "ネコ",
                    Pron = "ネコ",
                    ConjugationForm = "",
                    ConjugationType = "",
                    Pos1 = new PosPart { En = "noun", Ja = "名詞" },
                    Pos2 = new PosPart { En = "*", Ja = "*" },
                    Pos3 = new PosPart { En = "*", Ja = "*" },
                    Pos4 = new PosPart { En = "*", Ja = "*" }
                },
                new Morpheme
                {
                    Surface = "ちゃん",
                    Lemma = "ちゃん",
                    Orth = "ちゃん",
                    LemmaReading = "チャン",
                    Pron = "チャン",
                    ConjugationForm = "",
                    ConjugationType = "",
                    Pos1 = new PosPart { En = "suffix", Ja = "接尾辞" },
                    Pos2 = new PosPart { En = "*", Ja = "*" },
                    Pos3 = new PosPart { En = "*", Ja = "*" },
                    Pos4 = new PosPart { En = "*", Ja = "*" }
                }
            }
        };

        // Act
        _sentenceExtractor.ProcessMorphemesInSentence(sentence);

        // Assert
        Assert.Equal("猫ちゃん", sentence.Morphemes[1].CombinedForm);
        Assert.Equal(combinedId, sentence.Morphemes[1].SubjectId);
        Assert.Contains(sentence.SourceVocabulary, s => s.SubjectId == combinedId && s.Characters == "猫ちゃん");
    }

    [Fact]
    public void ProcessMorphemesInSentence_WithFallbackToOrth_LinksCorrectly()
    {
        // Arrange
        var fallbackId = 2006;
        AddSubject(fallbackId, "vocabulary", "猫");

        var sentence = new ReadingSentence
        {
            Ja = "ねこがいます。",
            En = "There is a cat.",
            SourceVocabulary = new List<SubjectReference>(),
            KanjiInSentence = new List<SubjectReference>(),
            Morphemes = new List<Morpheme>
            {
                new Morpheme
                {
                    Surface = "ねこ",
                    Lemma = "ねこ",
                    Orth = "猫",
                    LemmaReading = "ネコ",
                    Pron = "ネコ",
                    ConjugationForm = "",
                    ConjugationType = "",
                    Pos1 = new PosPart { En = "noun", Ja = "名詞" },
                    Pos2 = new PosPart { En = "*", Ja = "*" },
                    Pos3 = new PosPart { En = "*", Ja = "*" },
                    Pos4 = new PosPart { En = "*", Ja = "*" }
                }
            }
        };

        // Act
        _sentenceExtractor.ProcessMorphemesInSentence(sentence);

        // Assert
        Assert.Equal(fallbackId, sentence.Morphemes[0].SubjectId);
        Assert.Contains(sentence.SourceVocabulary, s => s.SubjectId == fallbackId && s.Characters == "猫");
    }

    [Fact]
    public void ProcessMorphemesInSentence_WithAuxiliaryVerbChain_InheritsSubjectId()
    {
        // Arrange
        var suruVerbId = 3001;
        AddSubject(suruVerbId, "vocabulary", "ほげほげする");

        var sentence = new ReadingSentence
        {
            Ja = "ほげほげしなく",
            En = "Not hogehogeing",
            SourceVocabulary = new List<SubjectReference>(),
            KanjiInSentence = new List<SubjectReference>(),
            Morphemes = new List<Morpheme>
            {
                new Morpheme
                {
                    Surface = "ほげほげ",
                    Lemma = "ほげほげ",
                    Orth = "ほげほげ",
                    LemmaReading = "ホゲホゲ",
                    Pron = "ホゲホゲ",
                    ConjugationForm = "",
                    ConjugationType = "",
                    Pos1 = new PosPart { En = "noun", Ja = "名詞" },
                    Pos2 = new PosPart { En = "verbal", Ja = "サ変接続" },
                    Pos3 = new PosPart { En = "*", Ja = "*" },
                    Pos4 = new PosPart { En = "*", Ja = "*" }
                },
                new Morpheme
                {
                    Surface = "し",
                    Lemma = "する",
                    Orth = "し",
                    LemmaReading = "スル",
                    Pron = "シ",
                    ConjugationForm = "連用形-一般",
                    ConjugationType = "サ行変格",
                    Pos1 = new PosPart { En = "verb", Ja = "動詞" },
                    Pos2 = new PosPart { En = "*", Ja = "*" },
                    Pos3 = new PosPart { En = "*", Ja = "*" },
                    Pos4 = new PosPart { En = "*", Ja = "*" }
                },
                new Morpheme
                {
                    Surface = "なく",
                    Lemma = "ない",
                    Orth = "なく",
                    LemmaReading = "ナイ",
                    Pron = "ナク",
                    ConjugationForm = "連用形-一般",
                    ConjugationType = "助動詞-ナイ",
                    Pos1 = new PosPart { En = "auxiliary verb", Ja = "助動詞" },
                    Pos2 = new PosPart { En = "*", Ja = "*" },
                    Pos3 = new PosPart { En = "*", Ja = "*" },
                    Pos4 = new PosPart { En = "*", Ja = "*" }
                }
            }
        };

        // Act
        _sentenceExtractor.ProcessMorphemesInSentence(sentence);

        // Assert
        Assert.Equal("ほげほげする", sentence.Morphemes[1].CombinedForm);
        Assert.Equal(suruVerbId, sentence.Morphemes[1].SubjectId);
        
        Assert.Equal("ほげほげする", sentence.Morphemes[2].CombinedForm);
        Assert.Equal(suruVerbId, sentence.Morphemes[2].SubjectId);
    }

    [Fact]
    public void ProcessMorphemesInSentence_WithNounWoSuru_CombinesAndLinksCorrectly()
    {
        // Arrange
        var walkId = 3002;
        AddSubject(walkId, "vocabulary", "散歩する");

        var sentence = new ReadingSentence
        {
            Ja = "散歩をする。",
            En = "I take a walk.",
            SourceVocabulary = new List<SubjectReference>(),
            KanjiInSentence = new List<SubjectReference>(),
            Morphemes = new List<Morpheme>
            {
                new Morpheme
                {
                    Surface = "散歩",
                    Lemma = "散歩",
                    Orth = "散歩",
                    LemmaReading = "サンポ",
                    Pron = "サンポ",
                    ConjugationForm = "",
                    ConjugationType = "",
                    Pos1 = new PosPart { En = "noun", Ja = "名詞" },
                    Pos2 = new PosPart { En = "verbal", Ja = "サ変接続" },
                    Pos3 = new PosPart { En = "*", Ja = "*" },
                    Pos4 = new PosPart { En = "*", Ja = "*" }
                },
                new Morpheme
                {
                    Surface = "を",
                    Lemma = "を",
                    Orth = "を",
                    LemmaReading = "ヲ",
                    Pron = "ヲ",
                    ConjugationForm = "",
                    ConjugationType = "",
                    Pos1 = new PosPart { En = "particle", Ja = "助詞" },
                    Pos2 = new PosPart { En = "*", Ja = "*" },
                    Pos3 = new PosPart { En = "*", Ja = "*" },
                    Pos4 = new PosPart { En = "*", Ja = "*" }
                },
                new Morpheme
                {
                    Surface = "する",
                    Lemma = "する",
                    Orth = "する",
                    LemmaReading = "スル",
                    Pron = "スル",
                    ConjugationForm = "終止形-一般",
                    ConjugationType = "サ行変格",
                    Pos1 = new PosPart { En = "verb", Ja = "動詞" },
                    Pos2 = new PosPart { En = "*", Ja = "*" },
                    Pos3 = new PosPart { En = "*", Ja = "*" },
                    Pos4 = new PosPart { En = "*", Ja = "*" }
                }
            }
        };

        // Act
        _sentenceExtractor.ProcessMorphemesInSentence(sentence);

        // Assert
        Assert.Equal("散歩する", sentence.Morphemes[2].CombinedForm);
        Assert.Equal(walkId, sentence.Morphemes[2].SubjectId);
        Assert.Contains(sentence.SourceVocabulary, s => s.SubjectId == walkId && s.Characters == "散歩する");
    }

    [Fact]
    public void ProcessMorphemesInSentence_WithMultiCharacterNumberCounter_CombinesAndLinksCorrectly()
    {
        // Arrange
        var counterId = 3003;
        AddSubject(counterId, "vocabulary", "個");

        var sentence = new ReadingSentence
        {
            Ja = "３十二個あります。",
            En = "There are 32 items.",
            SourceVocabulary = new List<SubjectReference>(),
            KanjiInSentence = new List<SubjectReference>(),
            Morphemes = new List<Morpheme>
            {
                new Morpheme
                {
                    Surface = "３",
                    Lemma = "３",
                    Orth = "３",
                    LemmaReading = "サン",
                    Pron = "サン",
                    ConjugationForm = "",
                    ConjugationType = "",
                    Pos1 = new PosPart { En = "noun", Ja = "名詞" },
                    Pos2 = new PosPart { En = "number", Ja = "数" },
                    Pos3 = new PosPart { En = "*", Ja = "*" },
                    Pos4 = new PosPart { En = "*", Ja = "*" }
                },
                new Morpheme
                {
                    Surface = "十",
                    Lemma = "十",
                    Orth = "十",
                    LemmaReading = "ジュウ",
                    Pron = "ジュウ",
                    ConjugationForm = "",
                    ConjugationType = "",
                    Pos1 = new PosPart { En = "noun", Ja = "名詞" },
                    Pos2 = new PosPart { En = "number", Ja = "数" },
                    Pos3 = new PosPart { En = "*", Ja = "*" },
                    Pos4 = new PosPart { En = "*", Ja = "*" }
                },
                new Morpheme
                {
                    Surface = "二",
                    Lemma = "二",
                    Orth = "二",
                    LemmaReading = "ニ",
                    Pron = "ニ",
                    ConjugationForm = "",
                    ConjugationType = "",
                    Pos1 = new PosPart { En = "noun", Ja = "名詞" },
                    Pos2 = new PosPart { En = "number", Ja = "数" },
                    Pos3 = new PosPart { En = "*", Ja = "*" },
                    Pos4 = new PosPart { En = "*", Ja = "*" }
                },
                new Morpheme
                {
                    Surface = "個",
                    Lemma = "個",
                    Orth = "個",
                    LemmaReading = "コ",
                    Pron = "コ",
                    ConjugationForm = "",
                    ConjugationType = "",
                    Pos1 = new PosPart { En = "noun", Ja = "名詞" },
                    Pos2 = new PosPart { En = "counter", Ja = "助数詞" },
                    Pos3 = new PosPart { En = "*", Ja = "*" },
                    Pos4 = new PosPart { En = "*", Ja = "*" }
                }
            }
        };

        // Act
        _sentenceExtractor.ProcessMorphemesInSentence(sentence);

        // Assert
        Assert.Equal("３十二個", sentence.Morphemes[3].CombinedForm);
        Assert.Null(sentence.Morphemes[3].SubjectId); // Kanji counter by itself should not be linked
        Assert.DoesNotContain(sentence.SourceVocabulary, s => s.SubjectId == counterId);
    }

    [Fact]
    public void ProcessMorphemesInSentence_WithSuruVerbFallback_LinksToBaseNoun()
    {
        // Arrange
        var nounId = 3004;
        AddSubject(nounId, "vocabulary", "ふがふが");

        var sentence = new ReadingSentence
        {
            Ja = "ふがふがします。",
            En = "I fugafuga.",
            SourceVocabulary = new List<SubjectReference>(),
            KanjiInSentence = new List<SubjectReference>(),
            Morphemes = new List<Morpheme>
            {
                new Morpheme
                {
                    Surface = "ふがふが",
                    Lemma = "ふがふが",
                    Orth = "ふがふが",
                    LemmaReading = "フガフガ",
                    Pron = "フガフガ",
                    ConjugationForm = "",
                    ConjugationType = "",
                    Pos1 = new PosPart { En = "noun", Ja = "名詞" },
                    Pos2 = new PosPart { En = "verbal", Ja = "サ変接続" },
                    Pos3 = new PosPart { En = "*", Ja = "*" },
                    Pos4 = new PosPart { En = "*", Ja = "*" }
                },
                new Morpheme
                {
                    Surface = "します",
                    Lemma = "する",
                    Orth = "し",
                    LemmaReading = "スル",
                    Pron = "シ",
                    ConjugationForm = "連用形-一般",
                    ConjugationType = "サ行変格",
                    Pos1 = new PosPart { En = "verb", Ja = "動詞" },
                    Pos2 = new PosPart { En = "*", Ja = "*" },
                    Pos3 = new PosPart { En = "*", Ja = "*" },
                    Pos4 = new PosPart { En = "*", Ja = "*" }
                }
            }
        };

        // Act
        _sentenceExtractor.ProcessMorphemesInSentence(sentence);

        // Assert
        Assert.Equal("ふがふが", sentence.Morphemes[1].CombinedForm);
        Assert.Equal(nounId, sentence.Morphemes[1].SubjectId);
        Assert.Contains(sentence.SourceVocabulary, s => s.SubjectId == nounId && s.Characters == "ふがふが");
    }

    [Fact]
    public void ProcessMorphemesInSentence_WithNumberAndCounter_RemovesNumberFromVocabulary()
    {
        // Arrange
        var numberId = 4001;
        var combinedId = 4002;
        AddSubject(numberId, "vocabulary", "七");
        AddSubject(combinedId, "vocabulary", "七つ");

        var sentence = new ReadingSentence
        {
            Ja = "七つあります。",
            En = "There are seven things.",
            SourceVocabulary = new List<SubjectReference>(),
            KanjiInSentence = new List<SubjectReference>(),
            Morphemes = new List<Morpheme>
            {
                new Morpheme
                {
                    Surface = "七",
                    Lemma = "七",
                    Orth = "七",
                    LemmaReading = "シチ",
                    Pron = "シチ",
                    ConjugationForm = "",
                    ConjugationType = "",
                    Pos1 = new PosPart { En = "noun", Ja = "名詞" },
                    Pos2 = new PosPart { En = "number", Ja = "数" },
                    Pos3 = new PosPart { En = "*", Ja = "*" },
                    Pos4 = new PosPart { En = "*", Ja = "*" }
                },
                new Morpheme
                {
                    Surface = "つ",
                    Lemma = "つ",
                    Orth = "つ",
                    LemmaReading = "ツ",
                    Pron = "ツ",
                    ConjugationForm = "",
                    ConjugationType = "",
                    Pos1 = new PosPart { En = "noun", Ja = "名詞" },
                    Pos2 = new PosPart { En = "counter", Ja = "助数詞可能" },
                    Pos3 = new PosPart { En = "*", Ja = "*" },
                    Pos4 = new PosPart { En = "*", Ja = "*" }
                }
            }
        };

        // Act
        _sentenceExtractor.ProcessMorphemesInSentence(sentence);

        // Assert
        Assert.Null(sentence.Morphemes[0].SubjectId); // Number ID should be cleaned up
        Assert.Equal(combinedId, sentence.Morphemes[1].SubjectId); // Counter should link to the combined form
        Assert.Equal("七つ", sentence.Morphemes[1].CombinedForm);

        // SourceVocabulary should only contain "七つ" (combinedId) and NOT "七" (numberId)
        Assert.Single(sentence.SourceVocabulary);
        Assert.Contains(sentence.SourceVocabulary, s => s.SubjectId == combinedId && s.Characters == "七つ");
        Assert.DoesNotContain(sentence.SourceVocabulary, s => s.SubjectId == numberId);
    }

    [Fact]
    public void ProcessMorphemesInSentence_WithKanjiCounterPrecededByNumber_DoesNotLinkCounterByItself()
    {
        // Arrange
        var numberId = 4003;
        var counterId = 4004;
        AddSubject(numberId, "vocabulary", "三");
        AddSubject(counterId, "vocabulary", "匹");

        var sentence = new ReadingSentence
        {
            Ja = "三匹います。",
            En = "There are three animals.",
            SourceVocabulary = new List<SubjectReference>(),
            KanjiInSentence = new List<SubjectReference>(),
            Morphemes = new List<Morpheme>
            {
                new Morpheme
                {
                    Surface = "三",
                    Lemma = "三",
                    Orth = "三",
                    LemmaReading = "サン",
                    Pron = "サン",
                    ConjugationForm = "",
                    ConjugationType = "",
                    Pos1 = new PosPart { En = "noun", Ja = "名詞" },
                    Pos2 = new PosPart { En = "number", Ja = "数" },
                    Pos3 = new PosPart { En = "*", Ja = "*" },
                    Pos4 = new PosPart { En = "*", Ja = "*" }
                },
                new Morpheme
                {
                    Surface = "匹",
                    Lemma = "匹",
                    Orth = "匹",
                    LemmaReading = "ヒキ",
                    Pron = "ヒキ",
                    ConjugationForm = "",
                    ConjugationType = "",
                    Pos1 = new PosPart { En = "noun", Ja = "名詞" },
                    Pos2 = new PosPart { En = "counter", Ja = "助数詞" },
                    Pos3 = new PosPart { En = "*", Ja = "*" },
                    Pos4 = new PosPart { En = "*", Ja = "*" }
                }
            }
        };

        // Act
        _sentenceExtractor.ProcessMorphemesInSentence(sentence);

        // Assert
        Assert.Null(sentence.Morphemes[0].SubjectId); // Number ID should be cleaned up
        Assert.Null(sentence.Morphemes[1].SubjectId); // Kanji counter by itself should not be linked
        Assert.Equal("三匹", sentence.Morphemes[1].CombinedForm); // Combined form should still be set visually

        // SourceVocabulary should be empty
        Assert.Empty(sentence.SourceVocabulary);
    }

    [Fact]
    public void ProcessMorphemesInSentence_WithNumberAndCounter_LookAheadSkipsNumberLinking()
    {
        // Arrange
        var numberId = 5001;
        var combinedId = 5002;
        AddSubject(numberId, "vocabulary", "七");
        AddSubject(combinedId, "vocabulary", "七つ");

        var sentence = new ReadingSentence
        {
            Ja = "七つ",
            En = "Seven items",
            SourceVocabulary = new List<SubjectReference>(),
            KanjiInSentence = new List<SubjectReference>(),
            Morphemes = new List<Morpheme>
            {
                new Morpheme
                {
                    Surface = "七",
                    Lemma = "七",
                    Orth = "七",
                    LemmaReading = "シチ",
                    Pron = "シチ",
                    ConjugationForm = "",
                    ConjugationType = "",
                    Pos1 = new PosPart { En = "noun", Ja = "名詞" },
                    Pos2 = new PosPart { En = "number", Ja = "数" },
                    Pos3 = new PosPart { En = "*", Ja = "*" },
                    Pos4 = new PosPart { En = "*", Ja = "*" }
                },
                new Morpheme
                {
                    Surface = "つ",
                    Lemma = "つ",
                    Orth = "つ",
                    LemmaReading = "ツ",
                    Pron = "ツ",
                    ConjugationForm = "",
                    ConjugationType = "",
                    Pos1 = new PosPart { En = "noun", Ja = "名詞" },
                    Pos2 = new PosPart { En = "counter", Ja = "助数詞可能" },
                    Pos3 = new PosPart { En = "*", Ja = "*" },
                    Pos4 = new PosPart { En = "*", Ja = "*" }
                }
            }
        };

        // Act
        _sentenceExtractor.ProcessMorphemesInSentence(sentence);

        // Assert
        Assert.Null(sentence.Morphemes[0].SubjectId); // Number ID should not be set (look-ahead skipped it)
        Assert.Equal(combinedId, sentence.Morphemes[1].SubjectId); // Counter links to the combined form
        
        Assert.Single(sentence.SourceVocabulary);
        Assert.Contains(sentence.SourceVocabulary, s => s.SubjectId == combinedId && s.Characters == "七つ");
        Assert.DoesNotContain(sentence.SourceVocabulary, s => s.SubjectId == numberId);
    }

    [Fact]
    public void ProcessMorphemesInSentence_WithStandaloneKanjiCounter_LinksSuccessfully()
    {
        // Arrange
        var counterId = 5003;
        AddSubject(counterId, "vocabulary", "匹");

        var sentence = new ReadingSentence
        {
            Ja = "匹",
            En = "Counter for small animals",
            SourceVocabulary = new List<SubjectReference>(),
            KanjiInSentence = new List<SubjectReference>(),
            Morphemes = new List<Morpheme>
            {
                new Morpheme
                {
                    Surface = "匹",
                    Lemma = "匹",
                    Orth = "匹",
                    LemmaReading = "ヒキ",
                    Pron = "ヒキ",
                    ConjugationForm = "",
                    ConjugationType = "",
                    Pos1 = new PosPart { En = "noun", Ja = "名詞" },
                    Pos2 = new PosPart { En = "counter", Ja = "助数詞" },
                    Pos3 = new PosPart { En = "*", Ja = "*" },
                    Pos4 = new PosPart { En = "*", Ja = "*" }
                }
            }
        };

        // Act
        _sentenceExtractor.ProcessMorphemesInSentence(sentence);

        // Assert
        Assert.Equal(counterId, sentence.Morphemes[0].SubjectId); // Standalone counter is linked
        Assert.Single(sentence.SourceVocabulary);
        Assert.Contains(sentence.SourceVocabulary, s => s.SubjectId == counterId && s.Characters == "匹");
    }

    [Fact]
    public void ProcessMorphemesInSentence_WithOkuDigit_ParsedAsNumeric()
    {
        // Arrange
        var counterId = 5004;
        AddSubject(counterId, "vocabulary", "一億人");

        var sentence = new ReadingSentence
        {
            Ja = "一億人",
            En = "One hundred million people",
            SourceVocabulary = new List<SubjectReference>(),
            KanjiInSentence = new List<SubjectReference>(),
            Morphemes = new List<Morpheme>
            {
                new Morpheme
                {
                    Surface = "一",
                    Lemma = "一",
                    Orth = "一",
                    LemmaReading = "イチ",
                    Pron = "イチ",
                    ConjugationForm = "",
                    ConjugationType = "",
                    Pos1 = new PosPart { En = "noun", Ja = "名詞" },
                    Pos2 = new PosPart { En = "number", Ja = "数" },
                    Pos3 = new PosPart { En = "*", Ja = "*" },
                    Pos4 = new PosPart { En = "*", Ja = "*" }
                },
                new Morpheme
                {
                    Surface = "億",
                    Lemma = "億",
                    Orth = "億",
                    LemmaReading = "オク",
                    Pron = "オク",
                    ConjugationForm = "",
                    ConjugationType = "",
                    Pos1 = new PosPart { En = "noun", Ja = "名詞" },
                    Pos2 = new PosPart { En = "number", Ja = "数" },
                    Pos3 = new PosPart { En = "*", Ja = "*" },
                    Pos4 = new PosPart { En = "*", Ja = "*" }
                },
                new Morpheme
                {
                    Surface = "人",
                    Lemma = "人",
                    Orth = "人",
                    LemmaReading = "ニン",
                    Pron = "ニン",
                    ConjugationForm = "",
                    ConjugationType = "",
                    Pos1 = new PosPart { En = "noun", Ja = "名詞" },
                    Pos2 = new PosPart { En = "counter", Ja = "助数詞" },
                    Pos3 = new PosPart { En = "*", Ja = "*" },
                    Pos4 = new PosPart { En = "*", Ja = "*" }
                }
            }
        };

        // Act
        _sentenceExtractor.ProcessMorphemesInSentence(sentence);

        // Assert
        Assert.Null(sentence.Morphemes[0].SubjectId); // 一 is numeric -> not linked
        Assert.Null(sentence.Morphemes[1].SubjectId); // 億 is numeric -> not linked
        Assert.Equal(counterId, sentence.Morphemes[2].SubjectId); // Combined form (一億人) matched
        Assert.Equal("一億人", sentence.Morphemes[2].CombinedForm);
    }

    [Fact]
    public void ProcessMorphemesInSentence_WithDesu_DoesNotCombine()
    {
        // Arrange
        var nounId = 6001;
        AddSubject(nounId, "vocabulary", "犬");

        var sentence = new ReadingSentence
        {
            Ja = "犬です。",
            En = "It is a dog.",
            SourceVocabulary = new List<SubjectReference>(),
            KanjiInSentence = new List<SubjectReference>(),
            Morphemes = new List<Morpheme>
            {
                new Morpheme
                {
                    Surface = "犬",
                    Lemma = "犬",
                    Orth = "犬",
                    LemmaReading = "イヌ",
                    Pron = "イヌ",
                    ConjugationForm = "",
                    ConjugationType = "",
                    Pos1 = new PosPart { En = "noun", Ja = "名詞" },
                    Pos2 = new PosPart { En = "*", Ja = "*" },
                    Pos3 = new PosPart { En = "*", Ja = "*" },
                    Pos4 = new PosPart { En = "*", Ja = "*" }
                },
                new Morpheme
                {
                    Surface = "です",
                    Lemma = "です",
                    Orth = "です",
                    LemmaReading = "デス",
                    Pron = "デス",
                    ConjugationForm = "助動詞-デス",
                    ConjugationType = "助動詞-デス",
                    Pos1 = new PosPart { En = "auxiliary verb", Ja = "助動詞" },
                    Pos2 = new PosPart { En = "*", Ja = "*" },
                    Pos3 = new PosPart { En = "*", Ja = "*" },
                    Pos4 = new PosPart { En = "*", Ja = "*" }
                }
            }
        };

        // Act
        _sentenceExtractor.ProcessMorphemesInSentence(sentence);

        // Assert
        Assert.Equal(nounId, sentence.Morphemes[0].SubjectId);
        Assert.Null(sentence.Morphemes[1].SubjectId);
        Assert.Null(sentence.Morphemes[1].CombinedForm);
    }
}


