import type { Route } from "./+types/kanji";
import { fetchSubjects, useInfiniteSubjects } from "~/hooks/useSubjects";
import { SubjectCard } from "../components/SubjectCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { LevelFilter, type LevelRange } from "../components/LevelFilter";
import { JLPTFilter, type JlptLevel } from "../components/JLPTFilter";
import { JoyoFilter, type JoyoGrade } from "../components/JoyoFilter";
import { FloatingWatermarks } from "../components/FloatingWatermarks";
import { useSearchParams } from "react-router";
import React, { useMemo, useEffect, useRef, useCallback } from "react";
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
      <div className="subjects-empty">
        <p role="alert" className="error-message">Error loading data</p>
      </div>
    </div>
  );
}

export default function Kanji({ loaderData: initialData }: Route.ComponentProps) {
  const [searchParams, setSearchParams] = useSearchParams();

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

      <div className="flex flex-row flex-nowrap items-center gap-x-4 gap-y-2 mb-8 p-2 px-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-x-auto"
        style={{ margin: "0 0 24px 0" }}>
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
