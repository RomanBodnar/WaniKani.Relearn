import type { Route } from "../+types/root";
import { useNavigate, Link } from "react-router";
import { type Subject } from "~/hooks/Subject";
import { API_ENDPOINTS } from "~/config/api";
import { transformSubject } from "~/utils/transformSubject";
import type { SubjectDetailData } from "~/types/subject";
import { parseMnemonics } from "~/utils/parseMnemonics";
import { createGrammarSlug } from "~/utils/grammar";
import { SubjectCharacter } from "~/components/SubjectCharacter";
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
    const componentSubjects: Subject[] = [];
    if (subject.ComponentSubjectIds && subject.ComponentSubjectIds.length > 0) {
      const componentPromises = subject.ComponentSubjectIds.map((componentId) =>
        fetchSubjectById(componentId)
      );
      const results = await Promise.all(componentPromises);
      componentSubjects.push(...results.filter((result): result is Subject => result !== null));
    }

    const amalgamationSubjects: Subject[] = [];
    if (subject.AmalgamationSubjectIds && subject.AmalgamationSubjectIds.length > 0) {
      const amalgamationPromises = subject.AmalgamationSubjectIds.map((amalgamationId) =>
        fetchSubjectById(amalgamationId)
      );
      const results = await Promise.all(amalgamationPromises);
      amalgamationSubjects.push(...results.filter((result): result is Subject => result !== null));
    }

    const visuallySimilarSubjects: Subject[] = [];
    if (subject.VisuallySimilarSubjectIds && subject.VisuallySimilarSubjectIds.length > 0) {
      const similarPromises = subject.VisuallySimilarSubjectIds.map((simId) =>
        fetchSubjectById(simId)
      );
      const results = await Promise.all(similarPromises);
      visuallySimilarSubjects.push(...results.filter((result): result is Subject => result !== null));
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
    kana_vocabulary: "/vocabulary",
  };
  const backPath = subjectListRoutes[subject.Object] || "/";

  return (
    <div className="subject-detail-container">
      {/* Background Side Decorations */}
      {subject.Characters && (
        <div
          className="subject-side-decoration subject-side-decoration-left"
          style={{ '--char-count': subject.Characters.length } as React.CSSProperties}
          aria-hidden="true"
        >
          {subject.Characters}
        </div>
      )}
      {subject.Characters && (
        <div
          className="subject-side-decoration subject-side-decoration-right"
          style={{ '--char-count': subject.Characters.length } as React.CSSProperties}
          aria-hidden="true"
        >
          {subject.Characters}
        </div>
      )}

      {/* Back navigation row */}
      <div className="subject-nav-row">
        <button
          className="back-button"
          onClick={() => navigate(backPath)}
          aria-label="Go back"
        >
          <span className="back-arrow">←</span>
          <span className="back-label">Back</span>
        </button>
      </div>

      {/* Hero header card */}
      <div className="subject-detail-header">
        {/* Accent character bubble */}
        <div
          className="subject-char-bubble"
          style={{
            backgroundColor: `var(--color-wk-${subject.Object.replace('_', '-')})`,
            '--char-count': subject.Characters?.length || 1,
          } as React.CSSProperties}
        >
          <SubjectCharacter
            subject={{ Characters: subject.Characters, CharacterImages: subject.CharacterImages, Slug: subject.Slug }}
            className="subject-detail-character japanese-text"
          />
        </div>

        {/* Title + metadata */}
        <div className="subject-detail-info">
          <span
            className="subject-type-badge"
            style={{ color: `var(--color-wk-${subject.Object.replace('_', '-')})` }}
          >
            {subject.Object.replace('_', ' ')}
          </span>
          {primaryMeaning && (
            <h1 className="subject-detail-primary-meaning">{primaryMeaning}</h1>
          )}
          {subject.Level !== undefined && (
            <div className="subject-meta-row">
              <span className="subject-meta-chip">Level {subject.Level}</span>
            </div>
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
            <h2>Radical components</h2>
            <div className="subject-links">
              {componentSubjects.map((comp) => {
                const meaning = comp.Meanings?.find(m => m.Primary)?.Meaning || comp.Meanings?.[0]?.Meaning || "";
                const reading = comp.Readings?.find(r => r.Primary)?.Reading || comp.Readings?.[0]?.Reading || "";
                return (
                  <Link
                    key={comp.Id}
                    to={`/subject/${comp.Id}`}
                    className="subject-link"
                  >
                    <div
                      className="subject-link-char-box"
                      style={{ backgroundColor: `var(--color-wk-${comp.Object.replace('_', '-')})` }}
                    >
                      <SubjectCharacter
                        subject={{ Characters: comp.Characters, CharacterImages: comp.CharacterImages, Slug: comp.Slug }}
                      />
                    </div>
                    <div className="subject-link-info">
                      {reading && <div className="subject-link-reading japanese-text">{reading}</div>}
                      <div className="subject-link-meaning">{meaning}</div>
                    </div>
                  </Link>
                );
              })}
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
              {amalgamationSubjects.map((amal) => {
                const meaning = amal.Meanings?.find(m => m.Primary)?.Meaning || amal.Meanings?.[0]?.Meaning || "";
                const reading = amal.Readings?.find(r => r.Primary)?.Reading || amal.Readings?.[0]?.Reading || "";
                return (
                  <Link
                    key={amal.Id}
                    to={`/subject/${amal.Id}`}
                    className="subject-link"
                  >
                    <div
                      className="subject-link-char-box"
                      style={{ backgroundColor: `var(--color-wk-${amal.Object.replace('_', '-')})` }}
                    >
                      <SubjectCharacter
                        subject={{ Characters: amal.Characters, CharacterImages: amal.CharacterImages, Slug: amal.Slug }}
                      />
                    </div>
                    <div className="subject-link-info">
                      {reading && <div className="subject-link-reading japanese-text">{reading}</div>}
                      <div className="subject-link-meaning">{meaning}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Visually Similar Kanji */}
        {visuallySimilarSubjects && visuallySimilarSubjects.length > 0 && (
          <section className="detail-section">
            <h2>Visually Similar Kanji</h2>
            <div className="subject-links">
              {visuallySimilarSubjects.map((sim) => {
                const meaning = sim.Meanings?.find(m => m.Primary)?.Meaning || sim.Meanings?.[0]?.Meaning || "";
                const reading = sim.Readings?.find(r => r.Primary)?.Reading || sim.Readings?.[0]?.Reading || "";
                return (
                  <Link
                    key={sim.Id}
                    to={`/subject/${sim.Id}`}
                    className="subject-link"
                  >
                    <div
                      className="subject-link-char-box"
                      style={{ backgroundColor: `var(--color-wk-${sim.Object.replace('_', '-')})` }}
                    >
                      <SubjectCharacter
                        subject={{ Characters: sim.Characters, CharacterImages: sim.CharacterImages, Slug: sim.Slug }}
                      />
                    </div>
                    <div className="subject-link-info">
                      {reading && <div className="subject-link-reading japanese-text">{reading}</div>}
                      <div className="subject-link-meaning">{meaning}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
