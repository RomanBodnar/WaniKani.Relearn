import React from "react";
import { Link } from "react-router";
import type { QuestionData } from "./conjugationEngine";

export interface SessionResultItem {
  question: QuestionData;
  userAnswer: string;
  isCorrect: boolean;
}

interface Props {
  results: SessionResultItem[];
  onRestartSession: () => void;
}

export function ExerciseResultModal({ results, onRestartSession }: Props) {
  const total = results.length;
  const correctCount = results.filter(r => r.isCorrect).length;
  const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  let scoreTitle = "Well Done!";
  let scoreClass = "score-good";
  if (percentage === 100) {
    scoreTitle = "Perfect Score! 🌟";
    scoreClass = "score-perfect";
  } else if (percentage >= 80) {
    scoreTitle = "Great Job! 🎉";
    scoreClass = "score-good";
  } else if (percentage >= 60) {
    scoreTitle = "Good Effort! 👍";
    scoreClass = "score-ok";
  } else {
    scoreTitle = "Keep Practicing! 💪";
    scoreClass = "score-need-practice";
  }

  return (
    <div className="exercise-results-container">
      <div className={`results-hero-card ${scoreClass}`}>
        <h2 className="results-hero-title">{scoreTitle}</h2>
        <div className="results-score-badge">
          <span className="score-number">{correctCount}</span>
          <span className="score-divider">/</span>
          <span className="score-total">{total}</span>
          <span className="score-percentage">({percentage}%)</span>
        </div>
        <p className="results-subtitle">
          {percentage >= 80 
            ? "You have a solid grasp of Japanese past and present tense conjugations!" 
            : "Review the answers and explanations below to strengthen your conjugation skills."}
        </p>

        <div className="results-hero-actions">
          <button 
            type="button" 
            className="btn-restart-session" 
            onClick={onRestartSession}
          >
            Practice Again (New 10 Verbs)
          </button>
          <Link to="/grammar" className="btn-back-grammar">
            Back to Grammar Guide
          </Link>
        </div>
      </div>

      {/* Breakdown List */}
      <div className="results-breakdown-section">
        <h3 className="breakdown-title">Session Review</h3>
        <div className="breakdown-list">
          {results.map((item, idx) => (
            <div 
              key={item.question.id || idx} 
              className={`breakdown-item ${item.isCorrect ? "item-correct" : "item-incorrect"}`}
            >
              <div className="breakdown-item-header">
                <div className="breakdown-num-badge">
                  #{idx + 1}
                </div>
                <div className="breakdown-verb-info">
                  <span className="breakdown-verb-chars">{item.question.verb.characters}</span>
                  <span className="breakdown-verb-reading">({item.question.verb.reading})</span>
                  <span className="breakdown-verb-meaning">
                    — {item.question.verb.meanings.slice(0, 2).join(", ")}
                  </span>
                </div>
                <div className="breakdown-status-tag">
                  {item.isCorrect ? (
                    <span className="tag-correct">✓ Correct</span>
                  ) : (
                    <span className="tag-incorrect">✗ Incorrect</span>
                  )}
                </div>
              </div>

              <div className="breakdown-direction">
                <span className="direction-mini-label">{item.question.directionLabel}</span>
                <span className="prompt-display-mini">
                  Prompt: <strong>{item.question.promptText}</strong>
                </span>
              </div>

              <div className="breakdown-answers-row">
                <div className="answer-col user-ans">
                  <span className="ans-label">Your answer:</span>
                  <span className={`ans-value ${item.isCorrect ? "text-success" : "text-danger"}`}>
                    {item.userAnswer || "(empty)"}
                  </span>
                </div>

                {!item.isCorrect && (
                  <div className="answer-col correct-ans">
                    <span className="ans-label">Accepted:</span>
                    <span className="ans-value text-accent">
                      {item.question.acceptedAnswers.join(" / ")}
                    </span>
                  </div>
                )}
              </div>

              <div className="breakdown-rule">
                <span className="rule-badge">Rule:</span>
                <span className="rule-text">{item.question.ruleExplanation}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
