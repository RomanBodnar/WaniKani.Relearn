import type { Route } from "../+types/root";
import { fetchSubjects } from "../hooks/useSubjects";
import { type Subject } from "~/hooks/Subject";
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
    return [];
  }
}

export default function Kanji({ loaderData }: Route.ComponentProps) {
  const response = loaderData as unknown as Subject[];
  console.log("Kanji loader data:", response);
  const subjects = response || [];

  return (
    <div className="subjects-container">
      <h1 className="subjects-title">Kanji</h1>
      <p className="subjects-subtitle">
        {subjects.length > 0
          ? `Total: ${response.length} kanji`
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
