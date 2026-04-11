import type { Route } from "../+types/root";
import { fetchSubjects, type SubjectsResponse } from "../hooks/useSubjects";
import { type Subject } from "~/hooks/Subject";
import { SubjectCard } from "../components/SubjectCard";
import "./subjects.css";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Kana Vocabulary | WaniKani:Relearn" },
    { name: "description", content: "Browse and review kana vocabulary" },
  ];
}

export async function loader({}: Route.LoaderArgs) {
  try {
    const data = await fetchSubjects("kana_vocabulary");
    return data;
  } catch (error) {
    console.error("Failed to fetch kana vocabulary:", error);
    return { data: [], total_count: 0, pages_total_count: 0, current_page: 1 };
  }
}

export default function KanaVocabulary({ loaderData }: Route.ComponentProps) {
  const response = loaderData as unknown as Subject[];
  const subjects = response || [];

  return (
    <div className="subjects-container">
      <h1 className="subjects-title">Kana Vocabulary</h1>
      <p className="subjects-subtitle">
        {subjects.length > 0
          ? `Total: ${response.length} kana vocabulary items`
          : "Loading kana vocabulary..."}
      </p>

      {subjects.length > 0 ? (
        <div className="subjects-grid">
          {subjects.map((subject: Subject) => (
            <SubjectCard key={subject.Id} subject={subject} />
          ))}
        </div>
      ) : (
        <div className="subjects-empty">
          <p>No kana vocabulary data available</p>
        </div>
      )}
    </div>
  );
}
