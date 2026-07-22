import type { GrammarArticle } from "../grammarData";

export const specialExpressionsArticles: GrammarArticle[] = [
  // 5.1 Causative and Passive Verbs
  {
    id: "causative-verbs",
    title: "Causative Verbs (「〜させる」)",
    section: "special",
    group: "Causative and Passive Verbs",
    chapterRef: "5.1.1",
    content: `Causative verbs indicate making or letting someone perform an action ("make/let do").

Conjugation Rules (all become ru-verbs):
• Ru-verbs: Replace 「る」 with 「させる」 (食べる → 食べさせる).
• U-verbs: Change u-vowel to a-vowel sound + 「せる」 (話す → 話させる, 飲む → 飲ませる).
• Exceptions: する → させる, くる → こさせる.

Nuance:
• When used with 「あげる」/「くれる」, it almost always means "let someone do" (e.g. 休ませてください - Please let me take day off).`,
    tofuguUrls: [
      { title: "Japanese Verb Causative Form Guide", url: "https://www.tofugu.com/japanese-grammar/verb-causative-form/" }
    ]
  },
  {
    id: "passive-verbs",
    title: "Passive Verbs (「〜される」)",
    section: "special",
    group: "Causative and Passive Verbs",
    chapterRef: "5.1.2",
    content: `Passive verbs indicate an action performed on the subject ("is done to").

Conjugation Rules (all become ru-verbs):
• Ru-verbs: Replace 「る」 with 「られる」 (食べる → 食べられる).
• U-verbs: Change u-vowel to a-vowel sound + 「れる」 (書く → 書かれる, 飲む → 飲まれる).
• Exceptions: する → される, くる → こられる.

Uses:
• Frequently used in essays, articles, and formal polite expressions (e.g. 明日の会議に行かれるんですか - Are you going to tomorrow's meeting?).`,
    tofuguUrls: [
      { title: "Japanese Verb Passive Form Guide", url: "https://www.tofugu.com/japanese-grammar/verb-passive-form/" }
    ]
  },
  {
    id: "causative-passive-verbs",
    title: "Causative-Passive Forms (「〜させられる」)",
    section: "special",
    group: "Causative and Passive Verbs",
    chapterRef: "5.1.4",
    content: `Combination of causative + passive ("is made to do something").

Conjugation:
• Conjugate to causative first, then passive:
  - 食べる → 食べさせる → 食べさせられる (was made to eat).
  - 行く → 行かせる → 行かせられる (was made to go).`
  },

  // 5.2 Honorific and Humble Forms
  {
    id: "honorific-humble",
    title: "Honorific & Humble Forms (敬語)",
    section: "special",
    group: "Honorific and Humble Forms",
    chapterRef: "5.2.1",
    content: `Japanese Keigo (敬語) expresses politeness beyond standard -masu/-desu form:
• Honorific (尊敬語): Elevates actions performed by others.
• Humble (謙譲語): Lowers actions performed by oneself.

Set Expressions Table:
• する → Honorific: なさる / Humble: 致す
• 行く/来る/いる → Honorific: いらっしゃる / Humble: 参る(行く/来る), おる(いる)
• 見る → Honorific: ご覧になる / Humble: 拝見する
• 言う → Honorific: おっしゃる / Humble: 申す・申し上げ
• 食べる/飲む → Honorific: 召し上がる / Humble: いただく
• 知っている → Honorific: ご存知です / Humble: 存じる`
  },
  {
    id: "honorific-humble-conjugations",
    title: "General Honorific & Humble Conjugations",
    section: "special",
    group: "Honorific and Humble Forms",
    chapterRef: "5.2.3",
    content: `Conjugation patterns for verbs without special set expressions using prefix 「御」 (お/ご):

Rules:
• Honorific Pattern: お + stem + になる (e.g. 先生はお見えになりますか).
• Honorific Politeness: お + stem + です (e.g. もうお帰りですか).
• Humble Pattern: お + stem + する (e.g. よろしくお願いします, お聞きしたいことがあります).`
  },

  // 5.3 Things that happen unintentionally
  {
    id: "unintentional-shimau",
    title: "Things That Happen Unintentionally (「〜てしまう」)",
    section: "special",
    group: "Things that happen unintentionally",
    chapterRef: "5.3.1",
    content: `Attach 「しまう」 to the te-form (〜てしまう) to express an action performed unintentionally, by accident, or to completion with regret.

Casual Slang:
• 〜てしまう shortens to 「〜ちゃう」 (宿題を忘れてしまった → 忘れちゃった).
• 〜でしまう shortens to 「〜じゃう」 (死んでしまった → 死んじゃった).`
  },

  // 5.4 Expressions with generic nouns
  {
    id: "generic-nouns-koto-tokoro-mono",
    title: "Expressions with Generic Nouns (こと・ところ・もの)",
    section: "special",
    group: "Expressions with generic nouns",
    chapterRef: "5.4.1",
    content: `Special expressions built with abstract generic nouns:

1. 「こと」 (koto - event/matter):
   - Verb past + ことがある: Expresses past experience ("have done before"). Example: パリに行ったことがある。
2. 「ところ」 (tokoro - abstract place/time):
   - Verb + ところ: Point in time (e.g. 終わったところです - just finished now, これから行くところでした - was just about to go).
3. 「もの」 (mono - generic object):
   - Casual feminine emphasis (e.g. 授業があったもの / 授業があったもん).`
  },

  // 5.5 Expressing levels of certainty
  {
    id: "levels-of-certainty",
    title: "Expressing Levels of Certainty (「かもしれない」・「でしょう」)",
    section: "special",
    group: "Expressing levels of certainty",
    chapterRef: "5.5.1",
    content: `Expressing varying degrees of certainty:

1. Uncertainty 「かもしれない」 (kamoshirenai - "maybe / possibly"):
   - Attach to clause without declarative 「だ」 (雨が降るかもしれない). Casual: 「かも」.
2. Fair Certainty 「でしょう」 (deshou - "probably"):
   - Polite probability (明日も雨でしょう).
3. Strong Certainty 「だろう」 (darou - casual "probably"):
   - Strong casual/masculine assertion (もう寝ているだろう).`
  },

  // 5.6 Expressing amounts
  {
    id: "expressing-amounts",
    title: "Expressing Amounts (「だけ」・「のみ」・「しか」・「すぎる」)",
    section: "special",
    group: "Expressing amounts",
    chapterRef: "5.6.1",
    content: `Particles for degrees and amounts:
• 「だけ」 (dake): "Only / just" (これだけ).
• 「のみ」 (nomi): Formal written version of 「だけ」.
• 「しか」 (shika): "Nothing but..." (requires negative verb: これしかない).
• 「ばかり」 (bakari): "Nothing but / flooded with" (仕事ばっかりだ).
• 「すぎる」 (sugiru): "Too much / exceed" (stem + すぎる → 食べすぎる).
• 「ほど」 (hodo): Extent ("the more X, the more Y" → 食べれば食べるほど).
• Adjective + 「さ」: Amount/degree suffix (高さ - height).`
  },

  // 5.7 Express similarity and hearsay
  {
    id: "similarity-hearsay",
    title: "Similarity & Hearsay (「よう」・「みたい」・「〜そう」・「らしい」)",
    section: "special",
    group: "Express similarity and hearsay",
    chapterRef: "5.7.1",
    content: `Expressions for likeness and reported speech:
1. 「よう」 (you): Likeness in appearance/manner (学生のようだ).
2. 「みたい」 (mitai): Casual similarity (売り切れみたい).
3. 「〜そう」 (sou): Likeness based on conjecture/look (美味しそう - looks tasty).
4. 「〜そうだ」 (sou da): Hearsay ("I heard that...") (雨が降るそうだ).
5. 「〜らしい」 (rashii): Hearsay or characteristic behavior (子供らしくない - doesn't act like a child).
6. 「っぽい」 (ppoi): Casual slang similarity (韓国人っぽい).`
  },

  // 5.8 Comparisons
  {
    id: "comparisons-hou-yori",
    title: "Comparisons (「方」・「より」・「によって」)",
    section: "special",
    group: "Using 方 and よる for comparisons",
    chapterRef: "5.8.1",
    content: `Comparing two things using 「方」 (hou) and 「より」 (yori):
• 「方」 (hou): "The way of / side" (ご飯の方がいい - The rice way is better).
• 「より」 (yori): "Rather than / as opposed to" (パンよりご飯 - Rice rather than bread).
• Superlative: 誰よりも (more than anyone), 何よりも (more than anything).
• Verb Stem + 方 (kata): Way of doing (行き方 - way to go, 食べ方 - way to eat).
• 「によって」 (ni yotte): Dependency ("depending on X").
• 「によると」 (ni yoruto): Source of information ("according to X").`
  },

  // 5.9 Easy / Difficult
  {
    id: "easy-difficult-yasui-nikui",
    title: "Easy or Difficult Actions (「〜やすい」・「〜にくい」)",
    section: "special",
    group: "Saying something is easy or difficult to do",
    chapterRef: "5.9.1",
    content: `Transforming verbs into i-adjectives describing ease:
• Verb stem + やすい (yasui): Easy to do (食べやすい - easy to eat).
• Verb stem + にくい (nikui): Difficult to do (読みにくい - hard to read).
• Variations: 〜がたい (gatai - written/formal), 〜づらい (dzurai - physical/painful).`
  },

  // 5.10 More negative verbs
  {
    id: "more-negative-verbs",
    title: "More Negative Verbs (「ないで」・「ず」・「ぬ」)",
    section: "special",
    group: "More negative verbs",
    chapterRef: "5.10.1",
    content: `Expressing actions without doing another action:
• 「〜ないで」: Doing something without doing X (何も食べないで寝た).
• 「〜ず(に)」: Formal version of ないで (言わずに帰った. Exceptions: する→せず, くる→こず).
• Classical Negative 「〜ぬ」: Classical negative ending (知らぬ).`
  },

  // 5.11 Hypothesizing and Concluding
  {
    id: "hypothesizing-wake-to-suru",
    title: "Hypothesizing & Concluding (「わけ」・「〜とする」)",
    section: "special",
    group: "Hypothesizing and Concluding",
    chapterRef: "5.11.1",
    content: `Reaching conclusions or hypotheses:
• 「わけ」 (wake): Deduced reasoning / conclusion (〜わけがない - no way that...).
• 「〜とする」: Making a hypothesis ("assume that...") (明日行くとする - Assume we go tomorrow).`
  },

  // 5.12 Time-specific actions
  {
    id: "time-specific-actions",
    title: "Time-specific Actions (「ばかり」・「とたん」・「ながら」)",
    section: "special",
    group: "Expressing time-specific actions",
    chapterRef: "5.12.1",
    content: `Actions in specific timeframes:
• Past + ばかり: Just finished recently (食べたばかり).
• Past + とたん(に): Immediately after outside control (窓を開けたとたんに猫が跳んでいった).
• Stem + ながら: Two concurrent actions (テレビを見ながら宿題をする).
• Stem + まくる: Repeat with reckless abandon (ゲームをやりまくっている).`
  },

  // 5.13 Leaving something as is
  {
    id: "leaving-as-is-mama-ppanashi",
    title: "Leaving Something the Way It Is (「まま」・「っぱなし」)",
    section: "special",
    group: "Leaving something the way it is",
    chapterRef: "5.13.1",
    content: `Expressing a lack of change:
• 「まま」 (mama): Unchanged state (このままでいい - OK just like this).
• Verb stem + っぱなし (ppanashi): Left in an unfinished condition due to neglect (テレビをつけっぱなしにする).`
  }
];
