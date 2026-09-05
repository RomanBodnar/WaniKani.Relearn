import { Link } from "react-router";
import { useState } from "react";

export const HomeDivider = () => <hr className="home-divider" />;

export const ReadingHeroHeader = () => {
  return (
    <section className="home-hero-section">
      <div className="home-hero-badge">
        <span className="badge-sparkle">✦</span> Japanese Study & Practice Companion
      </div>
      <h1 className="home-hero-headline">
        Practice Japanese with <br />
        <span className="text-gradient">Grammar, Reading & Kanji</span>
      </h1>
      <p className="home-hero-subtext">
        Interactive verb conjugation & Te-form practice, real sentence reading with instant word breakdowns, and comprehensive WaniKani vocabulary decks.
      </p>
      <div className="home-hero-actions">
        <Link to="/grammar" className="btn-hero-primary">
          <span className="btn-icon">⚡</span>
          Grammar & Exercises
        </Link>
        <Link to="/reading-practice" className="btn-hero-secondary">
          <span className="btn-icon">📖</span>
          Sentence Reading
        </Link>
        <Link to="/kanji" className="btn-hero-secondary">
          <span className="btn-icon">🎴</span>
          Kanji & Vocab
        </Link>
      </div>
    </section>
  );
};

export const CorePillarsHub = () => {
  return (
    <section className="home-pillars-section">
      <div className="pillars-grid">
        {/* Pillar 1: Grammar Exercises */}
        <div className="pillar-card pillar-grammar">
          <div className="pillar-top">
            <span className="pillar-icon">⚡</span>
            <span className="pillar-badge badge-grammar">Interactive Exercises</span>
          </div>
          <h3 className="pillar-title">Grammar & Conjugation</h3>
          <p className="pillar-desc">
            Test and drill Japanese verb conjugations with 10-question practice rounds and instant feedback.
          </p>
          <div className="pillar-action-links">
            <Link to="/grammar/exercise/tenses" className="pillar-sublink">
              <span>Past & Present Tenses</span>
              <span className="sublink-arrow">→</span>
            </Link>
            <Link to="/grammar/exercise/te-form" className="pillar-sublink">
              <span>Te-Form & Continuous (〜ている)</span>
              <span className="sublink-arrow">→</span>
            </Link>
            <Link to="/grammar" className="pillar-main-btn">
              Explore Grammar Guide →
            </Link>
          </div>
        </div>

        {/* Pillar 2: Sentence Reading */}
        <div className="pillar-card pillar-reading">
          <div className="pillar-top">
            <span className="pillar-icon">📖</span>
            <span className="pillar-badge badge-reading">Sentence Analysis</span>
          </div>
          <h3 className="pillar-title">Context Reading Practice</h3>
          <p className="pillar-desc">
            Read authentic Japanese sentences broken down by grammatical components with instant furigana and translations.
          </p>
          <div className="pillar-action-links">
            <Link to="/reading-practice" className="pillar-main-btn btn-reading">
              Start Reading Practice →
            </Link>
          </div>
        </div>

        {/* Pillar 3: Kanji & Vocab */}
        <div className="pillar-card pillar-kanji">
          <div className="pillar-top">
            <span className="pillar-icon">🎴</span>
            <span className="pillar-badge badge-kanji">WaniKani Library</span>
          </div>
          <h3 className="pillar-title">Kanji & Vocabulary Decks</h3>
          <p className="pillar-desc">
            Browse 60 levels of radicals, kanji, and vocabulary with instant modal previews and build your own custom study lists.
          </p>
          <div className="pillar-action-links">
            <div className="pillar-quick-tags">
              <Link to="/radicals" className="pillar-tag-link">Radicals</Link>
              <Link to="/kanji" className="pillar-tag-link">Kanji</Link>
              <Link to="/vocabulary" className="pillar-tag-link">Vocabulary</Link>
            </div>
            <Link to="/kanji" className="pillar-main-btn btn-kanji">
              Explore Subjects →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export const LiveSentenceDemo = () => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [activeMorpheme, setActiveMorpheme] = useState<string | null>(null);

  const morphemes = [
    { surface: "毎日", meaning: "Every day", reading: "まいにち", type: "vocab" },
    { surface: "日本語", meaning: "Japanese language", reading: "にほんご", type: "vocab" },
    { surface: "の", meaning: "possessive particle", reading: "の", type: "particle" },
    { surface: "文章", meaning: "Sentence / Text", reading: "ぶんしょう", type: "vocab" },
    { surface: "を", meaning: "object particle", reading: "を", type: "particle" },
    { surface: "読みます", meaning: "To read (polite)", reading: "よみます", type: "vocab" },
    { surface: "。", meaning: "", reading: "", type: "punct" },
  ];

  return (
    <section className="home-demo-section">
      <div className="demo-card-header">
        <span className="demo-card-badge">Interactive Sentence Breakdown</span>
        <span className="demo-card-level">Lv. 10 Sample</span>
      </div>
      <div className="demo-card-body">
        <p className="demo-sentence-ja">
          {morphemes.map((m, idx) => {
            if (m.type === "punct") return <span key={idx}>{m.surface}</span>;
            if (m.type === "particle") return <span key={idx} className="demo-particle">{m.surface}</span>;
            return (
              <button
                key={idx}
                className={`demo-morpheme-btn ${activeMorpheme === m.surface ? "active" : ""}`}
                onClick={() => setActiveMorpheme(activeMorpheme === m.surface ? null : m.surface)}
                title={`Click to view: ${m.meaning}`}
              >
                {m.surface}
              </button>
            );
          })}
        </p>

        {activeMorpheme && (
          <div className="demo-morpheme-popup">
            {(() => {
              const item = morphemes.find(m => m.surface === activeMorpheme);
              if (!item) return null;
              return (
                <div>
                  <span className="popup-reading">{item.reading}</span>
                  <span className="popup-meaning"> — {item.meaning}</span>
                </div>
              );
            })()}
          </div>
        )}

        <div className="demo-reveal-row">
          <button
            className={`demo-reveal-btn ${isRevealed ? "revealed" : ""}`}
            onClick={() => setIsRevealed(!isRevealed)}
          >
            {isRevealed ? "✓ Hide Translation" : "👁 Show Translation"}
          </button>
          {isRevealed && (
            <p className="demo-sentence-en">I read Japanese sentences every day.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export const QuickLevelSelector = () => {
  const levelRanges = [
    { label: "Levels 1–10", desc: "Beginner", min: 1, max: 10, color: "var(--color-vocabulary-block)" },
    { label: "Levels 11–20", desc: "Intermediate", min: 11, max: 20, color: "var(--color-kanji-block)" },
    { label: "Levels 21–30", desc: "Upper Inter.", min: 21, max: 30, color: "var(--color-radical-block)" },
    { label: "Levels 31–60", desc: "Advanced", min: 31, max: 60, color: "#8A3FFC" },
  ];

  return (
    <section className="home-quick-levels">
      <h2 className="home-section-title">Jump Directly into Reading by Level</h2>
      <div className="quick-levels-grid">
        {levelRanges.map((r) => (
          <Link
            key={r.label}
            to={`/reading-practice?minLevel=${r.min}&maxLevel=${r.max}`}
            className="level-pill-card"
          >
            <div className="level-pill-accent" style={{ background: r.color }} />
            <div className="level-pill-info">
              <span className="level-pill-label">{r.label}</span>
              <span className="level-pill-desc">{r.desc}</span>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="level-pill-arrow">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </Link>
        ))}
      </div>
    </section>
  );
};

export const FeatureShowcaseGrid = () => {
  const features = [
    {
      icon: "⚡",
      badge: "Interactive Practice",
      title: "Conjugation Exercises",
      description: "Drill verb tenses, polite speech, and Te-form continuous action (〜ている) with dynamic question generators.",
      link: "/grammar/exercise",
      cta: "Try Exercises",
      colorClass: "feat-grammar"
    },
    {
      icon: "📖",
      badge: "Reading Engine",
      title: "Morpheme Breakdowns",
      description: "Translate real sentences with clickable words, furigana toggles, and instant grammatical role inspection.",
      link: "/reading-practice",
      cta: "Start Reading",
      colorClass: "feat-reading"
    },
    {
      icon: "🔤",
      badge: "Smart Typing",
      title: "Built-In Japanese IME",
      description: "Type Japanese anywhere in the app with automatic Romaji-to-Hiragana conversion and live Kanji candidate autocompletion.",
      link: "/search",
      cta: "Try Search Bar",
      colorClass: "feat-vocab"
    },
    {
      icon: "📦",
      badge: "Custom Decks",
      title: "Personal Study Lists",
      description: "Bookmark difficult kanji and vocabulary to your personal study list for targeted review anytime.",
      link: "/kanji",
      cta: "Open My Box",
      colorClass: "feat-kanji"
    }
  ];

  return (
    <section className="home-feature-showcase">
      <h2 className="home-section-title">Explore All Features</h2>
      <div className="feature-cards-grid">
        {features.map((f) => (
          <div key={f.title} className={`feature-card ${f.colorClass}`}>
            <div className="feature-card-top">
              <span className="feature-card-icon">{f.icon}</span>
              <span className="feature-card-badge">{f.badge}</span>
            </div>
            <h3 className="feature-card-title">{f.title}</h3>
            <p className="feature-card-desc">{f.description}</p>
            <Link to={f.link} className="feature-card-link">
              {f.cta}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};
