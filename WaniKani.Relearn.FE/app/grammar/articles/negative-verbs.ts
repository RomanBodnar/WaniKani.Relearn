import type { GrammarArticle } from "../grammarData";

export const negativeVerbsArticle: GrammarArticle = {
  id: "negative-verbs",
  title: "Negative Verbs (否定形)",
  section: "basic",
  content: `Negative verbs express that an action does not occur or was not performed.

Conjugation Rules:
1. Ru-verbs (Ichidan): Drop 「る」 and add 「ない」:
   - 食べる → 食べない (to not eat)
   - 見る → 見ない (to not see)

2. U-verbs (Godan): Change ending u-vowel to its a-vowel equivalent and add 「ない」:
   - 書く → 書かない (to not write)
   - 飲む → 飲まない (to not drink)
   - *Special Exception*: Verbs ending in 「う」 change to 「わ」 + ない (e.g. 買う → 買わない).

3. Irregular Verbs:
   - する → しない
   - くる → こない
   - *Special Exception*: ある (to exist inanimate) negates directly to 「ない」 (not あらない).`
};
