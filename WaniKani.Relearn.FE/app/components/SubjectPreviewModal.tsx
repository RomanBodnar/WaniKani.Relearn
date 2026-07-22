import React, { useEffect, useRef } from 'react';
import type { Subject } from '~/hooks/Subject';
import { PracticeCard } from './PracticeCard';
import './SubjectPreviewModal.css';

interface SubjectPreviewModalProps {
  subject: Subject;
  variant?: 'kanji' | 'vocabulary' | 'radical';
  currentIndex: number;
  totalCount: number;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
  hasNext: boolean;
  hasPrev: boolean;
}

export const SubjectPreviewModal = ({
  subject,
  variant,
  currentIndex,
  totalCount,
  onNext,
  onPrev,
  onClose,
  hasNext,
  hasPrev,
}: SubjectPreviewModalProps) => {
  const touchStartX = useRef<number | null>(null);

  // Keyboard navigation & body scroll locking
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && hasNext) {
        onNext();
      } else if (e.key === 'ArrowLeft' && hasPrev) {
        onPrev();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [onNext, onPrev, onClose, hasNext, hasPrev]);

  // Touch gesture handling (swiping left for next, swiping right for prev)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchStartX.current - touchEndX;

    if (deltaX > 40 && hasNext) {
      onNext();
    } else if (deltaX < -40 && hasPrev) {
      onPrev();
    }
    touchStartX.current = null;
  };

  return (
    <div
      className="subject-preview-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="subject-preview-modal-content">
        <button
          className="subject-preview-modal-close"
          onClick={onClose}
          aria-label="Close preview modal"
        >
          ✕
        </button>

        <div
          className="subject-preview-modal-body"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <PracticeCard
            key={subject.Id}
            subject={subject}
            variant={variant}
            isActive={true}
          />
        </div>

        <div className="subject-preview-modal-controls">
          <button
            className="subject-preview-btn subject-preview-btn-secondary"
            onClick={onPrev}
            disabled={!hasPrev}
            aria-label="Previous item"
          >
            ← Previous
          </button>
          <span className="subject-preview-modal-counter">
            {currentIndex + 1} / {totalCount}
          </span>
          <button
            className="subject-preview-btn subject-preview-btn-primary"
            onClick={onNext}
            disabled={!hasNext}
            aria-label="Next item"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
};
