import type { GrammarArticle } from "../grammarData";

export const basicGrammarArticles: GrammarArticle[] = [
  // 3.2 Expressing State-of-Being
  {
    id: "state-of-being",
    title: "Declaring State-of-Being (「だ」)",
    section: "basic",
    group: "Expressing State-of-Being",
    chapterRef: "3.2.1",
    content: `State-of-being in Japanese does not use a verb equivalent to English "to be" (am/is/are). Instead, state-of-being is declared by attaching the Hiragana character 「だ」 (da) to a noun or na-adjective.

Key Points:
• Attach 「だ」 to a noun or na-adjective: 人 + だ = 人だ (Is person).
• Declarative statement makes a sentence sound emphatic and forceful.
• In casual greetings among friends, state-of-being is often implied without using 「だ」 (e.g., A: 元気？ B: 元気。).`,
    tofuguUrls: [
      { title: "Japanese State-of-Being: だ & です", url: "https://www.tofugu.com/japanese-grammar/da/" }
    ]
  },
  {
    id: "negative-state-of-being",
    title: "Negative State-of-Being (「じゃない」)",
    section: "basic",
    group: "Expressing State-of-Being",
    chapterRef: "3.2.2",
    content: `To express that something is NOT [X], attach 「じゃない」 (janai) to the noun or na-adjective.

Conjugation Rule:
• Attach 「じゃない」 to noun or na-adjective: 学生 + じゃない = 学生じゃない (Is not student).
• Examples:
  - 友達じゃない (Is not friend)
  - 元気じゃない (Is not well)`,
    tofuguUrls: [
      { title: "Japanese Negative State-of-Being", url: "https://www.tofugu.com/japanese-grammar/da/" }
    ]
  },
  {
    id: "past-state-of-being",
    title: "Past & Past-Negative State-of-Being (「だった」・「じゃなかった」)",
    section: "basic",
    group: "Expressing State-of-Being",
    chapterRef: "3.2.3",
    content: `Past tense state-of-being is expressed by conjugation.

Conjugation Rules:
• Past State-of-Being: Attach 「だった」 (datta) to the noun/na-adjective.
  - Example: 友達だった (Was friend).
• Negative Past State-of-Being: Drop 「い」 from 「じゃない」 and attach 「かった」 → 「じゃなかった」.
  - Example: 友達じゃなかった (Was not friend).

Summary Table:
• Non-Past Positive: 学生(だ) (Is student)
• Non-Past Negative: 学生じゃない (Is not student)
• Past Positive: 学生だった (Was student)
• Past Negative: 学生じゃなかった (Was not student)`,
    tofuguUrls: [
      { title: "Japanese Past State-of-Being: だった", url: "https://www.tofugu.com/japanese-grammar/da/" }
    ]
  },

  // 3.3 Introduction to Particles
  {
    id: "particles-topic",
    title: "The Topic Particle (「は」)",
    section: "basic",
    group: "Introduction to Particles",
    chapterRef: "3.3.2",
    content: `The topic particle identifies what the sentence is about ("As for [X]...").

Key Rules:
• The topic particle is written with Hiragana 「は」, but pronounced /wa/ when used as the topic particle.
• Once a topic is established in conversation, it does not need to be repeated.
• Example: ボブ：アリスは学生？ アリス：うん、学生。 (Bob: Is Alice a student? Alice: Yeah, I am.)`,
    tofuguUrls: [
      { title: "The Japanese Particle は (Topic Marker)", url: "https://www.tofugu.com/japanese-grammar/particle-wa/" }
    ]
  },
  {
    id: "inclusive-particle-mo",
    title: "The Inclusive Topic Particle (「も」)",
    section: "basic",
    group: "Introduction to Particles",
    chapterRef: "3.3.3",
    content: `The inclusive topic particle 「も」 (mo) replaces 「は」 to add the meaning of "also" or "too".

Key Rules:
• Introduces an additional topic consistent with the context.
• Example: アリス：うん、トムも学生。 (Yeah, and Tom is also a student.)
• For negative inclusion: トムも学生じゃない。 (Tom is also not a student.)`,
    tofuguUrls: [
      { title: "The Japanese Particle も (Also / Too)", url: "https://www.tofugu.com/japanese-grammar/particle-mo/" }
    ]
  },
  {
    id: "identifier-particle-ga",
    title: "The Identifier Particle (「が」)",
    section: "basic",
    group: "Introduction to Particles",
    chapterRef: "3.3.4",
    content: `The identifier particle 「が」 (ga) identifies a specific subject among all possible choices, answering a silent question of "who" or "which one".

Difference between 「は」 and 「が」:
• 「は」 introduces a topic ("As for me...").
• 「が」 identifies the specific subject ("I am the one...").
• Example:
  - 誰が学生？ (Who is the student?)
  - ジョンが学生。 (John is the one who is student.)`,
    tofuguUrls: [
      { title: "The Japanese Particle が (Subject/Identifier)", url: "https://www.tofugu.com/japanese-grammar/particle-ga/" }
    ]
  },

  // 3.4 Adjectives
  {
    id: "adjective",
    title: "Properties of Adjectives",
    section: "basic",
    group: "Adjectives",
    chapterRef: "3.4.1",
    content: `Adjectives directly modify nouns that immediately follow them. All Japanese adjectives fall into two distinct categories:
1. na-adjectives (な形容詞)
2. i-adjectives (い形容詞)`
  },
  {
    id: "na-adjective",
    title: "The Na-adjective (な形容詞)",
    section: "basic",
    group: "Adjectives",
    chapterRef: "3.4.2",
    content: `Na-adjectives act essentially like nouns. Conjugation rules for na-adjectives are identical to nouns.

Key Rule:
• When directly modifying a noun, stick 「な」 between the adjective and noun (e.g. 静かな人 - quiet person, 綺麗なお花 - pretty flower).
• Conjugations:
  - 魚が好きだ (Likes fish)
  - 魚が好きじゃない (Does not like fish)
  - 魚が好きだった (Liked fish)
  - 魚が好きじゃなかった (Did not like fish)`,
    tofuguUrls: [
      { title: "Japanese な-Adjectives Guide", url: "https://www.tofugu.com/japanese-grammar/na-adjective/" }
    ]
  },
  {
    id: "i-adjective",
    title: "The I-adjective (い形容詞)",
    section: "basic",
    group: "Adjectives",
    chapterRef: "3.4.3",
    content: `All i-adjectives end in the Hiragana character 「い」 (e.g. 高い, おいしい). Unlike na-adjectives, you do NOT add 「な」 to directly modify a noun.

Conjugation Rules for i-Adjectives:
• Negative: Remove trailing 「い」 and attach 「くない」 (高い → 高くない).
• Past-tense: Remove trailing 「い」 and attach 「かった」 (高い → 高かった).
• Past-Negative: Remove trailing 「い」 from negative and attach 「かった」 (高い → 高くなかった).
• Critical Rule: Do NOT attach declarative 「だ」 to i-adjectives.`,
    tofuguUrls: [
      { title: "Japanese い-Adjectives Guide", url: "https://www.tofugu.com/japanese-grammar/i-adjective/" }
    ]
  },
  {
    id: "no-adjective",
    title: "The No-adjective (の形容詞)",
    section: "basic",
    group: "Adjectives",
    chapterRef: "3.4.4",
    content: `A の-adjective is a noun that modifies another noun using the possessive/modifying particle 「の」 (no).

Examples:
• 日本の文化 (Japanese culture / Culture of Japan)
• 病気の子供 (Sick child / Child of illness)`,
    tofuguUrls: [
      { title: "Japanese の-Adjectives Guide", url: "https://www.tofugu.com/japanese-grammar/no-adjective/" }
    ]
  },
  {
    id: "i-adjective-exception-ii",
    title: "An Annoying Exception (「いい・よい」)",
    section: "basic",
    group: "Adjectives",
    chapterRef: "3.4.4",
    content: `The word for "good" was originally 「よい」 (良い), which over time became 「いい」. 

Conjugation Rule:
While plain non-past is 「いい」, ALL conjugations are derived from 「よい」:
• Positive Non-Past: いい (good)
• Negative: よくない (not good)
• Past: よかった (was good)
• Past-Negative: よくなかった (was not good)

This exception also applies to compound words like 「かっこいい」 → 「かっこよかった」.`,
    tofuguUrls: [
      { title: "Japanese い-Adjectives: いい & よい", url: "https://www.tofugu.com/japanese-grammar/i-adjective/" }
    ]
  },

  // 3.5 Verb Basics
  {
    id: "verb-basics",
    title: "Role of Verbs & Sentence Order",
    section: "basic",
    group: "Verb Basics",
    chapterRef: "3.5.1",
    content: `In Japanese, verbs always come at the end of the clause.

Critical Rule:
• A grammatically complete sentence requires a verb ONLY (including implied state-of-being).
• Example: 食べる。 (Eat. / I eat. / She eats.)`
  },
  {
    id: "ichidan-verb",
    title: "Classifying Ru-verbs (Ichidan)",
    section: "basic",
    group: "Verb Basics",
    chapterRef: "3.5.2",
    content: `Ru-verbs (Ichidan / 一段動詞) always end in 「る」, preceded by an /i/ or /e/ vowel sound.

Examples of Ru-verbs:
• 食べる (taberu - e-vowel preceding ru)
• 起きる (okiru - i-vowel preceding ru)
• 見る (miru - i-vowel preceding ru)
• 寝る (neru - e-vowel preceding ru)`,
    tofuguUrls: [
      { title: "Ichidan (Ru) Verbs Guide", url: "https://www.tofugu.com/japanese-grammar/verb-ichidan/" }
    ]
  },
  {
    id: "godan-verb",
    title: "Classifying U-verbs (Godan)",
    section: "basic",
    group: "Verb Basics",
    chapterRef: "3.5.2",
    content: `U-verbs (Godan / 五段動詞) can end in various u-vowel sounds: う, く, ぐ, す, つ, ぬ, ぶ, む, or る (preceded by /a/, /u/, or /o/ vowel sounds).

Examples of U-verbs:
• 話す (hanasu), 書く (kaku), 泳ぐ (oyogu), 飲む (nomu), 買う (kau), 分かる (wakaru).`,
    tofuguUrls: [
      { title: "Godan (U) Verbs Guide", url: "https://www.tofugu.com/japanese-grammar/verb-godan/" }
    ]
  },
  {
    id: "suru-verb",
    title: "Exception Verbs (「する」・「くる」)",
    section: "basic",
    group: "Verb Basics",
    chapterRef: "3.5.2",
    content: `There are only two exception verbs that are neither ru-verbs nor u-verbs:
1. する (suru - to do)
2. 来る (kuru - to come)`,
    tofuguUrls: [
      { title: "Japanese Irregular Verbs: する", url: "https://www.tofugu.com/japanese-grammar/verb-suru/" },
      { title: "Japanese Irregular Verbs: くる", url: "https://www.tofugu.com/japanese-grammar/verb-kuru/" }
    ]
  },
  {
    id: "iru-eru-u-verbs",
    title: "Appendix: iru/eru U-verbs",
    section: "basic",
    group: "Verb Basics",
    chapterRef: "3.5.3",
    content: `Some u-verbs end in "iru" or "eru" sound endings but conjugate as U-verbs (Godan).

Common Examples:
• 要る (iru - to need)
• 帰る (kaeru - to go home)
• 切る (kiru - to cut)
• 知る (shiru - to know)
• 入る (hairu - to enter)
• 走る (hashiru - to run)`
  },

  // 3.6 Negative Verbs
  {
    id: "negative-verbs",
    title: "Conjugating Verbs into Negative",
    section: "basic",
    group: "Negative Verbs",
    chapterRef: "3.6.1",
    content: `Rules for conjugating verbs into the negative form:

• Ru-verbs: Drop 「る」 and attach 「ない」 (食べる → 食べない).
• U-verbs ending in 「う」: Replace 「う」 with 「わ」 and attach 「ない」 (買う → 買わない).
• All other U-verbs: Replace u-vowel sound with a-vowel equivalent and attach 「ない」 (待つ → 待たない, 飲む → 飲まない).
• Exceptions:
  - する → しない
  - くる → こない
  - ある → ない (Special rule: negative of 「ある」 is simply 「ない」).`,
    tofuguUrls: [
      { title: "Japanese Verb Negative Form 〜ない", url: "https://www.tofugu.com/japanese-grammar/verb-negative-nai/" }
    ]
  },

  // 3.7 Past Tense
  {
    id: "past-tense",
    title: "Past Tense for Ru-verbs & U-verbs",
    section: "basic",
    group: "Past Tense",
    chapterRef: "3.7.1",
    content: `Rules for changing dictionary form to past tense:

1. Ru-verbs: Drop 「る」 and add 「た」 (出る → 出た, 食べる → 食べた).
2. U-verbs (by ending):
   - す → した (話す → 話した)
   - く → いた (書く → 書いた) *[Exception: 行く → 行った]*
   - ぐ → いだ (泳ぐ → 泳いだ)
   - む, ぬ, ぶ → んだ (飲む → 飲んだ, 死ぬ → 死んだ, 遊ぶ → 遊んだ)
   - る, つ, う → った (切る → 切った, 持つ → 持った, 買う → 買った)
3. Past-Negative Tense for All Verbs: Change verb to negative (ending in ない), remove 「い」, and add 「かった」 (捨てる → 捨てない → 捨てなかった).`,
    tofuguUrls: [
      { title: "Japanese Verb Past Form 〜た", url: "https://www.tofugu.com/japanese-grammar/verb-past-form-ta/" }
    ]
  },

  // 3.8 Particles Used with Verbs
  {
    id: "particles-verb",
    title: "Particles Used with Verbs (を・に・へ・で)",
    section: "basic",
    group: "Particles Used with Verbs",
    chapterRef: "3.8.1",
    content: `Overview of essential verb particles:
• 「を」 (wo / o): Direct object particle.
• 「に」 (ni): Target / destination / time particle.
• 「へ」 (e): Directional particle ("heading towards").
• 「で」 (de): Contextual / location of action / means particle.`,
    tofuguUrls: [
      { title: "The Particle を (Direct Object)", url: "https://www.tofugu.com/japanese-grammar/particle-wo/" },
      { title: "The Particle に (Target & Destination)", url: "https://www.tofugu.com/japanese-grammar/particle-ni/" },
      { title: "The Particle で (Context & Location)", url: "https://www.tofugu.com/japanese-grammar/particle-de/" }
    ]
  },
  {
    id: "direct-object-wo",
    title: "The Direct Object (「を」) Particle",
    section: "basic",
    group: "Particles Used with Verbs",
    chapterRef: "3.8.1",
    content: `The 「を」 character signifies the direct object of a verb.

Key Points:
• Written with 「を」, pronounced /o/.
• Motion verbs can also take places as direct objects (e.g. 街を歩く - walk through town).
• When using 「する」 with a noun, 「を」 is optional (e.g. 日本語を勉強する = 日本語勉強する).`,
    tofuguUrls: [
      { title: "The Particle を (Direct Object)", url: "https://www.tofugu.com/japanese-grammar/particle-wo/" }
    ]
  },
  {
    id: "target-particle-ni",
    title: "The Target (「に」) Particle",
    section: "basic",
    group: "Particles Used with Verbs",
    chapterRef: "3.8.2",
    content: `The 「に」 particle specifies a target of a verb.

Key Points:
• Motion target: Target destination (e.g. 日本に行く - go to Japan).
• Location of existence: Target of ある / いる (e.g. 猫は部屋にいる - cat is in the room).
• Time target: Specific time (e.g. 友達は、来年に日本に行く - friend will go to Japan next year).
• Paired with 「から」 (from) and 「まで」 (up to).`,
    tofuguUrls: [
      { title: "The Particle に (Target & Destination)", url: "https://www.tofugu.com/japanese-grammar/particle-ni/" }
    ]
  },
  {
    id: "directional-particle-e",
    title: "The Directional (「へ」) Particle",
    section: "basic",
    group: "Particles Used with Verbs",
    chapterRef: "3.8.3",
    content: `The 「へ」 particle (pronounced /e/) expresses heading towards a general direction.

Difference between 「に」 and 「へ」:
• 「に」 targets the final, intended destination.
• 「へ」 is fuzzy about the final destination and expresses setting out towards a direction (e.g. 日本へ行った - headed towards Japan).`,
    tofuguUrls: [
      { title: "The Particle へ (Direction)", url: "https://www.tofugu.com/japanese-grammar/particle-e/" }
    ]
  },
  {
    id: "contextual-particle-de",
    title: "The Contextual (「で」) Particle",
    section: "basic",
    group: "Particles Used with Verbs",
    chapterRef: "3.8.4",
    content: `The 「で」 particle specifies the context or location in which an action is performed ("by way of").

Examples:
• 映画館で見た。 (Saw at movie theater.)
• バスで帰る。 (Go home by bus.)`,
    tofuguUrls: [
      { title: "The Particle で (Context & Location)", url: "https://www.tofugu.com/japanese-grammar/particle-de/" }
    ]
  },

  // 3.9 Transitive and Intransitive Verbs
  {
    id: "transitive-intransitive",
    title: "Transitive & Intransitive Verbs",
    section: "basic",
    group: "Transitive and Intransitive Verbs",
    chapterRef: "3.9.1",
    content: `Transitive verbs describe actions by an active agent (takes direct object 「を」). Intransitive verbs describe actions occurring without a direct agent (uses subject 「が」).

Common Pairs:
• 落とす (to drop) / 落ちる (to fall)
• 出す (to take out) / 出る (to come out)
• 入れる (to insert) / 入る (to enter)
• 開ける (to open) / 開く (to be opened)
• 閉める (to close) / 閉まる (to be closed)
• つける (to attach/turn on) / つく (to be attached/turn on)
• 消す (to erase/turn off) / 消える (to disappear/go out)`,
    tofuguUrls: [
      { title: "Japanese Transitive and Intransitive Verbs Guide", url: "https://www.tofugu.com/japanese-grammar/transitive-intransitive-verbs/" }
    ]
  },

  // 3.10 Relative Clauses and Sentence Order
  {
    id: "relative-clauses",
    title: "Relative Clauses & Noun Modification",
    section: "basic",
    group: "Relative Clauses and Sentence Order",
    chapterRef: "3.10.1",
    content: `In Japanese, any verb phrase or relative clause can directly modify a noun just like a regular adjective.

Examples:
• 先週映画を見た人は誰？ (Who is the person who watched the movie last week?)
• ボブは、いつも勉強する人だ。 (Bob is a person who always studies.)`
  },
  {
    id: "sentence-order",
    title: "Japanese Sentence Order",
    section: "basic",
    group: "Relative Clauses and Sentence Order",
    chapterRef: "3.10.4",
    content: `The fundamental order of a Japanese sentence is: [Verb at the end].

Key Rules:
• The main verb MUST come at the end of the sentence.
• Anything preceding the verb can come in almost any order because particles define their grammatical roles.`
  },

  // 3.11 Noun-related Particles
  {
    id: "noun-particles",
    title: "Noun-related Particles (と・や・とか)",
    section: "basic",
    group: "Noun-related Particles",
    chapterRef: "3.11.1",
    content: `Particles used to group nouns:
• Inclusive 「と」 (and / with): Exhaustive listing or doing action together with someone (e.g. ナイフとフォーク, 友達と話した).
• Vague Listing 「や」 & 「とか」 (and/or, etc.): Non-exhaustive listing of nouns (e.g. 飲み物やカップ, 靴とかシャツ).`,
    tofuguUrls: [
      { title: "The Particle と (With / And)", url: "https://www.tofugu.com/japanese-grammar/particle-to/" },
      { title: "The Particles や and とか", url: "https://www.tofugu.com/japanese-grammar/particle-ya/" }
    ]
  },
  {
    id: "particle-no",
    title: "The 「の」 Particle (Possessive & Substituted Noun)",
    section: "basic",
    group: "Noun-related Particles",
    chapterRef: "3.11.4",
    content: `The 「の」 particle connects nouns and acts as a generic noun substitute.

Uses:
1. Possessive / Association: ボブの本 (Bob's book), アメリカの大学の学生 (Student of American college).
2. Substituted Noun: Replaces redundant nouns (e.g. 白いのは、かわいい - The white one is cute).`,
    tofuguUrls: [
      { title: "The Particle の (Possessive & Nominalizer)", url: "https://www.tofugu.com/japanese-grammar/particle-no/" }
    ]
  },
  {
    id: "explanatory-no",
    title: "The 「の」 Particle as Explanation (「のだ」・「んだ」)",
    section: "basic",
    group: "Noun-related Particles",
    chapterRef: "3.11.5",
    content: `Attached to sentence endings, 「の」 (or 「のだ」 / 「んだ」) conveys an explanatory tone or seeks an explanation.

Key Points:
• 今は忙しいの / 今は忙しいんだ。 (The thing is that I'm busy now.)
• どこに行くの？ (Where is it that you're going?)
• Requires 「な」 for nouns and na-adjectives (e.g. ジムなのだ / ジムなんだ).`
  },

  // 3.12 Adverbs and Sentence-ending particles
  {
    id: "adverb",
    title: "Properties of Adverbs",
    section: "basic",
    group: "Adverbs and Sentence-ending particles",
    chapterRef: "3.12.1",
    content: `How to change adjectives to adverbs:
• i-adjectives: Substitute trailing 「い」 with 「く」 (早い → 早く - quickly/early).
• na-adjectives: Attach target particle 「に」 (静か → 静かに - quietly).`
  },
  {
    id: "sentence-ending-particles",
    title: "Sentence-ending Particles (「ね」・「よ」・「よね」)",
    section: "basic",
    group: "Adverbs and Sentence-ending particles",
    chapterRef: "3.12.2",
    content: `Sentence-ending particles change the tone or feel of a sentence:
• 「ね」 (ne): Seeks agreement ("isn't it?", "right?"). Example: いい天気だね。
• 「よ」 (yo): Informs listener of new information ("you know"). Example: 時間がないよ。
• 「よね」 (yone): Informs while seeking agreement. Example: ボブは魚が好きなんだよね。`
  }
];
