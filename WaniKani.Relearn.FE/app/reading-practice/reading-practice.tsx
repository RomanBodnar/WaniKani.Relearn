import type { Route } from "./+types/reading-practice";
import { useState, useMemo, useEffect, useRef, useCallback } from "react";
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

export async function clientLoader() {
  return await fetchSentences(1, 10);
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

  const filters = useMemo(() => ({
    minLevel: selectedRange?.[0],
    maxLevel: selectedRange?.[1]
  }), [selectedRange]);

  const {
    sentences, loadMore, loadUpToPage, hasMore, isLoading, totalCount, page
  } = useReadingSentences(initialData, filters);

  const loaderRef = useRef<HTMLDivElement>(null);

  // Load bookmark on mount
  useEffect(() => {
    const saved = loadBookmark();
    if (saved) {
      setBookmark(saved);
    }
  }, []);

  // Infinite scroll observer
  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, isLoading, loadMore]);

  // Handle bookmark interaction: update bookmark as user progresses
  const handleCardInteract = useCallback((sentenceIndex: number) => {
    const currentPage = Math.floor(sentenceIndex / 10) + 1;
    const bm: ReadingBookmark = {
      page: currentPage,
      sentenceIndex,
      minLevel: filters.minLevel,
      maxLevel: filters.maxLevel,
      timestamp: new Date().toISOString(),
    };
    saveBookmark(bm);
  }, [filters.minLevel, filters.maxLevel]);

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

    // Load up to the bookmarked page
    await loadUpToPage(bookmark.page);
    setHasResumed(true);
    setBookmark(null);

    // Scroll to the sentence after data loads
    setTimeout(() => {
      const el = document.getElementById(`sentence-${bookmark.sentenceIndex}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        // Brief highlight effect
        el.style.boxShadow = "0 0 0 3px rgba(0, 170, 255, 0.4)";
        setTimeout(() => { el.style.boxShadow = ""; }, 2000);
      }
    }, 300);
  }, [bookmark, loadUpToPage]);

  const handleDismissBookmark = () => {
    clearBookmark();
    setBookmark(null);
  };

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
          ? `Showing ${sentences.length} of ${totalCount} sentences`
          : isLoading ? "Loading…" : "No sentences available"}
      </p>

      {/* Sentence cards */}
      {sentences.length > 0 ? (
        <div className="sentence-cards-list">
          {sentences.map((sentence, idx) => (
            <ReadingSentenceCard
              key={`${sentence.ja}-${idx}`}
              sentence={sentence}
              index={idx}
              onInteract={handleCardInteract}
            />
          ))}
        </div>
      ) : !isLoading && (
        <div className="sentence-card" style={{ textAlign: "center", padding: "40px" }}>
          <p style={{ color: "#64748b" }}>No sentences match the selected level range.</p>
        </div>
      )}

      {/* Infinite scroll trigger */}
      {hasMore && (
        <div ref={loaderRef} className="reading-loader">
          {isLoading && <LoadingSpinner />}
        </div>
      )}
    </div>
  );
}
