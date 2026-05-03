import type { Subject } from "~/hooks/Subject";

/**
 * Subject detail loader data structure
 */
export interface SubjectDetailData {
  subject: Subject;
  componentSubjects: Array<{ id: number; characters: string | null; CharacterImages?: any[]; slug?: string }>;
  amalgamationSubjects: Array<{ id: number; characters: string | null; CharacterImages?: any[]; slug?: string }>;
  visuallySimilarSubjects: Array<{ id: number; characters: string | null; CharacterImages?: any[]; slug?: string }>;
}
