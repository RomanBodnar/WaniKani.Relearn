import type { GrammarArticle } from "../grammarData";

export const ichidanVerbArticle: GrammarArticle = {
  id: "ichidan-verb",
  title: "Ichidan Verb (一段動詞)",
  section: "basic",
  content: `An Ichidan verb (一段動詞, also called a ru-verb) always ends in the character 「る」, preceded by an /i/ or /e/ vowel sound.

Conjugation Principle:
Ichidan verbs have very straightforward conjugations. In most cases, you simply drop the final 「る」 and replace it with the target suffix:
• Dictionary form: 食べる (to eat), 見る (to see)
• Negative form: Drop る + ない → 食べない, 見ない
• Past form: Drop る + た → 食べた, 見た
• Masu (polite) form: Drop る + ます → 食べます, 見ます
• Te-form: Drop る + て → 食べて, 見て`
};
