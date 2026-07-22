import type { GrammarArticle } from "../grammarData";

export const particlesTopicArticle: GrammarArticle = {
  id: "particles-topic",
  title: "Topic & Identifier Particles (は・も・が)",
  section: "basic",
  content: `Particles are small suffixes that define the grammatical function of words in a sentence.

1. The Topic Particle 「は」 (pronounced /wa/):
   - Identifies the topic of the sentence ("As for [X]...").
   - Example: 私は学生です。 (As for me, I am a student.)

2. The Inclusive Topic Particle 「も」:
   - Replaces 「は」 to add the meaning of "also" or "too".
   - Example: トムも学生です。 (Tom is also a student.)

3. The Identifier Particle 「が」:
   - Identifies a specific subject among possibilities ("who/which one is the one that...").
   - Answers questions of "who" or "what".
   - Example: 誰が学生ですか？ ジョンが学生です。 (Who is the student? John is the one who is a student.)`
};
