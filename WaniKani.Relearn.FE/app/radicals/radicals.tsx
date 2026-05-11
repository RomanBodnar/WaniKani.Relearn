import type { Route } from "./+types/radicals";
import { fetchSubjects, useInfiniteSubjects } from "~/hooks/useSubjects";
import { SubjectCard } from "../components/SubjectCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { LevelFilter, type LevelRange } from "../components/LevelFilter";
import { FloatingWatermarks } from "../components/FloatingWatermarks";
import { useSearchParams } from "react-router";
import React, { useMemo, useEffect, useRef, useCallback } from "react";
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
      <div className="subjects-empty">
        <p role="alert" className="error-message">Error loading data</p>
      </div>
    </div>
  );
}

export default function Radicals({ loaderData: initialData }: Route.ComponentProps) {
  const [searchParams, setSearchParams] = useSearchParams();

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
