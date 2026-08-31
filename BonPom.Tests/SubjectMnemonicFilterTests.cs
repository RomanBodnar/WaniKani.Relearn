using NSubstitute;
using WaniKani.Relearn.Account.Data;
using WaniKani.Relearn.Contracts.Subjects;
using WaniKani.Relearn.Subjects.Services;
using Kanji = WaniKani.Relearn.Subjects.Data.Models.Kanji;
using Vocabulary = WaniKani.Relearn.Subjects.Data.Models.Vocabulary;
using VocabularyReading = WaniKani.Relearn.Subjects.Data.Models.VocabularyReading;

namespace BonPom.Tests;

public class SubjectMnemonicFilterTests
{
    private readonly IWaniKaniUserCache _userCache = Substitute.For<IWaniKaniUserCache>();
    private readonly WaniKaniUserSubscriptionService _subscriptionService;
    private readonly SubjectMnemonicFilter _filter;

    public SubjectMnemonicFilterTests()
    {
        var httpClient = new HttpClient();
        _subscriptionService = new WaniKaniUserSubscriptionService(httpClient);
        _filter = new SubjectMnemonicFilter(_userCache, _subscriptionService);
    }

    [Fact]
    public void FilterHintsAndMnemonics_WhenLevelAllowed_PreservesAllFields()
    {
        // Arrange
        var kanji = new Kanji
        {
            Id = 1,
            Object = "kanji",
            Slug = "一",
            Characters = "一",
            Level = 2,
            MeaningMnemonic = "One mnemonic",
            MeaningHint = "One hint",
            ReadingMnemonic = "Ichi mnemonic",
            ReadingHint = "Ichi hint",
            WaniKaniDocumentUrl = "https://wanikani.com/kanji/一",
            Meanings = [new MeaningObject { Meaning = "One", Primary = true }],
            Readings = [new KanjiReading { Reading = "いち", Primary = true }]
        };

        // Act
        var result = (Kanji)_filter.FilterHintsAndMnemonics(kanji, maxLevel: 3);

        // Assert
        Assert.Equal("One mnemonic", result.MeaningMnemonic);
        Assert.Equal("One hint", result.MeaningHint);
        Assert.Equal("Ichi mnemonic", result.ReadingMnemonic);
        Assert.Equal("Ichi hint", result.ReadingHint);
        Assert.NotEmpty(result.Meanings);
        Assert.NotEmpty(result.Readings);
    }

    [Fact]
    public void FilterHintsAndMnemonics_WhenLevelExceedsMax_RedactsKanjiFields()
    {
        // Arrange
        var kanji = new Kanji
        {
            Id = 2,
            Object = "kanji",
            Slug = "鬱",
            Characters = "鬱",
            Level = 50,
            MeaningMnemonic = "Depression mnemonic",
            MeaningHint = "Depression hint",
            ReadingMnemonic = "Utsu mnemonic",
            ReadingHint = "Utsu hint",
            WaniKaniDocumentUrl = "https://wanikani.com/kanji/鬱",
            Meanings = [new MeaningObject { Meaning = "Depression", Primary = true }],
            Readings = [new KanjiReading { Reading = "うつ", Primary = true }]
        };

        // Act
        var result = (Kanji)_filter.FilterHintsAndMnemonics(kanji, maxLevel: 3);

        // Assert
        Assert.Null(result.MeaningMnemonic);
        Assert.Null(result.MeaningHint);
        Assert.Null(result.ReadingMnemonic);
        Assert.Null(result.ReadingHint);
    }

    [Fact]
    public void FilterHintsAndMnemonics_WhenLevelExceedsMax_RedactsVocabularyFields()
    {
        // Arrange
        var vocab = new Vocabulary
        {
            Id = 3,
            Object = "vocabulary",
            Slug = "東京",
            Characters = "東京",
            Level = 10,
            MeaningMnemonic = "Tokyo meaning mnemonic",
            ReadingMnemonic = "Tokyo reading mnemonic",
            WaniKaniDocumentUrl = "https://wanikani.com/vocabulary/東京",
            Meanings = [new MeaningObject { Meaning = "Tokyo", Primary = true }],
            Readings = [new VocabularyReading { Reading = "とうきょう", Primary = true }]
        };

        // Act
        var result = (Vocabulary)_filter.FilterHintsAndMnemonics(vocab, maxLevel: 3);

        // Assert
        Assert.Null(result.MeaningMnemonic);
        Assert.Null(result.ReadingMnemonic);
    }

    [Fact]
    public async Task GetMaxAllowedLevelAsync_WhenCached_ReturnsCachedLevel()
    {
        // Arrange
        _userCache.GetMaxLevel("user-123").Returns(Task.FromResult<int?>(60));

        // Act
        var level = await _filter.GetMaxAllowedLevelAsync("user-123", token: null);

        // Assert
        Assert.Equal(60, level);
    }

    [Fact]
    public async Task GetMaxAllowedLevelAsync_WhenAnonymousAndNoToken_ReturnsFreeTierDefault()
    {
        // Act
        var level = await _filter.GetMaxAllowedLevelAsync(userId: null, token: null);

        // Assert
        Assert.Equal(3, level);
    }
}
