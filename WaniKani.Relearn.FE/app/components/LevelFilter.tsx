import React from "react";
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

  return (
    <div className="level-filter-container">
      <span className="filter-label">Levels:</span>
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
