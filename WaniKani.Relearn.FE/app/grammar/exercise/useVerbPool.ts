import { useState, useEffect, useCallback, useRef } from "react";
import { fetchSubjects } from "~/hooks/useSubjects";
import { 
  buildVerbInfo, 
  createQuestion, 
  type VerbInfo, 
  type QuestionData, 
  type ExerciseDirection 
} from "./conjugationEngine";

const ALL_DIRECTIONS: ExerciseDirection[] = [
  "present_plain_to_past_plain",
  "past_plain_to_present_plain",
  "present_polite_to_past_polite",
  "past_polite_to_present_polite"
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
   * Generate a session of N questions (default 10)
   */
  const generateSession = useCallback((
    count: number = 10,
    allowedDirections: ExerciseDirection[] = ALL_DIRECTIONS
  ): QuestionData[] => {
    if (!verbs || verbs.length === 0) return [];

    const shuffledVerbs = shuffleArray(verbs);
    const selectedVerbs = shuffledVerbs.slice(0, Math.min(count, shuffledVerbs.length));
    
    // Distribute directions evenly across selected verbs
    const questions: QuestionData[] = [];
    selectedVerbs.forEach((verb, idx) => {
      const dirIndex = idx % allowedDirections.length;
      const direction = allowedDirections[dirIndex];
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
