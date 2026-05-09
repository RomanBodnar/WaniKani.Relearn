import type { Route } from "./+types/kanji";
import { fetchSubjects, useInfiniteSubjects } from "~/hooks/useSubjects";
import { SubjectCard } from "../components/SubjectCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { LevelFilter, type LevelRange } from "../components/LevelFilter";
import { JLPTFilter, type JlptLevel } from "../components/JLPTFilter";
import { JoyoFilter, type JoyoGrade } from "../components/JoyoFilter";
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
  const [selectedJlpt, setSelectedJlpt] = useState<JlptLevel>(null);
  const [selectedJoyo, setSelectedJoyo] = useState<JoyoGrade>(null);
  
  const filters = useMemo(() => ({
    minLevel: selectedRange?.[0],
    maxLevel: selectedRange?.[1]
  }), [selectedRange]);

  const { subjects, loadMore, hasMore, isLoading, totalCount } = useInfiniteSubjects(initialData, "kanji", filters);
  const loaderRef = useRef<HTMLDivElement>(null);

  const filteredSubjects = useMemo(() => {
    return subjects.filter(subject => {
      if (selectedJlpt && subject.JlptLevel !== selectedJlpt) return false;
      if (selectedJoyo && subject.JoyoGrade !== selectedJoyo) return false;
      return true;
    });
  }, [subjects, selectedJlpt, selectedJoyo]);

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
      <h1 className="subjects-title">Kanji</h1>
      
      <LevelFilter 
        selectedRange={selectedRange} 
        onRangeChange={setSelectedRange} 
      />

      <JLPTFilter 
        selectedLevel={selectedJlpt} 
        onLevelChange={setSelectedJlpt} 
      />

      <JoyoFilter 
        selectedGrade={selectedJoyo} 
        onGradeChange={setSelectedJoyo} 
      />

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

      {hasMore && (
        <div ref={loaderRef} className="subjects-loader flex justify-center p-8">
          {isLoading ? <LoadingSpinner /> : <div className="loader-trigger" style={{ height: '20px' }} />}
        </div>
      )}
    </div>
  );
}
