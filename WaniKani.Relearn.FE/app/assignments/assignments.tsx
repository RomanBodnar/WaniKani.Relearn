import { useLoaderData } from "react-router";
import type { Route } from "../+types/root";

type Assignment = {
  id: number;
  subjectType: "radical" | "kanji" | "vocabulary" | "kana_vocabulary";
  subjectId: number;
  availableAt: string;
};

export async function loader( {params}: Route.LoaderArgs) {
    console.log("test");
    var response = await fetch("http://localhost:5138/assignments?subjectTypes=Kanji");
    console.log("response from api", response);
    var data = response.json();
    return data;
}

export default function Assingnements({loaderData}: Route.ComponentProps) {
    const assignments = loaderData as any;
    console.log(assignments);

    return (
        <>
            <h1>Kanji Assignments: {assignments && assignments.total_count}</h1>
        </>
    );
}