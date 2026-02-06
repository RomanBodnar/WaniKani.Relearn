using System;

namespace WaniKani.Relearn.Model.Assignments;

public static class Mapping
{
    public static string ToSnakeCaseString(this SubjectType subjectType) => subjectType switch
    {
        SubjectType.Radical => "radical",
        SubjectType.Kanji => "kanji",
        SubjectType.Vocabulary => "vocabulary",
        SubjectType.KanaVocabulary => "kana_vocabulary",
        _ => throw new ArgumentOutOfRangeException(nameof(subjectType), subjectType, null)
    };
}
