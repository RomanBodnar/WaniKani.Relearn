import type { Route } from "./+types/radicals";
import { fetchSubjects } from "~/hooks/useSubjects";
import { SubjectCard } from "../components/SubjectCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { LevelFilter, type LevelRange } from "../components/LevelFilter";
import React, { useState, useMemo } from "react";
import "./subjects.css";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Radicals | WaniKani:Relearn" },
    { name: "description", content: "Browse and review radical components" },
  ];
}

export async function clientLoader() {
  return await fetchSubjects("radical");
}

export function HydrateFallback() {
  return (
    <div className="subjects-container">
      <h1 className="subjects-title">Radicals</h1>
      <LoadingSpinner />
    </div>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return (
    <div className="subjects-container">
      <h1 className="subjects-title">Radicals</h1>
      <div className="subjects-empty">
        <p role="alert" className="error-message">{error instanceof Error ? error.message : String(error)}</p>
      </div>
    </div>
  );
}

export default function Radicals({ loaderData: subjects }: Route.ComponentProps) {
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
      <h1 className="subjects-title">Radicals</h1>
      
      <LevelFilter 
        selectedRange={selectedRange} 
        onRangeChange={setSelectedRange} 
      />

      <p className="subjects-subtitle">
        {subjects && subjects.length > 0
          ? `Showing ${filteredSubjects.length} of ${subjects.length} radicals`
          : "No radicals data available"}
      </p>

      {filteredSubjects.length > 0 ? (
        <div className="subjects-grid">
          {filteredSubjects.map((subject) => (
            <SubjectCard key={subject.Id} subject={subject} variant="radical" />
          ))}
        </div>
      ) : (
        <div className="subjects-empty">
          <p>No radicals data matches the selected level range.</p>
        </div>
      )}
    </div>
  );
}
