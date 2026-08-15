import type { Route } from "./+types/reading-practice";
import { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams, useRouteLoaderData } from "react-router";
import {
  fetchSentences,
  useReadingSentences,
  saveBookmarkAsync,
  loadBookmarkAsync,
  clearBookmarkAsync
} from "~/hooks/useReadingSentences";
import { ReadingSentenceCard } from "./ReadingSentenceCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorDisplay } from "../components/ErrorDisplay";
import { LevelFilter, type LevelRange } from "../components/LevelFilter";
import type { ReadingBookmark, SentenceStatusFilter } from "~/types/reading";
import "./reading-practice.css";

export function meta() {
  return [
    { title: "Reading Practice | BonPom" },
    { name: "description", content: "Practice reading Japanese sentences from WaniKani vocabulary" },
  ];
}

export async function clientLoader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1", 10));
  const status = (url.searchParams.get("status") as SentenceStatusFilter) || "unpracticed";
  const minLevel = url.searchParams.get("minLevel") ? parseInt(url.searchParams.get("minLevel")!, 10) : undefined;
  const maxLevel = url.searchParams.get("maxLevel") ? parseInt(url.searchParams.get("maxLevel")!, 10) : undefined;
  return await fetchSentences(page, 10, minLevel, maxLevel, status);
}

export function ErrorBoundary() {
  return (
    <div className="reading-practice-container">
      <div className="reading-practice-header">
        <h1 className="reading-practice-title">Reading Practice</h1>
      </div>
      <ErrorDisplay 
        title="Error loading sentences" 
        description="Make sure the back-end reading practice API is running."
      />
    </div>
  );
}

