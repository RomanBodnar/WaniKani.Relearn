import type { Route } from "../+types/root";
import { useSubjects } from "~/hooks/useSubjects";
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
  const { data: subjects, isLoading, error } = useSubjects("kanji");

  return (
    <div className="subjects-container">
      <h1 className="subjects-title">Kanji</h1>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <p className="subjects-subtitle">
            {subjects && subjects.length > 0
              ? `Total: ${subjects.length} kanji`
              : "No kanji data available"}
          </p>

          {error ? (
            <div className="subjects-empty">
              <p role="alert" className="error-message">{error.message}</p>
            </div>
          ) : subjects && subjects.length > 0 ? (
            <div className="subjects-grid">
              {subjects.map((subject) => (
                <SubjectCard key={subject.Id} subject={subject} variant="kanji"/>
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
