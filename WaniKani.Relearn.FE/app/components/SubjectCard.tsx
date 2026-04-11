import type { Subject } from "~/hooks/Subject";
import "./SubjectCard.css";

interface SubjectCardProps {
  subject: Subject;
}

export const SubjectCard = ({ subject }: SubjectCardProps) => {
console.log("Rendering SubjectCard for subject:", subject);
  const primaryMeaning = subject.Data.Meanings.find((m) => m.Primary);
  const primaryReading = subject.Data.Readings?.find((r) => r.Primary);
console.log("Primary meaning:", primaryMeaning);
  return (
    <div className="subject-card">
      <div className="subject-card-character">
        {subject.Data.Characters}
      </div>
      <div className="subject-card-content">
        {primaryMeaning && (
          <div className="subject-card-meaning">
            <strong>{primaryMeaning.Meaning}</strong>
          </div>
        )}
        {primaryReading && (
          <div className="subject-card-reading">
            {primaryReading.Reading}
          </div>
        )}
        {subject.Data.Level !== undefined && (
          <div className="subject-card-level">
            Level {subject.Data.Level}
          </div>
        )}
        {subject.Data.PartOfSpeech && subject.Data.PartOfSpeech.length > 0 && (
          <div className="subject-card-pos">
            {subject.Data.PartOfSpeech.join(", ")}
          </div>
        )}
      </div>
    </div>
  );
};
