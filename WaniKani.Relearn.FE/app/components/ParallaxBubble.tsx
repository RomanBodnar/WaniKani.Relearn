import React, { useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { SubjectCharacter } from "./SubjectCharacter";

interface ParallaxBubbleProps {
  subject: {
    Characters?: string | null;
    CharacterImages?: any[];
    Slug: string;
    Object: string;
  };
}

export const ParallaxBubble = ({ subject }: ParallaxBubbleProps) => {
  const bubbleRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isAnimating, setIsAnimating] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!bubbleRef.current) return;

    const rect = bubbleRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation (max 15 degrees)
    const rotateY = ((x - centerX) / centerX) * 15;
    const rotateX = ((centerY - y) / centerY) * 15;

    setRotate({ x: rotateX, y: rotateY });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setRotate({ x: 0, y: 0 });
  }, []);

  const handleClick = useCallback(() => {
    if (isAnimating || subject.Object === 'radical') return;
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1000);
  }, [isAnimating, subject.Object]);

  const isRadical = subject.Object === 'radical';

  return (
    <div
      ref={bubbleRef}
      className={`subject-char-bubble ${isAnimating ? 'animating' : ''} ${isRadical ? 'is-radical' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        backgroundColor: `var(--color-wk-${subject.Object.replace('_', '-')})`,
        '--char-count': subject.Characters?.length || 1,
        transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        cursor: isRadical ? 'default' : 'pointer'
      } as React.CSSProperties}
    >
      <div style={{ opacity: isAnimating ? 0 : 1, transition: 'opacity 0.1s' }}>
        <SubjectCharacter
          subject={{ 
            Characters: subject.Characters, 
            CharacterImages: subject.CharacterImages, 
            Slug: subject.Slug 
          }}
          className="subject-detail-character japanese-text"
        />
      </div>
      
      {isAnimating && subject.Characters && createPortal(
        <div className="subject-char-jump-out">
          {subject.Characters}
        </div>,
        document.body
      )}
    </div>
  );
};
