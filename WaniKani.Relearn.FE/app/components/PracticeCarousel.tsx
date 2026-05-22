import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Subject } from '~/hooks/Subject';
import { PracticeCard } from './PracticeCard';
import './PracticeCarousel.css';

interface PracticeCarouselProps {
  subjects: Subject[];
  variant?: 'kanji' | 'radical' | 'vocabulary';
  initialIndex?: number;
}

export default function PracticeCarousel({ subjects, variant, initialIndex = 0 }: PracticeCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const touchStartX = useRef<number | null>(null);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(prev + 1, subjects.length - 1));
  }, [subjects.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrev]);

  // Touch handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchStartX.current - touchEndX;

    if (deltaX > 40) {
      goNext();
    } else if (deltaX < -40) {
      goPrev();
    }
    touchStartX.current = null;
  };

  if (!subjects.length) return null;

  return (
    <div 
      className="practice-carousel-container"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <button 
        className="practice-carousel-arrow practice-carousel-arrow-left" 
        onClick={goPrev}
        disabled={currentIndex === 0}
        style={{ opacity: currentIndex === 0 ? 0.3 : 1, cursor: currentIndex === 0 ? 'not-allowed' : 'pointer' }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>

      <div className="practice-carousel-track">
        {subjects.map((subject, index) => {
          const offset = index - currentIndex;
          const absOffset = Math.abs(offset);
          
          // Coverflow math with true 3D depth
          const translateX = offset * 300; // Adjusted to 300px horizontal spread
          const translateZ = -absOffset * 250; // Push side cards back to prevent 3D clipping and provide natural scale
          const rotateY = offset === 0 ? 0 : offset > 0 ? -35 : 35; // 35 degrees tilt
          const zIndex = 100 - absOffset;
          const opacity = Math.max(1 - absOffset * 0.4, 0); // Drops to 0 at offset 3, keeping 2 cards visible per side

          return (
            <div 
              key={subject.Id}
              className="practice-carousel-item"
              onClick={() => setCurrentIndex(index)}
              style={{
                transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg)`,
                zIndex,
                opacity,
                pointerEvents: opacity === 0 ? 'none' : 'auto'
              }}
            >
              <PracticeCard 
                subject={subject} 
                variant={variant} 
                isActive={offset === 0} 
              />
            </div>
          );
        })}
      </div>

      <button 
        className="practice-carousel-arrow practice-carousel-arrow-right" 
        onClick={goNext}
        disabled={currentIndex === subjects.length - 1}
        style={{ opacity: currentIndex === subjects.length - 1 ? 0.3 : 1, cursor: currentIndex === subjects.length - 1 ? 'not-allowed' : 'pointer' }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </div>
  );
}
