import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "react-router";
import type { Route } from "./+types/search";
import type { Subject } from "~/hooks/Subject";
import { fetchSubjects, type SubjectType, type PaginatedSubjects } from "~/hooks/useSubjects";
import { SubjectCard } from "~/components/SubjectCard";
import { LoadingSpinner } from "~/components/LoadingSpinner";
import "./search.css";

interface SearchData {
  radicals: PaginatedSubjects;
  kanji: PaginatedSubjects;
  vocabulary: PaginatedSubjects;
}

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Search | BonPom" },
    { name: "description", content: "Search across all subjects" },
  ];
}

export async function clientLoader(): Promise<SearchData> {
  const [radicals, kanji, vocabulary] = await Promise.all([
    fetchSubjects("radical", 1, 500),
    fetchSubjects("kanji", 1, 500),
    fetchSubjects("vocabulary", 1, 500),
  ]);
  return { radicals, kanji, vocabulary };
}

function getVariant(objectType: string): "radical" | "kanji" | "vocabulary" {
  switch (objectType?.toLowerCase()) {
    case "radical": return "radical";
    case "kanji": return "kanji";
    default: return "vocabulary";
  }
}

function matchesQuery(subject: Subject, query: string): boolean {
  if (!query) return false;

  // Match by characters
  if (subject.Characters?.toLowerCase().includes(query)) return true;

  // Match by meanings
  if (subject.Meanings?.some(m => m.Meaning.toLowerCase().includes(query))) return true;

  // Match by readings
  if (subject.Readings?.some(r => r.Reading.toLowerCase().includes(query))) return true;

  // Match by slug
  if (subject.Slug?.toLowerCase().includes(query)) return true;

  return false;
}

interface SearchSectionProps {
  title: string;
  badge: string;
  variant: "radical" | "kanji" | "vocabulary";
  subjects: Subject[];
}

function SearchSection({ title, badge, variant, subjects }: SearchSectionProps) {
  if (subjects.length === 0) return null;

  return (
    <section className="search-section">
      <div className="search-section-header">
        <span className={`search-section-badge search-section-badge-${variant}`}>{badge}</span>
        <h2 className="search-section-title">{title}</h2>
        <span className="search-section-count">{subjects.length} result{subjects.length !== 1 ? "s" : ""}</span>
      </div>
      <div className="search-section-grid">
        {subjects.map((subject) => (
          <SubjectCard key={subject.Id} subject={subject} variant={variant} />
        ))}
      </div>
    </section>
  );
}

