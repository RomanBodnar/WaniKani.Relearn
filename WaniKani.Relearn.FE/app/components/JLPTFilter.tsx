import React, { useState } from "react";
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

  const [isExpanded, setIsExpanded] = useState(false);
  
  const getActiveLabel = () => {
    if (selectedLevels.length === 0) return "All JLPT";
    if (selectedLevels.length === 1) return selectedLevels[0];
    return `${selectedLevels.length} selected`;
  };

  return (
    <div className={`level-filter-container filter-group ${isExpanded ? "expanded" : ""}`}>
      <button className="filter-label filter-toggle" onClick={() => setIsExpanded(!isExpanded)}>
        JLPT: <span className="mobile-active-label">{getActiveLabel()}</span>
        <svg className="filter-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
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
