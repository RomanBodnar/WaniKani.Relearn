import { useState, useEffect, useCallback, useRef } from "react";
import { API_ENDPOINTS } from "~/config/api";
import type { ReadingSentence, PaginatedSentences, ReadingBookmark, SentenceStatusFilter } from "~/types/reading";

const BOOKMARK_KEY = "reading-practice-bookmark";
const PER_PAGE = 10;

export async function fetchSentences(
  page: number = 1,
  perPage: number = PER_PAGE,
  minLevel?: number,
  maxLevel?: number,
  status: SentenceStatusFilter = "all"
): Promise<PaginatedSentences> {
  let url = `${API_ENDPOINTS.readingSentences}?page=${page}&perPage=${perPage}&status=${status}`;
  if (minLevel !== undefined) url += `&minLevel=${minLevel}`;
  if (maxLevel !== undefined) url += `&maxLevel=${maxLevel}`;

  const response = await fetch(url, { credentials: "include" });
  if (!response.ok) throw new Error("Failed to fetch sentences");

  const apiData = await response.json();

  return {
    data: apiData.data || apiData.Data || [],
    page: apiData.page || apiData.Page || page,
    perPage: apiData.perPage || apiData.PerPage || perPage,
    totalCount: apiData.totalCount || apiData.TotalCount || 0,
  };
}

export function saveBookmarkLocal(bookmark: ReadingBookmark): void {
  try {
    localStorage.setItem(BOOKMARK_KEY, JSON.stringify(bookmark));
  } catch {
    // localStorage may be unavailable
  }
}

export function loadBookmarkLocal(): ReadingBookmark | null {
  try {
    const raw = localStorage.getItem(BOOKMARK_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ReadingBookmark;
  } catch {
    return null;
  }
}

export function clearBookmarkLocal(): void {
  try {
    localStorage.removeItem(BOOKMARK_KEY);
  } catch {
    // noop
  }
}

export async function loadBookmarkAsync(isLoggedIn: boolean): Promise<ReadingBookmark | null> {
  if (isLoggedIn) {
    try {
      const res = await fetch(API_ENDPOINTS.readingBookmark, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        return {
          page: data.page ?? data.Page ?? 1,
          sentenceIndex: data.sentenceIndex ?? data.SentenceIndex ?? 0,
          minLevel: data.minLevel ?? data.MinLevel,
          maxLevel: data.maxLevel ?? data.MaxLevel,
          timestamp: data.updatedAt ?? data.UpdatedAt ?? new Date().toISOString(),
        };
      }
    } catch {
      // Fallback to local
    }
  }
  return loadBookmarkLocal();
}

export async function saveBookmarkAsync(bookmark: ReadingBookmark, isLoggedIn: boolean): Promise<void> {
  saveBookmarkLocal(bookmark);

  if (isLoggedIn) {
    try {
      await fetch(API_ENDPOINTS.readingBookmark, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          page: bookmark.page,
          sentenceIndex: bookmark.sentenceIndex,
          minLevel: bookmark.minLevel ?? null,
          maxLevel: bookmark.maxLevel ?? null,
          updatedAt: bookmark.timestamp || new Date().toISOString()
        })
      });
    } catch (err) {
      console.error("Failed to persist bookmark to server", err);
    }
  }
}

export async function clearBookmarkAsync(isLoggedIn: boolean): Promise<void> {
  clearBookmarkLocal();

  if (isLoggedIn) {
    try {
      await fetch(API_ENDPOINTS.readingBookmark, {
        method: "DELETE",
        credentials: "include"
      });
    } catch (err) {
      console.error("Failed to clear bookmark on server", err);
    }
  }
}

export function useReadingSentences(
  initialData: PaginatedSentences,
  filters: { minLevel?: number; maxLevel?: number; status?: SentenceStatusFilter } = {},
  onPageChange?: (page: number) => void
) {
  const [sentences, setSentences] = useState<ReadingSentence[]>(initialData.data || []);
  const [page, setPage] = useState(initialData.page || 1);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(initialData.totalCount || 0);

  const status = filters.status || "all";
  const totalPages = Math.max(1, Math.ceil(totalCount / PER_PAGE));

  const prevFilters = useRef({ minLevel: filters.minLevel, maxLevel: filters.maxLevel, status });

  useEffect(() => {
    const prev = prevFilters.current;
    if (prev.minLevel === filters.minLevel && prev.maxLevel === filters.maxLevel && prev.status === status) {
      return;
    }
    prevFilters.current = { minLevel: filters.minLevel, maxLevel: filters.maxLevel, status };

    let isMounted = true;

    const refetch = async () => {
      setIsLoading(true);
      try {
        const result = await fetchSentences(1, PER_PAGE, filters.minLevel, filters.maxLevel, status);
        if (isMounted) {
          setSentences(result.data || []);
          setPage(1);
          setTotalCount(result.totalCount);
          onPageChange?.(1);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    refetch();
    return () => { isMounted = false; };
  }, [filters.minLevel, filters.maxLevel, status, onPageChange]);

  const goToPage = useCallback(async (targetPage: number) => {
    if (targetPage < 1 || targetPage > totalPages || isLoading) return;
    setIsLoading(true);
    try {
      const result = await fetchSentences(targetPage, PER_PAGE, filters.minLevel, filters.maxLevel, status);
      setSentences(result.data || []);
      setPage(result.page);
      setTotalCount(result.totalCount);
      onPageChange?.(result.page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [totalPages, isLoading, filters.minLevel, filters.maxLevel, status, onPageChange]);

  const togglePracticed = useCallback(async (sentenceId: number, currentlyPracticed: boolean, isLoggedIn: boolean) => {
    // Optimistic update
    setSentences(prev => prev.map(s => s.id === sentenceId ? { ...s, isPracticed: !currentlyPracticed } : s));

    if (isLoggedIn) {
      try {
        const url = currentlyPracticed
          ? API_ENDPOINTS.unmarkPracticedSentence(sentenceId)
          : API_ENDPOINTS.markPracticedSentence(sentenceId);
        
        const method = currentlyPracticed ? "DELETE" : "POST";
        await fetch(url, { method, credentials: "include" });
      } catch (err) {
        console.error("Failed to toggle sentence practiced state", err);
        // Revert on error
        setSentences(prev => prev.map(s => s.id === sentenceId ? { ...s, isPracticed: currentlyPracticed } : s));
      }
    }
  }, []);

  return { sentences, page, totalPages, totalCount, isLoading, goToPage, togglePracticed };
}
