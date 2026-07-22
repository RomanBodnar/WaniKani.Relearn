import type { GrammarArticle } from "../grammarData";
import { basicGrammarArticles } from "./basic-grammar";
import { essentialGrammarArticles } from "./essential-grammar";
import { specialExpressionsArticles } from "./special-expressions";
import { advancedTopicsArticles } from "./advanced-topics";

// Standard 32 tags / categories for tag filtering & backwards compatibility
import { nounArticle } from "./noun";
import { pronounArticle } from "./pronoun";
import { stateOfBeingArticle } from "./state-of-being";
import { particlesTopicArticle } from "./particles-topic";
import { adjectiveArticle } from "./adjective";
import { iAdjectiveArticle } from "./i-adjective";
import { naAdjectiveArticle } from "./na-adjective";
import { noAdjectiveArticle } from "./no-adjective";
import { verbBasicsArticle } from "./verb-basics";
import { ichidanVerbArticle } from "./ichidan-verb";
import { godanVerbArticle } from "./godan-verb";
import { suruVerbArticle } from "./suru-verb";
import { negativeVerbsArticle } from "./negative-verbs";
import { pastTenseArticle } from "./past-tense";
import { particlesVerbArticle } from "./particles-verb";
import { transitiveIntransitiveArticle } from "./transitive-intransitive";
import { nounParticlesArticle } from "./noun-particles";
import { adverbArticle } from "./adverb";
import { politeFormArticle } from "./polite-form";
import { teFormArticle } from "./te-form";
import { potentialFormArticle } from "./potential-form";
import { conditionalsArticle } from "./conditionals";
import { mustHaveToArticle } from "./must-have-to";
import { desireSuggestionsArticle } from "./desire-suggestions";
import { definingDescribingArticle } from "./defining-describing";
import { givingReceivingArticle } from "./giving-receiving";
import { makingRequestsArticle } from "./making-requests";
import { numeralArticle } from "./numeral";
import { counterArticle } from "./counter";
import { suffixArticle } from "./suffix";
import { prefixArticle } from "./prefix";
import { expressionArticle } from "./expression";

export const tagArticles: GrammarArticle[] = [
  nounArticle,
  pronounArticle,
  stateOfBeingArticle,
  particlesTopicArticle,
  adjectiveArticle,
  iAdjectiveArticle,
  naAdjectiveArticle,
  noAdjectiveArticle,
  verbBasicsArticle,
  ichidanVerbArticle,
  godanVerbArticle,
  suruVerbArticle,
  negativeVerbsArticle,
  pastTenseArticle,
  particlesVerbArticle,
  transitiveIntransitiveArticle,
  nounParticlesArticle,
  adverbArticle,
  politeFormArticle,
  teFormArticle,
  potentialFormArticle,
  conditionalsArticle,
  mustHaveToArticle,
  desireSuggestionsArticle,
  definingDescribingArticle,
  givingReceivingArticle,
  makingRequestsArticle,
  numeralArticle,
  counterArticle,
  suffixArticle,
  prefixArticle,
  expressionArticle,
];

// Full 1-to-1 Tae Kim Guide Chapter Topics List
export const chapterArticlesList: GrammarArticle[] = [
  ...basicGrammarArticles,
  ...essentialGrammarArticles,
  ...specialExpressionsArticles,
  ...advancedTopicsArticles,
];

// Combined map matching any topic id (chapters + tags)
export const allGrammarArticles: Record<string, GrammarArticle> = Object.fromEntries([
  ...tagArticles.map((a) => [a.id, a]),
  ...chapterArticlesList.map((a) => [a.id, a]),
]);
