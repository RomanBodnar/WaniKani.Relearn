import React, { useState, useEffect, useRef } from "react";
import type { QuestionData } from "./conjugationEngine";
import { checkAnswer } from "./conjugationEngine";
import { romajiToHiragana, finalizeKana } from "./kanaInputHelper";

interface Props {
  question: QuestionData;
  questionIndex: number;
  totalQuestions: number;
  onAnswerSubmitted: (result: {
    question: QuestionData;
    userAnswer: string;
    isCorrect: boolean;
  }) => void;
  onNextQuestion: () => void;
  isLastQuestion: boolean;
}

export function ExerciseQuestionCard({
  question,
  questionIndex,
  totalQuestions,
  onAnswerSubmitted,
  onNextQuestion,
  isLastQuestion
}: Props) {
  const [inputValue, setInputValue] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showReading, setShowReading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const justValidatedRef = useRef<boolean>(false);

  // Focus input when question changes (desktop only to prevent mobile viewport jump)
  useEffect(() => {
    setInputValue("");
    setHasSubmitted(false);
    setIsCorrect(false);
    setShowReading(false);
    justValidatedRef.current = false;
    window.scrollTo({ top: 0, behavior: "instant" });

    const isTouch = window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768;
    if (!isTouch) {
      inputRef.current?.focus();
    }
  }, [question.id]);

  // After submitting, listen for Enter key to proceed to next question / results
  useEffect(() => {
    if (!hasSubmitted) return;

    const isTouch = window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768;
    if (!isTouch) {
      nextButtonRef.current?.focus();
    }

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        if (justValidatedRef.current) return;
        e.preventDefault();
        onNextQuestion();
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [hasSubmitted, onNextQuestion]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (hasSubmitted) return;
    const raw = e.target.value;
    const converted = romajiToHiragana(raw);
    setInputValue(converted);
  };

  const handleValidate = () => {
    const finalAnswer = finalizeKana(inputValue).trim();
    if (!finalAnswer) return;

    const correct = checkAnswer(finalAnswer, question.acceptedAnswers);
    setIsCorrect(correct);
    setHasSubmitted(true);
    setInputValue(finalAnswer);
    justValidatedRef.current = true;

    onAnswerSubmitted({
      question,
      userAnswer: finalAnswer,
      isCorrect: correct
    });

    // Prevent immediate double-triggering from the same Enter press
    setTimeout(() => {
      justValidatedRef.current = false;
    }, 150);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasSubmitted) {
      handleValidate();
    } else if (!justValidatedRef.current) {
      onNextQuestion();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing || e.keyCode === 229) {
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (!hasSubmitted) {
        handleValidate();
      } else if (!justValidatedRef.current) {
        onNextQuestion();
      }
    }
  };

  const verbGroupBadgeMap: Record<string, { label: string; className: string }> = {
    godan: { label: "Godan (五段)", className: "badge-godan" },
    ichidan: { label: "Ichidan (一段)", className: "badge-ichidan" },
    suru: { label: "Suru (する)", className: "badge-suru" },
    kuru: { label: "Kuru (来る)", className: "badge-kuru" },
    unknown: { label: "Verb", className: "badge-verb" }
  };

  const groupBadge = verbGroupBadgeMap[question.verb.group] || verbGroupBadgeMap.unknown;

  return (
    <div className="exercise-card">
      {/* Question Header & Meta */}
      <div className="exercise-card-meta">
        <span className={`verb-group-badge ${groupBadge.className}`}>
          {groupBadge.label}
        </span>
        {question.verb.level && (
          <span className="verb-level-badge">
            Level {question.verb.level}
          </span>
        )}
      </div>

      {/* Target Direction Banner */}
      <div className="exercise-direction-box">
        <div className="direction-label-row">
          <span className="direction-icon">⇄</span>
          <span className="direction-label">{question.directionLabel}</span>
        </div>
        <p className="direction-subtext">{question.directionDescription}</p>
      </div>

      {/* Prompt Verb Display */}
      <div className="prompt-verb-section">
        <div className="prompt-characters-wrapper">
          <span className="prompt-characters">{question.promptText}</span>
          {question.promptReading && question.promptReading !== question.promptText && (
            <button 
              type="button" 
              className="toggle-reading-btn"
              onClick={() => setShowReading(prev => !prev)}
              title="Toggle Kana reading hint"
            >
              {showReading ? question.promptReading : "Show Reading"}
            </button>
          )}
        </div>

        <div className="prompt-meanings">
          {question.verb.meanings.slice(0, 3).join(", ")}
        </div>
      </div>

      {/* Answer Form */}
      <form onSubmit={handleFormSubmit} className="exercise-form">
        <div className={`exercise-input-group ${hasSubmitted ? (isCorrect ? "is-correct" : "is-incorrect") : ""}`}>
          <input
            ref={inputRef}
            type="text"
            className="exercise-input"
            placeholder={isFocused ? "" : "Type your answer"}
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            readOnly={hasSubmitted}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck="false"
          />

          {!hasSubmitted ? (
            <button 
              type="submit" 
              className="exercise-submit-btn"
              disabled={!inputValue.trim()}
            >
              Check
            </button>
          ) : (
            <button 
              ref={nextButtonRef}
              type="button" 
              className="exercise-next-btn"
              onClick={onNextQuestion}
            >
              {isLastQuestion ? "View Results" : "Next →"}
            </button>
          )}
        </div>
      </form>

      {/* Feedback Overlay / Section */}
      {hasSubmitted && (
        <div className={`exercise-feedback-panel ${isCorrect ? "feedback-correct" : "feedback-incorrect"}`}>
          <div className="feedback-header">
            <span className="feedback-status-icon">
              {isCorrect ? "✓" : "✗"}
            </span>
            <div className="feedback-status-text">
              <h4>{isCorrect ? "Correct!" : "Not quite right"}</h4>
              {!isCorrect && (
                <div className="feedback-correct-answers">
                  <span className="answer-label">Correct answer:</span>
                  <span className="accepted-answers-list">
                    {question.acceptedAnswers.join(" / ")}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="feedback-explanation">
            <span className="explanation-icon">💡</span>
            <p className="explanation-text">{question.ruleExplanation}</p>
          </div>
        </div>
      )}
    </div>
  );
}
