import type { Subject } from "~/hooks/Subject";

export type VerbGroup = "godan" | "ichidan" | "suru" | "kuru" | "unknown";

export type ConjugationFormType = 
  | "present_plain" 
  | "past_plain" 
  | "present_polite" 
  | "past_polite"
  | "te_form"
  | "te_iru_plain"
  | "te_iru_polite"
  | "te_iru_past_plain"
  | "te_iru_past_polite";

export type ExerciseDirection = 
  // 12 Tense / Politeness pairs
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
  | "past_plain_to_present_polite"
  // Te-form & Continuous action pairs
  | "dictionary_to_te_form"
  | "te_form_to_dictionary"
  | "dictionary_to_te_iru_plain"
  | "te_iru_plain_to_dictionary"
  | "dictionary_to_te_iru_polite"
  | "te_iru_polite_to_dictionary"
  | "te_form_to_te_iru_plain"
  | "te_form_to_te_iru_polite";

export interface ConjugationForms {
  presentPlain: { kanji: string; kana: string };
  pastPlain: { kanji: string; kana: string };
  presentPolite: { kanji: string; kana: string };
  pastPolite: { kanji: string; kana: string };
  teForm: { kanji: string; kana: string };
  teIruPlain: { kanji: string; kana: string };
  teIruPolite: { kanji: string; kana: string };
  teIruPastPlain: { kanji: string; kana: string };
  teIruPastPolite: { kanji: string; kana: string };
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
    teForm: string;
    teIru: string;
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
 * Convert an English verb infinitive into continuous "-ing" participle
 * (e.g. "to eat" -> "eating", "to read" -> "reading", "to swim" -> "swimming")
 */
export function toContinuousEnglish(meaning: string): string {
  if (!meaning) return "doing";
  let base = meaning.trim().toLowerCase();
  if (base.startsWith("to ")) {
    base = base.slice(3).trim();
  }
  
  // Specific irregular mappings
  const irregulars: Record<string, string> = {
    "be": "being",
    "die": "dying",
    "lie": "lying",
    "tie": "tying",
    "run": "running",
    "swim": "swimming",
    "cut": "cutting",
    "put": "putting",
    "get": "getting",
    "set": "setting",
    "sit": "sitting",
    "hit": "hitting",
    "let": "letting",
    "stop": "stopping",
    "drop": "dropping",
    "step": "stepping",
    "win": "winning",
    "begin": "beginning",
    "forget": "forgetting"
  };

  if (irregulars[base]) {
    return irregulars[base];
  }

  // Double consonant rule for short CVC words (e.g. jog -> jogging, hop -> hopping)
  if (/^[bcdfghjklmnpqrstvwxyz][aeiou][bcdfghjklmnprstvz]$/.test(base) && !base.endsWith("w") && !base.endsWith("x") && !base.endsWith("y")) {
    return base + base.slice(-1) + "ing";
  }

  // Ends in 'ee', 'oe', 'ye' -> keep e (seeing, freeing)
  if (base.endsWith("ee") || base.endsWith("oe") || base.endsWith("ye")) {
    return base + "ing";
  }

  // Ends in silent 'e' (make -> making, write -> writing, come -> coming, have -> having, take -> taking, use -> using)
  if (base.endsWith("e") && !base.endsWith("ie") && base.length > 2) {
    return base.slice(0, -1) + "ing";
  }

  // Ends in 'ie' -> 'ying'
  if (base.endsWith("ie")) {
    return base.slice(0, -2) + "ying";
  }

  return base + "ing";
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
    const te = isKanji ? "来て" : "きて";
    return {
      presentPlain: { kanji: isKanji ? "来る" : "くる", kana: "くる" },
      pastPlain: { kanji: isKanji ? "来た" : "きた", kana: "きた" },
      presentPolite: { kanji: isKanji ? "来ます" : "きます", kana: "きます" },
      pastPolite: { kanji: isKanji ? "来ました" : "きました", kana: "きました" },
      teForm: { kanji: te, kana: "きて" },
      teIruPlain: { kanji: `${te}いる`, kana: "きている" },
      teIruPolite: { kanji: `${te}います`, kana: "きています" },
      teIruPastPlain: { kanji: `${te}いた`, kana: "きていた" },
      teIruPastPolite: { kanji: `${te}いました`, kana: "きていました" }
    };
  }

