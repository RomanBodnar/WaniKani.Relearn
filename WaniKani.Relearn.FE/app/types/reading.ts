export interface SubjectReference {
  subjectId: number;
  characters: string;
}

export interface ReadingSentence {
  ja: string;
  en: string;
  level: number;
  sourceVocabulary: SubjectReference[];
  kanjiInSentence: SubjectReference[];
}

export interface PaginatedSentences {
  data: ReadingSentence[];
  page: number;
  perPage: number;
  totalCount: number;
}

export interface ReadingBookmark {
  page: number;
  sentenceIndex: number;
  minLevel?: number;
  maxLevel?: number;
  timestamp: string;
}
