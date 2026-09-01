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
  | "past_polite_to_present_polite";

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

/**
 * Create a single question given a VerbInfo and a Direction
 */
export function createQuestion(verb: VerbInfo, direction: ExerciseDirection): QuestionData {
  let sourceFormType: ConjugationFormType;
  let targetFormType: ConjugationFormType;
  let directionLabel: string;
  let directionDescription: string;
  let promptText: string;
  let promptReading: string;
  let targetKanji: string;
  let targetKana: string;
  let ruleExplanation: string;

  switch (direction) {
    case "present_plain_to_past_plain":
      sourceFormType = "present_plain";
      targetFormType = "past_plain";
      directionLabel = "Present (Dictionary) ➔ Past (Plain)";
      directionDescription = "Conjugate the verb to its past plain (た/だ) form.";
      promptText = verb.forms.presentPlain.kanji;
      promptReading = verb.forms.presentPlain.kana;
      targetKanji = verb.forms.pastPlain.kanji;
      targetKana = verb.forms.pastPlain.kana;
      ruleExplanation = verb.ruleExplanation.pastPlain;
      break;

    case "past_plain_to_present_plain":
      sourceFormType = "past_plain";
      targetFormType = "present_plain";
      directionLabel = "Past (Plain) ➔ Present (Dictionary)";
      directionDescription = "Convert the past plain verb back to its dictionary form.";
      promptText = verb.forms.pastPlain.kanji;
      promptReading = verb.forms.pastPlain.kana;
      targetKanji = verb.forms.presentPlain.kanji;
      targetKana = verb.forms.presentPlain.kana;
      ruleExplanation = `Dictionary form of ${targetKanji} (${verb.group} verb).`;
      break;

    case "present_polite_to_past_polite":
      sourceFormType = "present_polite";
      targetFormType = "past_polite";
      directionLabel = "Present (ます) ➔ Past (ました)";
      directionDescription = "Conjugate the polite present verb to polite past (ました).";
      promptText = verb.forms.presentPolite.kanji;
      promptReading = verb.forms.presentPolite.kana;
      targetKanji = verb.forms.pastPolite.kanji;
      targetKana = verb.forms.pastPolite.kana;
      ruleExplanation = "Replace the 「ます」 ending with 「ました」.";
      break;

    case "past_polite_to_present_polite":
      sourceFormType = "past_polite";
      targetFormType = "present_polite";
      directionLabel = "Past (ました) ➔ Present (ます)";
      directionDescription = "Convert the polite past verb back to polite present (ます).";
      promptText = verb.forms.pastPolite.kanji;
      promptReading = verb.forms.pastPolite.kana;
      targetKanji = verb.forms.presentPolite.kanji;
      targetKana = verb.forms.presentPolite.kana;
      ruleExplanation = "Replace the 「ました」 ending with 「ます」.";
      break;
  }

  // Accepted answers include both Kanji and pure Kana representations
  const acceptedAnswers = Array.from(new Set([targetKanji, targetKana])).filter(Boolean);

  return {
    id: `${verb.id}-${direction}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    verb,
    direction,
    sourceFormType,
    targetFormType,
    promptText,
    promptReading,
    directionLabel,
    directionDescription,
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