export default function Search({ loaderData }: Route.ComponentProps) {
  const { radicals, kanji, vocabulary } = loaderData as SearchData;
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const inputRef = useRef<HTMLInputElement>(null);

  // Load more data in the background
  const [allRadicals, setAllRadicals] = useState<Subject[]>(radicals.data);
  const [allKanji, setAllKanji] = useState<Subject[]>(kanji.data);
  const [allVocabulary, setAllVocabulary] = useState<Subject[]>(vocabulary.data);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Background-load remaining pages for each type
  const loadAllPages = useCallback(async (type: SubjectType, initial: PaginatedSubjects): Promise<Subject[]> => {
    const all = [...initial.data];
    let currentPage = initial.page;
    const totalPages = Math.ceil(initial.totalCount / initial.perPage);

    while (currentPage < totalPages) {
      currentPage++;
      const result = await fetchSubjects(type, currentPage, 500);
      all.push(...result.data);
    }
    return all;
  }, []);

  useEffect(() => {
    let cancelled = false;
    const loadRemaining = async () => {
      const hasMoreRadicals = radicals.data.length < radicals.totalCount;
      const hasMoreKanji = kanji.data.length < kanji.totalCount;
      const hasMoreVocab = vocabulary.data.length < vocabulary.totalCount;

      if (!hasMoreRadicals && !hasMoreKanji && !hasMoreVocab) return;

      setIsLoadingMore(true);
      try {
        const [r, k, v] = await Promise.all([
          hasMoreRadicals ? loadAllPages("radical", radicals) : Promise.resolve(radicals.data),
          hasMoreKanji ? loadAllPages("kanji", kanji) : Promise.resolve(kanji.data),
          hasMoreVocab ? loadAllPages("vocabulary", vocabulary) : Promise.resolve(vocabulary.data),
        ]);
        if (!cancelled) {
          setAllRadicals(r);
          setAllKanji(k);
          setAllVocabulary(v);
        }
      } catch (err) {
        console.error("Failed to load all subjects for search:", err);
      } finally {
        if (!cancelled) setIsLoadingMore(false);
      }
    };
    loadRemaining();
    return () => { cancelled = true; };
  }, [radicals, kanji, vocabulary, loadAllPages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (val) {
        next.set("q", val);
      } else {
        next.delete("q");
      }
      return next;
    }, { replace: true });
  };

  const normalizedQuery = query.toLowerCase().trim();

  const filteredRadicals = useMemo(() => {
    if (!normalizedQuery) return [];
    return allRadicals.filter(s => matchesQuery(s, normalizedQuery));
  }, [allRadicals, normalizedQuery]);

  const filteredKanji = useMemo(() => {
    if (!normalizedQuery) return [];
    return allKanji.filter(s => matchesQuery(s, normalizedQuery));
  }, [allKanji, normalizedQuery]);

  const filteredVocabulary = useMemo(() => {
    if (!normalizedQuery) return [];
    return allVocabulary.filter(s => matchesQuery(s, normalizedQuery));
  }, [allVocabulary, normalizedQuery]);

  const totalResults = filteredRadicals.length + filteredKanji.length + filteredVocabulary.length;

  return (
    <div className="search-page">
      <div className="search-page-header">
        <h1 className="search-page-title">
          {normalizedQuery ? (
            <>Results for <span className="search-page-query">"{query}"</span></>
          ) : (
            "Search"
          )}
        </h1>
        {normalizedQuery && (
          <p className="search-page-subtitle">
            {totalResults} result{totalResults !== 1 ? "s" : ""} found across all subjects
            {isLoadingMore && " (still loading more data…)"}
          </p>
        )}
      </div>

      {!normalizedQuery ? (
        <div className="search-prompt">
          <svg className="search-prompt-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
          </svg>
          <p className="search-prompt-title">Search all subjects</p>
          <p className="search-prompt-description">
            Type a character, meaning, or reading to search across radicals, kanji, and vocabulary.
          </p>
        </div>
      ) : totalResults === 0 ? (
        <div className="search-empty">
          <svg className="search-empty-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /><path d="M8 11h6" />
          </svg>
          <p className="search-empty-title">No results found</p>
          <p className="search-empty-description">
            No subjects match "{query}". Try a different search term.
          </p>
        </div>
      ) : (
        <>
          {totalResults > 0 && (
            <div className="search-stats">
              {filteredRadicals.length > 0 && (
                <span className="search-stat-chip">
                  <span className="search-stat-chip-dot search-stat-chip-dot-radical" />
                  {filteredRadicals.length} radical{filteredRadicals.length !== 1 ? "s" : ""}
                </span>
              )}
              {filteredKanji.length > 0 && (
                <span className="search-stat-chip">
                  <span className="search-stat-chip-dot search-stat-chip-dot-kanji" />
                  {filteredKanji.length} kanji
                </span>
              )}
              {filteredVocabulary.length > 0 && (
                <span className="search-stat-chip">
                  <span className="search-stat-chip-dot search-stat-chip-dot-vocabulary" />
                  {filteredVocabulary.length} vocabulary
                </span>
              )}
            </div>
          )}

          <SearchSection
            title="Radicals"
            badge="部首"
            variant="radical"
            subjects={filteredRadicals}
          />
          <SearchSection
            title="Kanji"
            badge="漢字"
            variant="kanji"
            subjects={filteredKanji}
          />
          <SearchSection
            title="Vocabulary"
            badge="単語"
            variant="vocabulary"
            subjects={filteredVocabulary}
          />
        </>
      )}
    </div>
  );
}
