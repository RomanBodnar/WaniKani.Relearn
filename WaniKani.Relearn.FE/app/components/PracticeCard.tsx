import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import type { Subject } from '~/hooks/Subject';
import { API_ENDPOINTS } from '~/config/api';
import { transformSubject } from '~/utils/transformSubject';
import { SubjectCharacter } from './SubjectCharacter';
import { useBookmarks } from '~/hooks/useBookmarks';
import './PracticeCard.css';

// Client-side cache to prevent refetching
const subjectCache = new Map<number, Subject>();

interface PracticeCardProps {
  subject: Subject;
  variant?: 'kanji' | 'vocabulary' | 'radical';
  isActive: boolean;
}

export const PracticeCard = ({ subject, variant, isActive }: PracticeCardProps) => {
  const [fullData, setFullData] = useState<Subject | null>(subjectCache.get(subject.Id) || null);
  const [isLoading, setIsLoading] = useState(false);
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarks();

  const bookmarked = isBookmarked(subject.Id);

  useEffect(() => {
    if (!isActive) return;
    if (fullData) return; // already cached

    let isMounted = true;
    const fetchFullData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(API_ENDPOINTS.subjectById(subject.Id));
        if (response.ok) {
          const apiData = await response.json();
          const transformed = transformSubject(apiData);
          subjectCache.set(subject.Id, transformed);
          if (isMounted) {
            setFullData(transformed);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchFullData();

    return () => { isMounted = false; };
  }, [isActive, subject.Id, fullData]);

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (bookmarked) {
      removeBookmark(subject.Id);
    } else {
      addBookmark(subject);
    }
  };

  const displayData = fullData || subject;
  const meanings = displayData.Meanings || [];
  const readings = displayData.Readings || [];
  const pos = displayData.PartsOfSpeech || [];

  return (
    <div className={`practice-card ${variant ? `practice-card-${variant}` : ''} ${bookmarked ? 'bookmarked-card' : ''}`}>
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
      </button>

      <div className="practice-card-top">
        <div className="practice-card-character japanese-text">
          <SubjectCharacter subject={{ Characters: subject.Characters, CharacterImages: subject.CharacterImages, Slug: subject.Slug }} />
        </div>
      </div>

      <div className="practice-card-content">
        {meanings.length > 0 && (
          <div className="practice-card-section">
            <h4 className="practice-card-section-title">Meanings</h4>
            <p className="practice-card-section-text">
              {meanings.map((m, i) => (
                <span key={`meaning-${i}`} className={`practice-inline-text ${m.Primary ? 'primary' : 'secondary'}`}>
                  {m.Meaning}{i < meanings.length - 1 ? ', ' : ''}
                </span>
              ))}
            </p>
          </div>
        )}

        {readings.length > 0 && (
          <div className="practice-card-section">
            <h4 className="practice-card-section-title">Readings</h4>
            <p className="practice-card-section-text japanese-text">
              {readings.map((r, i) => (
                <span key={`reading-${i}`} className={`practice-inline-text ${r.Primary ? 'primary' : 'secondary'}`}>
                  {r.Reading}{i < readings.length - 1 ? ', ' : ''}
                </span>
              ))}
            </p>
          </div>
        )}

        {pos.length > 0 && (
          <div className="practice-card-section">
            <h4 className="practice-card-section-title">Part of Speech</h4>
            <p className="practice-card-section-text">{pos.join(', ')}</p>
          </div>
        )}

        {isLoading && !fullData && (
          <div className="practice-card-loading">Loading details...</div>
        )}
      </div>

      <div className="practice-card-footer">
        <Link to={`/subject/${subject.Id}`} className="practice-card-btn" onClick={(e) => e.stopPropagation()}>
          View Full Details
        </Link>
      </div>
    </div>
  );
};
