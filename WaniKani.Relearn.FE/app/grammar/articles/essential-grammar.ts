import type { GrammarArticle } from "../grammarData";

export const essentialGrammarArticles: GrammarArticle[] = [
  // 4.1 Polite Form and Verb Stems
  {
    id: "polite-form-stems",
    title: "The Stem of Verbs (Masu-stem)",
    section: "essential",
    group: "Polite Form and Verb Stems",
    chapterRef: "4.1.2",
    content: `The stem of a verb (masu-stem) is the foundation for polite conjugations and many intermediate grammar patterns.

Extracting the Stem:
• Ru-verbs: Remove trailing 「る」 (食べる → 食べ).
• U-verbs: Change last u-vowel sound to i-vowel sound (泳ぐ → 泳ぎ, 飲む → 飲み).
• Exceptions:
  - する → し
  - くる → き

Stem Usage:
• Purpose motion: Combine stem + に + 行く/来る (e.g. 映画を見に行く - go to see a movie).`
  },
  {
    id: "masu-form",
    title: "Using 「〜ます」 to Make Verbs Polite",
    section: "essential",
    group: "Polite Form and Verb Stems",
    chapterRef: "4.1.3",
    content: `To conjugate verbs into polite speech (丁寧語), attach 「〜ます」 conjugations to the verb stem.

Masu Conjugations:
• Plain Non-Past: ます (遊びます)
• Negative: ません (遊びません)
• Past: ました (遊びました)
• Past-Negative: ませんでした (遊びませんでした)`,
    tofuguUrls: [
      { title: "Japanese Verb Polite Form 〜ます", url: "https://www.tofugu.com/japanese-grammar/polite-form-masu/" }
    ]
  },
  {
    id: "desu-form",
    title: "Using 「です」 for Nouns & Adjectives",
    section: "essential",
    group: "Polite Form and Verb Stems",
    chapterRef: "4.1.4",
    content: `For non-verb sentences (nouns and adjectives), polite state-of-being is expressed using 「です」.

Conjugations:
• Nouns / na-adjectives:
  - Non-Past: 静かです
  - Negative: 静かじゃないです / 静かじゃありません
  - Past: 静かでした
  - Past-Negative: 静かじゃなかったです / 静かじゃありませんでした
• i-adjectives: Attach 「です」 to the conjugated i-adjective (かわいいです, かわいくないです, かわいかったです).
• Critical Note: Declarative 「だ」 must be removed before adding 「です」. 「です」 is NOT the same as 「だ」.`,
    tofuguUrls: [
      { title: "Japanese Polite State-of-Being: です", url: "https://www.tofugu.com/japanese-grammar/desu/" }
    ]
  },

  // 4.2 Addressing People
  {
    id: "addressing-people",
    title: "Addressing People & Referring to Oneself",
    section: "essential",
    group: "Addressing People",
    chapterRef: "4.2.1",
    content: `Japanese personal pronouns vary based on politeness, gender, and social relationships.

Referring to Yourself:
• 私 (watashi): Neutral / polite.
• 僕 (boku): Male casual / polite.
• 俺 (ore): Male casual / rough.
• あたし (atashi): Female casual.

Referring to Others:
• Address people by Name + Suffix (さん, くん, ちゃん) or Title (先生, 社長).
• Avoid using 「あなた」 directly unless necessary, as it can sound distant or accusatory.`,
    tofuguUrls: [
      { title: "Japanese Personal Pronouns Guide", url: "https://www.tofugu.com/japanese-grammar/personal-pronouns/" }
    ]
  },

  // 4.3 The Question Marker
  {
    id: "question-marker-ka",
    title: "The Question Marker (「か」)",
    section: "essential",
    group: "The Question Marker",
    chapterRef: "4.3.1",
    content: `The question marker 「か」 is attached to sentence endings to form questions.

Key Rules:
• In polite form: Attach 「か」 to 「〜ます」 or 「〜です」 (e.g. どこですか。, 行きますか。).
• Do NOT attach declarative 「だ」 before 「か」.
• In casual speech: Questions use rising intonation or explanatory 「の」 rather than 「か」.
• Relative Clause Mini-Questions: 「か」 creates mini-embedded questions (e.g. 昨日何を食べたか忘れた - Forgot what I ate yesterday).
• Question Words: 誰か (someone), 何か (something), いつか (sometime), どこか (somewhere).`,
    tofuguUrls: [
      { title: "The Particle か (Question Marker)", url: "https://www.tofugu.com/japanese-grammar/particle-ka/" }
    ]
  },

  // 4.4 Compound Sentences
  {
    id: "chaining-nouns-adjectives",
    title: "Expressing a Sequence of States (Chaining Nouns/Adjectives)",
    section: "essential",
    group: "Compound Sentences",
    chapterRef: "4.4.1",
    content: `To chain multiple nouns or adjectives describing a subject:

• Nouns & Na-adjectives: Attach 「で」 to each item except the last (e.g. 静かで、綺麗で、大好きな部屋).
• I-adjectives & Negative forms: Replace trailing 「い」 with 「くて」 (e.g. 狭くて、暗い部屋).`
  },
  {
    id: "te-form-verbs",
    title: "Expressing a Sequence of Verbs with the Te-form",
    section: "essential",
    group: "Compound Sentences",
    chapterRef: "4.4.2",
    content: `Chain multiple sequential actions using the te-form (て形). The tense of all actions is determined by the last verb.

Te-form Conjugation:
• Positive: Past tense 「た/だ」 → replace with 「て/で」 (食堂に行って、昼ご飯を食べて、昼寝をする).
• Negative: Replace 「い」 from 「ない」 with 「くて」 → 「なくて」 (行かなくて).`,
    tofuguUrls: [
      { title: "The Japanese Verb て-Form Guide", url: "https://www.tofugu.com/japanese-grammar/verb-te-form/" }
    ]
  },
  {
    id: "reason-causation-kara-node",
    title: "Expressing Reason or Causation (「から」・「ので」)",
    section: "essential",
    group: "Compound Sentences",
    chapterRef: "4.4.3",
    content: `Connect two sentences to state a reason [Reason] + から / ので + [Result].

Differences:
• 「から」: Explicitly states reason ("because"). Requires 「だから」 after nouns/na-adjectives.
• 「ので」: Soft causation with explanatory tone ("since / as"). Requires 「なので」 after nouns/na-adjectives. Favored for polite/discourteous explanations.`
  },
  {
    id: "contradiction-ga-kedo",
    title: "Expressing Contradiction (「が」・「けど」・「のに」)",
    section: "essential",
    group: "Compound Sentences",
    chapterRef: "4.4.5",
    content: `Connect contradictory or contrasting clauses:
• 「が」: Polite/formal contrast ("but / however").
• 「けど」 (けれど / けれども): Casual/standard contrast.
• 「のに」: Expresses "despite the fact that..." (Sentence 2 のに Sentence 1). Requires 「なのに」 after non-conjugated nouns/na-adjectives.`
  },
  {
    id: "listing-reasons-shi",
    title: "Expressing Multiple Reasons (「し」)",
    section: "essential",
    group: "Compound Sentences",
    chapterRef: "4.4.6",
    content: `Attach 「し」 to the end of relative clauses to list multiple reasons.

Key Point:
• Non-exhaustive listing of reasons ("and also because...").
• Requires 「だし」 after non-conjugated nouns and na-adjectives (e.g. 優しいし、かっこいいし、面白いから).`
  },
  {
    id: "multiple-actions-tari",
    title: "Expressing Multiple Actions/States (「〜たりする」)",
    section: "essential",
    group: "Compound Sentences",
    chapterRef: "4.4.7",
    content: `List representative actions or fluctuating states using past tense + 「り」 followed by 「する」.

Rules:
• Verbs: Past tense + り ... する (映画を見たり、本を読んだりする).
• States: Past state + り ... する (簡単だったり、難しかったりする).`
  },

  // 4.5 Other uses of the te-form
  {
    id: "enduring-states-te-iru",
    title: "Using 「〜ている」 for Enduring States",
    section: "essential",
    group: "Other uses of the te-form",
    chapterRef: "4.5.1",
    content: `Attach 「いる」 to the te-form of a verb (〜ている) to describe a continuing state or progressive action ("is doing").

Key Points:
• Conjugates as a regular ru-verb (読んでいる, 読んでいない, 読んでいた).
• Casual Speech: 「い」 is frequently dropped in conversation (e.g. 何してるの？ 昼ご飯食べてる。).
• Enduring State vs Action: Some verbs describe states resulting from action rather than progressive action (e.g. 結婚している = is married, 知っている = knows).`,
    tofuguUrls: [
      { title: "Japanese Verb Progressive Form 〜ている", url: "https://www.tofugu.com/japanese-grammar/verb-te-form/" }
    ]
  },
  {
    id: "resultant-states-te-aru",
    title: "Using 「〜てある」 for Resultant States",
    section: "essential",
    group: "Other uses of the te-form",
    chapterRef: "4.5.3",
    content: `Attach 「ある」 to the te-form (〜てある) to express a completed action performed in preparation for something else.

Example:
• 準備は、もうしてあるよ。 (The preparations are already done.)
• 切符を買ったし、ホテルの予約もしてある。 (I bought the tickets and took care of the hotel reservations.)`
  },
  {
    id: "preparation-te-oku",
    title: "Preparation for Future (「〜ておく」)",
    section: "essential",
    group: "Other uses of the te-form",
    chapterRef: "4.5.4",
    content: `Attach 「おく」 to the te-form (〜ておく) to explicitly state an action is performed with the future in mind.

Casual Abbreviation:
• 「〜ておく」 shortens to 「〜とく」 in casual speech (e.g. 晩ご飯を作っとく - Make dinner in advance).`
  },
  {
    id: "motion-verbs-te-iku-kuru",
    title: "Motion Verbs with Te-form (「〜ていく」・「〜てくる」)",
    section: "essential",
    group: "Other uses of the te-form",
    chapterRef: "4.5.5",
    content: `Attach motion verbs 「いく」 (go) and 「くる」 (come) to the te-form to show actions oriented in space or time.

Space / Physical Motion:
• 鉛筆を持っていく (Take pencil to school - hold and go).
• 鉛筆を持ってくる (Bring pencil home - hold and come).

Time Expressions:
• 増えていきます (Will increase toward the future).
• 勉強してきた (Have studied up to the present).`
  },

  // 4.6 Potential Form
  {
    id: "potential-form",
    title: "The Potential Form (可能形)",
    section: "essential",
    group: "Potential Form",
    chapterRef: "4.6.2",
    content: `Conjugating verbs into potential form to express "can do" or "able to do":

Conjugation Rules:
• Ru-verbs: Replace 「る」 with 「られる」 (e.g. 見る → 見られる). Colloquial slang drops ら (食べれる).
• U-verbs: Change ending u-vowel to e-vowel sound + 「る」 (e.g. 書く → 書ける, 泳ぐ → 泳げる).
• Exceptions:
  - する → できる (出来る)
  - くる → こられる
• Object Particle: Direct object 「を」 is generally replaced by 「が」 (e.g. 漢字が書けますか).`,
    tofuguUrls: [
      { title: "Japanese Verb Potential Form Guide", url: "https://www.tofugu.com/japanese-grammar/verb-potential-form/" }
    ]
  },
  {
    id: "visible-audible-mieru-kikoeru",
    title: "Spontaneous Perception (「見える」・「聞こえる」)",
    section: "essential",
    group: "Potential Form",
    chapterRef: "4.6.4",
    content: `Distinct verbs for natural spontaneous visibility and audibility:
• 見える (mieru): To be visible naturally.
• 聞こえる (kikoeru): To be audible naturally.

Difference: Use regular potential (見られる/聞ける) when given an opportunity to see/hear.`
  },

  // 4.7 Using する and なる with に
  {
    id: "suru-naru-ni-particle",
    title: "Using する & なる with Particles (「になる」・「にする」)",
    section: "essential",
    group: "Using する and なる with に",
    chapterRef: "4.7.1",
    content: `Using 「なる」 (become) and 「する」 (decide on) with nouns, adjectives, and verbs:

Nouns & Na-adjectives:
• Noun + になる: Become something (e.g. 医者になった - Became a doctor).
• Noun + にする: Decide on something (e.g. ハンバーガーとサラダにします - I'll go with hamburger and salad).

I-adjectives:
• Change 「い」 to 「く」 + なる/する (e.g. 背が高くなった - Gotten taller, 強くする - Make strong).

Verbs:
• Verb + ことになる / ことにする (Decided that / Decided to).
• Verb + ようになる / ようにする (Become so that / Try to make effort to).`
  },

  // 4.8 Conditionals
  {
    id: "conditionals-to",
    title: "Natural Consequence Conditional (「と」)",
    section: "essential",
    group: "Conditionals",
    chapterRef: "4.8.2",
    content: `The natural consequence conditional 「と」 expresses that if [Condition] occurs, [Result] naturally follows.

Format:
• [Verb/Adjective] + と + [Result]
• [State-of-being] + だと + [Result]
• Examples:
  - ボールを落とすと落ちる。 (If you drop the ball, it falls.)
  - 電気をつけると明るくなる。 (If you turn on light, it gets bright.)`
  },
  {
    id: "conditionals-nara",
    title: "Contextual Conditional (「なら」)",
    section: "essential",
    group: "Conditionals",
    chapterRef: "4.8.3",
    content: `The contextual conditional 「なら」 (nara) expresses what will happen assuming a specific context brought up by the speaker/listener ("If given that...").

Format:
• Attach 「なら」 (or formal 「ならば」) to the context. Do NOT attach 「だ」.
• Example: みんなが行くなら私も行く。 (If given that everybody is going, then I'll go too.)`
  },
  {
    id: "conditionals-ba",
    title: "General Conditional (「ば」)",
    section: "essential",
    group: "Conditionals",
    chapterRef: "4.8.4",
    content: `The general conditional 「ば」 expresses a standard "if" condition.

Conjugation:
• Verbs: Change last u-vowel to e-vowel + 「ば」 (食べる → 食べれば, 待つ → 待てば).
• i-adjectives / Negatives (ない): Drop 「い」 and attach 「ければ」 (おかしい → おかしければ, ない → なければ).
• Nouns & Na-adjectives: Attach 「であれば」 (学生であれば).`
  },
  {
    id: "conditionals-tara",
    title: "Past Conditional (「たら」)",
    section: "essential",
    group: "Conditionals",
    chapterRef: "4.8.5",
    content: `The past conditional 「たら」 (tara) is formed by taking past tense + 「ら」. It focuses on the result that happens after the condition is satisfied.

Conjugation:
• Past tense + ら (自動だった → 自動だったら, 待った → 待ったら, 読んだ → 読んだら).
• Unexpected Past Results: Used when a result took place in the past as an unexpected discovery (e.g. 家に帰ったら、誰もいなかった - When I went home, no one was there).`
  },

  // 4.9 Expressing "must" or "have to"
  {
    id: "must-have-to",
    title: "Must & Obligations (「〜なければ」・「〜なくては」)",
    section: "essential",
    group: "Expressing 'must' or 'have to'",
    chapterRef: "4.9.2",
    content: `Expressing things that must or must not be done using double negatives:

Things That Must Not Be Done:
• Verb te-form + は + だめ / いけない / ならない (入ってはならない, 食べてはだめ).

Things That Must Be Done:
1. Negative te-form + は + だめ/いけない/ならない (行かなくてはならない).
2. Negative verb + と + だめ/いけない (行かないとだめ).
3. Negative ba-conditional + だめ/いけない (行かなければいけない).

Casual Shortcuts:
• Replace 「なくては」 with 「なくちゃ」 (勉強しなくちゃ).
• Replace 「なければ」 with 「なきゃ」 (食べなきゃ).
• Use negative + 「と」 alone (学校に行かないと).`
  },
  {
    id: "ok-to-do-or-not",
    title: "Saying Something is OK to Do or Not Do (「〜てもいい」)",
    section: "essential",
    group: "Expressing 'must' or 'have to'",
    chapterRef: "4.9.5",
    content: `Using te-form + 「も」 + いい / 大丈夫 / 構わない to express permission ("even if you do X, it is OK"):

Examples:
• 全部食べてもいいよ。 (You can go ahead and eat it all.)
• 全部食べなくてもいいよ。 (You don't have to eat it all / OK not to eat.)
• Casual Speech: Shortens to 「〜ていい」 (帰っていい？ - Can I go home?).`
  },

  // 4.10 Desire and Suggestions
  {
    id: "desire-tai",
    title: "Verbs You Want to Do (「〜たい」)",
    section: "essential",
    group: "Desire and Suggestions",
    chapterRef: "4.10.2",
    content: `Expressing desire to perform an action using verb stem + 「たい」.

Rules:
• Verb stem + たい (温泉に行きたい - want to go to hotspring).
• Transforms verb into an i-adjective (行きたくない - don't want to go, 行きたかった - wanted to go).
• Restricted to first-person statements or direct questions.`,
    tofuguUrls: [
      { title: "Expressing Desire with 〜たい", url: "https://www.tofugu.com/japanese-grammar/kudatai-tai/" }
    ]
  },
  {
    id: "desire-hoshii",
    title: "Things You Want or Want Done (「欲しい」)",
    section: "essential",
    group: "Desire and Suggestions",
    chapterRef: "4.10.3",
    content: `Using i-adjective 「欲しい」 (hoshii) to express wanting objects or actions:
• Noun + が欲しい: Want something (ぬいぐるみがある - I want a stuffed doll).
• Verb te-form + ほしい: Want someone to do something (部屋を綺麗にしてほしい - I want the room cleaned up).`
  },
  {
    id: "volitional-form",
    title: "The Volitional Form (Casual & Polite 「〜よう」・「〜ましょう」)",
    section: "essential",
    group: "Desire and Suggestions",
    chapterRef: "4.10.4",
    content: `The volitional form expresses an intention or suggestion ("let's" / "shall we?"):

Casual Volitional:
• Ru-verbs: Drop 「る」 + 「よう」 (食べる → 食べよう).
• U-verbs: Change u-vowel to o-vowel + 「う」 (入る → 入ろう, 行く → 行こう).
• Exceptions: する → しよう, くる → こよう.

Polite Volitional:
• Verb stem + 「〜ましょう」 (行きましょう, 食べましょう).`,
    tofuguUrls: [
      { title: "Japanese Verb Volitional Form Guide", url: "https://www.tofugu.com/japanese-grammar/verb-volitional-form/" }
    ]
  },
  {
    id: "suggestions-tara-dou",
    title: "Making Suggestions (「〜たらどう」)",
    section: "essential",
    group: "Desire and Suggestions",
    chapterRef: "4.10.6",
    content: `Make suggestions using conditional 「たら」 or 「ば」 + 「どう」 ("How about doing X?"):

Examples:
• 銀行に行ったらどうですか。 (How about going to the bank?)
• ご両親と話せばどう？ (How about talking with your parents?)`
  },

  // 4.11 Performing an action on a relative clause
  {
    id: "quotes-to-tte",
    title: "Direct & Interpreted Quotes (「と」・「って」)",
    section: "essential",
    group: "Performing an action on a relative clause",
    chapterRef: "4.11.1",
    content: `Encapsulate clauses into quoted phrases using 「と」:
• Direct Quote: 「寒い」と言った。 (Alice said, "Cold".)
• Interpreted Quote / Thoughts: 授業がないと聞いた (I heard there is no class), カレーを食べようと思った (I thought about eating curry).
• Declarative 「だ」: State-of-being in relative quotes requires 「だ」 (何だと言いましたか).
• Casual Quote 「って」: Replaces 「と」 in casual speech and topic markers (明日雨が降るんだって).`
  },

  // 4.12 Defining and Describing
  {
    id: "defining-describing-to-iu",
    title: "Defining & Describing (「という」)",
    section: "essential",
    group: "Defining and Describing",
    chapterRef: "4.12.2",
    content: `Using 「という」 to define, describe, and name objects or concepts:
• Defining: ルミネというデパート (Department store called Lumine).
• Describing Clauses: 魚に弱いというのは本当？ (Is it true Japanese people are weak to alcohol?).
• Rephrasing: というか (Or rather / I mean), ということ (Meaning that...).
• Slang variations: 「って」, 「て」, 「ゆう」 (てゆうか).`
  },

  // 4.13 Trying something out
  {
    id: "trying-out-te-miru",
    title: "Trying Something Out (「〜てみる」)",
    section: "essential",
    group: "Trying something out",
    chapterRef: "4.13.2",
    content: `Attach 「みる」 to the te-form (〜てみる) to express trying something out / testing an action to see the result.

Examples:
• お好み焼きを食べてみた。 (I tried eating okonomiyaki.)
• 新しいデパートに行ってみる。 (I'll check out the new department store.)`
  },
  {
    id: "attempting-volitional-to-suru",
    title: "Attempting an Action (Volitional + 「とする」)",
    section: "essential",
    group: "Trying something out",
    chapterRef: "4.13.3",
    content: `Combine volitional form + 「とする」 to express attempting to perform an action.

Examples:
• 勉強を避けようとする。 (She attempts to avoid studying.)
• 部屋に入ろうとしている。 (He is attempting to enter the room.)`
  },

  // 4.14 Giving and Receiving
  {
    id: "giving-receiving-ageru-kureru-morau",
    title: "Giving & Receiving (あげる・くれる・もらう)",
    section: "essential",
    group: "Giving and Receiving",
    chapterRef: "4.14.2",
    content: `Express giving and receiving of items or favors (te-form + verb):
• あげる (ageru): Giving outward from speaker's perspective (友達にプレゼントをあげた).
• くれる (kureru): Giving inward to speaker from another's perspective (友達が私にプレゼントをくれた).
• もらう (morau): Receiving from someone (友達にプレゼントをもらった).
• Asking Favors: 貸してくれる？ (Will you lend me?) / 貸してもらえる？ (Can I receive favor of lending?).`
  },

  // 4.15 Making requests
  {
    id: "making-requests-kudasai-nasai",
    title: "Making Requests (「〜ください」・「〜なさい」・Command Form)",
    section: "essential",
    group: "Making requests",
    chapterRef: "4.15.2",
    content: `Requesting actions with varying politeness levels:
• 「〜ください」: Te-form + ください (漢字で書いてください).
• 「〜ちょうだい」: Casual request (書いてちょうだい).
• 「〜なさい」: Firm command with verb stem (聞きなさい).
• Command Form (Imperative): Ru-verbs る→ろ (食べろ), U-verbs u→e (書け). Rarely used in real life except fiction.
• Negative Command: Verb + な (食べるな - Don't eat!).`,
    tofuguUrls: [
      { title: "Making Requests with 〜ください", url: "https://www.tofugu.com/japanese-grammar/kudasai/" }
    ]
  },

  // 4.16 Numbers and Counting
  {
    id: "numbers-counters",
    title: "The Number System & Counters",
    section: "essential",
    group: "Numbers and Counting",
    chapterRef: "4.16.1",
    content: `Japanese number system and counting rules:
• Number units in 4 digits: 万 (10,000), 億 (100,000,000), 兆 (1,000,000,000,000).
• Common Counters:
  - 人 (nin / hitori, futari): People.
  - 本 (hon): Long objects.
  - 枚 (mai): Flat objects.
  - 冊 (satsu): Books.
  - 匹 (hiki): Small animals.
  - 個 (ko): Small round objects.
  - つ (tsu): Generic counter 1-10 (ひとつ, ふたつ...).`,
    tofuguUrls: [
      { title: "Japanese Dates and Time Guide", url: "https://www.tofugu.com/japanese-grammar/date-and-time/" },
      { title: "Comprehensive Japanese Counters List", url: "https://www.tofugu.com/japanese-grammar/counters-list/" }
    ]
  }
];