  // 2. SURU verbs (する, 勉強する, etc.)
  if (group === "suru" || word.endsWith("する")) {
    const prefix = word.slice(0, -2);
    const te = `${prefix}して`;
    return {
      presentPlain: { kanji: word, kana: word },
      pastPlain: { kanji: `${prefix}した`, kana: `${prefix}した` },
      presentPolite: { kanji: `${prefix}します`, kana: `${prefix}します` },
      pastPolite: { kanji: `${prefix}しました`, kana: `${prefix}しました` },
      teForm: { kanji: te, kana: te },
      teIruPlain: { kanji: `${te}いる`, kana: `${te}いる` },
      teIruPolite: { kanji: `${te}います`, kana: `${te}います` },
      teIruPastPlain: { kanji: `${te}いた`, kana: `${te}いた` },
      teIruPastPolite: { kanji: `${te}いました`, kana: `${te}いました` }
    };
  }

  // 3. ICHIDAN verbs (drop る)
  if (group === "ichidan" && word.endsWith("る")) {
    const stem = word.slice(0, -1);
    const te = `${stem}て`;
    return {
      presentPlain: { kanji: word, kana: word },
      pastPlain: { kanji: `${stem}た`, kana: `${stem}た` },
      presentPolite: { kanji: `${stem}ます`, kana: `${stem}ます` },
      pastPolite: { kanji: `${stem}ました`, kana: `${stem}ました` },
      teForm: { kanji: te, kana: te },
      teIruPlain: { kanji: `${te}いる`, kana: `${te}いる` },
      teIruPolite: { kanji: `${te}います`, kana: `${te}います` },
      teIruPastPlain: { kanji: `${te}いた`, kana: `${te}いた` },
      teIruPastPolite: { kanji: `${te}いました`, kana: `${te}いました` }
    };
  }

  // 4. GODAN verbs
  const lastChar = word.slice(-1);
  const base = word.slice(0, -1);

  // Special Exception: 行く / いく
  if (word === "行く" || word === "いく") {
    const isKanji = word === "行く";
    const te = isKanji ? "行って" : "いって";
    return {
      presentPlain: { kanji: word, kana: word },
      pastPlain: { kanji: isKanji ? "行った" : "いった", kana: "いった" },
      presentPolite: { kanji: isKanji ? "行きます" : "いきます", kana: "いきます" },
      pastPolite: { kanji: isKanji ? "行きました" : "いきました", kana: "いきました" },
      teForm: { kanji: te, kana: "いって" },
      teIruPlain: { kanji: `${te}いる`, kana: "いっている" },
      teIruPolite: { kanji: `${te}います`, kana: "いっています" },
      teIruPastPlain: { kanji: `${te}いた`, kana: "いっていた" },
      teIruPastPolite: { kanji: `${te}いました`, kana: "いっていました" }
    };
  }

  // Godan conjugation tables
  const godanMap: Record<string, { stemKana: string; pastEnding: string; teEnding: string }> = {
    "う": { stemKana: "い", pastEnding: "った", teEnding: "って" },
    "く": { stemKana: "き", pastEnding: "いた", teEnding: "いて" },
    "ぐ": { stemKana: "ぎ", pastEnding: "いだ", teEnding: "いで" },
    "す": { stemKana: "し", pastEnding: "した", teEnding: "して" },
    "つ": { stemKana: "ち", pastEnding: "った", teEnding: "って" },
    "ぬ": { stemKana: "に", pastEnding: "んだ", teEnding: "んで" },
    "ぶ": { stemKana: "び", pastEnding: "んだ", teEnding: "んで" },
    "む": { stemKana: "み", pastEnding: "んだ", teEnding: "んで" },
    "る": { stemKana: "り", pastEnding: "った", teEnding: "って" }
  };

