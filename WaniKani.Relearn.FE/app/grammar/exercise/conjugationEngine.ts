import type { Subject } from "~/hooks/Subject";

export type VerbGroup = "godan" | "ichidan" | "suru" | "kuru" | "unknown";

export type ConjugationFormType = 
  | "present_plain" 
  | "past_plain" 
  | "present_polite" 
  | "past_polite";

export type ExerciseDirection = 
  | "present_plain_to_past_plain"
  | "past_plain_to_present_plain"
  | "present_polite_to_past_polite"
  | "past_polite_to_present_polite"
  | "present_plain_to_present_polite"
  | "present_polite_to_present_plain"
  | "past_plain_to_past_polite"
  | "past_polite_to_past_plain"
  | "present_plain_to_past_polite"
  | "past_polite_to_present_plain"
  | "present_polite_to_past_plain"
  | "past_plain_to_present_polite";

export interface ConjugationForms {
  presentPlain: { kanji: string; kana: string };
  pastPlain: { kanji: string; kana: string };
  presentPolite: { kanji: string; kana: string };
  pastPolite: { kanji: string; kana: string };
}

export interface VerbInfo {
  id: number;
  characters: string;
  reading: string;
  meanings: string[];
  group: VerbGroup;
  level?: number;
  forms: ConjugationForms;
  ruleExplanation: {
    pastPlain: string;
    pastPolite: string;
    presentPolite: string;
  };
}

export interface QuestionData {
  id: string;
  verb: VerbInfo;
  direction: ExerciseDirection;
  sourceFormType: ConjugationFormType;
  targetFormType: ConjugationFormType;
  promptText: string;
  promptReading: string;
  directionLabel: string;
  directionDescription: string;
  acceptedAnswers: string[];
  ruleExplanation: string;
}

/**
 * Detect verb group from parts of speech and characters
 */
export function detectVerbGroup(subject: Subject): VerbGroup {
  const pos = (subject.PartsOfSpeech || []).map(p => p.toLowerCase());
  const characters = subject.Characters || "";
  const reading = subject.Readings?.[0]?.Reading || "";

  if (characters === "来る" || characters === "くる" || reading === "くる" || characters.endsWith("やって来る")) {
    return "kuru";
  }

  if (pos.some(p => p.includes("する") || p.includes("suru")) || characters.endsWith("する") || reading.endsWith("する")) {
    return "suru";
  }

  if (pos.some(p => p.includes("ichidan"))) {
    return "ichidan";
  }

  if (pos.some(p => p.includes("godan"))) {
    return "godan";
  }

  // Fallback heuristic if POS isn't explicit
  if (characters.endsWith("る")) {
    return "godan";
  }

  return "godan";
}

/**
 * Conjugate a string ending with Japanese kana
 */
