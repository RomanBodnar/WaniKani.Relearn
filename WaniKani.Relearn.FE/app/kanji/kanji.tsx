import type { Route } from "./+types/kanji";
import { fetchSubjects, useInfiniteSubjects } from "~/hooks/useSubjects";
import { SubjectCard } from "../components/SubjectCard";
import PracticeCarousel from "../components/PracticeCarousel";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { LevelFilter, type LevelRange } from "../components/LevelFilter";
import { JLPTFilter, type JlptLevel } from "../components/JLPTFilter";
import { FloatingWatermarks } from "../components/FloatingWatermarks";
import { ErrorDisplay } from "../components/ErrorDisplay";
import { useSearchParams } from "react-router";
import { useBookmarks } from "~/hooks/useBookmarks";
import React, { useMemo, useEffect, useRef, useCallback, useState } from "react";
import "./subjects.css";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Kanji | BonPom" },
    { name: "description", content: "Browse and review kanji characters" },
  ];
}

export async function clientLoader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const minLevel = url.searchParams.get("minLevel");
  const maxLevel = url.searchParams.get("maxLevel");
  return await fetchSubjects(
    "kanji",
    1,
    100,
    minLevel ? parseInt(minLevel, 10) : undefined,
    maxLevel ? parseInt(maxLevel, 10) : undefined
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return (
    <div className="subjects-container">
      <h1 className="subjects-title">Kanji</h1>
      <ErrorDisplay 
        title="Error loading data" 
        description="Make sure the back-end API is running and accessible."
      />
    </div>
  );
}

export default function Kanji({ loaderData: initialData }: Route.ComponentProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { bookmarks, fetchBookmarks } = useBookmarks();
  const [isBoxOpen, setIsBoxOpen] = useState(true);
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const [practiceStartIndex, setPracticeStartIndex] = useState(0);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const kanjiBookmarks = useMemo(() => {
    return bookmarks.filter(b => b.Object?.toLowerCase() === 'kanji');
  }, [bookmarks]);

  const selectedRange: LevelRange = useMemo(() => {
    const min = searchParams.get("minLevel");
    const max = searchParams.get("maxLevel");
    return min && max ? [parseInt(min, 10), parseInt(max, 10)] : null;
  }, [searchParams]);

  const selectedJlpt = searchParams.getAll("jlpt");
  const selectedJoyo = searchParams.getAll("joyo");

  const updateFilters = useCallback((updates: Record<string, string | string[] | null>) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      Object.entries(updates).forEach(([key, value]) => {
        next.delete(key);
        if (Array.isArray(value)) {
          value.forEach(v => next.append(key, v));
        } else if (value !== null) {
          next.set(key, value);
        }
      });
      return next;
    }, { replace: true });
  }, [setSearchParams]);

  const handleRangeChange = (range: LevelRange) => {
    updateFilters({
      minLevel: range ? String(range[0]) : null,
      maxLevel: range ? String(range[1]) : null
    });
  };

  const handleJlptChange = (levels: string[]) => {
    updateFilters({ jlpt: levels.length > 0 ? levels : null });
  };

  const handleJoyoChange = (grades: string[]) => {
    updateFilters({ joyo: grades.length > 0 ? grades : null });
  };

  const filters = useMemo(() => ({
    minLevel: selectedRange?.[0],
    maxLevel: selectedRange?.[1]
  }), [selectedRange]);

  const { subjects, loadMore, hasMore, isLoading, totalCount } = useInfiniteSubjects(initialData, "kanji", filters);
  const loaderRef = useRef<HTMLDivElement>(null);

  const searchQuery = searchParams.get("q")?.toLowerCase() || "";

  const filteredSubjects = useMemo(() => {
    return subjects.filter(subject => {
      if (selectedJlpt.length > 0 && (!subject.JlptLevel || !selectedJlpt.includes(subject.JlptLevel))) return false;
      if (selectedJoyo.length > 0 && (!subject.JoyoGrade || !selectedJoyo.includes(subject.JoyoGrade))) return false;
      if (searchQuery) {
        const matchesMeanings = subject.Meanings?.some(m => m.Meaning.toLowerCase().includes(searchQuery));
        if (!matchesMeanings) {
          return false;
        }
      }
      return true;
    });
  }, [subjects, selectedJlpt, selectedJoyo, searchQuery]);

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

  // If filtering on frontend hides items, we might need to load more
  useEffect(() => {
    if (filteredSubjects.length < 20 && hasMore && !isLoading) {
      // loadMore(); // Auto-loading more can cause infinite loops or rapid requests, keep it simple for now
    }
  }, [filteredSubjects, hasMore, isLoading, loadMore]);

  return (
    <div className="subjects-container">
      <FloatingWatermarks />
      <h1 className="subjects-title">Kanji</h1>

      <div className="level-filter-container">
        <div className="kanji-filter-wrapper">
          <LevelFilter
            selectedRange={selectedRange}
            onRangeChange={handleRangeChange}
          />
        </div>

        <div className="kanji-filter-wrapper">
          <JLPTFilter
            selectedLevels={selectedJlpt}
            onLevelsChange={handleJlptChange}
          />
        </div>

        {/* <div className="kanji-filter-wrapper">
          <JoyoFilter 
            selectedGrades={selectedJoyo} 
            onGradesChange={handleJoyoChange} 
          />
        </div> */}
      </div>

      <p className="subjects-subtitle">
        {subjects && subjects.length > 0
          ? `Showing ${filteredSubjects.length} of ${totalCount} kanji${filteredSubjects.length !== subjects.length ? ' (filtered)' : ''}`
          : isLoading ? "Loading..." : "No kanji data available"}
      </p>

      {kanjiBookmarks.length > 0 && !searchQuery && (
        <div className="my-box-deck-container" style={{ background: 'color-mix(in srgb, var(--color-kanji-block) 5%, transparent)', padding: '24px', borderRadius: '32px', marginBottom: '32px' }}>
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
                {kanjiBookmarks.length}
              </span>
            </h2>
            <div style={{ width: '1px', height: '24px', background: '#cbd5e1', margin: '0 8px' }}></div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', color: '#64748b' }}>
              <input type="checkbox" checked={isPracticeMode} onChange={(e) => setIsPracticeMode(e.target.checked)} style={{ accentColor: 'var(--color-kanji-block)', width: '16px', height: '16px', cursor: 'pointer' }} />
              Practice Mode
            </label>
          </div>
          {isBoxOpen && (
            isPracticeMode ? (
              <PracticeCarousel subjects={kanjiBookmarks} variant="kanji" initialIndex={practiceStartIndex} />
            ) : (
              <div className="subjects-grid my-box-grid" style={{ justifyContent: 'flex-start' }}>
                {kanjiBookmarks.map((subject, index) => (
                  <SubjectCard 
                    key={subject.Id} 
                    subject={subject} 
                    variant="kanji" 
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
            <SubjectCard key={subject.Id} subject={subject} variant="kanji" />
          ))}
        </div>
      ) : !isLoading && (
        <div className="subjects-empty">
          <p>No kanji data matches the selected filters.</p>
        </div>
      )}

      {hasMore && !searchQuery && (
        <div ref={loaderRef} className="subjects-loader flex justify-center p-8">
          {isLoading ? <LoadingSpinner /> : <div className="loader-trigger" style={{ height: '20px' }} />}
        </div>
      )}
    </div>
  );
}
