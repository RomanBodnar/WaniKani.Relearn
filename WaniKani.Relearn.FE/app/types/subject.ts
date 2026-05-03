import type { Subject } from "~/hooks/Subject";

/**
 * Subject detail loader data structure
 */
export interface SubjectDetailData {
  subject: Subject;
  componentSubjects: Subject[];
  amalgamationSubjects: Subject[];
  visuallySimilarSubjects: Subject[];
}
