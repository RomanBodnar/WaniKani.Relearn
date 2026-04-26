import type { Route } from "./+types/vocabulary";
import { fetchSubjects } from "~/hooks/useSubjects";
import { SubjectCard } from "../components/SubjectCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { LevelFilter, type LevelRange } from "../components/LevelFilter";
import React, { useState, useMemo } from "react";
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

export function HydrateFallback() {
  return (
    <div className="subjects-container">
      <h1 className="subjects-title">Vocabulary</h1>
      <LoadingSpinner />
    </div>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return (
    <div className="subjects-container">
      <h1 className="subjects-title">Vocabulary</h1>
      <div className="subjects-empty">
        <p role="alert" className="error-message">{error instanceof Error ? error.message : String(error)}</p>
      </div>
    </div>
  );
}

export default function Vocabulary({ loaderData: subjects }: Route.ComponentProps) {
  const [selectedRange, setSelectedRange] = useState<LevelRange>(null);

  const filteredSubjects = useMemo(() => {
    if (!subjects) return [];
    if (!selectedRange) return subjects;
    return subjects.filter(
      (s) => s.Level !== undefined && s.Level >= selectedRange[0] && s.Level <= selectedRange[1]
    );
  }, [subjects, selectedRange]);

  return (
    <div className="subjects-container">
      <h1 className="subjects-title">Vocabulary</h1>
      
      <LevelFilter 
        selectedRange={selectedRange} 
        onRangeChange={setSelectedRange} 
      />

      <p className="subjects-subtitle">
        {subjects && subjects.length > 0
          ? `Showing ${filteredSubjects.length} of ${subjects.length} vocabulary words`
          : "No vocabulary data available"}
      </p>

      {filteredSubjects.length > 0 ? (
        <div className="subjects-grid">
          {filteredSubjects.map((subject) => (
            <SubjectCard key={subject.Id} subject={subject} variant="vocabulary" />
          ))}
        </div>
      ) : (
        <div className="subjects-empty">
          <p>No vocabulary data matches the selected level range.</p>
        </div>
      )}
    </div>
  );
}
