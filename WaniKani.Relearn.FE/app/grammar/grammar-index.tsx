import type { Route } from "../+types/root";
import { Link } from "react-router";
import { grammarArticles } from "./grammarData";
import "../subject/subject.css";
import "./grammar.css";

export function meta() {
  return [
    { title: "Grammar Topics | WaniKani:Relearn" },
    { name: "description", content: "Index of all Japanese grammar parts of speech." },
  ];
}

export default function GrammarIndex() {
  return (
    <div className="grammar-detail-container">
      {/* Hero header card — no back button on the index page */}
      <div className="subject-detail-header">
        <div className="subject-char-bubble grammar-bubble">
          <span className="subject-detail-character japanese-text">文法</span>
        </div>
        <div className="subject-detail-info">
          <span className="subject-type-badge grammar-type-badge">Reference</span>
          <h1 className="subject-detail-primary-meaning">Grammar Topics</h1>
        </div>
      </div>

      <div className="grammar-detail-content">
        <section className="detail-section" style={{ marginTop: 0, paddingTop: 0, borderTop: 'none' }}>
          <h2>Available Topics</h2>
          <div className="grammar-cards-grid">
            {Object.values(grammarArticles).map(a => (
              <Link key={a.id} to={`/grammar/${a.id}`} className="grammar-card-link">
                <div className="grammar-card">
                  <h3 className="grammar-card-title">{a.title}</h3>
                  <p className="grammar-card-snippet">
                    {a.content.length > 120 ? `${a.content.substring(0, 120)}...` : a.content}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
