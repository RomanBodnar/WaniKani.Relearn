import type { Route } from "./+types/grammar";
import { Link, useNavigate, useParams } from "react-router";
import { grammarArticles, type GrammarArticle } from "./grammarData";
import "../subject/subject.css";
import "./grammar.css";

/**
 * Flexible article finder supporting exact IDs, kebab-case, case-insensitive, and slug variations.
 */
export function findArticle(id?: string): GrammarArticle | null {
  if (!id) return null;

  // 1. Direct key match
  if (grammarArticles[id]) return grammarArticles[id];

  // 2. Normalized kebab-case key match (replace underscores/spaces with hyphens, lowercase)
  const normalizedKey = id.toLowerCase().trim().replace(/[\s_]+/g, "-");
  if (grammarArticles[normalizedKey]) return grammarArticles[normalizedKey];

  // 3. Match by article id property (case-insensitive)
  const articles = Object.values(grammarArticles);
  const matchedById = articles.find(
    (a) => a.id.toLowerCase() === normalizedKey || a.id.toLowerCase() === id.toLowerCase()
  );
  if (matchedById) return matchedById;

  // 4. Fuzzy fallback match (id or title contains key)
  const fuzzyMatch = articles.find(
    (a) =>
      a.id.toLowerCase().includes(normalizedKey) ||
      normalizedKey.includes(a.id.toLowerCase()) ||
      a.title.toLowerCase().includes(normalizedKey)
  );
  if (fuzzyMatch) return fuzzyMatch;

  return null;
}

export function meta({ params }: Route.MetaArgs) {
  const article = findArticle(params.id);
  const title = article ? `${article.title} - Grammar | BonPom` : "Grammar Article Not Found";
  return [
    { title },
    { name: "description", content: article?.content || "Grammar reference" },
  ];
}

export function clientLoader({ params }: Route.ClientLoaderArgs) {
  const article = findArticle(params.id);
  
  if (!article) {
    throw new Response("Grammar article not found", { status: 404 });
  }

  return { article };
}

/** Extract Japanese characters inside parentheses of a grammar title, e.g. "Noun (名詞)" → "名詞" */
function extractJapanese(title: string): string {
  const match = title.match(/[（(]([^）)]+)[）)]/);
  return match ? match[1] : "文";
}

/** Strip parenthetical from title for a clean display name, e.g. "Noun (名詞)" → "Noun" */
function stripParenthetical(title: string): string {
  return title.replace(/\s*[（(][^）)]+[）)]\s*/, "").trim();
}

export default function Grammar({ loaderData }: Route.ComponentProps) {
  const routeParams = useParams();
  const article = (loaderData as any)?.article || findArticle(routeParams.id);
  const navigate = useNavigate();

  if (!article) {
    return <TopicNotFound />;
  }

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
          <h2>Overview & Explanation</h2>
          <p className="grammar-description">{article.content}</p>
        </section>

        {article.tofuguUrls && article.tofuguUrls.length > 0 && (
          <section className="detail-section tofugu-reference-section">
            <h2>Deep-Dive Reference on Tofugu</h2>
            <div className="tofugu-links-container">
              {article.tofuguUrls.map((ref, idx) => (
                <a
                  key={idx}
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tofugu-ref-card"
                >
                  <div className="tofugu-ref-header">
                    <span className="tofugu-badge">Tofugu Guide</span>
                    <span className="tofugu-external-icon">↗</span>
                  </div>
                  <h3 className="tofugu-ref-title">{ref.title}</h3>
                  <span className="tofugu-ref-url">{ref.url}</span>
                </a>
              ))}
            </div>
          </section>
        )}

        {(() => {
          const sameGroupArticles = Object.values(grammarArticles).filter(
            a => a.id !== article.id && article.group && a.group === article.group
          );
          const sameSectionArticles = Object.values(grammarArticles).filter(
            a => a.id !== article.id && article.section && a.section === article.section
          );
          const relatedList = sameGroupArticles.length > 0 ? sameGroupArticles : sameSectionArticles;

          if (relatedList.length === 0) return null;

          return (
            <section className="detail-section related-topics">
              <h2>{article.group ? `Related in ${article.group}` : "Related Topics"}</h2>
              <div className="parts-of-speech">
                {relatedList.map(a => (
                  <Link key={a.id} to={`/grammar/${a.id}`} className="pos-tag">
                    {stripParenthetical(a.title)}
                  </Link>
                ))}
              </div>
            </section>
          );
        })()}
      </div>
    </div>
  );
}

function TopicNotFound() {
  const navigate = useNavigate();

  return (
    <div className="grammar-detail-container">
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
        <p>Sorry, we don't have an article for this grammar topic yet.</p>
        <section className="detail-section related-topics mt-8">
          <h2>Available Topics</h2>
          <div className="parts-of-speech">
            {Object.values(grammarArticles).map(a => (
              <Link key={a.id} to={`/grammar/${a.id}`} className="pos-tag">
                {stripParenthetical(a.title)}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  return <TopicNotFound />;
}
