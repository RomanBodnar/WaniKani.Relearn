
export interface Subject {
  Id: number;
  Object: string;
  Url: string;
  DataUpdatedAt: string;
  Characters: string;
  Meanings: Array<{
    Meaning: string;
    Primary: boolean;
    AcceptedAnswer: boolean;
  }>;
  Readings?: Array<{
    Reading: string;
    Primary: boolean;
    AcceptedAnswer: boolean;
    Type?: string;
  }>;
  Level?: number;
  LessonPosition?: number;
  MeaningMnemonic?: string;
  ReadingMnemonic?: string;
  PartsOfSpeech?: string[];
  Slug?: string;
  SpacedRepetitionSystemId?: number;
  ComponentSubjectIds?: number[];
  ContextSentences?: Array<{ en: string; ja: string }>;
  PronunciationAudios?: Array<{ url: string; content_type: string; metadata: unknown }>;
  AmalgamationSubjectIds?: number[];
  CharacterImages?: Array<{ url: string; content_type: string; metadata: unknown }>;
}
