export interface GrammarArticle {
  id: string; // The kebab-case slug
  title: string; // The display title
  content: string; // The markdown or HTML content
}

export const grammarArticles: Record<string, GrammarArticle> = {
  "noun": {
    id: "noun",
    title: "Noun (名詞)",
    content: "A noun is a word that represents a person, place, thing, or idea. In Japanese, nouns do not conjugate and do not have plural forms."
  },
  "pronoun": {
    id: "pronoun",
    title: "Pronoun (代名詞)",
    content: "A pronoun is a word that replaces a noun. In Japanese, pronouns are often omitted if the context makes it clear who or what is being referred to."
  },
  "adjective": {
    id: "adjective",
    title: "Adjective (形容詞)",
    content: "An adjective is a word that describes a noun. Japanese has two main types of adjectives: い-adjectives and な-adjectives."
  },
  "i-adjective": {
    id: "i-adjective",
    title: "い-Adjective (い形容詞)",
    content: "An い-adjective always ends in the hiragana い (i). They can conjugate to show tense and politeness, much like verbs."
  },
  "na-adjective": {
    id: "na-adjective",
    title: "な-Adjective (な形容詞)",
    content: "A な-adjective behaves similarly to a noun. When modifying a noun, they take the particle な (na) between the adjective and the noun."
  },
  "no-adjective": {
    id: "no-adjective",
    title: "の-Adjective (の形容詞)",
    content: "A の-adjective is a noun that modifies another noun using the particle の (no)."
  },
  "adverb": {
    id: "adverb",
    title: "Adverb (副詞)",
    content: "An adverb is a word that modifies a verb, adjective, or other adverb. They typically do not conjugate."
  },
  "intransitive-verb": {
    id: "intransitive-verb",
    title: "Intransitive Verb (自動詞)",
    content: "An intransitive verb is a verb that does not take a direct object. The action typically happens on its own or describes a state. They are often used with the particle が (ga)."
  },
  "transitive-verb": {
    id: "transitive-verb",
    title: "Transitive Verb (他動詞)",
    content: "A transitive verb is a verb that takes a direct object. Someone or something performs an action on an object. They are often used with the particle を (wo)."
  },
  "ichidan-verb": {
    id: "ichidan-verb",
    title: "Ichidan Verb (一段動詞)",
    content: "An ichidan verb (also known as a ru-verb) always ends in る (ru) and has either an 'i' or 'e' vowel sound right before the る. They have a very simple conjugation pattern."
  },
  "godan-verb": {
    id: "godan-verb",
    title: "Godan Verb (五段動詞)",
    content: "A godan verb (also known as an u-verb) can end in various kana (う, く, ぐ, す, つ, ぬ, ぶ, む, or る). Their conjugation involves changes across the five vowel rows (a, i, u, e, o) of the kana chart."
  },
  "suru-verb": {
    id: "suru-verb",
    title: "Suru Verb (する動詞)",
    content: "A suru verb is formed by combining a noun with the irregular verb する (suru, meaning 'to do'), turning the noun into an action verb."
  },
  "suffix": {
    id: "suffix",
    title: "Suffix (接尾辞)",
    content: "A suffix is an affix attached to the end of a word to alter its meaning or create a new word."
  },
  "prefix": {
    id: "prefix",
    title: "Prefix (接頭辞)",
    content: "A prefix is an affix attached to the beginning of a word to alter its meaning or create a new word."
  },
  "expression": {
    id: "expression",
    title: "Expression (表現)",
    content: "An expression is a set phrase or idiom that has a specific meaning, often not deducible from the individual words alone."
  },
  "numeral": {
    id: "numeral",
    title: "Numeral (数詞)",
    content: "A numeral is a word representing a number. In Japanese, there are two common numbering systems: the native Japanese system and the Sino-Japanese system."
  },
  "counter": {
    id: "counter",
    title: "Counter (助数詞)",
    content: "A counter is a word added to a number when counting items, actions, or time. Japanese has many different counters depending on the type of object being counted (e.g., flat objects, long objects, people)."
  }
};
