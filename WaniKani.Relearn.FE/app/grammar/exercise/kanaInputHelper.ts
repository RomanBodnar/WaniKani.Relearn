/**
 * Lightweight Romaji-to-Hiragana converter for interactive Japanese typing input.
 */

const ROMAJI_TO_HIRAGANA_MAP: Record<string, string> = {
  // 4-letter combos
  shya: "しゃ", shyu: "しゅ", shyo: "しょ", shye: "しぇ",
  chya: "ちゃ", chyu: "ちゅ", chyo: "ちょ", chye: "ちぇ",
  shia: "しゃ", shiu: "しゅ", shio: "しょ", shie: "しぇ",
  chia: "ちゃ", chiu: "ちゅ", chio: "ちょ", chie: "ちぇ",
  xtsu: "っ", ltsu: "っ",

  // 3-letter combos
  kya: "きゃ", kyu: "きゅ", kyo: "きょ", kye: "きぇ",
  sha: "しゃ", shu: "しゅ", sho: "しょ", she: "しぇ",
  sya: "しゃ", syu: "しゅ", syo: "しょ", sye: "しぇ",
  sia: "しゃ", siu: "しゅ", sio: "しょ", sie: "しぇ",
  cha: "ちゃ", chu: "ちゅ", cho: "ちょ", che: "ちぇ",
  tya: "ちゃ", tyu: "ちゅ", tyo: "ちょ", tye: "ちぇ",
  cya: "ちゃ", cyu: "ちゅ", cyo: "ちょ", cye: "ちぇ",
  tia: "ちゃ", tiu: "ちゅ", tio: "ちょ", tie: "ちぇ",
  nya: "にゃ", nyu: "にゅ", nyo: "にょ", nye: "にぇ",
  hya: "ひゃ", hyu: "ひゅ", hyo: "ひょ", hye: "ひぇ",
  mya: "みゃ", myu: "みゅ", myo: "みょ", mye: "みぇ",
  rya: "りゃ", ryu: "りゅ", ryo: "りょ", rye: "りぇ",
  gya: "ぎゃ", gyu: "ぎゅ", gyo: "ぎょ", gye: "ぎぇ",
  ja: "じゃ", ju: "じゅ", jo: "じょ", je: "じぇ",
  jya: "じゃ", jyu: "じゅ", jyo: "じょ", jye: "じぇ",
  zya: "じゃ", zyu: "じゅ", zyo: "じょ", zye: "じぇ",
  zia: "じゃ", ziu: "じゅ", zio: "じょ", zie: "じぇ",
  bya: "びゃ", byu: "びゅ", byo: "びょ", bye: "びぇ",
  pya: "ぴゃ", pyu: "ぴゅ", pyo: "ぴょ", pye: "ぴぇ",
  dya: "ぢゃ", dyu: "ぢゅ", dyo: "ぢょ", dye: "ぢぇ",
  dha: "でゃ", dhu: "でゅ", dho: "でょ", dhe: "でぇ", dhi: "でぃ",
  tha: "てゃ", thu: "てゅ", tho: "てょ", the: "てぇ", thi: "てぃ",
  fya: "ふゃ", fyu: "ふゅ", fyo: "ふょ",
  tsu: "つ", shi: "し", chi: "ち",
  xya: "ゃ", xyu: "ゅ", xyo: "ょ",
  lya: "ゃ", lyu: "ゅ", lyo: "ょ",
  xtu: "っ", ltu: "っ", xwa: "ゎ", lwa: "ゎ",
  kwa: "くぁ", gwa: "ぐぁ",
  tsa: "つぁ", tsi: "つぃ", tse: "つぇ", tso: "つぉ",

  // 2-letter combos
  ka: "か", ki: "き", ku: "く", ke: "け", ko: "こ",
  sa: "さ", si: "し", su: "す", se: "せ", so: "そ",
  ta: "た", ti: "ち", tu: "つ", te: "て", to: "と",
  na: "な", ni: "に", nu: "ぬ", ne: "ね", no: "の",
  ha: "は", hi: "ひ", fu: "ふ", he: "へ", ho: "ほ", hu: "ふ",
  ma: "ま", mi: "み", mu: "む", me: "め", mo: "も",
  ya: "や", yu: "ゆ", yo: "よ",
  ra: "ら", ri: "り", ru: "る", re: "れ", ro: "ろ",
  wa: "わ", wo: "を",
  ga: "が", gi: "ぎ", gu: "ぐ", ge: "げ", go: "ご",
  za: "ざ", ji: "じ", zi: "じ", zu: "ず", ze: "ぜ", zo: "ぞ",
  da: "だ", di: "ぢ", du: "づ", de: "で", do: "ど",
  ba: "ば", bi: "び", bu: "ぶ", be: "べ", bo: "ぼ",
  pa: "ぱ", pi: "ぴ", pu: "ぷ", pe: "ぺ", po: "ぽ",
  fa: "ふぁ", fi: "ふぃ", fe: "ふぇ", fo: "ふぉ",
  va: "ゔぁ", vi: "ゔぃ", vu: "ゔ", ve: "ゔぇ", vo: "ゔぉ",
  xa: "ぁ", xi: "ぃ", xu: "ぅ", xe: "ぇ", xo: "ぉ",
  la: "ぁ", li: "ぃ", lu: "ぅ", le: "ぇ", lo: "ぉ",

  // Single vowels and n
  a: "あ", i: "い", u: "う", e: "え", o: "お",
  nn: "ん", "n'": "ん"
};

/**
 * Kana + following Romaji combinations for progressive on-the-fly typing
 */
