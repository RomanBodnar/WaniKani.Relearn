import type { Route } from "../+types/root";
import { fetchSubjects } from "../hooks/useSubjects";
import { type Subject } from "~/hooks/Subject";
import { SubjectCard } from "../components/SubjectCard";
import "./subjects.css";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Radicals | WaniKani:Relearn" },
    { name: "description", content: "Browse and review radical components" },
  ];
}

export async function loader({}: Route.LoaderArgs) {
  try {
    const data = await fetchSubjects("radical");
    return data;
  } catch (error) {
    console.error("Failed to fetch radicals:", error);
    return [];
  }
}

export default function Radicals({ loaderData }: Route.ComponentProps) {
  const response = loaderData as unknown as Subject[];
  console.log("Radicals loader data:", response);
  const subjects = response || [];

  return (
    <div className="subjects-container">
      <h1 className="subjects-title">Radicals</h1>
      <p className="subjects-subtitle">
        {subjects.length > 0
          ? `Total: ${response.length} radicals`
          : "Loading radicals..."}
      </p>

      {subjects.length > 0 ? (
        <div className="subjects-grid">
          {subjects.map((subject: Subject) => (
            <SubjectCard key={subject.Id} subject={subject} />
          ))}
        </div>
      ) : (
        <div className="subjects-empty">
          <p>No radicals data available</p>
        </div>
      )}
    </div>
  );
}
