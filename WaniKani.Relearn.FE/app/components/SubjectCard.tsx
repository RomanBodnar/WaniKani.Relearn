import type { Subject } from "~/hooks/Subject";
import { Link } from "react-router";
import { SubjectCharacter } from "./SubjectCharacter";
import { useBookmarks } from "~/hooks/useBookmarks";
import "./SubjectCard.css";

interface SubjectCardProps {
  subject: Subject;
  variant?: "kanji" | "vocabulary" | "radical";
  onClick?: (e: React.MouseEvent, subject: Subject) => void;
}

export const SubjectCard = ({ subject, variant, onClick }: SubjectCardProps) => {
  const primaryMeaning = subject.Meanings?.find((m) => m.Primary);
  const primaryReading = subject.Readings?.find((r) => r.Primary);
  const { isBookmarked, addBookmark, removeBookmark, isLoggedIn } = useBookmarks();

  const bookmarked = isBookmarked(subject.Id);

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation();
    if (bookmarked) {
      removeBookmark(subject.Id);
    } else {
      addBookmark(subject);
    }
  };

  return (
    <Link 
      to={`/subject/${subject.Id}`} 
      className="subject-card-link"
      onClick={onClick ? (e) => { e.preventDefault(); onClick(e, subject); } : undefined}
    >
      <div className={`subject-card ${variant ? `subject-card-${variant}` : ''} ${bookmarked ? 'bookmarked-card' : ''}`}>
        {isLoggedIn && (
          <button 
            className={`subject-bookmark-btn ${bookmarked ? 'bookmarked' : ''}`}
            onClick={handleBookmarkClick}
            aria-label={bookmarked ? "Remove from My Box" : "Add to My Box"}
          >
            {bookmarked ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            )}
            <span className="subject-bookmark-tooltip">
              {bookmarked ? "Remove from My Box" : "Add to My Box"}
            </span>
          </button>
        )}
        <div className="subject-card-character japanese-text">
          <SubjectCharacter subject={{ Characters: subject.Characters, CharacterImages: subject.CharacterImages, Slug: subject.Slug }} />
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
