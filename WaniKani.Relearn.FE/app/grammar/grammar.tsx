import type { Route } from "../+types/root";
import { Link, useNavigate } from "react-router";
import { grammarArticles } from "./grammarData";
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

export default function Grammar({ loaderData }: Route.ComponentProps) {
  const { article } = loaderData as unknown as { article: typeof grammarArticles[keyof typeof grammarArticles] };
  const navigate = useNavigate();

  return (
    <div className="grammar-detail-container">
      <div className="grammar-detail-header">
        <button
          className="back-button header-back-button"
          onClick={() => navigate("/grammar")}
          aria-label="Go back to grammar topics"
        >
          ←
        </button>
        <h1>{article.title}</h1>
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
      <div className="grammar-detail-header" style={{ backgroundColor: '#ff5e5e' }}>
        <button
          className="back-button header-back-button"
          onClick={() => navigate("/grammar")}
          aria-label="Go back to grammar topics"
        >
          ←
        </button>
        <h1>Grammar Topic Not Found</h1>
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
