import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { API_ENDPOINTS } from "~/config/api";
import { type Subject } from "~/hooks/Subject";
import { transformSubject } from "~/utils/transformSubject";
import "./SubjectPreviewModal.css";

interface SubjectPreviewModalProps {
  subjectId: number;
  anchorElement: HTMLElement | null;
  onClose: () => void;
}

export function SubjectPreviewModal({ subjectId, anchorElement, onClose }: SubjectPreviewModalProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [subject, setSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);

  // Open native popover and position it
  useEffect(() => {
    const popover = popoverRef.current;
    if (!popover) return;

    if (!popover.matches(":popover-open")) {
      popover.showPopover();
    }

    const updatePosition = () => {
      if (!anchorElement) return;
      const rect = anchorElement.getBoundingClientRect();
      const width = popover.offsetWidth;
      const height = popover.offsetHeight;
      
      let top = rect.bottom + 12; 
      let left = rect.left + (rect.width / 2) - (width / 2);
      let transformOrigin = "top center";

      // Horizontal boundaries
      if (left < 16) left = 16;
      else if (left + width > window.innerWidth - 16) left = window.innerWidth - width - 16;

      // Vertical boundaries (if not enough space below, show above)
      if (top + height > window.innerHeight - 16) {
        // Check if there is more space above
        if (rect.top > window.innerHeight - rect.bottom) {
          top = rect.top - height - 12;
          transformOrigin = "bottom center";
        }
        
        // Final clamping
        if (top + height > window.innerHeight - 16) {
          top = window.innerHeight - height - 16;
        }
        if (top < 16) top = 16;
      }

      popover.style.top = `${top}px`;
      popover.style.left = `${left}px`;
      popover.style.margin = '0';
      popover.style.transformOrigin = transformOrigin;
    };

    updatePosition();

    const resizeObserver = new ResizeObserver(() => {
      updatePosition();
    });
    resizeObserver.observe(popover);

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, { passive: true });

    const handleToggle = (e: Event) => {
      const evt = e as ToggleEvent;
      if (evt.newState === "closed") {
        onClose();
      }
    };

    popover.addEventListener("toggle", handleToggle);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
      popover.removeEventListener("toggle", handleToggle);
    };
  }, [anchorElement, onClose, subject, loading]);

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
    <div 
      ref={popoverRef} 
      popover="auto"
      className="subject-preview-modal"
    >
      <div className="subject-preview-content">
        {loading ? (
          <div className="subject-preview-loading">Loading...</div>
        ) : subject ? (
          <>
            <div className="subject-preview-header">
              <span className={`subject-preview-type ${subject.Object.replace('_', '-')}`}>
                {subject.Object.replace('_', ' ')}
              </span>
              <h2 className="subject-preview-characters">{subject.Characters}</h2>
            </div>
            
            <div className="subject-preview-stats">
              {primaryReading && (
                <div className="stat-row">
                  <span className="stat-label">Reading</span>
                  <span className="stat-value japanese-text">{primaryReading}</span>
                </div>
              )}
              {primaryMeaning && (
                <div className="stat-row">
                  <span className="stat-label">Meaning</span>
                  <span className="stat-value">{primaryMeaning}</span>
                </div>
              )}
            </div>

            <div className="subject-preview-actions">
              <button className="subject-preview-add-btn" type="button">
                + My Box
              </button>
            </div>
            
            <div className="subject-preview-footer">
              <Link to={`/subject/${subject.Id}`} className="subject-preview-full-link">
                View Full Details &rarr;
              </Link>
            </div>
          </>
        ) : (
          <div className="subject-preview-error">Failed to load subject.</div>
        )}
      </div>
    </div>
  );
}
