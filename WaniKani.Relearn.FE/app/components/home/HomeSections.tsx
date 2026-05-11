import { Link, useNavigate } from "react-router";
import { useState } from "react";
import type { Subject } from "~/hooks/Subject";
import { SubjectCard } from "~/components/SubjectCard";

export const HomeDivider = () => <hr className="home-divider" />;

export const SearchHero = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <section className="home-hero">
      <h1 className="home-hero-logo">bonpom</h1>
      <form onSubmit={handleSearch} className="home-search-container">
        <input
          type="text"
          className="home-search-input"
          placeholder="Search radicals, kanji, vocabulary..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="home-search-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
      </form>
    </section>
  );
};

export const NavigationHub = () => {
  const links = [
    { title: "Kanji", path: "/kanji", icon: "漢字", className: "hub-kanji" },
    { title: "Vocabulary", path: "/vocabulary", icon: "語彙", className: "hub-vocabulary" },
    { title: "Radicals", path: "/radicals", icon: "部首", className: "hub-radicals" },
    { title: "Grammar", path: "/grammar", icon: "文法", className: "hub-grammar" },
  ];

  return (
    <section className="home-hub">
      <h2 className="home-section-title">Explore Categories</h2>
      <div className="home-hub-grid">
        {links.map((link) => (
          <Link key={link.path} to={link.path} className={`hub-card ${link.className}`}>
            <span className="hub-card-icon">{link.icon}</span>
            <span className="hub-card-title">{link.title}</span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export const DailySpotlight = ({ subject }: { subject: Subject }) => {
  if (!subject) return null;

  return (
    <section className="home-spotlight">
      <h2 className="home-section-title">
        <span style={{ color: "#FE3365" }}>✦</span> Daily Spotlight
      </h2>
      <div className="spotlight-card">
        <div 
          className="spotlight-char-box"
          style={{ backgroundColor: `var(--color-wk-${subject.Object.replace('_', '-')})` }}
        >
          {subject.Characters || "?"}
        </div>
        <div className="spotlight-info">
          <span className="spotlight-type">{subject.Object.replace('_', ' ')}</span>
          <h3 className="spotlight-meaning">{subject.Meanings[0].Meaning}</h3>
          {subject.Readings && subject.Readings.length > 0 && (
            <p className="spotlight-reading">
              {subject.Readings.find(r => r.Primary)?.Reading || subject.Readings[0].Reading}
            </p>
          )}
          <Link to={`/subject/${subject.Id}`} className="spotlight-link">
            Learn more 
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export const BrowseGrid = ({ subjects }: { subjects: Subject[] }) => {
  return (
    <section className="home-browse">
      <h2 className="home-section-title">Recently Discovered</h2>
      <div className="browse-grid">
        {subjects.map((subject) => (
          <SubjectCard key={subject.Id} subject={subject} variant={subject.Object as any} />
        ))}
      </div>
    </section>
  );
};
