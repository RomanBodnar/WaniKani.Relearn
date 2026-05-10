import React from "react";
import "./LevelFilter.css";

export type JlptLevel = string;

interface JLPTFilterProps {
  selectedLevels: string[];
  onLevelsChange: (levels: string[]) => void;
}

const LEVELS: { label: string; value: string | null }[] = [
  { label: "All JLPT", value: null },
  { label: "N5", value: "N5" },
  { label: "N4", value: "N4" },
  { label: "N3", value: "N3" },
  { label: "N2", value: "N2" },
  { label: "N1", value: "N1" },
];

export const JLPTFilter: React.FC<JLPTFilterProps> = ({
  selectedLevels,
  onLevelsChange,
}) => {
  const handleToggle = (value: string | null) => {
    if (value === null) {
      onLevelsChange([]);
    } else {
      if (selectedLevels.includes(value)) {
        onLevelsChange(selectedLevels.filter((v) => v !== value));
      } else {
        onLevelsChange([...selectedLevels, value]);
      }
    }
  };

  return (
    <div className="level-filter-container">
      <span className="filter-label">JLPT:</span>
      <div className="filter-options">
        {LEVELS.map((level) => {
          const isActive = level.value === null 
            ? selectedLevels.length === 0 
            : selectedLevels.includes(level.value);
            
          return (
            <button
              key={level.label}
              className={`filter-button ${isActive ? "active" : ""}`}
              onClick={() => handleToggle(level.value)}
            >
              {level.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