export default function ReadingPractice({ loaderData: initialData }: Route.ComponentProps) {
  const rootData = useRouteLoaderData("root") as { isLoggedIn: boolean } | undefined;
  const isLoggedIn = rootData?.isLoggedIn || false;

  const [selectedRange, setSelectedRange] = useState<LevelRange>(null);
  const [bookmark, setBookmark] = useState<ReadingBookmark | null>(null);
  const [hasResumed, setHasResumed] = useState(false);
  const [focusModeIndex, setFocusModeIndex] = useState<number | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const statusFilter = (searchParams.get("status") as SentenceStatusFilter) || "unpracticed";

  const filters = useMemo(() => ({
    minLevel: selectedRange?.[0],
    maxLevel: selectedRange?.[1],
    status: statusFilter
  }), [selectedRange, statusFilter]);

  // Sync page changes to the URL search param
  const syncPage = useCallback((newPage: number) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (newPage <= 1) {
          next.delete("page");
        } else {
          next.set("page", String(newPage));
        }
        return next;
      },
      { replace: false }
    );
  }, [setSearchParams]);

  const handleStatusFilterChange = (newStatus: SentenceStatusFilter) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (newStatus === "unpracticed") {
          next.delete("status");
        } else {
          next.set("status", newStatus);
        }
        next.delete("page");
        return next;
      },
      { replace: false }
    );
  };

  const {
    sentences, page, totalPages, totalCount, isLoading, goToPage, togglePracticed
  } = useReadingSentences(initialData, filters, syncPage);

  // Load bookmark on mount
  useEffect(() => {
    loadBookmarkAsync(isLoggedIn).then(saved => {
      if (saved) setBookmark(saved);
    });
  }, [isLoggedIn]);

  // Update bookmark as user interacts with cards
  const handleCardInteract = useCallback((sentenceIndex: number) => {
    const bm: ReadingBookmark = {
      page,
      sentenceIndex,
      minLevel: filters.minLevel,
      maxLevel: filters.maxLevel,
      timestamp: new Date().toISOString(),
    };
    saveBookmarkAsync(bm, isLoggedIn);
  }, [page, filters.minLevel, filters.maxLevel, isLoggedIn]);

  // Update bookmark when focus mode changes
  useEffect(() => {
    if (focusModeIndex !== null) {
      handleCardInteract(focusModeIndex);
    }
  }, [focusModeIndex, handleCardInteract]);

  // Resume from bookmark
  const handleResume = useCallback(async () => {
    if (!bookmark) return;

    if (bookmark.minLevel !== undefined || bookmark.maxLevel !== undefined) {
      const range: LevelRange = (bookmark.minLevel && bookmark.maxLevel)
        ? [bookmark.minLevel, bookmark.maxLevel]
        : null;
      setSelectedRange(range);
    }

    await goToPage(bookmark.page);
    setHasResumed(true);
    setBookmark(null);

    setTimeout(() => {
      const el = document.getElementById(`sentence-${bookmark.sentenceIndex}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.style.boxShadow = "0 0 0 3px rgba(41, 98, 255, 0.4)";
        setTimeout(() => { el.style.boxShadow = ""; }, 2000);
      }
    }, 300);
  }, [bookmark, goToPage]);

  const handleDismissBookmark = () => {
    clearBookmarkAsync(isLoggedIn);
    setBookmark(null);
  };

  const handleTogglePracticedCard = (sentenceId: number, currentlyPracticed: boolean) => {
    togglePracticed(sentenceId, currentlyPracticed, isLoggedIn);
  };

  // Focus Mode Handlers
  const handleNextFocus = async () => {
    if (focusModeIndex === null) return;
    if (focusModeIndex < sentences.length - 1) {
      setFocusModeIndex(focusModeIndex + 1);
    } else if (page < totalPages) {
      await goToPage(page + 1);
      setFocusModeIndex(0);
    }
  };

  const handlePrevFocus = async () => {
    if (focusModeIndex === null) return;
    if (focusModeIndex > 0) {
      setFocusModeIndex(focusModeIndex - 1);
    } else if (page > 1) {
      await goToPage(page - 1);
      setFocusModeIndex(9);
    }
  };

  const pageNumbers = buildPageNumbers(page, totalPages);

  return (
    <div className="reading-practice-container">
      <div className="reading-practice-header">
        <h1 className="reading-practice-title">Reading Practice</h1>
        <p className="reading-practice-subtitle">
          Translate Japanese sentences from WaniKani vocabulary context sentences.
        </p>
      </div>

      {/* Resume banner */}
      {bookmark && !hasResumed && (
        <div className="resume-banner">
          <div className="resume-banner-text">
            <span className="resume-banner-title">📖 Continue where you left off?</span>
            <span className="resume-banner-detail">
              Page {bookmark.page}, sentence #{bookmark.sentenceIndex + 1}
              {bookmark.minLevel !== undefined && ` · Levels ${bookmark.minLevel}–${bookmark.maxLevel}`}
              {" · "}
              {new Date(bookmark.timestamp).toLocaleDateString()}
            </span>
          </div>
          <div className="resume-banner-actions">
            <button className="resume-btn resume-btn-primary" onClick={handleResume}>
              Resume
            </button>
            <button className="resume-btn resume-btn-secondary" onClick={handleDismissBookmark}>
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Practice controls: Level filter & Status filter tabs */}
      <div className="reading-practice-controls">
        <LevelFilter
          selectedRange={selectedRange}
          onRangeChange={setSelectedRange}
        />

        <div className="status-filter-tabs" role="tablist" aria-label="Sentence practice filter">
          <button
            type="button"
            className={`status-tab ${statusFilter === "unpracticed" ? "active" : ""}`}
            onClick={() => handleStatusFilterChange("unpracticed")}
            role="tab"
            aria-selected={statusFilter === "unpracticed"}
          >
            Unpracticed
          </button>
          <button
            type="button"
            className={`status-tab ${statusFilter === "practiced" ? "active" : ""}`}
            onClick={() => handleStatusFilterChange("practiced")}
            role="tab"
            aria-selected={statusFilter === "practiced"}
          >
            Practiced
          </button>
          <button
            type="button"
            className={`status-tab ${statusFilter === "all" ? "active" : ""}`}
            onClick={() => handleStatusFilterChange("all")}
            role="tab"
            aria-selected={statusFilter === "all"}
          >
            All Sentences
          </button>
        </div>
      </div>

      <p className="reading-practice-count">
        {sentences && sentences.length > 0
          ? `${totalCount} sentences · Page ${page} of ${totalPages}`
          : isLoading ? "Loading…" : "No sentences available"}
      </p>

      {/* Sentence cards */}
      {isLoading ? (
        <div className="reading-loader">
          <LoadingSpinner />
        </div>
      ) : sentences.length > 0 ? (
        <div className="sentence-cards-list">
          {sentences.map((sentence, idx) => (
            <ReadingSentenceCard
              key={`${page}-${sentence.id || idx}`}
              sentence={sentence}
              index={idx}
              onInteract={handleCardInteract}
              onFocus={setFocusModeIndex}
              onTogglePracticed={handleTogglePracticedCard}
            />
          ))}
        </div>
      ) : (
        <div className="sentence-card" style={{ textAlign: "center", padding: "40px" }}>
          {statusFilter === "practiced" ? (
            <p style={{ color: "#64748b" }}>You haven't marked any sentences as practiced yet in this level range.</p>
          ) : (
            <p style={{ color: "#64748b" }}>No sentences match the selected filters.</p>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="pagination" aria-label="Sentence pages">
          <button
            className="pagination-btn pagination-prev"
            onClick={() => goToPage(page - 1)}
            disabled={page <= 1 || isLoading}
            aria-label="Previous page"
          >
            ← Prev
          </button>

          <div className="pagination-pages">
            {pageNumbers.map((p, i) =>
              p === "…" ? (
                <span key={`ellipsis-${i}`} className="pagination-ellipsis">…</span>
              ) : (
                <button
                  key={p}
                  className={`pagination-btn pagination-num ${p === page ? "active" : ""}`}
                  onClick={() => goToPage(p as number)}
                  disabled={isLoading}
                  aria-current={p === page ? "page" : undefined}
                >
                  {p}
                </button>
              )
            )}
          </div>

          <button
            className="pagination-btn pagination-next"
            onClick={() => goToPage(page + 1)}
            disabled={page >= totalPages || isLoading}
            aria-label="Next page"
          >
            Next →
          </button>
        </nav>
      )}

      {/* Focus Mode Modal */}
      {focusModeIndex !== null && sentences[focusModeIndex] && (
        <div className="focus-modal-overlay" onClick={(e) => {
          if (e.target === e.currentTarget) setFocusModeIndex(null);
        }}>
          <div className="focus-modal-content">
            <button className="focus-modal-close" onClick={() => setFocusModeIndex(null)} aria-label="Close focus mode">
              ✕
            </button>
            <div className="focus-modal-body">
              <ReadingSentenceCard
                key={`focus-${page}-${focusModeIndex}`}
                sentence={sentences[focusModeIndex]}
                index={focusModeIndex}
                onInteract={handleCardInteract}
                onTogglePracticed={handleTogglePracticedCard}
              />
            </div>
            <div className="focus-modal-controls">
              <button 
                className="resume-btn resume-btn-secondary" 
                onClick={handlePrevFocus} 
                disabled={focusModeIndex === 0 && page === 1}
              >
                ← Previous
              </button>
              <span className="focus-modal-counter">
                {(page - 1) * 10 + focusModeIndex + 1} / {totalCount}
              </span>
              <button 
                className="resume-btn resume-btn-primary" 
                onClick={handleNextFocus} 
                disabled={focusModeIndex === sentences.length - 1 && page === totalPages}
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function buildPageNumbers(current: number, total: number): (number | "…")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "…")[] = [];
  const windowSize = 1;

  pages.push(1);

  const rangeStart = Math.max(2, current - windowSize);
  const rangeEnd = Math.min(total - 1, current + windowSize);

  if (rangeStart > 2) pages.push("…");

  for (let i = rangeStart; i <= rangeEnd; i++) {
    pages.push(i);
  }

  if (rangeEnd < total - 1) pages.push("…");

  pages.push(total);

  return pages;
}
