import type { Route } from "./+types/vocabulary";
import { fetchSubjects } from "~/hooks/useSubjects";
import { SubjectCard } from "../components/SubjectCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
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
  return (
    <div className="subjects-container">
      <h1 className="subjects-title">Vocabulary</h1>
      <p className="subjects-subtitle">
        {subjects && subjects.length > 0
          ? `Total: ${subjects.length} vocabulary words`
          : "No vocabulary data available"}
      </p>

      {subjects && subjects.length > 0 ? (
        <div className="subjects-grid">
          {subjects.map((subject) => (
            <SubjectCard key={subject.Id} subject={subject} variant="vocabulary" />
          ))}
        </div>
      ) : (
        <div className="subjects-empty">
          <p>No vocabulary data available</p>
        </div>
      )}
    </div>
  );
}
