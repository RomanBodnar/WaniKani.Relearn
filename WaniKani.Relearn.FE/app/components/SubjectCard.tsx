import type { Subject } from "~/hooks/Subject";
import { Link } from "react-router";
import { SubjectCharacter } from "./SubjectCharacter";
import "./SubjectCard.css";

interface SubjectCardProps {
  subject: Subject;
  variant?: "kanji" | "vocabulary" | "radical";
}

export const SubjectCard = ({ subject, variant }: SubjectCardProps) => {
  const primaryMeaning = subject.Meanings?.find((m) => m.Primary);
  const primaryReading = subject.Readings?.find((r) => r.Primary);

  return (
    <Link to={`/subject/${subject.Id}`} className="subject-card-link">
      <div className={`subject-card ${variant ? `subject-card-${variant}` : ''}`}>
        <div className="subject-card-character japanese-text">
          <SubjectCharacter subject={{ Characters: subject.Characters, CharacterImages: subject.CharacterImages }} />
        </div>
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
    </Link>
  );
};
