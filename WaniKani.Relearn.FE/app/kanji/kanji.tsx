import { useState, useEffect } from "react";
import type { Route } from "../+types/root";
import { fetchSubjects } from "../hooks/useSubjects";
import { type Subject } from "~/hooks/Subject";
import { SubjectCard } from "../components/SubjectCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import "./subjects.css";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Kanji | WaniKani:Relearn" },
    { name: "description", content: "Browse and review kanji characters" },
  ];
}

export default function Kanji() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadKanji = async () => {
      try {
        setIsLoading(true);
        const data = await fetchSubjects("kanji");
        setSubjects(data || []);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch kanji:", err);
        setError("Failed to load kanji");
        setSubjects([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadKanji();
  }, []);

  return (
    <div className="subjects-container">
      <h1 className="subjects-title">Kanji</h1>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <p className="subjects-subtitle">
            {subjects.length > 0
              ? `Total: ${subjects.length} kanji`
              : "No kanji data available"}
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
              <p>No kanji data available</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
