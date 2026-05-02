import type { Route } from "./+types/kanji";
import { fetchSubjects, useInfiniteSubjects } from "~/hooks/useSubjects";
import { SubjectCard } from "../components/SubjectCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { LevelFilter, type LevelRange } from "../components/LevelFilter";
import React, { useState, useMemo, useEffect, useRef } from "react";
import "./subjects.css";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Kanji | WaniKani:Relearn" },
    { name: "description", content: "Browse and review kanji characters" },
  ];
}

export async function clientLoader() {
  return await fetchSubjects("kanji");
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
  const [selectedRange, setSelectedRange] = useState<LevelRange>(null);
  
  const filters = useMemo(() => ({
    minLevel: selectedRange?.[0],
    maxLevel: selectedRange?.[1]
  }), [selectedRange]);

  const { subjects, loadMore, hasMore, isLoading, totalCount } = useInfiniteSubjects(initialData, "kanji", filters);
  const loaderRef = useRef<HTMLDivElement>(null);

  // Use a ref for the observer to avoid constant re-binding
  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // We check isLoading here but we need to ensure we have the current value.
        // However, the observer callback closure will have the value from when it was created.
        // Re-creating the observer when isLoading changes is actually standard, 
        // but we need to make sure it doesn't trigger a loop.
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { threshold: 0.1 } // Lower threshold to trigger earlier
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, isLoading, loadMore]);

  return (
    <div className="subjects-container">
      <h1 className="subjects-title">Kanji</h1>
      
      <LevelFilter 
        selectedRange={selectedRange} 
        onRangeChange={setSelectedRange} 
      />

      <p className="subjects-subtitle">
        {subjects && subjects.length > 0
          ? `Showing ${subjects.length} of ${totalCount} kanji`
          : isLoading ? "Loading..." : "No kanji data available"}
      </p>

      {subjects.length > 0 ? (
        <div className="subjects-grid">
          {subjects.map((subject) => (
            <SubjectCard key={subject.Id} subject={subject} variant="kanji" />
          ))}
        </div>
      ) : !isLoading && (
        <div className="subjects-empty">
          <p>No kanji data matches the selected level range.</p>
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
