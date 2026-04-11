import { useState, useEffect } from "react";
import type { Subject } from "./Subject";

export type SubjectType = "kanji" | "vocabulary" | "kana_vocabulary";

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
): Promise<Subject[]> {
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
