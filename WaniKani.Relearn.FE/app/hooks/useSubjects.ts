import { useState, useEffect } from "react";

export type SubjectType = "kanji" | "vocabulary" | "kana_vocabulary";

export interface Subject {
  Id: number;
  Object: string;
  Url: string;
  DataUpdatedAt: string;
  Data: {
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
      Type: string;
    }>;
    Level?: number;
    LessonPosition?: number;
    MeaningMnemonic?: string;
    ReadingMnemonic?: string;
    PartOfSpeech?: string[];
    [key: string]: any;
  };
}

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

export async function fetchSubjects(
  subjectType: SubjectType
): Promise<SubjectsResponse> {
  const typeMap: Record<SubjectType, string> = {
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

  return response.json();
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
        setData(result.data);
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
