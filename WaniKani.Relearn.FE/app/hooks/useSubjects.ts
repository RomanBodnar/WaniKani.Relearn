import { useState, useEffect } from "react";
import type { Subject } from "./Subject";
import { transformSubject } from "~/utils/transformSubject";
import { API_BASE_URL } from "~/config/api";

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
  const response = await fetch(`${API_BASE_URL}/api/subjects/${queryType}`);

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
    const controller = new AbortController();
    let isMounted = true;

    const loadData = async () => {
      try {
        setIsLoading(true);
        const typeMap: Record<SubjectType, string> = {
          radical: "Radical",
          kanji: "Kanji",
          vocabulary: "Vocabulary",
          kana_vocabulary: "KanaVocabulary",
        };
        const queryType = typeMap[subjectType];
        const response = await fetch(
          `${API_BASE_URL}/api/subjects/${queryType}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch ${subjectType} data`);
        }

        const apiData = await response.json();
        const result = apiData.map(transformSubject);
        
        if (isMounted) {
          setData(result);
          setError(null);
          setIsLoading(false);
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return; // Ignore abort errors
        }
        if (isMounted) {
          setError(err instanceof Error ? err : new Error("Unknown error"));
          setData(null);
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [subjectType]);

  return { data, isLoading, error };
}
