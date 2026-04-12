import type { Subject } from "~/hooks/Subject";
import "./SubjectCard.css";

interface SubjectCardProps {
  subject: Subject;
}

export const SubjectCard = ({ subject }: SubjectCardProps) => {
  const primaryMeaning = subject.Meanings?.find((m) => m.Primary);
  const primaryReading = subject.Readings?.find((r) => r.Primary);

  return (
    <div className="subject-card">
      <div className="subject-card-character">{subject.Characters}</div>
      <div className="subject-card-content">
        {primaryMeaning && (
          <div className="subject-card-meaning">
            <strong>{primaryMeaning.Meaning}</strong>
          </div>
        )}
        {primaryReading && (
          <div className="subject-card-reading">{primaryReading.Reading}</div>
        )}
        {subject.Level !== undefined && (
          <div className="subject-card-level">Level {subject.Level}</div>
        )}
        {subject.PartsOfSpeech && subject.PartsOfSpeech.length > 0 && (
          <div className="subject-card-pos">
            {subject.PartsOfSpeech.join(", ")}
          </div>
        )}
      </div>
    </div>
  );
};
