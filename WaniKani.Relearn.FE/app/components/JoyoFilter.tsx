import React from "react";
import "./LevelFilter.css";

export type JoyoGrade = string | null;

interface JoyoFilterProps {
  selectedGrade: JoyoGrade;
  onGradeChange: (grade: JoyoGrade) => void;
}

const GRADES: { label: string; value: JoyoGrade }[] = [
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
  selectedGrade,
  onGradeChange,
}) => {
  return (
    <div className="level-filter-container">
      <span className="filter-label">Jouyou:</span>
      <div className="filter-options">
        {GRADES.map((grade) => (
          <button
            key={grade.label}
            className={`filter-button ${selectedGrade === grade.value ? "active" : ""}`}
            onClick={() => onGradeChange(grade.value)}
          >
            {grade.label}
          </button>
        ))}
      </div>
    </div>
  );
};
