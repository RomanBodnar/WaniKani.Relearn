import React, { useState, useEffect } from "react";
import "./LevelFilter.css";

export type LevelRange = [number, number] | null;

interface LevelFilterProps {
  selectedRange: LevelRange;
  onRangeChange: (range: LevelRange) => void;
  headerExtra?: React.ReactNode;
}

const DECADES = [
  { label: "1-10", min: 1, max: 10 },
  { label: "11-20", min: 11, max: 20 },
  { label: "21-30", min: 21, max: 30 },
  { label: "31-40", min: 31, max: 40 },
  { label: "41-50", min: 41, max: 50 },
  { label: "51-60", min: 51, max: 60 },
];

export const LevelFilter: React.FC<LevelFilterProps> = ({
  selectedRange,
  onRangeChange,
  headerExtra,
}) => {
  // Determine if a single level is selected
  const isSingleLevel = selectedRange !== null && selectedRange[0] === selectedRange[1];
  const activeSingleLevel = isSingleLevel ? selectedRange[0] : null;

  // Determine active decade group based on selected range
  const activeDecadeIndex = selectedRange !== null
    ? DECADES.findIndex(d => selectedRange[0] >= d.min && selectedRange[1] <= d.max)
    : -1;

  // State to track which decade group tab is currently expanded/active
  const [activeDecade, setActiveDecade] = useState<number | null>(
    activeDecadeIndex !== -1 ? activeDecadeIndex : null
  );

  useEffect(() => {
    if (activeDecadeIndex !== -1) {
      setActiveDecade(activeDecadeIndex);
    }
  }, [activeDecadeIndex]);

  // Handle decade tab click
  const handleDecadeClick = (index: number) => {
    const decade = DECADES[index];
    if (activeDecade === index && selectedRange !== null && selectedRange[0] === decade.min && selectedRange[1] === decade.max) {
      // Toggle off if already full decade selected -> reset to All
      onRangeChange(null);
      setActiveDecade(null);
    } else {
      setActiveDecade(index);
      onRangeChange([decade.min, decade.max]);
    }
  };

  // Handle individual level pill click
  const handleSingleLevelClick = (level: number) => {
    if (activeSingleLevel === level) {
      // Toggle back to full decade range or reset
      const decade = DECADES[activeDecade ?? 0];
      onRangeChange([decade.min, decade.max]);
    } else {
      onRangeChange([level, level]);
    }
  };

  // Handle direct select dropdown change
  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === "all") {
      onRangeChange(null);
      setActiveDecade(null);
    } else if (val.startsWith("decade-")) {
      const idx = parseInt(val.replace("decade-", ""), 10);
      const decade = DECADES[idx];
      setActiveDecade(idx);
      onRangeChange([decade.min, decade.max]);
    } else {
      const levelNum = parseInt(val, 10);
      const decIdx = DECADES.findIndex(d => levelNum >= d.min && levelNum <= d.max);
      setActiveDecade(decIdx !== -1 ? decIdx : null);
      onRangeChange([levelNum, levelNum]);
    }
  };

  // Get active dropdown value string
  const getDropdownValue = () => {
    if (selectedRange === null) return "all";
    if (isSingleLevel) return String(selectedRange[0]);
    if (activeDecadeIndex !== -1) return `decade-${activeDecadeIndex}`;
    return "all";
  };

  const renderDropdown = () => (
    <div className="level-select-wrapper">
      <select
        className="level-select-dropdown"
        value={getDropdownValue()}
        onChange={handleDropdownChange}
        aria-label="Select Individual Level"
      >
        <option value="all">Select Level...</option>
        <optgroup label="Decade Ranges">
          {DECADES.map((d, idx) => (
            <option key={`dec-${d.label}`} value={`decade-${idx}`}>
              Levels {d.label}
            </option>
          ))}
        </optgroup>
        <optgroup label="Individual Levels (1 - 60)">
          {Array.from({ length: 60 }, (_, i) => i + 1).map((lvl) => (
            <option key={`lvl-${lvl}`} value={String(lvl)}>
              Level {lvl}
            </option>
          ))}
        </optgroup>
      </select>
    </div>
  );

  return (
    <div className="level-filter-group">
      {/* Render top header bar ONLY if headerExtra exists */}
      {headerExtra ? (
        <>
          <div className="level-filter-header">
            <div className="level-filter-header-left">{headerExtra}</div>
            {renderDropdown()}
          </div>
          <div className="level-filter-divider" />
        </>
      ) : null}

      {/* Main Decade Pills Row */}
      <div className="level-filter-row">
        <span className="filter-label">LEVELS:</span>

        <div className="filter-options">
          {/* All Levels Button */}
          <button
            type="button"
            className={`filter-button ${selectedRange === null ? "active" : ""}`}
            onClick={() => {
              onRangeChange(null);
              setActiveDecade(null);
            }}
          >
            All Levels
          </button>

          {/* Decade Range Tabs */}
          {DECADES.map((d, idx) => {
            const isDecadeActive = activeDecade === idx;
            const isFullRangeSelected = selectedRange !== null && selectedRange[0] === d.min && selectedRange[1] === d.max;
            return (
              <button
                key={d.label}
                type="button"
                className={`filter-button decade-button ${isDecadeActive ? "decade-active" : ""} ${isFullRangeSelected ? "active" : ""}`}
                onClick={() => handleDecadeClick(idx)}
              >
                {d.label}
              </button>
            );
          })}

          {/* If no headerExtra, render dropdown inline at the end of decade pills */}
          {!headerExtra && renderDropdown()}
        </div>
      </div>

      {/* Sub-row for selecting individual levels when a decade group is active */}
      {activeDecade !== null && (
        <div className="sub-levels-row">
          <span className="sub-levels-label">
            Select Level ({DECADES[activeDecade].label}):
          </span>
          <div className="sub-levels-options">
            <button
              type="button"
              className={`sub-level-button ${selectedRange !== null && selectedRange[0] === DECADES[activeDecade].min && selectedRange[1] === DECADES[activeDecade].max ? "active" : ""}`}
              onClick={() => onRangeChange([DECADES[activeDecade].min, DECADES[activeDecade].max])}
            >
              All {DECADES[activeDecade].label}
            </button>
            {Array.from(
              { length: DECADES[activeDecade].max - DECADES[activeDecade].min + 1 },
              (_, i) => DECADES[activeDecade].min + i
            ).map((lvl) => (
              <button
                key={`sub-lvl-${lvl}`}
                type="button"
                className={`sub-level-button ${activeSingleLevel === lvl ? "active" : ""}`}
                onClick={() => handleSingleLevelClick(lvl)}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
