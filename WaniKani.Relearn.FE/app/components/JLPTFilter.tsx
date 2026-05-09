import React from "react";
import "./LevelFilter.css";

export type JlptLevel = string | null;

interface JLPTFilterProps {
  selectedLevel: JlptLevel;
  onLevelChange: (level: JlptLevel) => void;
}

const LEVELS: { label: string; value: JlptLevel }[] = [
  { label: "All JLPT", value: null },
  { label: "N5", value: "N5" },
  { label: "N4", value: "N4" },
  { label: "N3", value: "N3" },
  { label: "N2", value: "N2" },
  { label: "N1", value: "N1" },
];

export const JLPTFilter: React.FC<JLPTFilterProps> = ({
  selectedLevel,
  onLevelChange,
}) => {
  return (
    <div className="level-filter-container">
      <span className="filter-label">JLPT:</span>
      <div className="filter-options">
        {LEVELS.map((level) => (
          <button
            key={level.label}
            className={`filter-button ${selectedLevel === level.value ? "active" : ""}`}
            onClick={() => onLevelChange(level.value)}
          >
            {level.label}
          </button>
        ))}
      </div>
    </div>
  );
};
