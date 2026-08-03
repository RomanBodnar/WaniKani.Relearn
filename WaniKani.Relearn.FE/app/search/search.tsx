import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router";
import type { Route } from "./+types/search";
import type { Subject } from "~/hooks/Subject";
import { searchSubjects } from "~/hooks/useSubjects";
import { SubjectCard } from "~/components/SubjectCard";
import { LoadingSpinner } from "~/components/LoadingSpinner";
import "./search.css";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Search | BonPom" },
    { name: "description", content: "Search across all subjects" },
  ];
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

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const inputRef = useRef<HTMLInputElement>(null);

  const [searchResults, setSearchResults] = useState<Subject[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const normalizedQuery = query.trim();

  useEffect(() => {
    if (!normalizedQuery) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    let isMounted = true;
    setIsSearching(true);
    setSearchError(null);

    const performSearch = async () => {
      try {
        const result = await searchSubjects(normalizedQuery);
        if (isMounted) {
          setSearchResults(result.data || []);
        }
      } catch (err: any) {
        if (isMounted) {
          console.error("Search error:", err);
          setSearchError(err.message || "Search failed");
          setSearchResults([]);
        }
      } finally {
        if (isMounted) {
          setIsSearching(false);
        }
      }
    };

    const timer = setTimeout(performSearch, 200);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [normalizedQuery]);

  // Focus input on mount if needed
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const filteredRadicals = searchResults.filter(
    (s) => s.Object?.toLowerCase() === "radical"
  );
  const filteredKanji = searchResults.filter(
    (s) => s.Object?.toLowerCase() === "kanji"
  );
  const filteredVocabulary = searchResults.filter(
    (s) => s.Object?.toLowerCase() === "vocabulary" || s.Object?.toLowerCase() === "kana_vocabulary"
  );

  const totalResults = searchResults.length;

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
        {normalizedQuery && !isSearching && (
          <p className="search-page-subtitle">
            {totalResults} result{totalResults !== 1 ? "s" : ""} found across all subjects
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
      ) : isSearching ? (
        <div className="search-loading">
          <LoadingSpinner />
          <p>Searching subjects...</p>
        </div>
      ) : totalResults === 0 ? (
        <div className="search-empty">
          <svg className="search-empty-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /><path d="M8 11h6" />
          </svg>
          <p className="search-empty-title">No results found</p>
          <p className="search-empty-description">
            {searchError ? searchError : `No subjects match "${query}". Try a different search term.`}
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
