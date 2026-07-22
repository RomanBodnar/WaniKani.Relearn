import { Link } from "react-router";
import { useState } from "react";

export const HomeDivider = () => <hr className="home-divider" />;

export const ReadingHeroHeader = () => {
  return (
    <section className="home-hero-section">
      <div className="home-hero-badge">
        <span className="badge-sparkle">✦</span> Japanese Reading Practice & Study Companion
      </div>
      <h1 className="home-hero-headline">
        Master Japanese Through <br />
        <span className="text-gradient">Real Context Sentences</span>
      </h1>
      <p className="home-hero-subtext">
        Translate authentic Japanese sentences built from WaniKani vocabulary.
        Explore interactive morpheme breakdowns, instant item previews, and level-by-level practice.
      </p>
      <div className="home-hero-actions">
        <Link to="/reading-practice" className="btn-hero-primary">
          Start Reading Practice
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </Link>
        <Link to="/kanji" className="btn-hero-secondary">
          Explore Subjects
        </Link>
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
        <span className="demo-card-badge">Live Interactive Preview</span>
        <span className="demo-card-level">Lv. 10</span>
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
            {isRevealed ? "✓ Translation" : "👁 Show Translation"}
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
      <h2 className="home-section-title">Jump Directly into Reading</h2>
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
      icon: "📖",
      badge: "Core Learning",
      title: "Context Reading Practice",
      description: "Translate real WaniKani context sentences level by level with interactive morpheme popups and Focus Mode.",
      link: "/reading-practice",
      cta: "Start Reading",
      colorClass: "feat-reading"
    },
    {
      icon: "📦",
      badge: "Personal Decks",
      title: "My Box & 3D Practice",
      description: "Bookmark kanji and vocabulary to your custom box and review them using the 3D coverflow card deck.",
      link: "/kanji",
      cta: "View My Box",
      colorClass: "feat-kanji"
    },
    {
      icon: "🔍",
      badge: "Instant Previews",
      title: "Item Preview Modals",
      description: "Click any subject card across Kanji, Vocab, and Radicals pages to instantly inspect meanings, readings, and SRS levels.",
      link: "/vocabulary",
      cta: "Browse Items",
      colorClass: "feat-vocab"
    },
    {
      icon: "📚",
      badge: "Grammar Index",
      title: "Grammar & Structure",
      description: "Explore structured Japanese grammar explanations and reference cards categorized by proficiency.",
      link: "/grammar",
      cta: "Explore Grammar",
      colorClass: "feat-grammar"
    }
  ];

  return (
    <section className="home-feature-showcase">
      <h2 className="home-section-title">Everything You Need to Relearn Japanese</h2>
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
