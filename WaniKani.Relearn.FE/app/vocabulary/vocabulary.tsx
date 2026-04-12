import { useState, useEffect } from "react";
import type { Route } from "../+types/root";
import { fetchSubjects } from "../hooks/useSubjects";
import { type Subject } from "~/hooks/Subject";
import { SubjectCard } from "../components/SubjectCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import "./subjects.css";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Vocabulary | WaniKani:Relearn" },
    { name: "description", content: "Browse and review vocabulary words" },
  ];
}

export default function Vocabulary() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadVocabulary = async () => {
      try {
        setIsLoading(true);
        const data = await fetchSubjects("vocabulary");
        setSubjects(data || []);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch vocabulary:", err);
        setError("Failed to load vocabulary");
        setSubjects([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadVocabulary();
  }, []);

  return (
    <div className="subjects-container">
      <h1 className="subjects-title">Vocabulary</h1>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <p className="subjects-subtitle">
            {subjects.length > 0
              ? `Total: ${subjects.length} vocabulary words`
              : "No vocabulary data available"}
          </p>

          {error ? (
            <div className="subjects-empty">
              <p style={{ color: "#d32f2f" }}>{error}</p>
            </div>
          ) : subjects.length > 0 ? (
            <div className="subjects-grid">
              {subjects.map((subject: Subject) => (
                <SubjectCard key={subject.Id} subject={subject} />
              ))}
            </div>
          ) : (
            <div className="subjects-empty">
              <p>No vocabulary data available</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
