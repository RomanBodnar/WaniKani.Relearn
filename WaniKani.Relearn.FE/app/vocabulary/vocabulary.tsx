import type { Route } from "./+types/vocabulary";
import { fetchSubjects, useInfiniteSubjects } from "~/hooks/useSubjects";
import { SubjectCard } from "../components/SubjectCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { LevelFilter, type LevelRange } from "../components/LevelFilter";
import React, { useState, useMemo, useEffect, useRef } from "react";
import "./subjects.css";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Vocabulary | WaniKani:Relearn" },
    { name: "description", content: "Browse and review vocabulary words" },
  ];
}

export async function clientLoader() {
  return await fetchSubjects("vocabulary");
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return (
    <div className="subjects-container">
      <h1 className="subjects-title">Vocabulary</h1>
      <div className="subjects-empty">
        <p role="alert" className="error-message">Error loading data</p>
      </div>
    </div>
  );
}

export default function Vocabulary({ loaderData: initialData }: Route.ComponentProps) {
  const [selectedRange, setSelectedRange] = useState<LevelRange>(null);
  
  const filters = useMemo(() => ({
    minLevel: selectedRange?.[0],
    maxLevel: selectedRange?.[1]
  }), [selectedRange]);

  const { subjects, loadMore, hasMore, isLoading, totalCount } = useInfiniteSubjects(initialData, "vocabulary", filters);
  const loaderRef = useRef<HTMLDivElement>(null);

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
      <h1 className="subjects-title">Vocabulary</h1>

      <LevelFilter
        selectedRange={selectedRange}
        onRangeChange={setSelectedRange}
      />

      <p className="subjects-subtitle">
        {subjects && subjects.length > 0
          ? `Showing ${subjects.length} of ${totalCount} vocabulary words`
          : isLoading ? "Loading..." : "No vocabulary data available"}
      </p>

      {subjects.length > 0 ? (
        <div className="subjects-grid">
          {subjects.map((subject) => (
            <SubjectCard key={subject.Id} subject={subject} variant="vocabulary" />
          ))}
        </div>
      ) : !isLoading && (
        <div className="subjects-empty">
          <p>No vocabulary data matches the selected level range.</p>
        </div>
      )}

      {hasMore && (
        <div ref={loaderRef} className="subjects-loader flex justify-center p-8">
          {isLoading && <LoadingSpinner />}
        </div>
      )}
    </div>
  );
}
