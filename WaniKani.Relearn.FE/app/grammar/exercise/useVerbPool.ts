import { useState, useEffect, useCallback } from "react";
import { fetchSubjects } from "~/hooks/useSubjects";
import { 
  buildVerbInfo, 
  createQuestion, 
  type VerbInfo, 
  type QuestionData, 
  type ExerciseDirection 
} from "./conjugationEngine";

export type ExerciseCategory = "tenses" | "te_form" | "all";

export const TENSES_DIRECTIONS: ExerciseDirection[] = [
  "present_plain_to_past_plain",
  "past_plain_to_present_plain",
  "present_polite_to_past_polite",
  "past_polite_to_present_polite",
  "present_plain_to_present_polite",
  "present_polite_to_present_plain",
  "past_plain_to_past_polite",
  "past_polite_to_past_plain",
  "present_plain_to_past_polite",
  "past_polite_to_present_plain",
  "present_polite_to_past_plain",
  "past_plain_to_present_polite"
];

export const TE_FORM_DIRECTIONS: ExerciseDirection[] = [
  "dictionary_to_te_form",
  "te_form_to_dictionary",
  "dictionary_to_te_iru_plain",
  "te_iru_plain_to_dictionary",
  "dictionary_to_te_iru_polite",
  "te_iru_polite_to_dictionary",
  "te_form_to_te_iru_plain",
  "te_form_to_te_iru_polite"
];

export const ALL_DIRECTIONS: ExerciseDirection[] = [
  ...TENSES_DIRECTIONS,
  ...TE_FORM_DIRECTIONS
];

// In-memory cache of parsed verbs across renders & navigations
let cachedVerbs: VerbInfo[] | null = null;
let fetchPromise: Promise<VerbInfo[]> | null = null;

async function loadVerbPool(): Promise<VerbInfo[]> {
  if (cachedVerbs && cachedVerbs.length > 0) {
    return cachedVerbs;
  }

  if (fetchPromise) {
    return fetchPromise;
  }

  fetchPromise = (async () => {
    try {
      // Fetch vocabulary subjects in batches or large page
      // Using 500 items per request provides hundreds of verbs
      const result = await fetchSubjects("vocabulary", 1, 500);
      const items = result.data || [];

      const verbList: VerbInfo[] = [];

      for (const item of items) {
        const pos = (item.PartsOfSpeech || []).map(p => p.toLowerCase());
        const isVerb = pos.some(p => 
          p.includes("godan") || 
          p.includes("ichidan") || 
          p.includes("する") || 
          p.includes("suru") ||
          p.includes("verb")
        ) || (item.Characters && (item.Characters.endsWith("する") || item.Characters === "来る"));

        if (!isVerb) continue;

        const info = buildVerbInfo(item);
        if (info) {
          verbList.push(info);
        }
      }

      cachedVerbs = verbList;
      return verbList;
    } catch (err) {
      console.error("Failed to load verbs for grammar exercise:", err);
      fetchPromise = null;
      return [];
    }
  })();

  return fetchPromise;
}

/**
 * Shuffle an array randomly using Fisher-Yates
 */
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Hook to manage verb loading and 10-question session generation
 */
export function useVerbPool() {
  const [verbs, setVerbs] = useState<VerbInfo[]>(() => cachedVerbs || []);
  const [isLoading, setIsLoading] = useState<boolean>(!cachedVerbs || cachedVerbs.length === 0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cachedVerbs && cachedVerbs.length > 0) {
      setVerbs(cachedVerbs);
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    loadVerbPool()
      .then((data) => {
        if (isMounted) {
          setVerbs(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError("Failed to load verbs");
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Generate a session of N questions (default 10) for the given category
   */
  const generateSession = useCallback((
    count: number = 10,
    category: ExerciseCategory = "tenses"
  ): QuestionData[] => {
    if (!verbs || verbs.length === 0) return [];

    let allowedDirections: ExerciseDirection[];
    if (category === "te_form") {
      allowedDirections = TE_FORM_DIRECTIONS;
    } else if (category === "all") {
      allowedDirections = ALL_DIRECTIONS;
    } else {
      allowedDirections = TENSES_DIRECTIONS;
    }

    const shuffledVerbs = shuffleArray(verbs);
    const selectedVerbs = shuffledVerbs.slice(0, Math.min(count, shuffledVerbs.length));
    const shuffledDirections = shuffleArray(allowedDirections);
    
    // Distribute shuffled directions across selected verbs
    const questions: QuestionData[] = [];
    selectedVerbs.forEach((verb, idx) => {
      const dirIndex = idx % shuffledDirections.length;
      const direction = shuffledDirections[dirIndex];
      questions.push(createQuestion(verb, direction));
    });

    return shuffleArray(questions);
  }, [verbs]);

  return {
    verbs,
    isLoading,
    error,
    generateSession
  };
}
