import type { Route } from "./+types/kanji";
import { fetchSubjects } from "~/hooks/useSubjects";
import { SubjectCard } from "../components/SubjectCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { LevelFilter, type LevelRange } from "../components/LevelFilter";
import React, { useState, useMemo } from "react";
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
        <p role="alert" className="error-message">{error instanceof Error ? error.message : String(error)}</p>
      </div>
    </div>
  );
}

export default function Kanji({ loaderData: subjects }: Route.ComponentProps) {
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
      <h1 className="subjects-title">Kanji</h1>
      
      <LevelFilter 
        selectedRange={selectedRange} 
        onRangeChange={setSelectedRange} 
      />

      <p className="subjects-subtitle">
        {subjects && subjects.length > 0
          ? `Showing ${filteredSubjects.length} of ${subjects.length} kanji`
          : "No kanji data available"}
      </p>

      {filteredSubjects.length > 0 ? (
        <div className="subjects-grid">
          {filteredSubjects.map((subject) => (
            <SubjectCard key={subject.Id} subject={subject} variant="kanji" />
          ))}
        </div>
      ) : (
        <div className="subjects-empty">
          <p>No kanji data matches the selected level range.</p>
        </div>
      )}
    </div>
  );
}
