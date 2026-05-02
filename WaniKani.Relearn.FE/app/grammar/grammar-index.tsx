import type { Route } from "../+types/root";
import { Link, useNavigate } from "react-router";
import { grammarArticles } from "./grammarData";
import "./grammar.css";

export function meta() {
  return [
    { title: "Grammar Topics | WaniKani:Relearn" },
    { name: "description", content: "Index of all Japanese grammar parts of speech." },
  ];
}

export default function GrammarIndex() {
  const navigate = useNavigate();

  return (
    <div className="grammar-detail-container">
      <div className="grammar-detail-header" style={{ backgroundColor: '#2196F3' }}>
        <h1>Grammar Topics</h1>
      </div>

      <div className="grammar-detail-content">
        <section className="detail-section related-topics" style={{ marginTop: 0, paddingTop: 0, borderTop: 'none' }}>
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
