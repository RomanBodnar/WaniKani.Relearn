import { useEffect, useState } from "react";
import { Link } from "react-router";
import { API_ENDPOINTS } from "~/config/api";
import { type Subject } from "~/hooks/Subject";
import { transformSubject } from "~/utils/transformSubject";
import "./SubjectPreviewInline.css";

interface SubjectPreviewInlineProps {
  subjectId: number;
  isClosing?: boolean;
}

export function SubjectPreviewInline({ subjectId, isClosing }: SubjectPreviewInlineProps) {
  const [subject, setSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Wait for the next frame to trigger the CSS transition
    const frame = requestAnimationFrame(() => setIsOpen(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetch(API_ENDPOINTS.subjectById(subjectId))
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          setSubject(transformSubject(data));
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch subject", err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [subjectId]);

  const primaryMeaning = subject?.Meanings?.find(m => m.Primary)?.Meaning || subject?.Meanings?.[0]?.Meaning || "";
  const primaryReading = subject?.Readings?.find(r => r.Primary)?.Reading || subject?.Readings?.[0]?.Reading || "";

  return (
    <div className={`subject-preview-inline-wrapper ${isOpen && !isClosing ? 'open' : ''}`}>
      <div className={`subject-preview-inline ${loading && subject ? 'loading-update' : ''}`}>
        {(!subject && loading) ? (
          <div className="subject-preview-loading">Loading...</div>
        ) : subject ? (
        <div className="subject-preview-row">
          <div className="subject-preview-info">
            <span className={`subject-preview-chars-pill ${subject.Object.replace('_', '-')}`} title={subject.Object.replace('_', ' ')}>
              {subject.Characters}
            </span>
            
            <div className="subject-preview-stats-row">
              {primaryReading && (
                <span className="stat-value japanese-text">{primaryReading}</span>
              )}
              {(primaryReading && primaryMeaning) && <span className="stat-divider">|</span>}
              {primaryMeaning && (
                <span className="stat-value meaning">{primaryMeaning}</span>
              )}
            </div>
          </div>

          <div className="subject-preview-actions-row">
            <button className="subject-preview-add-btn-small" type="button">
              + My Box
            </button>
            <Link to={`/subject/${subject.Id}`} className="subject-preview-full-link" title="View Full Details">
              View Full Details &rarr;
            </Link>
          </div>
          </div>
        ) : (
          <div className="subject-preview-error">Failed to load subject.</div>
        )}
      </div>
    </div>
  );
}