function conjugateWord(
  word: string, 
  group: VerbGroup, 
  isKuru: boolean = false
): ConjugationForms | null {
  if (!word) return null;

  // 1. KURU verb (来る / くる)
  if (isKuru || word === "来る" || word === "くる") {
    const isKanji = word.includes("来");
    if (isKanji) {
      return {
        presentPlain: { kanji: "来る", kana: "くる" },
        pastPlain: { kanji: "来た", kana: "きた" },
        presentPolite: { kanji: "来ます", kana: "きます" },
        pastPolite: { kanji: "来ました", kana: "きました" }
      };
    } else {
      return {
        presentPlain: { kanji: "くる", kana: "くる" },
        pastPlain: { kanji: "きた", kana: "きた" },
        presentPolite: { kanji: "きます", kana: "きます" },
        pastPolite: { kanji: "きました", kana: "きました" }
      };
    }
  }

  // 2. SURU verbs (する, 勉強する, etc.)
  if (group === "suru" || word.endsWith("する")) {
    const prefix = word.slice(0, -2);
    return {
      presentPlain: { kanji: word, kana: word },
      pastPlain: { kanji: `${prefix}した`, kana: `${prefix}した` },
      presentPolite: { kanji: `${prefix}します`, kana: `${prefix}します` },
      pastPolite: { kanji: `${prefix}しました`, kana: `${prefix}しました` }
    };
  }

  // 3. ICHIDAN verbs (drop る)
  if (group === "ichidan" && word.endsWith("る")) {
    const stem = word.slice(0, -1);
    return {
      presentPlain: { kanji: word, kana: word },
      pastPlain: { kanji: `${stem}た`, kana: `${stem}た` },
      presentPolite: { kanji: `${stem}ます`, kana: `${stem}ます` },
      pastPolite: { kanji: `${stem}ました`, kana: `${stem}ました` }
    };
  }

  // 4. GODAN verbs
  const lastChar = word.slice(-1);
  const base = word.slice(0, -1);

  // Special Exception: 行く / いく
  if (word === "行く" || word === "いく") {
    const isKanji = word === "行く";
    return {
      presentPlain: { kanji: word, kana: word },
      pastPlain: { kanji: isKanji ? "行った" : "いった", kana: "いった" },
      presentPolite: { kanji: isKanji ? "行きます" : "いきます", kana: "いきます" },
      pastPolite: { kanji: isKanji ? "行きました" : "いきました", kana: "いきました" }
    };
  }

  // Godan conjugation tables
  const godanMap: Record<string, { stemKana: string; pastEnding: string }> = {
    "う": { stemKana: "い", pastEnding: "った" },
    "く": { stemKana: "き", pastEnding: "いた" },
    "ぐ": { stemKana: "ぎ", pastEnding: "いだ" },
    "す": { stemKana: "し", pastEnding: "した" },
    "つ": { stemKana: "ち", pastEnding: "った" },
    "ぬ": { stemKana: "に", pastEnding: "んだ" },
    "ぶ": { stemKana: "び", pastEnding: "んだ" },
    "む": { stemKana: "み", pastEnding: "んだ" },
    "る": { stemKana: "り", pastEnding: "った" }
  };

  const rule = godanMap[lastChar];
  if (rule) {
    const stem = base + rule.stemKana;
    const past = base + rule.pastEnding;
    return {
      presentPlain: { kanji: word, kana: word },
      pastPlain: { kanji: past, kana: past },
      presentPolite: { kanji: `${stem}ます`, kana: `${stem}ます` },
      pastPolite: { kanji: `${stem}ました`, kana: `${stem}ました` }
    };
  }

  return null;
}

/**
 * Generate full conjugation info for both Kanji characters and Kana reading
 */
export function buildVerbInfo(subject: Subject): VerbInfo | null {
  const characters = subject.Characters || "";
  const reading = subject.Readings?.[0]?.Reading || characters;
  const meanings = (subject.Meanings || []).map(m => m.Meaning);
  const group = detectVerbGroup(subject);

  const isKuru = group === "kuru" || characters === "来る" || reading === "くる";

  const kanjiForms = conjugateWord(characters, group, isKuru);
  const kanaForms = conjugateWord(reading, group, isKuru);

  if (!kanjiForms || !kanaForms) return null;

  const combinedForms: ConjugationForms = {
    presentPlain: { kanji: kanjiForms.presentPlain.kanji, kana: kanaForms.presentPlain.kana },
    pastPlain: { kanji: kanjiForms.pastPlain.kanji, kana: kanaForms.pastPlain.kana },
    presentPolite: { kanji: kanjiForms.presentPolite.kanji, kana: kanaForms.presentPolite.kana },
    pastPolite: { kanji: kanjiForms.pastPolite.kanji, kana: kanaForms.pastPolite.kana }
  };

  // Build rule explanation
  let pastPlainRule = "";
  let pastPoliteRule = "";
  let presentPoliteRule = "";

  if (group === "ichidan") {
    pastPlainRule = "Ichidan verb: drop 「る」 and add 「た」";
    presentPoliteRule = "Ichidan verb: drop 「る」 and add 「ます」";
    pastPoliteRule = "Ichidan verb: drop 「る」 and add 「ました」";
  } else if (group === "suru") {
    pastPlainRule = "Suru verb: 「する」 becomes 「した」";
    presentPoliteRule = "Suru verb: 「する」 becomes 「します」";
    pastPoliteRule = "Suru verb: 「する」 becomes 「しました」";
  } else if (group === "kuru") {
    pastPlainRule = "Irregular verb 「来る (くる)」 becomes 「来た (きた)」";
    presentPoliteRule = "Irregular verb 「来る (くる)」 becomes 「来ます (きます)」";
    pastPoliteRule = "Irregular verb 「来る (くる)」 becomes 「来ました (きました)」";
  } else {
    // Godan
    const lastChar = characters.slice(-1);
    if (characters === "行く" || reading === "いく") {
      pastPlainRule = "Exception: 「行く」 changes to 「行った」";
      presentPoliteRule = "Godan (く → き): 「行く」 changes to 「行きます」";
      pastPoliteRule = "Godan polite past: 「行きました」";
    } else {
      const pastEndings: Record<string, string> = {
        "う": "う → った",
        "く": "く → いた",
        "ぐ": "ぐ → いだ",
        "す": "す → した",
        "つ": "つ → った",
        "ぬ": "ぬ → んだ",
        "ぶ": "ぶ → んだ",
        "む": "む → んだ",
        "る": "る → った",
      };
      pastPlainRule = `Godan verb: sound change (${pastEndings[lastChar] || "euphonic change"})`;
      presentPoliteRule = "Godan verb: shift ending kana to the i-row + 「ます」";
      pastPoliteRule = "Godan verb: shift ending kana to the i-row + 「ました」";
    }
  }

  return {
    id: subject.Id,
    characters,
    reading,
    meanings,
    group,
    level: subject.Level,
    forms: combinedForms,
    ruleExplanation: {
      pastPlain: pastPlainRule,
      pastPolite: pastPoliteRule,
      presentPolite: presentPoliteRule
    }
  };
}

