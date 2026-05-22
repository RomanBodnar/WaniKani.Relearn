import type { Subject } from "~/hooks/Subject";

/**
 * Raw API response interface for subject data
 */
interface RawSubjectData {
  id: number;
  object: string;
  url: string;
  dataUpdatedAt: string;
  characters: string | null;
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
  visuallySimilarSubjectIds?: number[];
  characterImages?: Array<{ url: string; content_type: string; metadata: unknown }>;
  jlptLevel?: string;
  joyoGrade?: string;
}

/**
 * Transforms API response (snake_case/lowercase) to match Subject interface (PascalCase)
 * Handles both top-level and nested property name conversions
 */
export function transformSubject(apiSubject: any): Subject {
  const id = apiSubject.id ?? apiSubject.Id ?? (apiSubject.subjectId ? parseInt(apiSubject.subjectId, 10) : undefined) ?? (apiSubject.SubjectId ? parseInt(apiSubject.SubjectId, 10) : undefined);
  
  return {
    Id: id,
    Object: apiSubject.object ?? apiSubject.Object ?? apiSubject.type ?? apiSubject.Type,
    Url: apiSubject.url ?? apiSubject.Url,
    DataUpdatedAt: apiSubject.dataUpdatedAt ?? apiSubject.DataUpdatedAt,
    Characters: apiSubject.characters ?? apiSubject.Characters,
    Meanings: (apiSubject.meanings || apiSubject.Meanings)?.map((m: any) => ({
      Meaning: m.meaning ?? m.Meaning,
      Primary: m.primary ?? m.Primary,
      AcceptedAnswer: m.accepted_answer ?? m.AcceptedAnswer,
    })) || (
      (apiSubject.meaning || apiSubject.Meaning) ? [{
        Meaning: apiSubject.meaning || apiSubject.Meaning,
        Primary: true,
        AcceptedAnswer: true
      }] : []
    ),
    Readings: (apiSubject.readings || apiSubject.Readings)?.map((r: any) => ({
      Reading: r.reading ?? r.Reading,
      Primary: r.primary ?? r.Primary,
      AcceptedAnswer: r.accepted_answer ?? r.AcceptedAnswer,
      Type: r.type ?? r.Type,
    })) || (
      (apiSubject.reading || apiSubject.Reading) ? [{
        Reading: apiSubject.reading || apiSubject.Reading,
        Primary: true,
        AcceptedAnswer: true,
        Type: 'primary'
      }] : []
    ),
    Level: apiSubject.level ?? apiSubject.Level,
    LessonPosition: apiSubject.lessonPosition ?? apiSubject.LessonPosition,
    MeaningMnemonic: apiSubject.meaningMnemonic ?? apiSubject.MeaningMnemonic,
    ReadingMnemonic: apiSubject.readingMnemonic ?? apiSubject.ReadingMnemonic,
    PartsOfSpeech: apiSubject.partsOfSpeech ?? apiSubject.PartsOfSpeech,
    Slug: apiSubject.slug ?? apiSubject.Slug,
    SpacedRepetitionSystemId: apiSubject.spacedRepetitionSystemId ?? apiSubject.SpacedRepetitionSystemId,
    ComponentSubjectIds: apiSubject.componentSubjectIds,
    ContextSentences: apiSubject.contextSentences,
    PronunciationAudios: apiSubject.pronunciationAudios,
    AmalgamationSubjectIds: apiSubject.amalgamationSubjectIds,
    VisuallySimilarSubjectIds: apiSubject.visuallySimilarSubjectIds,
    CharacterImages: apiSubject.characterImages,
    JlptLevel: apiSubject.jlptLevel,
    JoyoGrade: apiSubject.joyoGrade,
  };
}
