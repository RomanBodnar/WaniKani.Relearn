/**
 * Lightweight Romaji-to-Hiragana converter for interactive Japanese typing input.
 */

const ROMAJI_TO_HIRAGANA_MAP: Record<string, string> = {
  // Triple chars (e.g. sshe, ttsu, etc. handled by double consonant rule, but special cases here)
  kya: "きゃ", kyu: "きゅ", kyo: "きょ",
  sha: "しゃ", shu: "しゅ", sho: "しょ", she: "しぇ",
  cha: "ちゃ", chu: "ちゅ", cho: "ちょ", che: "ちぇ",
  nya: "にゃ", nyu: "にゅ", nyo: "にょ",
  hya: "ひゃ", hyu: "ひゅ", hyo: "ひょ",
  mya: "みゃ", myu: "みゅ", myo: "みょ",
  rya: "りゃ", ryu: "りゅ", ryo: "りょ",
  gya: "ぎゃ", gyu: "ぎゅ", gyo: "ぎょ",
  ja: "じゃ", ju: "じゅ", jo: "じょ", jya: "じゃ", jyu: "じゅ", jyo: "じょ",
  bya: "びゃ", byu: "びゅ", byo: "びょ",
  pya: "ぴゃ", pyu: "ぴゅ", pyo: "ぴょ",
  tsu: "つ", shi: "し", chi: "ち",

  // Double chars
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

  // Single vowels and n
  a: "あ", i: "い", u: "う", e: "え", o: "お",
  nn: "ん", "n'": "ん"
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

    // Check 1-letter combinations (vowels)
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
