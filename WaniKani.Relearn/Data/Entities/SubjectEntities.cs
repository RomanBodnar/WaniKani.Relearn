namespace WaniKani.Relearn.Data.Entities;

public class SubjectEntity
{
    public int Id { get; set; }
    public required string ObjectType { get; set; } // 'radical', 'kanji', 'vocabulary'
    public required string Slug { get; set; }
    public string? Characters { get; set; }
    public required string MeaningMnemonic { get; set; }
    public string? WaniKaniApiUrl { get; set; }
    public required string WaniKaniDocumentUrl { get; set; }
    public int Level { get; set; }
    public int SpacedRepetitionSystemId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? HiddenAt { get; set; }
    public DateTime DataUpdatedAt { get; set; }

    // Navigation properties
    public ICollection<SubjectMeaningEntity> Meanings { get; set; } = [];
    public ICollection<SubjectAuxiliaryMeaningEntity> AuxiliaryMeanings { get; set; } = [];
    public KanjiDetailsEntity? KanjiDetails { get; set; }
    public VocabularyDetailsEntity? VocabularyDetails { get; set; }
    public ICollection<KanjiReadingEntity> KanjiReadings { get; set; } = [];
    public ICollection<VocabularyReadingEntity> VocabularyReadings { get; set; } = [];
    public ICollection<VocabularyPartOfSpeechEntity> PartsOfSpeech { get; set; } = [];
    public ICollection<VocabularyPronunciationAudioEntity> PronunciationAudios { get; set; } = [];
    public ICollection<RadicalCharacterImageEntity> RadicalCharacterImages { get; set; } = [];
    public ICollection<SubjectRelationshipEntity> ParentRelationships { get; set; } = [];
    public ICollection<SubjectRelationshipEntity> ChildRelationships { get; set; } = [];
    public ICollection<ContextSentenceEntity> ContextSentences { get; set; } = [];
}

public class SubjectMeaningEntity
{
    public long Id { get; set; }
    public int SubjectId { get; set; }
    public required string Meaning { get; set; }
    public bool IsPrimary { get; set; }
    public bool AcceptedAnswer { get; set; } = true;

    public SubjectEntity? Subject { get; set; }
}

public class SubjectAuxiliaryMeaningEntity
{
    public long Id { get; set; }
    public int SubjectId { get; set; }
    public required string Meaning { get; set; }
    public required string Type { get; set; } // 'whitelist', 'blacklist'

    public SubjectEntity? Subject { get; set; }
}

public class KanjiDetailsEntity
{
    public int SubjectId { get; set; }
    public string? MeaningHint { get; set; }
    public string? ReadingHint { get; set; }
    public required string ReadingMnemonic { get; set; }
    public string? JlptLevel { get; set; }
    public string? JoyoGrade { get; set; }

    public SubjectEntity? Subject { get; set; }
}

public class KanjiReadingEntity
{
    public long Id { get; set; }
    public int SubjectId { get; set; }
    public required string Reading { get; set; }
    public required string Type { get; set; } // 'onyomi', 'kunyomi', 'nanori'
    public bool IsPrimary { get; set; }
    public bool AcceptedAnswer { get; set; } = true;

    public SubjectEntity? Subject { get; set; }
}

public class VocabularyDetailsEntity
{
    public int SubjectId { get; set; }
    public string? ReadingMnemonic { get; set; }

    public SubjectEntity? Subject { get; set; }
}

public class VocabularyReadingEntity
{
    public long Id { get; set; }
    public int SubjectId { get; set; }
    public required string Reading { get; set; }
    public bool IsPrimary { get; set; }
    public bool AcceptedAnswer { get; set; } = true;

    public SubjectEntity? Subject { get; set; }
}

public class VocabularyPartOfSpeechEntity
{
    public int SubjectId { get; set; }
    public required string PartOfSpeech { get; set; }

    public SubjectEntity? Subject { get; set; }
}

public class VocabularyPronunciationAudioEntity
{
    public long Id { get; set; }
    public int SubjectId { get; set; }
    public required string Url { get; set; }
    public required string ContentType { get; set; }
    public required string Gender { get; set; }
    public int SourceId { get; set; }
    public required string Pronunciation { get; set; }
    public string? VoiceActorId { get; set; }
    public string? VoiceActorName { get; set; }
    public string? VoiceDescription { get; set; }

    public SubjectEntity? Subject { get; set; }
}

public class RadicalCharacterImageEntity
{
    public long Id { get; set; }
    public int SubjectId { get; set; }
    public required string Url { get; set; }
    public required string ContentType { get; set; }
    public string? MetadataJson { get; set; }

    public SubjectEntity? Subject { get; set; }
}

public class SubjectRelationshipEntity
{
    public int ParentSubjectId { get; set; }
    public int ChildSubjectId { get; set; }
    public required string RelationshipType { get; set; } // 'amalgamation', 'component', 'visually_similar'

    public SubjectEntity? ParentSubject { get; set; }
    public SubjectEntity? ChildSubject { get; set; }
}
