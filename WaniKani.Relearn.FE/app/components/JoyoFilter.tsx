import React from "react";
import "./LevelFilter.css";

export type JoyoGrade = string;

interface JoyoFilterProps {
  selectedGrades: string[];
  onGradesChange: (grades: string[]) => void;
}

const GRADES: { label: string; value: string | null }[] = [
  { label: "All Jouyou", value: null },
  { label: "Grade 1", value: "1" },
  { label: "Grade 2", value: "2" },
  { label: "Grade 3", value: "3" },
  { label: "Grade 4", value: "4" },
  { label: "Grade 5", value: "5" },
  { label: "Grade 6", value: "6" },
  { label: "Junior High", value: "8" },
];

export const JoyoFilter: React.FC<JoyoFilterProps> = ({
  selectedGrades,
  onGradesChange,
}) => {
  const handleToggle = (value: string | null) => {
    if (value === null) {
      onGradesChange([]);
    } else {
      if (selectedGrades.includes(value)) {
        onGradesChange(selectedGrades.filter((v) => v !== value));
      } else {
        onGradesChange([...selectedGrades, value]);
      }
    }
  };

  return (
    <div className="level-filter-container">
      <span className="filter-label">Jouyou:</span>
      <div className="filter-options">
        {GRADES.map((grade) => {
          const isActive = grade.value === null 
            ? selectedGrades.length === 0 
            : selectedGrades.includes(grade.value);
            
          return (
            <button
              key={grade.label}
              className={`filter-button ${isActive ? "active" : ""}`}
              onClick={() => handleToggle(grade.value)}
            >
              {grade.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
