import type { Subject } from "~/hooks/Subject";

/**
 * Subject detail loader data structure
 */
export interface SubjectDetailData {
  subject: Subject;
  componentSubjects: Array<{ id: number; characters: string | null; CharacterImages?: any[] }>;
  amalgamationSubjects: Array<{ id: number; characters: string | null; CharacterImages?: any[] }>;
  visuallySimilarSubjects: Array<{ id: number; characters: string | null; CharacterImages?: any[] }>;
}
