import { useState, useEffect, useCallback } from "react";
import { API_ENDPOINTS } from "~/config/api";
import type { ReadingSentence, PaginatedSentences, ReadingBookmark } from "~/types/reading";

const BOOKMARK_KEY = "reading-practice-bookmark";

export async function fetchSentences(
  page: number = 1,
  perPage: number = 10,
  minLevel?: number,
  maxLevel?: number
): Promise<PaginatedSentences> {
  let url = `${API_ENDPOINTS.readingSentences}?page=${page}&perPage=${perPage}`;
  if (minLevel !== undefined) url += `&minLevel=${minLevel}`;
  if (maxLevel !== undefined) url += `&maxLevel=${maxLevel}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch sentences");

  const apiData = await response.json();

  return {
    data: apiData.data || apiData.Data || [],
    page: apiData.page || apiData.Page || page,
    perPage: apiData.perPage || apiData.PerPage || perPage,
    totalCount: apiData.totalCount || apiData.TotalCount || 0,
  };
}

export function saveBookmark(bookmark: ReadingBookmark): void {
  try {
    localStorage.setItem(BOOKMARK_KEY, JSON.stringify(bookmark));
  } catch {
    // localStorage may be unavailable
  }
}

export function loadBookmark(): ReadingBookmark | null {
  try {
    const raw = localStorage.getItem(BOOKMARK_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ReadingBookmark;
  } catch {
    return null;
  }
}

export function clearBookmark(): void {
  try {
    localStorage.removeItem(BOOKMARK_KEY);
  } catch {
    // noop
  }
}

export function useReadingSentences(
  initialData: PaginatedSentences,
  filters: { minLevel?: number; maxLevel?: number } = {}
) {
  const [sentences, setSentences] = useState<ReadingSentence[]>(initialData.data || []);
  const [page, setPage] = useState(initialData.page || 1);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(initialData.totalCount || 0);

  // Reset when filters change
  useEffect(() => {
    let isMounted = true;

    const refetch = async () => {
      setIsLoading(true);
      try {
        const result = await fetchSentences(1, 10, filters.minLevel, filters.maxLevel);
        if (isMounted) {
          setSentences(result.data || []);
          setPage(1);
          setTotalCount(result.totalCount);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    refetch();
    return () => { isMounted = false; };
  }, [filters.minLevel, filters.maxLevel]);

  const hasMore = sentences.length < totalCount;

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    try {
      const nextPage = page + 1;
      const result = await fetchSentences(nextPage, 10, filters.minLevel, filters.maxLevel);
      setSentences(prev => [...prev, ...(result.data || [])]);
      setPage(result.page);
      setTotalCount(result.totalCount);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, page, filters.minLevel, filters.maxLevel]);

  /**
   * Load sentences up to a specific page (used for bookmark resume).
   * Fetches pages 1..targetPage and merges all results.
   */
  const loadUpToPage = useCallback(async (targetPage: number) => {
    setIsLoading(true);
    try {
      const allSentences: ReadingSentence[] = [];
      for (let p = 1; p <= targetPage; p++) {
        const result = await fetchSentences(p, 10, filters.minLevel, filters.maxLevel);
        allSentences.push(...(result.data || []));
        if (p === targetPage) {
          setTotalCount(result.totalCount);
        }
      }
      setSentences(allSentences);
      setPage(targetPage);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [filters.minLevel, filters.maxLevel]);

  return { sentences, loadMore, loadUpToPage, hasMore, isLoading, totalCount, page };
}