interface DirectionConfig {
  sourceKey: keyof ConjugationForms;
  targetKey: keyof ConjugationForms;
  sourceFormType: ConjugationFormType;
  targetFormType: ConjugationFormType;
  label: string;
  description: string;
  getRule: (verb: VerbInfo, targetKanji: string) => string;
}

const DIRECTION_CONFIGS: Record<ExerciseDirection, DirectionConfig> = {
  present_plain_to_past_plain: {
    sourceKey: "presentPlain",
    targetKey: "pastPlain",
    sourceFormType: "present_plain",
    targetFormType: "past_plain",
    label: "Present (Dictionary) ➔ Past (Plain)",
    description: "Conjugate the verb to its past plain (た/だ) form.",
    getRule: (verb) => verb.ruleExplanation.pastPlain
  },
  past_plain_to_present_plain: {
    sourceKey: "pastPlain",
    targetKey: "presentPlain",
    sourceFormType: "past_plain",
    targetFormType: "present_plain",
    label: "Past (Plain) ➔ Present (Dictionary)",
    description: "Convert the past plain verb back to its dictionary form.",
    getRule: (verb, targetKanji) => `Dictionary form of ${targetKanji} (${verb.group} verb).`
  },
  present_polite_to_past_polite: {
    sourceKey: "presentPolite",
    targetKey: "pastPolite",
    sourceFormType: "present_polite",
    targetFormType: "past_polite",
    label: "Present (ます) ➔ Past (ました)",
    description: "Conjugate the polite present verb to polite past (ました).",
    getRule: () => "Replace the 「ます」 ending with 「ました」."
  },
  past_polite_to_present_polite: {
    sourceKey: "pastPolite",
    targetKey: "presentPolite",
    sourceFormType: "past_polite",
    targetFormType: "present_polite",
    label: "Past (ました) ➔ Present (ます)",
    description: "Convert the polite past verb back to polite present (ます).",
    getRule: () => "Replace the 「ました」 ending with 「ます」."
  },
  present_plain_to_present_polite: {
    sourceKey: "presentPlain",
    targetKey: "presentPolite",
    sourceFormType: "present_plain",
    targetFormType: "present_polite",
    label: "Present (Dictionary) ➔ Present (ます)",
    description: "Conjugate the dictionary form verb to polite present (ます).",
    getRule: (verb) => verb.ruleExplanation.presentPolite
  },
  present_polite_to_present_plain: {
    sourceKey: "presentPolite",
    targetKey: "presentPlain",
    sourceFormType: "present_polite",
    targetFormType: "present_plain",
    label: "Present (ます) ➔ Present (Dictionary)",
    description: "Convert the polite present (ます) verb back to dictionary form.",
    getRule: (verb) => `Convert the masu-stem back to dictionary ending (${verb.group} verb).`
  },
  past_plain_to_past_polite: {
    sourceKey: "pastPlain",
    targetKey: "pastPolite",
    sourceFormType: "past_plain",
    targetFormType: "past_polite",
    label: "Past (Plain) ➔ Past (ました)",
    description: "Conjugate the past plain (た/だ) verb to polite past (ました).",
    getRule: (verb) => verb.ruleExplanation.pastPolite
  },
  past_polite_to_past_plain: {
    sourceKey: "pastPolite",
    targetKey: "pastPlain",
    sourceFormType: "past_polite",
    targetFormType: "past_plain",
    label: "Past (ました) ➔ Past (Plain)",
    description: "Convert the polite past (ました) verb to past plain (た/だ).",
    getRule: (verb) => verb.ruleExplanation.pastPlain
  },
  present_plain_to_past_polite: {
    sourceKey: "presentPlain",
    targetKey: "pastPolite",
    sourceFormType: "present_plain",
    targetFormType: "past_polite",
    label: "Present (Dictionary) ➔ Past (ました)",
    description: "Conjugate the dictionary form verb to polite past (ました).",
    getRule: (verb) => verb.ruleExplanation.pastPolite
  },
  past_polite_to_present_plain: {
    sourceKey: "pastPolite",
    targetKey: "presentPlain",
    sourceFormType: "past_polite",
    targetFormType: "present_plain",
    label: "Past (ました) ➔ Present (Dictionary)",
    description: "Convert the polite past (ました) verb to dictionary form.",
    getRule: (verb) => `Convert the polite past verb back to dictionary form (${verb.group} verb).`
  },
  present_polite_to_past_plain: {
    sourceKey: "presentPolite",
    targetKey: "pastPlain",
    sourceFormType: "present_polite",
    targetFormType: "past_plain",
    label: "Present (ます) ➔ Past (Plain)",
    description: "Conjugate the polite present (ます) verb to past plain (た/だ).",
    getRule: (verb) => verb.ruleExplanation.pastPlain
  },
  past_plain_to_present_polite: {
    sourceKey: "pastPlain",
    targetKey: "presentPolite",
    sourceFormType: "past_plain",
    targetFormType: "present_polite",
    label: "Past (Plain) ➔ Present (ます)",
    description: "Conjugate the past plain (た/だ) verb to polite present (ます).",
    getRule: (verb) => verb.ruleExplanation.presentPolite
  }
};

