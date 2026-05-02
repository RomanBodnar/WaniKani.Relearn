import type { Route } from "../+types/root";
import { useNavigate, Link } from "react-router";
import { type Subject } from "~/hooks/Subject";
import { API_ENDPOINTS } from "~/config/api";
import { transformSubject } from "~/utils/transformSubject";
import type { SubjectDetailData } from "~/types/subject";
import { parseMnemonics } from "~/utils/parseMnemonics";
import { createGrammarSlug } from "~/utils/grammar";
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

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
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

    const visuallySimilarSubjects: Array<{ id: number; characters: string }> = [];
    if (subject.VisuallySimilarSubjectIds && subject.VisuallySimilarSubjectIds.length > 0) {
      const similarPromises = subject.VisuallySimilarSubjectIds.map((simId) =>
        fetchSubjectById(simId)
      );
      const results = await Promise.all(similarPromises);
      visuallySimilarSubjects.push(
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
      visuallySimilarSubjects,
    };
  } catch (error) {
    console.error("Failed to fetch subject:", error);
    throw new Response("Failed to load subject", { status: 500 });
  }
}

export default function SubjectDetail({ loaderData }: Route.ComponentProps) {
  const { subject, componentSubjects, amalgamationSubjects, visuallySimilarSubjects } = loaderData as unknown as SubjectDetailData;
  const navigate = useNavigate();
  const primaryMeaning = subject.Meanings?.find(m => m.Primary)?.Meaning || subject.Meanings?.[0]?.Meaning || "";

  // Map subject type to its list route
  const subjectListRoutes: Record<string, string> = {
    kanji: "/kanji",
    radical: "/radicals",
    vocabulary: "/vocabulary",
    kana_vocabulary: "/kana-vocabulary",
  };
  const backPath = subjectListRoutes[subject.Object] || "/";

  return (
    <div className="subject-detail-container">
      {/* Background Side Decorations */}
      <div
        className="subject-side-decoration subject-side-decoration-left"
        style={{ '--char-count': subject.Characters.length } as React.CSSProperties}
        aria-hidden="true"
      >
        {subject.Characters}
      </div>
      <div
        className="subject-side-decoration subject-side-decoration-right"
        style={{ '--char-count': subject.Characters.length } as React.CSSProperties}
        aria-hidden="true"
      >
        {subject.Characters}
      </div>

      <div
        className="subject-detail-header"
        style={{ backgroundColor: `var(--color-wk-${subject.Object.replace('_', '-')})` }}
      >
        <button
          className="back-button"
          onClick={() => navigate(backPath)}
          aria-label="Go back"
        >
          ←
        </button>
        <div className="subject-detail-character japanese-text">{subject.Characters}</div>
        <div className="subject-detail-info">
          {primaryMeaning && (
            <span className="subject-detail-primary-meaning">{primaryMeaning}</span>
          )}
          {subject.Level !== undefined && (
            <span className="subject-detail-level">Level {subject.Level}</span>
          )}
        </div>
      </div>

      <div className="subject-detail-content">
        {/* Meanings & Mnemonic Section */}
        {(subject.Meanings?.length || subject.MeaningMnemonic) ? (
          <section className="detail-section">
            <h2>Meanings</h2>

            {subject.Meanings && subject.Meanings.length > 0 && (
              <div className="meanings-layout mb-6">
                {subject.Meanings.filter(m => m.Primary).length > 0 && (
                  <div className="primary-meanings">
                    <span className="meaning-type-label">Primary</span>
                    <span className="primary-meaning-text">
                      {subject.Meanings.filter(m => m.Primary).map(m => m.Meaning).join(', ')}
                    </span>
                  </div>
                )}
                {subject.Meanings.filter(m => !m.Primary).length > 0 && (
                  <div className="alternative-meanings mt-4">
                    <span className="meaning-type-label">Alternatives</span>
                    <span className="alternative-meaning-text">
                      {subject.Meanings.filter(m => !m.Primary).map(m => m.Meaning).join(', ')}
                    </span>
                  </div>
                )}
              </div>
            )}

            {subject.MeaningMnemonic && (
              <div className="mnemonic-sub-section" style={{ marginTop: subject.Meanings?.length ? '20px' : '0' }}>
                <h3 style={{ fontSize: '16px', color: '#555', marginBottom: '10px' }}>Meaning Mnemonic</h3>
                <p className="mnemonic-text">{parseMnemonics(subject.MeaningMnemonic)}</p>
              </div>
            )}
          </section>
        ) : null}

        {/* Readings & Mnemonic Section */}
        {(subject.Readings?.length || subject.ReadingMnemonic) ? (
          <section className="detail-section">
            <h2>Readings</h2>

            {subject.Readings && subject.Readings.length > 0 && (
              <div className="readings-layout mb-6">
                {subject.Object === 'kanji' ? (
                  <div className="kanji-readings-grid">
                    <div className="reading-column">
                      <h3 className="reading-type-label">On'yomi</h3>
                      <div className="reading-items-inline">
                        {subject.Readings.filter(r => r.Type === 'onyomi').length > 0
                          ? subject.Readings.filter(r => r.Type === 'onyomi').map((r, i) => (
                            <span key={`on-${i}`} className={`reading-inline-text ${r.Primary ? 'primary' : 'secondary'}`}>{r.Reading}</span>
                          ))
                          : <span className="reading-inline-text none">None</span>}
                      </div>
                    </div>
                    <div className="reading-column">
                      <h3 className="reading-type-label">Kun'yomi</h3>
                      <div className="reading-items-inline">
                        {subject.Readings.filter(r => r.Type === 'kunyomi').length > 0
                          ? subject.Readings.filter(r => r.Type === 'kunyomi').map((r, i) => (
                            <span key={`kun-${i}`} className={`reading-inline-text ${r.Primary ? 'primary' : 'secondary'}`}>{r.Reading}</span>
                          ))
                          : <span className="reading-inline-text none">None</span>}
                      </div>
                    </div>
                    <div className="reading-column">
                      <h3 className="reading-type-label">Nanori</h3>
                      <div className="reading-items-inline">
                        {subject.Readings.filter(r => r.Type === 'nanori').length > 0
                          ? subject.Readings.filter(r => r.Type === 'nanori').map((r, i) => (
                            <span key={`nan-${i}`} className={`reading-inline-text ${r.Primary ? 'primary' : 'secondary'}`}>{r.Reading}</span>
                          ))
                          : <span className="reading-inline-text none">None</span>}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="vocab-readings-grid">
                    <div className="reading-column">
                      <h3 className="reading-type-label">Reading</h3>
                      <div className="reading-items-inline">
                        {subject.Readings.map((r, i) => (
                          <span key={`voc-${i}`} className={`reading-inline-text ${r.Primary ? 'primary' : 'secondary'}`}>{r.Reading}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {subject.ReadingMnemonic && (
              <div className="mnemonic-sub-section" style={{ marginTop: subject.Readings?.length ? '20px' : '0' }}>
                <h3 style={{ fontSize: '16px', color: '#555', marginBottom: '10px' }}>Reading Mnemonic</h3>
                <p className="mnemonic-text">{parseMnemonics(subject.ReadingMnemonic)}</p>
              </div>
            )}
          </section>
        ) : null}

        {/* Parts of Speech */}
        {subject.PartsOfSpeech && subject.PartsOfSpeech.length > 0 && (
          <section className="detail-section">
            <h2>Parts of Speech</h2>
            <div className="parts-of-speech">
              {subject.PartsOfSpeech.map((pos, idx) => (
                <Link key={idx} to={`/grammar/${createGrammarSlug(pos)}`} className="pos-tag" style={{ textDecoration: 'none' }}>
                  {pos}
                </Link>
              ))}
            </div>
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
              {subject.Object === 'kanji' && 'Found in Vocabulary'}
              {subject.Object === 'radical' && 'Used in Kanji'}
              {subject.Object !== 'kanji' && subject.Object !== 'radical' && 'Used In'}
              {' '}({subject.AmalgamationSubjectIds?.length || 0})
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

        {/* Visually Similar Kanji */}
        {visuallySimilarSubjects && visuallySimilarSubjects.length > 0 && (
          <section className="detail-section">
            <h2>Visually Similar ({visuallySimilarSubjects.length})</h2>
            <div className="subject-links">
              {visuallySimilarSubjects.map((sim) => (
                <Link
                  key={sim.id}
                  to={`/subject/${sim.id}`}
                  className="subject-link"
                >
                  {sim.characters}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
