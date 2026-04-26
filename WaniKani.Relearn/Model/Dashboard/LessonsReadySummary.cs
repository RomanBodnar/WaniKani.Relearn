namespace WaniKani.Relearn.Model.Dashboard;

public record LessonsReadySummary(
    int Total,
    int Radicals,
    int Kanji,
    int Vocabulary);