const KANA_ROMAJI_MERGES: Record<string, Record<string, string>> = {
  "し": { "ya": "しゃ", "yu": "しゅ", "yo": "しょ", "u": "しゅ", "a": "しゃ", "o": "しょ", "e": "しぇ" },
  "ち": { "ya": "ちゃ", "yu": "ちゅ", "yo": "ちょ", "u": "ちゅ", "a": "ちゃ", "o": "ちょ", "e": "ちぇ" },
  "じ": { "ya": "じゃ", "yu": "じゅ", "yo": "じょ", "u": "じゅ", "a": "じゃ", "o": "じょ", "e": "じぇ" },
  "き": { "ya": "きゃ", "yu": "きゅ", "yo": "きょ", "e": "きぇ" },
  "ぎ": { "ya": "ぎゃ", "yu": "ぎゅ", "yo": "ぎょ", "e": "ぎぇ" },
  "に": { "ya": "にゃ", "yu": "にゅ", "yo": "にょ", "e": "にぇ" },
  "ひ": { "ya": "ひゃ", "yu": "ひゅ", "yo": "ひょ", "e": "ひぇ" },
  "び": { "ya": "びゃ", "yu": "びゅ", "yo": "びょ", "e": "びぇ" },
  "ぴ": { "ya": "ぴゃ", "yu": "ぴゅ", "yo": "ぴょ", "e": "ぴぇ" },
  "み": { "ya": "みゃ", "yu": "みゅ", "yo": "みょ", "e": "みぇ" },
  "り": { "ya": "りゃ", "yu": "りゅ", "yo": "りょ", "e": "りぇ" },
  "ふ": { "a": "ふぁ", "i": "ふぃ", "e": "ふぇ", "o": "ふぉ", "ya": "ふゃ", "yu": "ふゅ", "yo": "ふょ" },
  "て": { "i": "てぃ", "yu": "てゅ" },
  "で": { "i": "でぃ", "yu": "でゅ" },
  "う": { "i": "うぃ", "e": "うぇ", "o": "うぉ" }
};

/**
 * Convert Romaji input string to Hiragana on-the-fly.
 * Retains existing Hiragana/Kanji/Katakana characters.
 */
export function romajiToHiragana(text: string): string {
  let result = "";
  let i = 0;
  const len = text.length;

  while (i < len) {
    const char = text[i].toLowerCase();

    // Check if character is not standard ASCII letter
    if (!/[a-z]/.test(char)) {
      result += text[i];
      i++;
      continue;
    }

    // Check for merger with previous converted kana (e.g. "し" + "u" -> "しゅ", "し" + "yu" -> "しゅ")
    if (result.length > 0) {
      const lastKana = result.slice(-1);
      const mergeRule = KANA_ROMAJI_MERGES[lastKana];
      if (mergeRule) {
        if (i + 2 <= len) {
          const chunk2 = text.slice(i, i + 2).toLowerCase();
          if (mergeRule[chunk2]) {
            result = result.slice(0, -1) + mergeRule[chunk2];
            i += 2;
            continue;
          }
        }
        if (mergeRule[char]) {
          result = result.slice(0, -1) + mergeRule[char];
          i += 1;
          continue;
        }
      }
    }

    // Check for double consonants -> small っ (e.g. tt, kk, ss, pp)
    if (
      i + 1 < len &&
      char === text[i + 1].toLowerCase() &&
      char !== "n" &&
      /[bcdfghjklmpqrstvwxyz]/.test(char)
    ) {
      result += "っ";
      i++;
      continue;
    }

    // Check 4-letter combinations
    if (i + 4 <= len) {
      const chunk4 = text.slice(i, i + 4).toLowerCase();
      if (ROMAJI_TO_HIRAGANA_MAP[chunk4]) {
        result += ROMAJI_TO_HIRAGANA_MAP[chunk4];
        i += 4;
        continue;
      }
    }

    // Check 3-letter combinations
    if (i + 3 <= len) {
      const chunk3 = text.slice(i, i + 3).toLowerCase();
      if (ROMAJI_TO_HIRAGANA_MAP[chunk3]) {
        result += ROMAJI_TO_HIRAGANA_MAP[chunk3];
        i += 3;
        continue;
      }
    }

    // Check 2-letter combinations
    if (i + 2 <= len) {
      const chunk2 = text.slice(i, i + 2).toLowerCase();
      if (ROMAJI_TO_HIRAGANA_MAP[chunk2]) {
        result += ROMAJI_TO_HIRAGANA_MAP[chunk2];
        i += 2;
        continue;
      }
    }

    // Check 1-letter combinations (vowels and special n)
    if (ROMAJI_TO_HIRAGANA_MAP[char]) {
      // Special check: trailing 'n' is kept as 'n' until another consonant/vowel or space is pressed,
      // except if followed by a consonant (other than y/vowels) where n becomes ん
      if (char === "n") {
        if (i + 1 < len) {
          const nextChar = text[i + 1].toLowerCase();
          if (nextChar === " " || (/[bcdfghjklmnpqrstvwxz]/.test(nextChar) && nextChar !== "y")) {
            result += "ん";
            i++;
            continue;
          }
        }
      } else {
        result += ROMAJI_TO_HIRAGANA_MAP[char];
        i++;
        continue;
      }
    }

    result += text[i];
    i++;
  }

  return result;
}

/**
 * Handle trailing 'n' at submission time (e.g. converting 'nomimasen' -> 'のみません')
 */
export function finalizeKana(text: string): string {
  let res = romajiToHiragana(text);
  if (res.endsWith("n") || res.endsWith("N")) {
    res = res.slice(0, -1) + "ん";
  }
  return res;
}
