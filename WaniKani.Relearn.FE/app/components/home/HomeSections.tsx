import { Link } from "react-router";
import { useState, useEffect } from "react";
import { useBookmarks } from "~/hooks/useBookmarks";
import { loadBookmarkAsync } from "~/hooks/useReadingSentences";
import type { ReadingBookmark } from "~/types/reading";
import { SubjectCard } from "../SubjectCard";
import PracticeCarousel from "../PracticeCarousel";
import { ToggleSwitch } from "../ToggleSwitch";

export const HomeDivider = () => <hr className="home-divider" />;

export const ReadingHeroHeader = () => {
  const handleScrollToDemo = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const demoEl = document.getElementById("demo-sentence-section");
    if (demoEl) {
      demoEl.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <section className="home-hero-section">
      <h1 className="home-hero-headline">
        Practice Japanese with <br />
        <span className="text-gradient">Grammar, Reading & Kanji</span>
      </h1>
      <p className="home-hero-subtext">
        Interactive verb conjugation & Te-form practice, real sentence reading with instant word breakdowns, and comprehensive WaniKani vocabulary decks.
      </p>
      <div className="home-hero-actions">
        <Link to="/grammar" className="btn-hero-primary">
          Start Practicing
          <span className="btn-hero-arrow" aria-hidden="true">→</span>
        </Link>
        <a href="#demo-sentence-section" onClick={handleScrollToDemo} className="btn-hero-secondary">
          <span className="btn-icon">✨</span>
          Try Live Demo
          <span className="btn-hero-arrow-down" aria-hidden="true">↓</span>
        </a>
      </div>
    </section>
  );
};

