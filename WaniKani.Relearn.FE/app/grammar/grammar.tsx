import type { Route } from "../+types/root";
import { Link, useNavigate } from "react-router";
import { grammarArticles } from "./grammarData";
import "../subject/subject.css";
import "./grammar.css";


export function meta({ params }: Route.MetaArgs) {
  const article = grammarArticles[params.id as string];
  const title = article ? `${article.title} - Grammar | WaniKani:Relearn` : "Grammar Article Not Found";
  return [
    { title },
    { name: "description", content: article?.content || "Grammar reference" },
  ];
}

export function clientLoader({ params }: Route.ClientLoaderArgs) {
  const id = params.id;
  const article = id ? grammarArticles[id] : null;
  
  if (!article) {
    throw new Response("Grammar article not found", { status: 404 });
  }

  return { article };
}

/** Extract the Japanese characters inside the parentheses of a grammar title, e.g. "Noun (名詞)" → "名詞" */
function extractJapanese(title: string): string {
  const match = title.match(/[（(]([^）)]+)[）)]/);
  return match ? match[1] : "文";
}

/** Strip the parenthetical from the title for a clean display name, e.g. "Noun (名詞)" → "Noun" */
function stripParenthetical(title: string): string {
  return title.replace(/\s*[（(][^）)]+[）)]\s*/, "").trim();
}

export default function Grammar({ loaderData }: Route.ComponentProps) {
  const { article } = loaderData as unknown as { article: typeof grammarArticles[keyof typeof grammarArticles] };
  const navigate = useNavigate();
  const japaneseSymbol = extractJapanese(article.title);
  const displayTitle = stripParenthetical(article.title);

  return (
    <div className="grammar-detail-container">
      {/* Back navigation row */}
      <div className="subject-nav-row">
        <button
          className="back-button"
          onClick={() => navigate("/grammar")}
          aria-label="Go back to grammar topics"
        >
          <span className="back-arrow">←</span>
          <span className="back-label">Back</span>
        </button>
      </div>

      {/* Hero header card */}
      <div className="subject-detail-header">
        <div
          className="subject-char-bubble grammar-bubble"
          style={{ '--char-count': japaneseSymbol.length } as React.CSSProperties}
        >
          <span className="subject-detail-character japanese-text">{japaneseSymbol}</span>
        </div>

        <div className="subject-detail-info">
          <span className="subject-type-badge grammar-type-badge">Grammar</span>
          <h1 className="subject-detail-primary-meaning">{displayTitle}</h1>
        </div>
      </div>

      <div className="grammar-detail-content">
        <section className="detail-section">
          <h2>Definition</h2>
          <p className="grammar-description">{article.content}</p>
        </section>

        <section className="detail-section related-topics">
          <h2>More Topics</h2>
          <div className="parts-of-speech">
            {Object.values(grammarArticles)
              .filter(a => a.id !== article.id)
              .map(a => (
                <Link key={a.id} to={`/grammar/${a.id}`} className="pos-tag">
                  {a.title.split(' ')[0]} {/* Just show the English part for brevity in tags */}
                </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const navigate = useNavigate();

  return (
    <div className="grammar-detail-container">
      {/* Back navigation row */}
      <div className="subject-nav-row">
        <button
          className="back-button"
          onClick={() => navigate("/grammar")}
          aria-label="Go back to grammar topics"
        >
          <span className="back-arrow">←</span>
          <span className="back-label">Back</span>
        </button>
      </div>

      {/* Hero header card */}
      <div className="subject-detail-header">
        <div className="subject-char-bubble grammar-bubble">
          <span className="subject-detail-character japanese-text">文</span>
        </div>
        <div className="subject-detail-info">
          <span className="subject-type-badge grammar-type-badge">Grammar</span>
          <h1 className="subject-detail-primary-meaning">Topic Not Found</h1>
        </div>
      </div>

      <div className="grammar-detail-content">
        <p>Sorry, we don't have an article for this part of speech yet.</p>
        <section className="detail-section related-topics mt-8">
          <h2>Available Topics</h2>
          <div className="parts-of-speech">
            {Object.values(grammarArticles).map(a => (
                <Link key={a.id} to={`/grammar/${a.id}`} className="pos-tag">
                  {a.title.split(' ')[0]}
                </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
