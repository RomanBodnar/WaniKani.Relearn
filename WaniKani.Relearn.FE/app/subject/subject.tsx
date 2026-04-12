import type { Route } from "../+types/root";
import { useNavigate, Link } from "react-router";
import { type Subject } from "~/hooks/Subject";
import { API_ENDPOINTS } from "~/config/api";
import { transformSubject } from "~/utils/transformSubject";
import type { SubjectDetailData } from "~/types/subject";
import "./subject.css";

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: `Subject #${params.id} | WaniKani:Relearn` },
    { name: "description", content: "View subject details" },
  ];
}

/**
 * Fetches a subject by ID from the API
 */
async function fetchSubjectById(id: number | string): Promise<Subject | null> {
  const response = await fetch(API_ENDPOINTS.subjectById(id));
  if (!response.ok) {
    return null;
  }
  const data = await response.json();
  return transformSubject(data);
}

export async function loader({ params }: Route.LoaderArgs) {
  const id = params.id;
  if (!id) {
    throw new Response("Subject ID not found", { status: 404 });
  }

  try {
    const response = await fetch(API_ENDPOINTS.subjectById(id));

    if (!response.ok) {
      throw new Response("Subject not found", { status: 404 });
    }

    const apiData = await response.json();
    const subject = transformSubject(apiData);

    // Fetch related subjects (components and amalgamations) in parallel for performance
    const componentSubjects: Array<{ id: number; characters: string }> = [];
    if (subject.ComponentSubjectIds && subject.ComponentSubjectIds.length > 0) {
      const componentPromises = subject.ComponentSubjectIds.map((componentId) =>
        fetchSubjectById(componentId)
      );
      const results = await Promise.all(componentPromises);
      componentSubjects.push(
        ...results
          .filter((result) => result !== null)
          .map((result) => ({
            id: result!.Id,
            characters: result!.Characters,
          }))
      );
    }

    const amalgamationSubjects: Array<{ id: number; characters: string }> = [];
    if (subject.AmalgamationSubjectIds && subject.AmalgamationSubjectIds.length > 0) {
      // Limit to first 20 for performance
      const limitedIds = subject.AmalgamationSubjectIds.slice(0, 20);
      const amalgamationPromises = limitedIds.map((amalgamationId) =>
        fetchSubjectById(amalgamationId)
      );
      const results = await Promise.all(amalgamationPromises);
      amalgamationSubjects.push(
        ...results
          .filter((result) => result !== null)
          .map((result) => ({
            id: result!.Id,
            characters: result!.Characters,
          }))
      );
    }

    return {
      subject,
      componentSubjects,
      amalgamationSubjects,
    };
  } catch (error) {
    console.error("Failed to fetch subject:", error);
    throw new Response("Failed to load subject", { status: 500 });
  }
}

export default function SubjectDetail({ loaderData }: Route.ComponentProps) {
  const { subject, componentSubjects, amalgamationSubjects } = loaderData as unknown as SubjectDetailData;
  const navigate = useNavigate();

  return (
    <div className="subject-detail-container">
      <button
        className="back-button"
        onClick={() => navigate(-1)}
        aria-label="Go back"
      >
        ← Back
      </button>

      <div className="subject-detail-header">
        <div className="subject-detail-character">{subject.Characters}</div>
        <div className="subject-detail-info">
          <span className="subject-detail-type">{subject.Object}</span>
          {subject.Level !== undefined && (
            <span className="subject-detail-level">Level {subject.Level}</span>
          )}
        </div>
      </div>

      <div className="subject-detail-content">
        {/* Meanings Section */}
        {subject.Meanings && subject.Meanings.length > 0 && (
          <section className="detail-section">
            <h2>Meanings</h2>
            <div className="meanings-list">
              {subject.Meanings.map((meaning, idx) => (
                <div
                  key={idx}
                  className={`meaning-item ${
                    meaning.Primary ? "primary" : "secondary"
                  }`}
                >
                  <span className="meaning-text">{meaning.Meaning}</span>
                  {meaning.Primary && (
                    <span className="badge primary">Primary</span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Readings Section */}
        {subject.Readings && subject.Readings.length > 0 && (
          <section className="detail-section">
            <h2>Readings</h2>
            <div className="readings-list">
              {subject.Readings.map((reading, idx) => (
                <div
                  key={idx}
                  className={`reading-item ${
                    reading.Primary ? "primary" : "secondary"
                  }`}
                >
                  <span className="reading-text">{reading.Reading}</span>
                  {reading.Type && (
                    <span className="reading-type">{reading.Type}</span>
                  )}
                  {reading.Primary && (
                    <span className="badge primary">Primary</span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Parts of Speech */}
        {subject.PartsOfSpeech && subject.PartsOfSpeech.length > 0 && (
          <section className="detail-section">
            <h2>Parts of Speech</h2>
            <div className="parts-of-speech">
              {subject.PartsOfSpeech.map((pos, idx) => (
                <span key={idx} className="pos-tag">
                  {pos}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Meaning Mnemonic */}
        {subject.MeaningMnemonic && (
          <section className="detail-section mnemonic-section">
            <h2>Meaning Mnemonic</h2>
            <p className="mnemonic-text">{subject.MeaningMnemonic}</p>
          </section>
        )}

        {/* Reading Mnemonic */}
        {subject.ReadingMnemonic && (
          <section className="detail-section mnemonic-section">
            <h2>Reading Mnemonic</h2>
            <p className="mnemonic-text">{subject.ReadingMnemonic}</p>
          </section>
        )}

        {/* Context Sentences */}
        {subject.ContextSentences && subject.ContextSentences.length > 0 && (
          <section className="detail-section">
            <h2>Context Sentences</h2>
            <div className="context-sentences">
              {subject.ContextSentences.map((sentence, idx) => (
                <div key={idx} className="context-sentence">
                  <p className="sentence-ja">{sentence.ja}</p>
                  <p className="sentence-en">{sentence.en}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Component Subject IDs */}
        {componentSubjects && componentSubjects.length > 0 && (
          <section className="detail-section">
            <h2>Components</h2>
            <div className="subject-links">
              {componentSubjects.map((comp) => (
                <Link
                  key={comp.id}
                  to={`/subject/${comp.id}`}
                  className="subject-link"
                >
                  {comp.characters}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Amalgamation Subjects */}
        {amalgamationSubjects && amalgamationSubjects.length > 0 && (
          <section className="detail-section">
            <h2>
              Used In (
              {subject.AmalgamationSubjectIds?.length || 0})
            </h2>
            <div className="subject-links">
              {amalgamationSubjects.map((amal) => (
                <Link
                  key={amal.id}
                  to={`/subject/${amal.id}`}
                  className="subject-link"
                >
                  {amal.characters}
                </Link>
              ))}
              {subject.AmalgamationSubjectIds &&
                subject.AmalgamationSubjectIds.length > 20 && (
                  <span className="more-indicator">
                    +{subject.AmalgamationSubjectIds.length - 20} more
                  </span>
                )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
