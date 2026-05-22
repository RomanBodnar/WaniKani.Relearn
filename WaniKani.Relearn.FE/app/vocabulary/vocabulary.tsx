import type { Route } from "./+types/vocabulary";
import { fetchSubjects, useInfiniteSubjects } from "~/hooks/useSubjects";
import { SubjectCard } from "../components/SubjectCard";
import PracticeCarousel from "../components/PracticeCarousel";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { LevelFilter, type LevelRange } from "../components/LevelFilter";
import { FloatingWatermarks } from "../components/FloatingWatermarks";
import { ErrorDisplay } from "../components/ErrorDisplay";
import { useSearchParams } from "react-router";
import { useBookmarks } from "~/hooks/useBookmarks";
import React, { useMemo, useEffect, useRef, useCallback, useState } from "react";
import "./subjects.css";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Vocabulary | BonPom" },
    { name: "description", content: "Browse and review vocabulary words" },
  ];
}

export async function clientLoader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const minLevel = url.searchParams.get("minLevel");
  const maxLevel = url.searchParams.get("maxLevel");
  return await fetchSubjects(
    "vocabulary",
    1,
    100,
    minLevel ? parseInt(minLevel, 10) : undefined,
    maxLevel ? parseInt(maxLevel, 10) : undefined
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return (
    <div className="subjects-container">
      <h1 className="subjects-title">Vocabulary</h1>
      <ErrorDisplay 
        title="Error loading data" 
        description="Make sure the back-end API is running and accessible."
      />
    </div>
  );
}

export default function Vocabulary({ loaderData: initialData }: Route.ComponentProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { bookmarks, fetchBookmarks } = useBookmarks();
  const [isBoxOpen, setIsBoxOpen] = useState(true);
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const [practiceStartIndex, setPracticeStartIndex] = useState(0);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const vocabBookmarks = useMemo(() => {
    return bookmarks.filter(b => b.Object?.toLowerCase() === 'vocabulary' || b.Object?.toLowerCase() === 'kana_vocabulary');
  }, [bookmarks]);

  const selectedRange: LevelRange = useMemo(() => {
    const min = searchParams.get("minLevel");
    const max = searchParams.get("maxLevel");
    return min && max ? [parseInt(min, 10), parseInt(max, 10)] : null;
  }, [searchParams]);

  const handleRangeChange = useCallback((range: LevelRange) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (range) {
        next.set("minLevel", String(range[0]));
        next.set("maxLevel", String(range[1]));
      } else {
        next.delete("minLevel");
        next.delete("maxLevel");
      }
      return next;
    }, { replace: true });
  }, [setSearchParams]);
  
  const filters = useMemo(() => ({
    minLevel: selectedRange?.[0],
    maxLevel: selectedRange?.[1]
  }), [selectedRange]);

  const { subjects, loadMore, hasMore, isLoading, totalCount } = useInfiniteSubjects(initialData, "vocabulary", filters);
  const loaderRef = useRef<HTMLDivElement>(null);

  const searchQuery = searchParams.get("q")?.toLowerCase() || "";

  const filteredSubjects = useMemo(() => {
    return subjects.filter(subject => {
      if (searchQuery) {
        const matchesMeanings = subject.Meanings?.some(m => m.Meaning.toLowerCase().includes(searchQuery));
        if (!matchesMeanings) {
          return false;
        }
      }
      return true;
    });
  }, [subjects, searchQuery]);

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

  return (
    <div className="subjects-container">
      <FloatingWatermarks chars={["食", "話", "見", "行", "水", "時", "人", "月"]} />
      <h1 className="subjects-title">Vocabulary</h1>

      <LevelFilter
        selectedRange={selectedRange}
        onRangeChange={handleRangeChange}
      />

      <p className="subjects-subtitle">
        {subjects && subjects.length > 0
          ? `Showing ${filteredSubjects.length} of ${totalCount} vocabulary${filteredSubjects.length !== subjects.length ? ' (filtered)' : ''}`
          : isLoading ? "Loading..." : "No vocabulary data available"}
      </p>

      {vocabBookmarks.length > 0 && !searchQuery && (
        <div className="my-box-deck-container" style={{ background: 'color-mix(in srgb, var(--color-vocabulary-block) 5%, transparent)', padding: '24px', borderRadius: '32px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: isBoxOpen ? '24px' : '0' }}>
            <button 
              onClick={() => setIsBoxOpen(!isBoxOpen)}
              style={{ background: 'var(--color-surface, #ffffff)', border: '1px solid #cbd5e1', cursor: 'pointer', padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', color: '#64748b' }}
              aria-label={isBoxOpen ? "Collapse My Box" : "Expand My Box"}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isBoxOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
            <h2 style={{ margin: 0, fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px', lineHeight: 1 }}>
              My Box
              <span style={{ fontSize: '1rem', background: '#f1f5f9', color: '#64748b', padding: '2px 10px', borderRadius: '999px', fontWeight: '500', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {vocabBookmarks.length}
              </span>
            </h2>
            <div style={{ width: '1px', height: '24px', background: '#cbd5e1', margin: '0 8px' }}></div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', color: '#64748b' }}>
              <input type="checkbox" checked={isPracticeMode} onChange={(e) => setIsPracticeMode(e.target.checked)} style={{ accentColor: 'var(--color-vocabulary-block)', width: '16px', height: '16px', cursor: 'pointer' }} />
              Practice Mode
            </label>
          </div>
          {isBoxOpen && (
            isPracticeMode ? (
              <PracticeCarousel subjects={vocabBookmarks} variant="vocabulary" initialIndex={practiceStartIndex} />
            ) : (
              <div className="subjects-grid my-box-grid" style={{ justifyContent: 'flex-start' }}>
                {vocabBookmarks.map((subject, index) => (
                  <SubjectCard 
                    key={subject.Id} 
                    subject={subject} 
                    variant="vocabulary" 
                    onClick={(e) => {
                      setPracticeStartIndex(index);
                      setIsPracticeMode(true);
                    }}
                  />
                ))}
              </div>
            )
          )}
        </div>
      )}

      {filteredSubjects.length > 0 ? (
        <div className="subjects-grid">
          {filteredSubjects.map((subject) => (
            <SubjectCard key={subject.Id} subject={subject} variant="vocabulary" />
          ))}
        </div>
      ) : !isLoading && (
        <div className="subjects-empty">
          <p>No vocabulary data matches the selected filters.</p>
        </div>
      )}

      {hasMore && !searchQuery && (
        <div ref={loaderRef} className="subjects-loader flex justify-center p-8">
          {isLoading && <LoadingSpinner />}
        </div>
      )}
    </div>
  );
}
