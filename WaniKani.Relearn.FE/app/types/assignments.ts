/**
 * Assignment-related types
 */
export type SubjectTypeKey = "radical" | "kanji" | "vocabulary" | "kana_vocabulary";

export interface Assignment {
  id: number;
  subjectType: SubjectTypeKey;
  subjectId: number;
  availableAt: string;
}

export interface AssignmentsResponse {
  assignments: Assignment[];
  total_count: number;
}
