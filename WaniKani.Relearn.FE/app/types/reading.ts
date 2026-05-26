export interface SubjectReference {
  subjectId: number;
  characters: string;
}

export interface PartOfSpeech {
  ja: string;
  en: string;
}

export interface Morpheme {
  subjectId: number | null;
  combinedForm: string | null;
  surface: string;
  conjugationType: string;
  conjugationForm: string;
  lemmaReading: string;
  lemma: string;
  orth: string;
  pron: string;
  pos1: PartOfSpeech | null;
  pos2: PartOfSpeech | null;
  pos3: PartOfSpeech | null;
  pos4: PartOfSpeech | null;
}

export interface ReadingSentence {
  ja: string;
  en: string;
  level: number;
  sourceVocabulary: SubjectReference[];
  kanjiInSentence: SubjectReference[];
  morphemes?: Morpheme[];
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
