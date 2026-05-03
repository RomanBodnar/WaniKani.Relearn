import type { Route } from "./+types/reading-practice";
import { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router";
import { fetchSentences, useReadingSentences, saveBookmark, loadBookmark, clearBookmark } from "~/hooks/useReadingSentences";
import { ReadingSentenceCard } from "./ReadingSentenceCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { LevelFilter, type LevelRange } from "../components/LevelFilter";
import type { ReadingBookmark } from "~/types/reading";
import "./reading-practice.css";

export function meta() {
  return [
    { title: "Reading Practice | WaniKani:Relearn" },
    { name: "description", content: "Practice reading Japanese sentences from WaniKani vocabulary" },
  ];
}

export async function clientLoader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1", 10));
  return await fetchSentences(page, 10);
}

export function ErrorBoundary() {
  return (
    <div className="reading-practice-container">
      <div className="reading-practice-header">
        <h1 className="reading-practice-title">Reading Practice</h1>
      </div>
      <div className="sentence-card" style={{ textAlign: "center", padding: "40px" }}>
        <p role="alert" style={{ color: "#ef4444", fontWeight: 600 }}>Error loading sentences</p>
        <p style={{ color: "#64748b", fontSize: 14 }}>
          Make sure the back-end reading practice API is running.
        </p>
      </div>
    </div>
  );
}

export default function ReadingPractice({ loaderData: initialData }: Route.ComponentProps) {
  const [selectedRange, setSelectedRange] = useState<LevelRange>(null);
  const [bookmark, setBookmark] = useState<ReadingBookmark | null>(null);
  const [hasResumed, setHasResumed] = useState(false);
  const [, setSearchParams] = useSearchParams();

  const filters = useMemo(() => ({
    minLevel: selectedRange?.[0],
    maxLevel: selectedRange?.[1]
  }), [selectedRange]);

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

  const {
    sentences, page, totalPages, totalCount, isLoading, goToPage
  } = useReadingSentences(initialData, filters, syncPage);

  // Load bookmark on mount
  useEffect(() => {
    const saved = loadBookmark();
    if (saved) {
      setBookmark(saved);
    }
  }, []);

  // Update bookmark as user interacts with cards
  const handleCardInteract = useCallback((sentenceIndex: number) => {
    const bm: ReadingBookmark = {
      page,
      sentenceIndex,
      minLevel: filters.minLevel,
      maxLevel: filters.maxLevel,
      timestamp: new Date().toISOString(),
    };
    saveBookmark(bm);
  }, [page, filters.minLevel, filters.maxLevel]);

  // Resume from bookmark
  const handleResume = useCallback(async () => {
    if (!bookmark) return;

    // Apply bookmark filters if they differ
    if (bookmark.minLevel !== undefined || bookmark.maxLevel !== undefined) {
      const range: LevelRange = (bookmark.minLevel && bookmark.maxLevel)
        ? [bookmark.minLevel, bookmark.maxLevel]
        : null;
      setSelectedRange(range);
    }

    await goToPage(bookmark.page);
    setHasResumed(true);
    setBookmark(null);

    // Scroll to the sentence after data loads
    setTimeout(() => {
      const el = document.getElementById(`sentence-${bookmark.sentenceIndex}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.style.boxShadow = "0 0 0 3px rgba(0, 170, 255, 0.4)";
        setTimeout(() => { el.style.boxShadow = ""; }, 2000);
      }
    }, 300);
  }, [bookmark, goToPage]);

  const handleDismissBookmark = () => {
    clearBookmark();
    setBookmark(null);
  };

  // Build page number buttons
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

      <LevelFilter
        selectedRange={selectedRange}
        onRangeChange={setSelectedRange}
      />

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
              key={`${page}-${idx}`}
              sentence={sentence}
              index={idx}
              onInteract={handleCardInteract}
            />
          ))}
        </div>
      ) : (
        <div className="sentence-card" style={{ textAlign: "center", padding: "40px" }}>
          <p style={{ color: "#64748b" }}>No sentences match the selected level range.</p>
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
    </div>
  );
}

/**
 * Builds an array of page numbers with ellipsis for large page counts.
 * Always shows first, last, and a window around the current page.
 * Example: [1, "…", 4, 5, 6, "…", 20]
 */
function buildPageNumbers(current: number, total: number): (number | "…")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "…")[] = [];
  const windowSize = 1; // pages around current

  // Always include page 1
  pages.push(1);

  const rangeStart = Math.max(2, current - windowSize);
  const rangeEnd = Math.min(total - 1, current + windowSize);

  if (rangeStart > 2) pages.push("…");

  for (let i = rangeStart; i <= rangeEnd; i++) {
    pages.push(i);
  }

  if (rangeEnd < total - 1) pages.push("…");

  // Always include last page
  pages.push(total);

  return pages;
}
