namespace WaniKani.Relearn.Contracts.Assignments;

[Flags]
public enum SubjectType
{
    None = 0,
    Radical = 1,
    Kanji = 2,
    Vocabulary = 4,
    KanaVocabulary = 8
}
