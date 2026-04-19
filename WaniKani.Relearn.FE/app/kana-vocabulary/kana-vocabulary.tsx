import type { Route } from "../+types/root";
import { useSubjects } from "~/hooks/useSubjects";
import { SubjectCard } from "../components/SubjectCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import "./subjects.css";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Kana Vocabulary | WaniKani:Relearn" },
    { name: "description", content: "Browse and review kana vocabulary" },
  ];
}

export default function KanaVocabulary() {
  const { data: subjects, isLoading, error } = useSubjects("kana_vocabulary");

  return (
    <div className="subjects-container">
      <h1 className="subjects-title">Kana Vocabulary</h1>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <p className="subjects-subtitle">
            {subjects && subjects.length > 0
              ? `Total: ${subjects.length} kana vocabulary items`
              : "No kana vocabulary data available"}
          </p>

          {error ? (
            <div className="subjects-empty">
              <p role="alert" className="error-message">{error.message}</p>
            </div>
          ) : subjects && subjects.length > 0 ? (
            <div className="subjects-grid">
              {subjects.map((subject) => (
                <SubjectCard key={subject.Id} subject={subject} variant="vocabulary" />
              ))}
            </div>
          ) : (
            <div className="subjects-empty">
              <p>No kana vocabulary data available</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
