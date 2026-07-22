import type { GrammarArticle } from "../grammarData";

export const pastTenseArticle: GrammarArticle = {
  id: "past-tense",
  title: "Past Tense (過去形)",
  section: "basic",
  content: `The past tense indicates that an action took place in the past.

1. Ru-verbs: Drop 「る」 and add 「た」:
   - 食べる → 食べた (ate)
   - 見る → 見た (saw)

2. U-verbs (Euphonic sound changes by ending):
   - す → した (話す → 話した)
   - く → いた (書く → 書いた) *[Exception: 行く → 行った]*
   - ぐ → いだ (泳ぐ → 泳いだ)
   - む, ぶ, ぬ → んだ (飲む → 飲んだ, 遊ぶ →遊んだ, 死ぬ → 死んだ)
   - る, つ, う → った (切る → 切った, 持つ → 持った, 買う → 買った)

3. Past Negative for All Verbs:
   - Convert to negative form (ending in ない), drop い, and add かった:
   - 食べない → 食べなかった (did not eat)
   - 書かない → 書かなかった (did not write)`
};
