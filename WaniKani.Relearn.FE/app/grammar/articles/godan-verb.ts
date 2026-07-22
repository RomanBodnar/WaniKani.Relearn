import type { GrammarArticle } from "../grammarData";

export const godanVerbArticle: GrammarArticle = {
  id: "godan-verb",
  title: "Godan Verb (五段動詞)",
  section: "basic",
  content: `A Godan verb (五段動詞, also called an u-verb) can end in any u-vowel kana sound: う, く, ぐ, す, つ, ぬ, ぶ, む, or る.

Conjugation Principle:
Godan verbs conjugate by shifting the ending kana across the 5 vowel columns (a, i, u, e, o):
• Negative form (a-row): Shift ending to a-row + ない (e.g. 書く → 書かない, 飲む → 飲まない). Note: う changes to わ (e.g. 買う → 買わない).
• Polite form (i-row): Shift ending to i-row + ます (e.g. 書く → 書きます, 飲む → 飲無ます).
• Dictionary form (u-row): 書く, 飲む.
• Potential / Imperative form (e-row): Shift ending to e-row + る (e.g. 書く → 書ける).
• Volitional form (o-row): Shift ending to o-row + う (e.g. 書く → 書こう).`
};
