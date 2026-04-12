import { useState, useEffect } from "react";
import type { Subject } from "./Subject";

export type SubjectType = "radical" | "kanji" | "vocabulary" | "kana_vocabulary";

export interface SubjectsResponse {
  data: Subject[];
  total_count: number;
  pages_total_count: number;
  current_page: number;
}

interface UseSubjectsResult {
  data: Subject[] | null;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Transforms API response (snake_case/lowercase) to match Subject interface (PascalCase)
 * Handles both top-level and nested property name conversions
 */
function transformSubject(apiSubject: any): Subject {
  return {
    Id: apiSubject.id,
    Object: apiSubject.object,
    Url: apiSubject.url,
    DataUpdatedAt: apiSubject.dataUpdatedAt,
    Characters: apiSubject.characters,
    Meanings: apiSubject.meanings?.map((m: any) => ({
      Meaning: m.meaning,
      Primary: m.primary,
      AcceptedAnswer: m.accepted_answer,
    })) || [],
    Readings: apiSubject.readings?.map((r: any) => ({
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
    AmalgationSubjectIds: apiSubject.amalgationSubjectIds,
    CharacterImages: apiSubject.characterImages,
  };
}

export async function fetchSubjects(
  subjectType: SubjectType
): Promise<Subject[]> {
  const typeMap: Record<SubjectType, string> = {
    radical: "Radical",
    kanji: "Kanji",
    vocabulary: "Vocabulary",
    kana_vocabulary: "KanaVocabulary",
  };

  const queryType = typeMap[subjectType];
  const response = await fetch(
    `http://localhost:5138/api/subjects/${queryType}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch ${subjectType} data`);
  }

  const apiData = await response.json();
  return apiData.map(transformSubject);
}

export function useSubjects(subjectType: SubjectType): UseSubjectsResult {
  const [data, setData] = useState<Subject[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const result = await fetchSubjects(subjectType);
        setData(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [subjectType]);

  return { data, isLoading, error };
}