/**
 * Create a single question given a VerbInfo and a Direction
 */
export function createQuestion(verb: VerbInfo, direction: ExerciseDirection): QuestionData {
  const config = DIRECTION_CONFIGS[direction] || DIRECTION_CONFIGS.present_plain_to_past_plain;
  const sourceForm = verb.forms[config.sourceKey];
  const targetForm = verb.forms[config.targetKey];

  const promptText = sourceForm.kanji;
  const promptReading = sourceForm.kana;
  const targetKanji = targetForm.kanji;
  const targetKana = targetForm.kana;
  const ruleExplanation = config.getRule(verb, targetKanji);

  // Accepted answers include both Kanji and pure Kana representations
  const acceptedAnswers = Array.from(new Set([targetKanji, targetKana])).filter(Boolean);

  return {
    id: `${verb.id}-${direction}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    verb,
    direction,
    sourceFormType: config.sourceFormType,
    targetFormType: config.targetFormType,
    promptText,
    promptReading,
    directionLabel: config.label,
    directionDescription: config.description,
    acceptedAnswers,
    ruleExplanation
  };
}

/**
 * Check whether user's submitted input matches any accepted answer
 */
export function checkAnswer(userInput: string, acceptedAnswers: string[]): boolean {
  const cleaned = userInput.trim().normalize("NFKC").toLowerCase();
  if (!cleaned) return false;

  return acceptedAnswers.some(ans => {
    const cleanedAns = ans.trim().normalize("NFKC").toLowerCase();
    return cleaned === cleanedAns;
  });
}
