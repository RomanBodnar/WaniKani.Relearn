import type { Subject } from "~/hooks/Subject";

/**
 * Raw API response interface for subject data
 */
interface RawSubjectData {
  id: number;
  object: string;
  url: string;
  dataUpdatedAt: string;
  characters: string;
  meanings?: Array<{
    meaning: string;
    primary: boolean;
    accepted_answer: boolean;
  }>;
  readings?: Array<{
    reading: string;
    primary: boolean;
    accepted_answer: boolean;
    type?: string;
  }>;
  level?: number;
  lessonPosition?: number;
  meaningMnemonic?: string;
  readingMnemonic?: string;
  partsOfSpeech?: string[];
  slug?: string;
  spacedRepetitionSystemId?: number;
  componentSubjectIds?: number[];
  contextSentences?: Array<{ en: string; ja: string }>;
  pronunciationAudios?: Array<{ url: string; content_type: string; metadata: unknown }>;
  amalgamationSubjectIds?: number[];
  characterImages?: Array<{ url: string; content_type: string; metadata: unknown }>;
}

/**
 * Transforms API response (snake_case/lowercase) to match Subject interface (PascalCase)
 * Handles both top-level and nested property name conversions
 */
export function transformSubject(apiSubject: RawSubjectData): Subject {
  return {
    Id: apiSubject.id,
    Object: apiSubject.object,
    Url: apiSubject.url,
    DataUpdatedAt: apiSubject.dataUpdatedAt,
    Characters: apiSubject.characters,
    Meanings: apiSubject.meanings?.map((m) => ({
      Meaning: m.meaning,
      Primary: m.primary,
      AcceptedAnswer: m.accepted_answer,
    })) || [],
    Readings: apiSubject.readings?.map((r) => ({
      Reading: r.reading,
      Primary: r.primary,
      AcceptedAnswer: r.accepted_answer,
      Type: r.type,
    })) || [],
    Level: apiSubject.level,
    LessonPosition: apiSubject.lessonPosition,
    MeaningMnemonic: apiSubject.meaningMnemonic,
    ReadingMnemonic: apiSubject.readingMnemonic,
    PartsOfSpeech: apiSubject.partsOfSpeech,
    Slug: apiSubject.slug,
    SpacedRepetitionSystemId: apiSubject.spacedRepetitionSystemId,
    ComponentSubjectIds: apiSubject.componentSubjectIds,
    ContextSentences: apiSubject.contextSentences,
    PronunciationAudios: apiSubject.pronunciationAudios,
    AmalgamationSubjectIds: apiSubject.amalgamationSubjectIds,
    CharacterImages: apiSubject.characterImages,
  };
}
