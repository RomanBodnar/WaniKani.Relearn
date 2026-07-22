import { allGrammarArticles, chapterArticlesList, tagArticles } from "./articles";

export type GrammarSection = "basic" | "essential" | "special" | "advanced";

export interface TofuguReference {
  title: string;
  url: string;
}

export interface GrammarArticle {
  id: string; // The kebab-case slug
  title: string; // The display title
  section?: GrammarSection; // Main section in Tae Kim's guide
  group?: string; // Sub-grouping / chapter title in Tae Kim's guide
  chapterRef?: string; // Chapter reference number (e.g. 3.2.1)
  content: string; // The text content
  tofuguUrls?: TofuguReference[]; // Reference links to Tofugu grammar articles
}

export const grammarArticles: Record<string, GrammarArticle> = allGrammarArticles;
export const chapterArticles: GrammarArticle[] = chapterArticlesList;
export const categoryTagArticles: GrammarArticle[] = tagArticles;
