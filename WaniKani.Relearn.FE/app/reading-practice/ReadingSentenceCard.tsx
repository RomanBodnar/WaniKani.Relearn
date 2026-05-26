import { useState, useRef, useEffect } from "react";
import type { ReadingSentence } from "~/types/reading";
import { SubjectPreviewInline } from "~/components/SubjectPreviewInline";

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
  const [activeSubjectId, setActiveSubjectId] = useState<number | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const closingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (closingTimeoutRef.current) clearTimeout(closingTimeoutRef.current);
    };
  }, []);

  const handlePillClick = (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
    if (activeSubjectId === id) {
      setIsClosing(true);
      closingTimeoutRef.current = setTimeout(() => {
        setIsClosing(false);
        setActiveSubjectId(null);
        closingTimeoutRef.current = null;
      }, 300); // matches the 0.3s CSS transition duration
    } else {
      if (closingTimeoutRef.current) {
        clearTimeout(closingTimeoutRef.current);
        closingTimeoutRef.current = null;
      }
      setIsClosing(false);
      setActiveSubjectId(id);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
    onInteract?.(index);
  };

  const handleRevealToggle = () => {
    setIsRevealed(prev => !prev);
    onInteract?.(index);
  };

  const morphemes = sentence.morphemes;

  return (
    <div className="sentence-card" id={`sentence-${index}`}>
      <span className="sentence-card-level">Lv. {sentence.level}</span>

      {/* Japanese sentence */}
      <p className="sentence-ja">
        {morphemes && morphemes.length > 0 ? (
          morphemes.map((morpheme, mIdx) => {
            const previousMorpheme = mIdx > 0 ? morphemes[mIdx - 1] : null;
            const nextMorpheme = mIdx < morphemes.length - 1 ? morphemes[mIdx + 1] : null;

            // Skip rendering this morpheme if it's already part of a combined form in the next morpheme
            if (nextMorpheme?.combinedForm !== null) {
              return null;
            }

            // Case 1: combinedForm is not null and subjectId is not null
            if (morpheme.combinedForm !== null && morpheme.subjectId !== null) {
              const previousSurface = previousMorpheme?.surface || '';
              const isActive = activeSubjectId === morpheme.subjectId;
              return (
                <button
                  type="button"
                  key={`morpheme-${mIdx}-${morpheme.subjectId}`}
                  onClick={(e) => handlePillClick(e, morpheme.subjectId!)}
                  className={`morpheme-link ${isActive ? 'active' : ''}`}
                >
                  {previousSurface}{morpheme.surface}
                </button>
              );
            }

            // Case 2: combinedForm is not null, subjectId is null, but previous morpheme has subjectId
            if (morpheme.combinedForm !== null && morpheme.subjectId === null && previousMorpheme && previousMorpheme.subjectId !== null) {
              const previousSurface = previousMorpheme.surface;
              const subjectId = previousMorpheme.subjectId;
              const isActive = activeSubjectId === subjectId;
              return (
                <button
                  type="button"
                  key={`morpheme-${mIdx}-${subjectId}`}
                  onClick={(e) => handlePillClick(e, subjectId)}
                  className={`morpheme-link ${isActive ? 'active' : ''}`}
                >
                  {previousSurface}{morpheme.surface}
                </button>
              );
            }

            // Case 3: combinedForm is not null, but both current and previous morphemes have null subjectId
            if (morpheme.combinedForm !== null && morpheme.subjectId === null && (!previousMorpheme || previousMorpheme.subjectId === null)) {
              const previousSurface = previousMorpheme?.surface || '';
              return (
                <span
                  key={`morpheme-${mIdx}`}
                  className="morpheme-link morpheme-link-missing"
                >
                  {previousSurface}{morpheme.surface}
                </span>
              );
            }

            // Default case: morpheme has subjectId (original logic)
            if (morpheme.subjectId !== null) {
              const isActive = activeSubjectId === morpheme.subjectId;
              return (
                <button
                  type="button"
                  key={`morpheme-${mIdx}-${morpheme.subjectId}`}
                  onClick={(e) => handlePillClick(e, morpheme.subjectId!)}
                  className={`morpheme-link ${isActive ? 'active' : ''}`}
                >
                  {morpheme.surface}
                </button>
              );
            }

            // Plain morpheme with no linking
            return <span key={`morpheme-${mIdx}`}>{morpheme.surface}</span>;
          })
        ) : (
          sentence.ja
        )}
      </p>

      {/* Subject tags */}
      <div className="sentence-tags">
        {/* Vocabulary tags */}
        {sentence.sourceVocabulary && sentence.sourceVocabulary.length > 0 && (
          <div className="sentence-tags-group">
            <span className="sentence-tags-label">Vocab</span>
            <div className="sentence-tags-pills">
              {sentence.sourceVocabulary.map((vocab) => (
                <button
                  type="button"
                  key={`vocab-${vocab.subjectId}`}
                  onClick={(e) => handlePillClick(e, vocab.subjectId)}
                  className={`sentence-tag sentence-tag-vocab ${activeSubjectId === vocab.subjectId ? 'active' : ''}`}
                >
                  {vocab.characters}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Kanji tags */}
        {sentence.kanjiInSentence && sentence.kanjiInSentence.length > 0 && (
          <div className="sentence-tags-group">
            <span className="sentence-tags-label">Kanji</span>
            <div className="sentence-tags-pills">
              {sentence.kanjiInSentence.map((kanji) => (
                <button
                  type="button"
                  key={`kanji-${kanji.subjectId}`}
                  onClick={(e) => handlePillClick(e, kanji.subjectId)}
                  className={`sentence-tag sentence-tag-kanji ${activeSubjectId === kanji.subjectId ? 'active' : ''}`}
                >
                  {kanji.characters}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {activeSubjectId !== null && (
        <SubjectPreviewInline
          subjectId={activeSubjectId}
          isClosing={isClosing}
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
