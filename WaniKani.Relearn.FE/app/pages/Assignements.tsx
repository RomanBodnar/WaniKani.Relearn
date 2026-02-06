import { useLoaderData } from "react-router";

type Assignment = {
  id: number;
  subjectType: "radical" | "kanji" | "vocabulary" | "kana_vocabulary";
  subjectId: number;
  availableAt: string;
};

export function kanjiAssignmentsLoader() {
    return fetch("http://localhost:5138/assignments?subjectTypes=kanji")
        .then((response) => response.json());
}

export default function Assingnements() {
    const assignments = useLoaderData() as any;
    console.log(assignments);

    return (
        <>
            <h1>Kanji Assignments: {assignments.total_count}</h1>
        </>
    );
}