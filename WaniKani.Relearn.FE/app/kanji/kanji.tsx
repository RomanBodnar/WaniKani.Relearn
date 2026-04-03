import type { Route } from "../+types/root";
import { fetchSubjects, type SubjectsResponse, type Subject } from "../hooks/useSubjects";
import { SubjectCard } from "../components/SubjectCard";
import "./subjects.css";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Kanji | WaniKani:Relearn" },
    { name: "description", content: "Browse and review kanji characters" },
  ];
}

export async function loader({}: Route.LoaderArgs) {
  try {
    const data = await fetchSubjects("kanji");
    return data;
  } catch (error) {
    console.error("Failed to fetch kanji:", error);
    return { data: [], total_count: 0, pages_total_count: 0, current_page: 1 };
  }
}

export default function Kanji({ loaderData }: Route.ComponentProps) {
  const response = loaderData as SubjectsResponse;
  const subjects = response.data || [];

  return (
    <div className="subjects-container">
      <h1 className="subjects-title">Kanji</h1>
      <p className="subjects-subtitle">
        {subjects.length > 0
          ? `Total: ${response.total_count} kanji`
          : "Loading kanji..."}
      </p>

      {subjects.length > 0 ? (
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
    </div>
  );
}