export const HomeUserDashboard = () => {
  const { isLoggedIn, bookmarks } = useBookmarks();
  const [readingBookmark, setReadingBookmark] = useState<ReadingBookmark | null>(null);

  useEffect(() => {
    if (!isLoggedIn) return;

    let isMounted = true;
    loadBookmarkAsync(true)
      .then((b) => {
        if (isMounted) {
          setReadingBookmark(b);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [isLoggedIn]);

  if (!isLoggedIn) return null;

  const radicalCount = bookmarks.filter((b) => b.Object?.toLowerCase() === "radical").length;
  const kanjiCount = bookmarks.filter((b) => b.Object?.toLowerCase() === "kanji").length;
  const vocabCount = bookmarks.filter(
    (b) => b.Object?.toLowerCase() === "vocabulary" || b.Object?.toLowerCase() === "kanavocabulary"
  ).length;

  const handleScrollToMyBox = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const deckEl = document.getElementById("home-my-box-deck");
    if (deckEl) {
      e.preventDefault();
      deckEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const readingParams = readingBookmark
    ? `?page=${readingBookmark.page}${
        readingBookmark.minLevel !== undefined && readingBookmark.minLevel !== null
          ? `&minLevel=${readingBookmark.minLevel}`
          : ""
      }${
        readingBookmark.maxLevel !== undefined && readingBookmark.maxLevel !== null
          ? `&maxLevel=${readingBookmark.maxLevel}`
          : ""
      }`
    : "";

  return (
    <section className="home-dashboard-section">
      <div className="home-dashboard-grid">
        {/* Card 1: Resume Reading */}
        <div className="home-dashboard-card card-resume-reading">
          <div className="dashboard-card-top">
            <span className="dashboard-card-icon">📖</span>
            <span className="dashboard-card-tag tag-reading">Reading Practice</span>
          </div>

          <div className="dashboard-card-body">
            <h3 className="dashboard-card-title">
              {readingBookmark ? "Resume Reading" : "Start Reading"}
            </h3>
            {readingBookmark ? (
              <div className="dashboard-reading-meta">
                <span className="reading-meta-badge badge-page">Page {readingBookmark.page}</span>
                {readingBookmark.minLevel && readingBookmark.maxLevel ? (
                  <span className="reading-meta-badge badge-levels">
                    Levels {readingBookmark.minLevel}–{readingBookmark.maxLevel}
                  </span>
                ) : (
                  <span className="reading-meta-badge badge-levels">All Levels</span>
                )}
                {readingBookmark.sentenceIndex !== undefined && (
                  <span className="reading-meta-badge badge-sentence">
                    Sentence #{readingBookmark.sentenceIndex + 1}
                  </span>
                )}
              </div>
            ) : null}
            <p className="dashboard-card-desc">
              {readingBookmark
                ? "Pick up right where you left off in your authentic sentence reading practice."
                : "Pick up authentic Japanese sentences with instant furigana breakdowns."}
            </p>
          </div>

          <div className="dashboard-card-footer">
            <Link
              to={`/reading-practice${readingParams}`}
              className="dashboard-action-btn btn-reading-action"
            >
              {readingBookmark ? "Continue Reading →" : "Start Reading Practice →"}
            </Link>
          </div>
        </div>

        {/* Card 2: My Box Summary */}
        <div className="home-dashboard-card card-my-box">
          <div className="dashboard-card-top">
            <span className="dashboard-card-icon">📦</span>
            <span className="dashboard-card-tag tag-my-box">Personal Study Box</span>
          </div>

          <div className="dashboard-card-body">
            <h3 className="dashboard-card-title">
              {bookmarks.length > 0
                ? `${bookmarks.length} Saved Subject${bookmarks.length === 1 ? "" : "s"}`
                : "My Box is Empty"}
            </h3>
            <p className="dashboard-card-desc">
              {bookmarks.length > 0 ? (
                <span className="dashboard-counts-breakdown">
                  {radicalCount > 0 && <span className="count-tag radical-count">{radicalCount} Radicals</span>}
                  {kanjiCount > 0 && <span className="count-tag kanji-count">{kanjiCount} Kanji</span>}
                  {vocabCount > 0 && <span className="count-tag vocab-count">{vocabCount} Vocab</span>}
                </span>
              ) : (
                "Bookmark difficult radicals, kanji, and vocabulary while studying to drill them here."
              )}
            </p>
          </div>

          <div className="dashboard-card-footer">
            {bookmarks.length > 0 ? (
              <div className="dashboard-action-group">
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent("start-home-practice"))}
                  className="dashboard-action-btn btn-my-box-action"
                >
                  Start Practice ⚡
                </button>
                <a
                  href="#home-my-box-deck"
                  onClick={handleScrollToMyBox}
                  className="dashboard-sub-action-link"
                >
                  Browse Grid ({bookmarks.length}) ↓
                </a>
              </div>
            ) : (
              <Link to="/kanji" className="dashboard-action-btn btn-my-box-action">
                Browse Kanji to Save →
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export const HomeMyBoxDeck = () => {
  const { isLoggedIn, bookmarks } = useBookmarks();
  const [isBoxOpen, setIsBoxOpen] = useState(true);
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const [practiceStartIndex, setPracticeStartIndex] = useState(0);
  const [typeFilter, setTypeFilter] = useState<"all" | "radical" | "kanji" | "vocabulary">("all");

  useEffect(() => {
    const handleStartPractice = () => {
      setIsBoxOpen(true);
      setIsPracticeMode(true);
      const deckEl = document.getElementById("home-my-box-deck");
      if (deckEl) {
        deckEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    window.addEventListener("start-home-practice", handleStartPractice);
    return () => window.removeEventListener("start-home-practice", handleStartPractice);
  }, []);

  if (!isLoggedIn || bookmarks.length === 0) return null;

  const radicalCount = bookmarks.filter((b) => b.Object?.toLowerCase() === "radical").length;
  const kanjiCount = bookmarks.filter((b) => b.Object?.toLowerCase() === "kanji").length;
  const vocabCount = bookmarks.filter(
    (b) => b.Object?.toLowerCase() === "vocabulary" || b.Object?.toLowerCase() === "kanavocabulary"
  ).length;

  const filteredBookmarks = bookmarks.filter((b) => {
    if (typeFilter === "all") return true;
    const obj = b.Object?.toLowerCase();
    if (typeFilter === "vocabulary") return obj === "vocabulary" || obj === "kanavocabulary";
    return obj === typeFilter;
  });

  return (
    <section id="home-my-box-deck" className="home-my-box-section">
      <div className="my-box-deck-container home-my-box-container">
        <div className="home-my-box-header">
          <div className="home-my-box-header-left">
            <button
              onClick={() => setIsBoxOpen(!isBoxOpen)}
              className="my-box-collapse-btn"
              aria-label={isBoxOpen ? "Collapse My Box" : "Expand My Box"}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  transform: isBoxOpen ? "rotate(90deg)" : "none",
                  transition: "transform 0.2s",
                }}
              >
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
            <h2 className="home-my-box-title">
              My Study Box
              <span className="home-my-box-badge">{bookmarks.length}</span>
            </h2>
          </div>

          <div className="home-my-box-controls">
            {/* Type filter tabs */}
            <div className="home-my-box-type-tabs">
              <button
                className={`type-tab-btn ${typeFilter === "all" ? "active" : ""}`}
                onClick={() => setTypeFilter("all")}
              >
                All ({bookmarks.length})
              </button>
              {radicalCount > 0 && (
                <button
                  className={`type-tab-btn tab-radical ${typeFilter === "radical" ? "active" : ""}`}
                  onClick={() => setTypeFilter("radical")}
                >
                  Radicals ({radicalCount})
                </button>
              )}
              {kanjiCount > 0 && (
                <button
                  className={`type-tab-btn tab-kanji ${typeFilter === "kanji" ? "active" : ""}`}
                  onClick={() => setTypeFilter("kanji")}
                >
                  Kanji ({kanjiCount})
                </button>
              )}
              {vocabCount > 0 && (
                <button
                  className={`type-tab-btn tab-vocab ${typeFilter === "vocabulary" ? "active" : ""}`}
                  onClick={() => setTypeFilter("vocabulary")}
                >
                  Vocabulary ({vocabCount})
                </button>
              )}
            </div>

            <div className="home-my-box-divider"></div>

            <ToggleSwitch
              checked={isPracticeMode}
              onChange={setIsPracticeMode}
              label="Practice Mode"
              color="var(--color-pink-hot, #FE3365)"
            />
          </div>
        </div>

        {isBoxOpen && (
          isPracticeMode ? (
            <div key="practice-mode" className="mode-transition-enter" style={{ marginTop: "20px" }}>
              <PracticeCarousel
                subjects={filteredBookmarks}
                initialIndex={practiceStartIndex}
              />
            </div>
          ) : (
            <div
              key="grid-mode"
              className="subjects-grid my-box-grid mode-transition-enter"
              style={{ justifyContent: "flex-start", marginTop: "20px", marginBottom: 0 }}
            >
              {filteredBookmarks.map((subject, index) => (
                <SubjectCard
                  key={subject.Id}
                  subject={subject}
                  onClick={() => {
                    setPracticeStartIndex(index);
                    setIsPracticeMode(true);
                  }}
                />
              ))}
            </div>
          )
        )}
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
            <Link to="/grammar/exercise/tenses" className="pillar-sublink pillar-sublink-grammar">
              <span>Past & Present Tenses</span>
              <span className="sublink-arrow">→</span>
            </Link>
            <Link to="/grammar/exercise/te-form" className="pillar-sublink pillar-sublink-grammar">
              <span>Te-Form & Continuous (〜ている)</span>
              <span className="sublink-arrow">→</span>
            </Link>
            <Link to="/grammar" className="pillar-main-btn btn-grammar">
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
            <Link to="/reading-practice" className="pillar-sublink pillar-sublink-reading">
              <span>Interactive Furigana Breakdowns</span>
              <span className="sublink-arrow">→</span>
            </Link>
            <Link to="/reading-practice?minLevel=1&maxLevel=10" className="pillar-sublink pillar-sublink-reading">
              <span>Practice by Level (JLPT & WaniKani)</span>
              <span className="sublink-arrow">→</span>
            </Link>
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
            <Link to="/kanji" className="pillar-sublink pillar-sublink-kanji">
              <span>Radicals & Kanji Library</span>
              <span className="sublink-arrow">→</span>
            </Link>
            <Link to="/vocabulary" className="pillar-sublink pillar-sublink-kanji">
              <span>Vocabulary Decks & "My Box"</span>
              <span className="sublink-arrow">→</span>
            </Link>
            <Link to="/kanji" className="pillar-main-btn btn-kanji">
              Explore All Subjects →
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
    <section id="demo-sentence-section" className="home-demo-section">
      <div className="demo-card-header">
        <div className="demo-card-header-left">
          <span className="demo-card-badge">Interactive Sentence Breakdown</span>
          <span className="demo-onboarding-hint">
            <span className="hint-hand" aria-hidden="true">👆</span> Click any word for instant breakdown
          </span>
        </div>
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
    { label: "Levels 1–10", desc: "Beginner", stage: "JLPT N5", min: 1, max: 10, color: "var(--color-vocabulary-block)" },
    { label: "Levels 11–20", desc: "Intermediate", stage: "JLPT N4", min: 11, max: 20, color: "var(--color-kanji-block)" },
    { label: "Levels 21–30", desc: "Upper Inter.", stage: "JLPT N3", min: 21, max: 30, color: "var(--color-radical-block)" },
    { label: "Levels 31–60", desc: "Advanced", stage: "JLPT N2–N1", min: 31, max: 60, color: "#8A3FFC" },
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
              <div className="level-pill-header">
                <span className="level-pill-label">{r.label}</span>
                <span className="level-pill-stage" style={{ color: r.color }}>
                  {r.stage}
                </span>
              </div>
              <span className="level-pill-desc">{r.desc} Reading Practice</span>
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
      description: "Drill Japanese verb tenses, polite speech, and Te-form continuous action (〜ている) with 10-question practice rounds and instant feedback.",
      link: "/grammar/exercise",
      cta: "Try Exercises",
      colorClass: "feat-grammar"
    },
    {
      icon: "📖",
      badge: "Reading Engine",
      title: "Morpheme Breakdowns",
      description: "Read real Japanese sentences with clickable word breakdowns, toggleable furigana readings, and grammatical role analysis.",
      link: "/reading-practice",
      cta: "Start Reading",
      colorClass: "feat-reading"
    },
    {
      icon: "🔤",
      badge: "Smart Typing",
      title: "Built-In Japanese IME",
      description: "Search kanji and vocabulary naturally anywhere in the app with automatic Romaji-to-Kana conversion and live candidate autocompletion.",
      link: "/search",
      cta: "Try Search Bar",
      colorClass: "feat-vocab"
    },
    {
      icon: "📦",
      badge: "Custom Decks",
      title: "Personal Study Lists",
      description: "Bookmark difficult kanji and vocabulary directly to \"My Box\" for focused personal review sessions anytime.",
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
              <div className="feature-card-icon-wrap">
                <span className="feature-card-icon">{f.icon}</span>
              </div>
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
