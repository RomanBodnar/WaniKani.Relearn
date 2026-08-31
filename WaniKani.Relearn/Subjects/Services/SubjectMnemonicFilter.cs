using WaniKani.Relearn.Account.Data;
using WaniKani.Relearn.Subjects.Data.Models;

namespace WaniKani.Relearn.Subjects.Services;

public class SubjectMnemonicFilter(
    IWaniKaniUserCache userCache,
    WaniKaniUserSubscriptionService subscriptionService)
{
    private const int MaxAllowedLevelWithoutSubscription = 3;

    public async ValueTask<int> GetMaxAllowedLevelAsync(string? userId, string? token)
    {
        int? maxLevel = null;
        if (!string.IsNullOrEmpty(userId))
        {
            maxLevel = await userCache.GetMaxLevel(userId);
        }

        if (maxLevel is null)
        {
            maxLevel = token switch
            {
                not null => (await subscriptionService.GetUserMaxLevel(token))?.MaxAllowedLevel
                            ?? MaxAllowedLevelWithoutSubscription,
                _ => MaxAllowedLevelWithoutSubscription
            };
            if (!string.IsNullOrEmpty(userId))
            {
                userCache.SetMaxLevel(userId, maxLevel);
            }
        }

        return maxLevel.Value;
    }

    public Subject FilterHintsAndMnemonics(Subject subject, int maxLevel)
    {
        if (maxLevel < subject.Level)
        {
            subject = subject with
            {
                MeaningMnemonic = null!,
            };
            if (subject is Kanji kanji)
            {
                subject = kanji with
                {
                    MeaningHint = null,
                    ReadingHint = null,
                    ReadingMnemonic = null!,
                };
            }
            else if (subject is Vocabulary vocabulary)
            {
                subject = vocabulary with
                {
                    ReadingMnemonic = null,
                };
            }
        }
        return subject;
    }

    public async ValueTask<Subject> FilterHintsAndMnemonics(Subject subject, string? userId, string? token)
    {
        var maxLevel = await GetMaxAllowedLevelAsync(userId, token);
        return FilterHintsAndMnemonics(subject, maxLevel);
    }
}
