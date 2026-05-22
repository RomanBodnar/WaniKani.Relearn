import React, { useState } from "react";
import "./LevelFilter.css";

export type LevelRange = [number, number] | null;

interface LevelFilterProps {
  selectedRange: LevelRange;
  onRangeChange: (range: LevelRange) => void;
}

const RANGES: { label: string; value: LevelRange }[] = [
  { label: "All Levels", value: null },
  { label: "1-10", value: [1, 10] },
  { label: "11-20", value: [11, 20] },
  { label: "21-30", value: [21, 30] },
  { label: "31-40", value: [31, 40] },
  { label: "41-50", value: [41, 50] },
  { label: "51-60", value: [51, 60] },
];

export const LevelFilter: React.FC<LevelFilterProps> = ({
  selectedRange,
  onRangeChange,
}) => {
  const isSelected = (range: LevelRange) => {
    if (range === null) return selectedRange === null;
    if (selectedRange === null) return false;
    return range[0] === selectedRange[0] && range[1] === selectedRange[1];
  };

  const [isExpanded, setIsExpanded] = useState(false);
  const activeLabel = RANGES.find((r) => isSelected(r.value))?.label || "All Levels";

  return (
    <div className={`level-filter-container filter-group ${isExpanded ? "expanded" : ""}`}>
      <button className="filter-label filter-toggle" onClick={() => setIsExpanded(!isExpanded)}>
        Levels: <span className="mobile-active-label">{activeLabel}</span>
        <svg className="filter-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
      <div className="filter-options">
        {RANGES.map((range) => (
          <button
            key={range.label}
            className={`filter-button ${isSelected(range.value) ? "active" : ""}`}
            onClick={() => onRangeChange(range.value)}
          >
            {range.label}
          </button>
        ))}
      </div>
    </div>
  );
};
