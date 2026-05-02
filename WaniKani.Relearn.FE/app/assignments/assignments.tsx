import type { Route } from "../+types/root";
import { API_ENDPOINTS } from "~/config/api";
import type { AssignmentsResponse } from "~/types/assignments";

export async function clientLoader( {params}: Route.ClientLoaderArgs) {
    const response = await fetch(`${API_ENDPOINTS.assignments}?subjectTypes=Kanji`);
    return response.json() as Promise<AssignmentsResponse>;
}

export default function Assignments({loaderData}: Route.ComponentProps) {
    const assignments = loaderData as unknown as AssignmentsResponse;

    return (
        <>
            <h1>Kanji Assignments: {assignments?.total_count || 0}</h1>
        </>
    );
}