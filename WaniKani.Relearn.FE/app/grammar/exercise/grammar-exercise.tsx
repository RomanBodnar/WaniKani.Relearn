import { useState, useEffect, useCallback } from "react";
import { Link, useParams, useSearchParams, useNavigate } from "react-router";
import type { Route } from "./+types/grammar-exercise";
import { useVerbPool, type ExerciseCategory } from "./useVerbPool";
import { ExerciseQuestionCard } from "./ExerciseQuestionCard";
import { ExerciseResultModal, type SessionResultItem } from "./ExerciseResultModal";
import { LoadingSpinner } from "~/components/LoadingSpinner";
import { ErrorDisplay } from "~/components/ErrorDisplay";
import type { QuestionData } from "./conjugationEngine";
import "./grammar-exercise.css";

export function meta({ params }: Route.MetaArgs) {
  const isTeForm = params?.type === "te-form";
  if (isTeForm) {
    return [
      { title: "Te-Form & Continuous Action Practice | BonPom Grammar" },
      { name: "description", content: "Practice Japanese Te-Form (〜て / 〜で) and expressing continuous action (〜ている / 〜ています)." }
    ];
  }
  return [
    { title: "Verb Tense Conjugation Practice | BonPom Grammar" },
    { name: "description", content: "Practice conjugating Japanese verbs between past and present forms in dictionary and polite masu forms." }
  ];
}

export default function GrammarExercise() {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const typeSlug = params.type || searchParams.get("type");
  const activeCategory: ExerciseCategory = typeSlug === "te-form" ? "te_form" : "tenses";

  const { verbs, isLoading, error, generateSession } = useVerbPool();

  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [sessionResults, setSessionResults] = useState<SessionResultItem[]>([]);
  const [isSessionComplete, setIsSessionComplete] = useState<boolean>(false);

  // Initialize or re-generate questions when category or verbs change
  useEffect(() => {
    if (verbs && verbs.length > 0) {
      const initialQuestions = generateSession(10, activeCategory);
      setQuestions(initialQuestions);
      setCurrentIndex(0);
      setSessionResults([]);
      setIsSessionComplete(false);
    }
  }, [verbs, activeCategory, generateSession]);

  const handleSelectCategory = (newCat: ExerciseCategory) => {
    if (newCat === activeCategory) return;
    const targetUrl = newCat === "te_form" ? "/grammar/exercise/te-form" : "/grammar/exercise/tenses";
    navigate(targetUrl);
  };

  const handleRestart = useCallback(() => {
    const newQuestions = generateSession(10, activeCategory);
    setQuestions(newQuestions);
    setCurrentIndex(0);
    setSessionResults([]);
    setIsSessionComplete(false);
  }, [generateSession, activeCategory]);

  const handleAnswerSubmitted = useCallback((result: SessionResultItem) => {
    setSessionResults(prev => [...prev, result]);
  }, []);

  const handleNextQuestion = useCallback(() => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsSessionComplete(true);
    }
  }, [currentIndex, questions.length]);

  if (isLoading) {
    return (
      <div className="grammar-exercise-container">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || (!isLoading && verbs.length === 0)) {
    return (
      <div className="grammar-exercise-container">
        <div className="exercise-top-nav">
          <Link to="/grammar" className="exercise-back-link">
            ← Back to Grammar
          </Link>
        </div>
        <ErrorDisplay
          title="Could not load exercise verbs"
          description="Make sure the backend API is running and vocabulary data is accessible."
        />
        <div style={{ textAlign: "center", marginTop: "16px" }}>
          <button 
            type="button" 
            className="btn-restart-session" 
            onClick={handleRestart}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const currentScore = sessionResults.filter(r => r.isCorrect).length;
  const progressPercent = totalQuestions > 0 ? ((currentIndex + 1) / totalQuestions) * 100 : 0;

  return (
    <div className="grammar-exercise-container">
      {/* Top navigation & session header */}
      <div className="exercise-top-nav">
        <Link to="/grammar" className="exercise-back-link">
          ← Back to Grammar
        </Link>

        {!isSessionComplete && (
          <div className="exercise-session-tracker">
            <span className="exercise-progress-pill">
              Question {currentIndex + 1} / {totalQuestions}
            </span>
            <span className="exercise-score-pill">
              Score: {currentScore}
            </span>
          </div>
        )}
      </div>

      {/* Exercise Category Selector Tabs */}
      <div className="exercise-category-tabs">
        <button
          type="button"
          className={`exercise-category-tab ${activeCategory === "tenses" ? "active" : ""}`}
          onClick={() => handleSelectCategory("tenses")}
        >
          <span className="tab-icon">🔄</span>
          <span className="tab-title">Past & Present Tenses</span>
          <span className="tab-sub">Plain & ます</span>
        </button>

        <button
          type="button"
          className={`exercise-category-tab ${activeCategory === "te_form" ? "active" : ""}`}
          onClick={() => handleSelectCategory("te_form")}
        >
          <span className="tab-icon">⚡</span>
          <span className="tab-title">Te-Form & Continuous</span>
          <span className="tab-sub">〜て & 〜ている</span>
        </button>
      </div>

      {/* Progress Bar */}
      {!isSessionComplete && (
        <div className="exercise-progress-bar-container">
          <div 
            className="exercise-progress-bar-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}

      {/* Content: Active Question vs Session Results */}
      {!isSessionComplete && currentQuestion ? (
        <ExerciseQuestionCard
          key={currentQuestion.id}
          question={currentQuestion}
          questionIndex={currentIndex}
          totalQuestions={totalQuestions}
          onAnswerSubmitted={handleAnswerSubmitted}
          onNextQuestion={handleNextQuestion}
          isLastQuestion={currentIndex === totalQuestions - 1}
        />
      ) : (
        <ExerciseResultModal
          results={sessionResults}
          onRestartSession={handleRestart}
        />
      )}
    </div>
  );
}