  const rule = godanMap[lastChar];
  if (rule) {
    const stem = base + rule.stemKana;
    const past = base + rule.pastEnding;
    const te = base + rule.teEnding;
    return {
      presentPlain: { kanji: word, kana: word },
      pastPlain: { kanji: past, kana: past },
      presentPolite: { kanji: `${stem}ます`, kana: `${stem}ます` },
      pastPolite: { kanji: `${stem}ました`, kana: `${stem}ました` },
      teForm: { kanji: te, kana: te },
      teIruPlain: { kanji: `${te}いる`, kana: `${te}いる` },
      teIruPolite: { kanji: `${te}います`, kana: `${te}います` },
      teIruPastPlain: { kanji: `${te}いた`, kana: `${te}いた` },
      teIruPastPolite: { kanji: `${te}いました`, kana: `${te}いました` }
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
    pastPolite: { kanji: kanjiForms.pastPolite.kanji, kana: kanaForms.pastPolite.kana },
    teForm: { kanji: kanjiForms.teForm.kanji, kana: kanaForms.teForm.kana },
    teIruPlain: { kanji: kanjiForms.teIruPlain.kanji, kana: kanaForms.teIruPlain.kana },
    teIruPolite: { kanji: kanjiForms.teIruPolite.kanji, kana: kanaForms.teIruPolite.kana },
    teIruPastPlain: { kanji: kanjiForms.teIruPastPlain.kanji, kana: kanaForms.teIruPastPlain.kana },
    teIruPastPolite: { kanji: kanjiForms.teIruPastPolite.kanji, kana: kanaForms.teIruPastPolite.kana }
  };

  // Build rule explanations
  let pastPlainRule = "";
  let pastPoliteRule = "";
  let presentPoliteRule = "";
  let teFormRule = "";
  let teIruRule = "";

  if (group === "ichidan") {
    pastPlainRule = "Ichidan verb: drop 「る」 and add 「た」";
    presentPoliteRule = "Ichidan verb: drop 「る」 and add 「ます」";
    pastPoliteRule = "Ichidan verb: drop 「る」 and add 「ました」";
    teFormRule = "Ichidan verb: drop 「る」 and add 「て」 (e.g. 食べる → 食べて)";
    teIruRule = "Ichidan verb: te-form + 「いる / います」 for ongoing action";
  } else if (group === "suru") {
    pastPlainRule = "Suru verb: 「する」 becomes 「した」";
    presentPoliteRule = "Suru verb: 「する」 becomes 「します」";
    pastPoliteRule = "Suru verb: 「する」 becomes 「しました」";
    teFormRule = "Suru verb: 「する」 becomes 「して」 (e.g. 勉強する → 勉強して)";
    teIruRule = "Suru verb: 「〜している / しています」 for continuous action";
  } else if (group === "kuru") {
    pastPlainRule = "Irregular verb 「来る (くる)」 becomes 「来た (きた)」";
    presentPoliteRule = "Irregular verb 「来る (くる)」 becomes 「来ます (きます)」";
    pastPoliteRule = "Irregular verb 「来る (くる)」 becomes 「来ました (きました)」";
    teFormRule = "Irregular verb 「来る (くる)」 becomes 「来て (きて)」";
    teIruRule = "Irregular verb: 「来ている / 来ています」";
  } else {
    // Godan
    const lastChar = characters.slice(-1);
    if (characters === "行く" || reading === "いく") {
      pastPlainRule = "Exception: 「行く」 changes to 「行った」";
      presentPoliteRule = "Godan (く → き): 「行く」 changes to 「行きます」";
      pastPoliteRule = "Godan polite past: 「行きました」";
      teFormRule = "Exception: 「行く」 changes to 「行って」 (instead of いいて)";
      teIruRule = "Exception: 「行っている / 行っています」";
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
      const teEndings: Record<string, string> = {
        "う": "う → って",
        "く": "く → いて",
        "ぐ": "ぐ → いで",
        "す": "す → して",
        "つ": "つ → って",
        "ぬ": "ぬ → んで",
        "ぶ": "ぶ → んで",
        "む": "む → んで",
        "る": "る → って",
      };
      pastPlainRule = `Godan verb: sound change (${pastEndings[lastChar] || "euphonic change"})`;
      presentPoliteRule = "Godan verb: shift ending kana to the i-row + 「ます」";
      pastPoliteRule = "Godan verb: shift ending kana to the i-row + 「ました」";
      teFormRule = `Godan verb: sound change (${teEndings[lastChar] || "te-form euphonic change"})`;
      teIruRule = "Godan verb: te-form + 「いる / います」 for ongoing action";
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
      presentPolite: presentPoliteRule,
      teForm: teFormRule,
      teIru: teIruRule
    }
  };
}

interface DirectionConfig {
  sourceKey: keyof ConjugationForms;
  targetKey: keyof ConjugationForms;
  sourceFormType: ConjugationFormType;
  targetFormType: ConjugationFormType;
  label: string;
  getDescription: (verb: VerbInfo) => string;
  getRule: (verb: VerbInfo, targetKanji: string) => string;
}

export const DIRECTION_CONFIGS: Record<ExerciseDirection, DirectionConfig> = {
  // --- Tenses & Politeness ---
  present_plain_to_past_plain: {
    sourceKey: "presentPlain",
    targetKey: "pastPlain",
    sourceFormType: "present_plain",
    targetFormType: "past_plain",
    label: "Present (Dictionary) ➔ Past (Plain)",
    getDescription: () => "Conjugate the verb to its past plain (た/だ) form.",
    getRule: (verb) => verb.ruleExplanation.pastPlain
  },
  past_plain_to_present_plain: {
    sourceKey: "pastPlain",
    targetKey: "presentPlain",
    sourceFormType: "past_plain",
    targetFormType: "present_plain",
    label: "Past (Plain) ➔ Present (Dictionary)",
    getDescription: () => "Convert the past plain verb back to its dictionary form.",
    getRule: (verb, targetKanji) => `Dictionary form of ${targetKanji} (${verb.group} verb).`
  },
  present_polite_to_past_polite: {
    sourceKey: "presentPolite",
    targetKey: "pastPolite",
    sourceFormType: "present_polite",
    targetFormType: "past_polite",
    label: "Present (ます) ➔ Past (ました)",
    getDescription: () => "Conjugate the polite present verb to polite past (ました).",
    getRule: () => "Replace the 「ます」 ending with 「ました」."
  },
  past_polite_to_present_polite: {
    sourceKey: "pastPolite",
    targetKey: "presentPolite",
    sourceFormType: "past_polite",
    targetFormType: "present_polite",
    label: "Past (ました) ➔ Present (ます)",
    getDescription: () => "Convert the polite past verb back to polite present (ます).",
    getRule: () => "Replace the 「ました」 ending with 「ます」."
  },
  present_plain_to_present_polite: {
    sourceKey: "presentPlain",
    targetKey: "presentPolite",
    sourceFormType: "present_plain",
    targetFormType: "present_polite",
    label: "Present (Dictionary) ➔ Present (ます)",
    getDescription: () => "Conjugate the dictionary form verb to polite present (ます).",
    getRule: (verb) => verb.ruleExplanation.presentPolite
  },
  present_polite_to_present_plain: {
    sourceKey: "presentPolite",
    targetKey: "presentPlain",
    sourceFormType: "present_polite",
    targetFormType: "present_plain",
    label: "Present (ます) ➔ Present (Dictionary)",
    getDescription: () => "Convert the polite present (ます) verb back to dictionary form.",
    getRule: (verb) => `Convert the masu-stem back to dictionary ending (${verb.group} verb).`
  },
  past_plain_to_past_polite: {
    sourceKey: "pastPlain",
    targetKey: "pastPolite",
    sourceFormType: "past_plain",
    targetFormType: "past_polite",
    label: "Past (Plain) ➔ Past (ました)",
    getDescription: () => "Conjugate the past plain (た/だ) verb to polite past (ました).",
    getRule: (verb) => verb.ruleExplanation.pastPolite
  },
  past_polite_to_past_plain: {
    sourceKey: "pastPolite",
    targetKey: "pastPlain",
    sourceFormType: "past_polite",
    targetFormType: "past_plain",
    label: "Past (ました) ➔ Past (Plain)",
    getDescription: () => "Convert the polite past (ました) verb to past plain (た/だ).",
    getRule: (verb) => verb.ruleExplanation.pastPlain
  },
  present_plain_to_past_polite: {
    sourceKey: "presentPlain",
    targetKey: "pastPolite",
    sourceFormType: "present_plain",
    targetFormType: "past_polite",
    label: "Present (Dictionary) ➔ Past (ました)",
    getDescription: () => "Conjugate the dictionary form verb to polite past (ました).",
    getRule: (verb) => verb.ruleExplanation.pastPolite
  },
  past_polite_to_present_plain: {
    sourceKey: "pastPolite",
    targetKey: "presentPlain",
    sourceFormType: "past_polite",
    targetFormType: "present_plain",
    label: "Past (ました) ➔ Present (Dictionary)",
    getDescription: () => "Convert the polite past (ました) verb to dictionary form.",
    getRule: (verb) => `Convert the polite past verb back to dictionary form (${verb.group} verb).`
  },
  present_polite_to_past_plain: {
    sourceKey: "presentPolite",
    targetKey: "pastPlain",
    sourceFormType: "present_polite",
    targetFormType: "past_plain",
    label: "Present (ます) ➔ Past (Plain)",
    getDescription: () => "Conjugate the polite present (ます) verb to past plain (た/だ).",
    getRule: (verb) => verb.ruleExplanation.pastPlain
  },
  past_plain_to_present_polite: {
    sourceKey: "pastPlain",
    targetKey: "presentPolite",
    sourceFormType: "past_plain",
    targetFormType: "present_polite",
    label: "Past (Plain) ➔ Present (ます)",
    getDescription: () => "Conjugate the past plain (た/だ) verb to polite present (ます).",
    getRule: (verb) => verb.ruleExplanation.presentPolite
  },

  // --- Te-Form & Continuous Action ---
  dictionary_to_te_form: {
    sourceKey: "presentPlain",
    targetKey: "teForm",
    sourceFormType: "present_plain",
    targetFormType: "te_form",
    label: "Dictionary ➔ Te-Form (〜て / 〜で)",
    getDescription: (verb) => {
      const cont = toContinuousEnglish(verb.meanings[0] || "");
      const baseAction = verb.meanings[0]?.replace(/^to\s+/, "") || "do";
      return `Convert to Te-form to connect actions or make a request (e.g. "${cont} and...", "please ${baseAction}").`;
    },
    getRule: (verb) => verb.ruleExplanation.teForm
  },
  te_form_to_dictionary: {
    sourceKey: "teForm",
    targetKey: "presentPlain",
    sourceFormType: "te_form",
    targetFormType: "present_plain",
    label: "Te-Form (〜て) ➔ Dictionary Form",
    getDescription: () => "What is the basic dictionary (plain present) form of this verb?",
    getRule: (verb, targetKanji) => `Dictionary form of ${targetKanji} (${verb.group} verb). ${verb.ruleExplanation.teForm}`
  },
  dictionary_to_te_iru_plain: {
    sourceKey: "presentPlain",
    targetKey: "teIruPlain",
    sourceFormType: "present_plain",
    targetFormType: "te_iru_plain",
    label: "Express Continuous Action (Plain: 〜ている)",
    getDescription: (verb) => {
      const cont = toContinuousEnglish(verb.meanings[0] || "");
      return `How would you say you are currently ${cont}? (e.g. "I am ${cont} [plain speech]")`;
    },
    getRule: (verb) => `${verb.ruleExplanation.teForm} ➔ Add 「いる」 for continuous action: 「〜ている」.`
  },
  te_iru_plain_to_dictionary: {
    sourceKey: "teIruPlain",
    targetKey: "presentPlain",
    sourceFormType: "te_iru_plain",
    targetFormType: "present_plain",
    label: "Continuous Action (〜ている) ➔ Dictionary Form",
    getDescription: (verb) => {
      const cont = toContinuousEnglish(verb.meanings[0] || "");
      return `What is the basic dictionary form of this continuous action ("is ${cont}")?`;
    },
    getRule: (verb, targetKanji) => `Drop 「いる」 and convert te-form back to dictionary form ${targetKanji}.`
  },
  dictionary_to_te_iru_polite: {
    sourceKey: "presentPlain",
    targetKey: "teIruPolite",
    sourceFormType: "present_plain",
    targetFormType: "te_iru_polite",
    label: "Express Continuous Action (Polite: 〜ています)",
    getDescription: (verb) => {
      const cont = toContinuousEnglish(verb.meanings[0] || "");
      return `How would you politely say you are currently ${cont}? (e.g. "I am ${cont} [polite speech]")`;
    },
    getRule: (verb) => `${verb.ruleExplanation.teForm} ➔ Add 「います」 for polite continuous action: 「〜ています」.`
  },
  te_iru_polite_to_dictionary: {
    sourceKey: "teIruPolite",
    targetKey: "presentPlain",
    sourceFormType: "te_iru_polite",
    targetFormType: "present_plain",
    label: "Continuous Action (〜ています) ➔ Dictionary Form",
    getDescription: (verb) => {
      const cont = toContinuousEnglish(verb.meanings[0] || "");
      return `What is the basic dictionary form of this polite ongoing action ("is ${cont}")?`;
    },
    getRule: (verb, targetKanji) => `Drop 「います」 and convert te-form back to dictionary form ${targetKanji}.`
  },
  te_form_to_te_iru_plain: {
    sourceKey: "teForm",
    targetKey: "teIruPlain",
    sourceFormType: "te_form",
    targetFormType: "te_iru_plain",
    label: "Te-Form ➔ Continuous Action (〜ている)",
    getDescription: (verb) => {
      const cont = toContinuousEnglish(verb.meanings[0] || "");
      return `Express the ongoing action ("is ${cont}") in plain speech.`;
    },
    getRule: () => "Attach 「いる」 to the te-form to express an ongoing state or continuous action."
  },
  te_form_to_te_iru_polite: {
    sourceKey: "teForm",
    targetKey: "teIruPolite",
    sourceFormType: "te_form",
    targetFormType: "te_iru_polite",
    label: "Te-Form ➔ Continuous Action (〜ています)",
    getDescription: (verb) => {
      const cont = toContinuousEnglish(verb.meanings[0] || "");
      return `Express the ongoing action ("is ${cont}") in polite speech.`;
    },
    getRule: () => "Attach 「います」 to the te-form to express a polite ongoing state or continuous action."
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
  const directionDescription = config.getDescription(verb);

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
