import { useState } from "react";
import type { ReadingSentence } from "~/types/reading";
import { SubjectPreviewModal } from "~/components/SubjectPreviewModal";

interface ReadingSentenceCardProps {
  sentence: ReadingSentence;
  /** Global index used for bookmark tracking */
  index: number;
  /** Called when the user interacts with this card (for bookmark updates) */
  onInteract?: (index: number) => void;
  /** Called to enter focus mode for this specific sentence */
  onFocus?: (index: number) => void;
}

export function ReadingSentenceCard({ sentence, index, onInteract, onFocus }: ReadingSentenceCardProps) {
  const [userInput, setUserInput] = useState("");
  const [isRevealed, setIsRevealed] = useState(false);
  const [activeSubject, setActiveSubject] = useState<{ id: number; element: HTMLElement } | null>(null);

  const handlePillClick = (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
    setActiveSubject({
      id,
      element: e.currentTarget
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
    onInteract?.(index);
  };

  const handleRevealToggle = () => {
    setIsRevealed(prev => !prev);
    onInteract?.(index);
  };

  return (
    <div className="sentence-card" id={`sentence-${index}`}>
      <span className="sentence-card-level">Lv. {sentence.level}</span>

      {/* Japanese sentence */}
      <p className="sentence-ja">{sentence.ja}</p>

      {/* Subject tags */}
      <div className="sentence-tags">
        {/* Vocabulary tags */}
        {sentence.sourceVocabulary && sentence.sourceVocabulary.length > 0 && (
          <div className="sentence-tags-group">
            <span className="sentence-tags-label">Vocab</span>
            {sentence.sourceVocabulary.map((vocab) => (
              <button
                type="button"
                key={`vocab-${vocab.subjectId}`}
                onClick={(e) => handlePillClick(e, vocab.subjectId)}
                className="sentence-tag sentence-tag-vocab"
              >
                {vocab.characters}
              </button>
            ))}
          </div>
        )}

        {/* Kanji tags */}
        {sentence.kanjiInSentence && sentence.kanjiInSentence.length > 0 && (
          <div className="sentence-tags-group">
            <span className="sentence-tags-label">Kanji</span>
            {sentence.kanjiInSentence.map((kanji) => (
              <button
                type="button"
                key={`kanji-${kanji.subjectId}`}
                onClick={(e) => handlePillClick(e, kanji.subjectId)}
                className="sentence-tag sentence-tag-kanji"
              >
                {kanji.characters}
              </button>
            ))}
          </div>
        )}
      </div>

      {activeSubject !== null && (
        <SubjectPreviewModal
          subjectId={activeSubject.id}
          anchorElement={activeSubject.element}
          onClose={() => setActiveSubject(null)}
        />
      )}

      {/* Translation input */}
      <div className="sentence-input-wrapper">
        <input
          type="text"
          className="sentence-input"
          placeholder="Type your translation…"
          value={userInput}
          onChange={handleInputChange}
          autoComplete="off"
        />
      </div>

      {/* Reveal translation */}
      <div className="sentence-reveal-row">
        <button
          type="button"
          className={`sentence-reveal-btn ${isRevealed ? "revealed" : ""}`}
          onClick={handleRevealToggle}
        >
          {isRevealed ? "✓ Translation" : "👁 Show Translation"}
        </button>

        {onFocus && (
          <button
            type="button"
            className="sentence-reveal-btn focus-btn"
            onClick={() => onFocus(index)}
          >
            ⛶ Focus Mode
          </button>
        )}

        {isRevealed && (
          <p className="sentence-en">{sentence.en}</p>
        )}
      </div>
    </div>
  );
}
