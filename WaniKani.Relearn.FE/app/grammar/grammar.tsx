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

/** Extract Japanese characters inside title or parentheses, e.g. "Noun (名詞)" → "名詞", "Declaring (「だ」)" → "だ" */
function extractJapanese(title: string): string {
  // 1. Look for Japanese characters inside Japanese quotation marks e.g. 「だ」
  const quoteMatch = title.match(/「([^」]+)」/);
  if (quoteMatch && quoteMatch[1].length <= 5) {
    return quoteMatch[1].trim();
  }

  // 2. Look for Japanese characters in parentheses e.g. (名詞)
  const parenMatch = title.match(/[（(]([^）)]*[ぁ-んァ-ヶ一-龥々][^）)]*)[）)]/);
  if (parenMatch) {
    const cleaned = parenMatch[1].replace(/[「」〜~・]/g, "").trim();
    if (cleaned.length > 0 && cleaned.length <= 5) {
      return cleaned;
    }
    const firstPart = cleaned.split(/[\s/／・]/)[0];
    if (firstPart && firstPart.length <= 5) {
      return firstPart;
    }
  }

  return "文";
}

/** Strip parenthetical Japanese suffix from title for a clean display name, e.g. "Noun (名詞)" → "Noun" */
function stripParenthetical(title: string): string {
  const hasJapaneseOnlyInParens = /^[ぁ-んァ-ヶ一-龥々「」〜~・\s/／]+$/;
  const match = title.match(/[（(]([^）)]+)[）)]/);
  if (match && hasJapaneseOnlyInParens.test(match[1].trim())) {
    return title.replace(/\s*[（(][^）)]+[）)]\s*/, "").trim();
  }
  return title.trim();
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

        {["past-tense", "polite-form", "verb-basics", "godan-verb", "ichidan-verb", "suru-verb"].includes(article.id) && (
          <section className="detail-section practice-callout-section">
            <div className="grammar-exercise-banner">
              <div className="exercise-banner-content">
                <div className="exercise-banner-tag">Practice This Topic</div>
                <h2 className="exercise-banner-title">Verb Conjugation Exercise</h2>
                <p className="exercise-banner-desc">
                  Practice past and present tense conjugations with 10 questions using vocabulary from your database.
                </p>
              </div>
              <Link to="/grammar/exercise" className="exercise-banner-btn">
                Start Practice →
              </Link>
            </div>
          </section>
        )}

        {article.tofuguUrls && article.tofuguUrls.length > 0 && (
          <section className="detail-section tofugu-reference-section">
            <h2>Deep-Dive Reference on Tofugu</h2>
            <div className="tofugu-links-container">
              {article.tofuguUrls.map((ref: { url: string; title: string }, idx: number) => (
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
