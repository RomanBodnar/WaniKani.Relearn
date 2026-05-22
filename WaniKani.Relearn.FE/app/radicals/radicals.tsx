import type { Route } from "./+types/radicals";
import { fetchSubjects, useInfiniteSubjects } from "~/hooks/useSubjects";
import { SubjectCard } from "../components/SubjectCard";
import PracticeCarousel from "../components/PracticeCarousel";
import { ToggleSwitch } from "../components/ToggleSwitch";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { LevelFilter, type LevelRange } from "../components/LevelFilter";
import { ErrorDisplay } from "../components/ErrorDisplay";
import { FloatingWatermarks } from "../components/FloatingWatermarks";
import { useSearchParams } from "react-router";
import { useBookmarks } from "~/hooks/useBookmarks";
import React, { useMemo, useEffect, useRef, useCallback, useState } from "react";
import "./subjects.css";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Radicals | BonPom" },
    { name: "description", content: "Browse and review radical components" },
  ];
}

export async function clientLoader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const minLevel = url.searchParams.get("minLevel");
  const maxLevel = url.searchParams.get("maxLevel");
  return await fetchSubjects(
    "radical",
    1,
    100,
    minLevel ? parseInt(minLevel, 10) : undefined,
    maxLevel ? parseInt(maxLevel, 10) : undefined
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return (
    <div className="subjects-container">
      <h1 className="subjects-title">Radicals</h1>
      <ErrorDisplay 
        title="Error loading data" 
        description="Make sure the back-end API is running and accessible."
      />
    </div>
  );
}

export default function Radicals({ loaderData: initialData }: Route.ComponentProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { bookmarks, fetchBookmarks } = useBookmarks();
  const [isBoxOpen, setIsBoxOpen] = useState(true);
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const [practiceStartIndex, setPracticeStartIndex] = useState(0);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const radicalBookmarks = useMemo(() => {
    return bookmarks.filter(b => b.Object?.toLowerCase() === 'radical');
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

  const { subjects, loadMore, hasMore, isLoading, totalCount } = useInfiniteSubjects(initialData, "radical", filters);
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
      <FloatingWatermarks chars={["一", "人", "大", "力", "口", "土", "山", "火"]} />
      <h1 className="subjects-title">Radicals</h1>
      
      <LevelFilter 
        selectedRange={selectedRange} 
        onRangeChange={handleRangeChange} 
      />

      <p className="subjects-subtitle">
        {subjects && subjects.length > 0
          ? `Showing ${filteredSubjects.length} of ${totalCount} radicals${filteredSubjects.length !== subjects.length ? ' (filtered)' : ''}`
          : isLoading ? "Loading..." : "No radicals data available"}
      </p>

      {radicalBookmarks.length > 0 && !searchQuery && (
        <div className="my-box-deck-container" style={{ background: 'color-mix(in srgb, var(--color-radical-block) 5%, transparent)', padding: '24px', borderRadius: '32px', marginBottom: '32px' }}>
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
                {radicalBookmarks.length}
              </span>
            </h2>
            <div style={{ width: '1px', height: '24px', background: '#cbd5e1', margin: '0 8px' }}></div>
            <ToggleSwitch 
              checked={isPracticeMode} 
              onChange={setIsPracticeMode} 
              label="Practice Mode" 
              color="var(--color-radical-block)" 
            />
          </div>
          {isBoxOpen && (
            isPracticeMode ? (
              <div key="practice-mode" className="mode-transition-enter">
                <PracticeCarousel subjects={radicalBookmarks} variant="radical" initialIndex={practiceStartIndex} />
              </div>
            ) : (
              <div key="grid-mode" className="subjects-grid my-box-grid mode-transition-enter" style={{ justifyContent: 'flex-start' }}>
                {radicalBookmarks.map((subject, index) => (
                  <SubjectCard 
                    key={subject.Id} 
                    subject={subject} 
                    variant="radical" 
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
            <SubjectCard key={subject.Id} subject={subject} variant="radical" />
          ))}
        </div>
      ) : !isLoading && (
        <div className="subjects-empty">
          <p>No radicals data matches the selected filters.</p>
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
