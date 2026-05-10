import React, { useEffect, useRef, useState } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  threshold?: number;
  once?: boolean;
}

export const ScrollReveal = ({ 
  children, 
  className = "", 
  threshold = 0.1, 
  once = true 
}: ScrollRevealProps) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          if (once && elementRef.current) {
            observer.unobserve(elementRef.current);
          }
        } else if (!once) {
          setIsRevealed(false);
        }
      },
      { threshold }
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [threshold, once]);

  return (
    <div
      ref={elementRef}
      className={`reveal-section ${isRevealed ? "is-revealed" : ""} ${className}`}
    >
      {children}
    </div>
  );
};
