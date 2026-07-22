import { useState } from "react";
import type { Route } from "../+types/root";
import { Link } from "react-router";
import { chapterArticles, type GrammarSection, type GrammarArticle } from "./grammarData";
import "../subject/subject.css";
import "./grammar.css";

export function meta() {
  return [
    { title: "Grammar Topics | BonPom" },
    { name: "description", content: "Categorized Japanese grammar guide mapped 1-to-1 with Tae Kim's Grammar Reference." },
  ];
}

interface SectionConfig {
  key: GrammarSection;
  title: string;
  subtitle: string;
}

const SECTIONS: SectionConfig[] = [
  {
    key: "basic",
    title: "1. Basic Grammar (基本文法)",
    subtitle: "State-of-being, core particles, adjectives, verb classifications, and basic sentence order.",
  },
  {
    key: "essential",
    title: "2. Essential Grammar (必須文法)",
    subtitle: "Polite speech, te-form, potential form, conditionals, obligations, desire, requests, numbers & counters.",
  },
  {
    key: "special",
    title: "3. Special Expressions (特殊表現)",
    subtitle: "Causative & passive forms, keigo (honorific/humble), unintentional actions, similarity, and comparisons.",
  },
  {
    key: "advanced",
    title: "4. Advanced Topics (上級文法)",
    subtitle: "Formal state-of-being (である), obligations (べき), minimum expectations, tendencies, and literary patterns.",
  },
];

export default function GrammarIndex() {
  const articles = chapterArticles;

  // Track collapsed state for each section (false = open, true = collapsed)
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (key: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const allCollapsed = SECTIONS.every((sec) => collapsedSections[sec.key]);

  const toggleAll = () => {
    const nextState = !allCollapsed;
    const updated: Record<string, boolean> = {};
    SECTIONS.forEach((sec) => {
      updated[sec.key] = nextState;
    });
    setCollapsedSections(updated);
  };

  return (
    <div className="grammar-detail-container">
      {/* Hero header card */}
      <div className="grammar-header">
        <h1 className="grammar-title">Grammar Reference</h1>
        <p className="grammar-subtitle">
          Japanese grammar topics mapped 1-to-1 with Tae Kim's Japanese Grammar Guide.
        </p>
      </div>

      <div className="grammar-detail-content">
        {/* Controls row for Expand All / Collapse All */}
        <div className="grammar-controls-row">
          <span className="grammar-total-count">
            {articles.length} Detailed Articles
          </span>
          <button
            className="grammar-toggle-all-btn"
            onClick={toggleAll}
            type="button"
          >
            {allCollapsed ? "Expand All Sections" : "Collapse All Sections"}
          </button>
        </div>

        {SECTIONS.map((sec) => {
          const sectionArticles = articles.filter(
            (a) => (a.section || "basic") === sec.key
          );

          if (sectionArticles.length === 0) return null;

          const isCollapsed = Boolean(collapsedSections[sec.key]);

          return (
            <section
              key={sec.key}
              className={`grammar-section-block ${isCollapsed ? "collapsed" : "expanded"}`}
            >
              <button
                className="grammar-section-toggle"
                onClick={() => toggleSection(sec.key)}
                type="button"
                aria-expanded={!isCollapsed}
              >
                <div className="grammar-section-title-group">
                  <div className="grammar-heading-row">
                    <h2 className="grammar-section-heading">{sec.title}</h2>
                    <span className="grammar-section-badge">
                      {sectionArticles.length} {sectionArticles.length === 1 ? "article" : "articles"}
                    </span>
                  </div>
                  <p className="grammar-section-subtext">{sec.subtitle}</p>
                </div>

                <div className={`grammar-chevron ${isCollapsed ? "collapsed" : ""}`}>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </button>

              {!isCollapsed && (
                <div className="grammar-cards-grid">
                  {sectionArticles.map((a) => (
                    <Link key={a.id} to={`/grammar/${a.id}`} className="grammar-card-link">
                      <div className="grammar-card">
                        {a.group && (
                          <span className="grammar-card-tag">{a.group}</span>
                        )}
                        <h3 className="grammar-card-title">{a.title}</h3>
                        <p className="grammar-card-snippet">
                          {a.content.length > 120 ? `${a.content.substring(0, 120)}...` : a.content}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
