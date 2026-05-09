using WaniKani.Relearn.Model.Assignments;
using WaniKani.Relearn.Model.Dashboard;

namespace WaniKani.Relearn.Model.Reviews;

public interface IDashboardService
{
    Task<DashboardSummary> GetDashboardSummary();
}

public enum SrsLevel
{
    Apprentice = 1,
    Guru = 2,
    Master = 3,
    Enlighten = 4,
    Burned = 5
}

public class DashboardService(
    IAssignmentApi assignmentApi
    ) : IDashboardService
{

    public async Task<DashboardSummary> GetDashboardSummary()
    {
        AssignmentsQuery query = new()
        {
            Burned = false,
            Unlocked = true,
        };
        var assignments = await assignmentApi.GetAssignments(query);
        var reviews = assignments.Data.Where(x => x.Data.AvailableAt is not null);
        var summary = new DashboardSummary
        {
            SrsDistribution = GetSrsDistribution(reviews.ToList()),
            LessonsReady = GetReadyLessons(assignments.Data.ToList()),
            ReviewsAwaiting = GetReadyReviews(reviews.ToList())
        };
        return summary;  
    }

    public List<SrsDistributionItem> GetSrsDistribution(List<SingleResource<Assignment>> reviews)
    {
        var stageDisctributions = reviews
            .GroupBy(x => GetSrsStage(x.Data.SrsStage))
            .Select(group =>
            {
                var srsSrsStage = group.Key;
                return group.Aggregate(
                    new SrsDistributionItem(
                        srsSrsStage.ToString(),
                        0,
                        0,
                        0
                    ),
                    (acc, item) =>
                    {
                        switch (item.Data.SubjectType)
                        {
                            case string s when s == SubjectType.Kanji.ToSnakeCaseString():
                                acc.Kanji++;
                                return acc;
                            case string s when s == SubjectType.Radical.ToSnakeCaseString():
                                acc.Radicals++;
                                return acc;
                            case string v when v == SubjectType.Vocabulary.ToSnakeCaseString() || v == SubjectType.KanaVocabulary.ToSnakeCaseString():
                                acc.Vocabulary++;
                                return acc;
                            default: return acc;
                        }
                    }

                );
            })
            .ToList();
        return stageDisctributions;

        SrsLevel GetSrsStage(int srsStage)
        {
            return srsStage switch
            {
                1 or 2 or 3 or 4 => SrsLevel.Apprentice,
                5 or 6 => SrsLevel.Guru,
                7 => SrsLevel.Master,
                8 => SrsLevel.Enlighten,
                9 => SrsLevel.Burned,
                _ => throw new ArgumentOutOfRangeException(nameof(srsStage), $"Invalid SRS stage: {srsStage}")
            };

        }
    }

    public ReviewsReadySummary GetReadyReviews(List<SingleResource<Assignment>> reviews)
    {
        ReviewsReadySummary reviewSummary = reviews
        .GroupBy(review => review.Data.SubjectType)
        .Aggregate(
            new ReviewsReadySummary(reviews.Count, 0, 0, 0),
            (acc, group) =>
            {
                switch (group.Key)
                {
                    case string s when s == SubjectType.Kanji.ToSnakeCaseString():
                        return acc with { Kanji = group.Count() };
                    case string s when s == SubjectType.Radical.ToSnakeCaseString():
                        return acc with { Radicals = group.Count() };
                    case string v when v == SubjectType.Vocabulary.ToSnakeCaseString() || v == SubjectType.KanaVocabulary.ToSnakeCaseString():
                        return acc with { Vocabulary = acc.Vocabulary + group.Count() };
                    default: return acc;
                }
            });
        return reviewSummary;
    }

    public LessonsReadySummary GetReadyLessons(List<SingleResource<Assignment>> assignments)
    {
        var lessons = assignments.Where(x => x.Data.AvailableAt is null).ToList();
        
        LessonsReadySummary lessonSummary = lessons
        .GroupBy(lesson => lesson.Data.SubjectType)
        .Aggregate(
            new LessonsReadySummary(lessons.Count, 0, 0, 0),
            (acc, group) =>
            {
                switch (group.Key)
                {
                    case string s when s == SubjectType.Kanji.ToSnakeCaseString():
                        return acc with { Kanji = group.Count() };
                    case string s when s == SubjectType.Radical.ToSnakeCaseString():
                        return acc with { Radicals = group.Count() };
                    case string v when v == SubjectType.Vocabulary.ToSnakeCaseString() || v == SubjectType.KanaVocabulary.ToSnakeCaseString():
                        return acc with { Vocabulary = acc.Vocabulary + group.Count() };
                    default: return acc;
                }
            });
        return lessonSummary;
    }
}