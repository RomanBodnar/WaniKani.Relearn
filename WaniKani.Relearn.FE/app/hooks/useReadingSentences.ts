import { useState, useEffect, useCallback } from "react";
import { API_ENDPOINTS } from "~/config/api";
import type { ReadingSentence, PaginatedSentences, ReadingBookmark } from "~/types/reading";

const BOOKMARK_KEY = "reading-practice-bookmark";
const PER_PAGE = 10;

export async function fetchSentences(
  page: number = 1,
  perPage: number = PER_PAGE,
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

  const totalPages = Math.max(1, Math.ceil(totalCount / PER_PAGE));

  // Refetch when filters change — reset to page 1
  useEffect(() => {
    let isMounted = true;

    const refetch = async () => {
      setIsLoading(true);
      try {
        const result = await fetchSentences(1, PER_PAGE, filters.minLevel, filters.maxLevel);
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

  const goToPage = useCallback(async (targetPage: number) => {
    if (targetPage < 1 || targetPage > totalPages || isLoading) return;
    setIsLoading(true);
    try {
      const result = await fetchSentences(targetPage, PER_PAGE, filters.minLevel, filters.maxLevel);
      setSentences(result.data || []);
      setPage(result.page);
      setTotalCount(result.totalCount);
      // Scroll to top of sentence list
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [totalPages, isLoading, filters.minLevel, filters.maxLevel]);

  return { sentences, page, totalPages, totalCount, isLoading, goToPage };
}
