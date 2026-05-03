import { useState, useEffect, useCallback } from "react";
import type { Subject } from "./Subject";
import { transformSubject } from "~/utils/transformSubject";
import { API_BASE_URL } from "~/config/api";

export type SubjectType = "radical" | "kanji" | "vocabulary" | "kana_vocabulary";

export interface PaginatedSubjects {
  data: Subject[];
  page: number;
  perPage: number;
  totalCount: number;
}

export async function fetchSubjects(
  subjectType: SubjectType,
  page: number = 1,
  perPage: number = 100,
  minLevel?: number,
  maxLevel?: number
): Promise<PaginatedSubjects> {
  const typeMap: Record<SubjectType, string[]> = {
    radical: ["Radical"],
    kanji: ["Kanji"],
    vocabulary: ["Vocabulary", "KanaVocabulary"],
    kana_vocabulary: ["KanaVocabulary"],
  };

  const queryTypes = typeMap[subjectType] || [];
  const params = new URLSearchParams();

  queryTypes.forEach(t => params.append('types', t));
  params.set('page', String(page));
  params.set('perPage', String(perPage));

  if (minLevel !== undefined) params.set('minLevel', String(minLevel));
  if (maxLevel !== undefined) params.set('maxLevel', String(maxLevel));

  const url = `${API_BASE_URL}/api/subjects?${params.toString()}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${subjectType} data`);
  }

  const apiData = await response.json();

  let subjectsData: any[] = [];
  let resultPage = page;
  let resultPerPage = perPage;
  let totalCount = 0;

  if (Array.isArray(apiData)) {
    subjectsData = apiData;
    totalCount = apiData.length;
  } else if (apiData) {
    subjectsData = apiData.data || apiData.Data || [];
    resultPage = apiData.page || apiData.Page || page;
    resultPerPage = apiData.perPage || apiData.PerPage || perPage;
    totalCount = apiData.totalCount || apiData.TotalCount || subjectsData.length;
  }

  return {
    data: subjectsData.map(transformSubject),
    page: resultPage,
    perPage: resultPerPage,
    totalCount: totalCount
  };
}

export function useInfiniteSubjects(
  initialData: PaginatedSubjects,
  subjectType: SubjectType,
  filters: { minLevel?: number; maxLevel?: number } = {}
) {
  const [subjects, setSubjects] = useState<Subject[]>(initialData.data || []);
  const [page, setPage] = useState(initialData.page || 1);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(initialData.totalCount || 0);

  // Reset when filters change
  useEffect(() => {
    let isMounted = true;

    // Skip reset for the initial mount if it matches initialData
    // Actually, it's safer to just fetch if filters are provided, 
    // but the initialData already has page 1 for the default view.
    // However, if the user starts with a filter, clientLoader might need to know.

    const resetAndFetch = async () => {
      setIsLoading(true);
      try {
        const result = await fetchSubjects(subjectType, 1, 100, filters.minLevel, filters.maxLevel);
        if (isMounted) {
          setSubjects(result.data || []);
          setPage(1);
          setTotalCount(result.totalCount);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    resetAndFetch();

    return () => { isMounted = false; };
  }, [subjectType, filters.minLevel, filters.maxLevel]);

  const hasMore = subjects.length < totalCount;

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    try {
      const nextPage = page + 1;
      const result = await fetchSubjects(subjectType, nextPage, 100, filters.minLevel, filters.maxLevel);
      setSubjects(prev => [...prev, ...(result.data || [])]);
      setPage(result.page);
      setTotalCount(result.totalCount);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, page, subjectType, filters.minLevel, filters.maxLevel]);

  return { subjects, loadMore, hasMore, isLoading, totalCount };
}
