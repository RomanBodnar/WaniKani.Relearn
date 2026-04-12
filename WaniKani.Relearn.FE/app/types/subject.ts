import type { Subject } from "~/hooks/Subject";

/**
 * Subject detail loader data structure
 */
export interface SubjectDetailData {
  subject: Subject;
  componentSubjects: Array<{ id: number; characters: string }>;
  amalgamationSubjects: Array<{ id: number; characters: string }>;
}
