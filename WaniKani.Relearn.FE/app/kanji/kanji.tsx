import type { Route } from "./+types/kanji";
import { fetchSubjects } from "~/hooks/useSubjects";
import { SubjectCard } from "../components/SubjectCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
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

export function HydrateFallback() {
  return (
    <div className="subjects-container">
      <h1 className="subjects-title">Kanji</h1>
      <LoadingSpinner />
    </div>
  );
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
  return (
    <div className="subjects-container">
      <h1 className="subjects-title">Kanji</h1>
      <p className="subjects-subtitle">
        {subjects && subjects.length > 0
          ? `Total: ${subjects.length} kanji`
          : "No kanji data available"}
      </p>

      {subjects && subjects.length > 0 ? (
        <div className="subjects-grid">
          {subjects.map((subject) => (
            <SubjectCard key={subject.Id} subject={subject} variant="kanji" />
          ))}
        </div>
      ) : (
        <div className="subjects-empty">
          <p>No kanji data available</p>
        </div>
      )}
    </div>
  );
}
