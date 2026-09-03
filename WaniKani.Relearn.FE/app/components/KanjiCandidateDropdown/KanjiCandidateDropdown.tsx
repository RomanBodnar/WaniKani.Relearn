import React, { useEffect, useRef } from "react";
import "./kanji-candidate-dropdown.css";

interface Props {
  candidates: string[];
  selectedIndex: number;
  onSelect: (candidate: string) => void;
  className?: string;
}

export function KanjiCandidateDropdown({
  candidates,
  selectedIndex,
  onSelect,
  className = ""
}: Props) {
  const listRef = useRef<HTMLDivElement>(null);

  // Scroll active candidate item into view when navigating via arrow keys
  useEffect(() => {
    if (!listRef.current) return;
    const activeItem = listRef.current.querySelector(`.kanji-candidate-item:nth-child(${selectedIndex + 1})`) as HTMLElement;
    if (activeItem) {
      activeItem.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  if (!candidates || candidates.length === 0) {
    return null;
  }

  return (
    <div className={`kanji-candidate-dropdown ${className}`} ref={listRef}>
      {candidates.map((candidate, idx) => (
        <div
          key={`${candidate}-${idx}`}
          className={`kanji-candidate-item ${idx === selectedIndex ? "active" : ""}`}
          onMouseDown={(e) => {
            // Prevent blur of input before selection commits
            e.preventDefault();
            onSelect(candidate);
          }}
        >
          <div className="kanji-candidate-main">
            <span className="kanji-candidate-index">{idx + 1}.</span>
            <span className="kanji-candidate-text">{candidate}</span>
          </div>
          {idx === 0 && (
            <span className="kanji-candidate-hint">Space / Enter ↵</span>
          )}
        </div>
      ))}
    </div>
  );
}
