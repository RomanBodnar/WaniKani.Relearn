namespace WaniKani.Relearn.Data.Entities;

public class ContextSentenceEntity
{
    public long Id { get; set; }
    public int? SubjectId { get; set; }
    public required string Ja { get; set; }
    public required string En { get; set; }
    public int Level { get; set; } = 1;

    // Navigation properties
    public SubjectEntity? Subject { get; set; }
    public ICollection<SentenceSubjectReferenceEntity> SubjectReferences { get; set; } = [];
    public ICollection<SentenceMorphemeEntity> Morphemes { get; set; } = [];
    public ICollection<UserPracticedSentenceEntity> PracticedByUsers { get; set; } = [];
    public ICollection<UserTranslationAttemptEntity> TranslationAttempts { get; set; } = [];
}

public class SentenceSubjectReferenceEntity
{
    public long SentenceId { get; set; }
    public int SubjectId { get; set; }
    public required string ReferenceType { get; set; } // 'source_vocabulary', 'kanji_in_sentence'

    public ContextSentenceEntity? Sentence { get; set; }
    public SubjectEntity? Subject { get; set; }
}

public class SentenceMorphemeEntity
{
    public long Id { get; set; }
    public long SentenceId { get; set; }
    public int SequenceOrder { get; set; }
    public int? SubjectId { get; set; }
    public required string Surface { get; set; }
    public string? Lemma { get; set; }
    public string? LemmaReading { get; set; }
    public string? Orth { get; set; }
    public string? Pron { get; set; }
    public string? ConjugationType { get; set; }
    public string? ConjugationForm { get; set; }
    public string? Pos1Ja { get; set; }
    public string? Pos1En { get; set; }
    public string? Pos2Ja { get; set; }
    public string? Pos2En { get; set; }
    public string? Pos3Ja { get; set; }
    public string? Pos3En { get; set; }
    public string? Pos4Ja { get; set; }
    public string? Pos4En { get; set; }

    public ContextSentenceEntity? Sentence { get; set; }
    public SubjectEntity? Subject { get; set; }
}
