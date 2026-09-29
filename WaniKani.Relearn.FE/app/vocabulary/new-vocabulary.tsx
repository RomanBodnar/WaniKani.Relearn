import { useState, type FormEvent } from "react";
import { Link } from "react-router";
import type { Route } from "./+types/new-vocabulary";
import "./new-vocabulary.css";

const STORAGE_KEY = "bonpom-custom-vocabulary";

type CustomVocabulary = {
  id: string;
  word: string;
  meaning: string;
  createdAt: string;
};

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Add a word | BonPom" },
    { name: "description", content: "Add a word to your custom vocabulary" },
  ];
}

export default function NewVocabulary() {
  const [word, setWord] = useState("");
  const [meaning, setMeaning] = useState("");
  const [savedWord, setSavedWord] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedWord = word.trim();
    const trimmedMeaning = meaning.trim();
    if (!trimmedWord || !trimmedMeaning) return;

    const stored = window.localStorage.getItem(STORAGE_KEY);
    const currentVocabulary: CustomVocabulary[] = stored ? JSON.parse(stored) : [];
    const newVocabulary: CustomVocabulary = {
      id: window.crypto.randomUUID(),
      word: trimmedWord,
      meaning: trimmedMeaning,
      createdAt: new Date().toISOString(),
    };

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([newVocabulary, ...currentVocabulary]),
    );
    setSavedWord(trimmedWord);
    setWord("");
    setMeaning("");
  };

  return (
    <div className="new-vocabulary-page">
      <div className="new-vocabulary-shell">
        <Link to="/vocabulary" className="new-vocabulary-back">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Vocabulary
        </Link>

        <header className="new-vocabulary-header">
          <div className="new-vocabulary-mark" aria-hidden="true">言</div>
          <div>
            <p className="new-vocabulary-eyebrow">Custom vocabulary</p>
            <h1>Add a new word</h1>
            <p>Build a collection that is personal to you.</p>
          </div>
        </header>

        <form className="new-vocabulary-form" onSubmit={handleSubmit}>
          <div className="new-vocabulary-field">
            <label htmlFor="custom-word">Word</label>
            <input
              id="custom-word"
              name="word"
              type="text"
              value={word}
              onChange={(event) => {
                setWord(event.target.value);
                setSavedWord("");
              }}
              placeholder="e.g. 木漏れ日"
              lang="ja"
              autoFocus
              required
            />
          </div>

          <div className="new-vocabulary-divider" aria-hidden="true">
            <span />
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m7 10 5 5 5-5" />
            </svg>
            <span />
          </div>

          <div className="new-vocabulary-field">
            <label htmlFor="custom-meaning">Meaning or translation</label>
            <input
              id="custom-meaning"
              name="meaning"
              type="text"
              value={meaning}
              onChange={(event) => {
                setMeaning(event.target.value);
                setSavedWord("");
              }}
              placeholder="e.g. sunlight through trees"
              required
            />
          </div>

          <button className="new-vocabulary-submit" type="submit">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add to my vocabulary
          </button>

          <p className={`new-vocabulary-status ${savedWord ? "is-visible" : ""}`} role="status" aria-live="polite">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m5 12 4 4L19 6" />
            </svg>
            {savedWord ? `${savedWord} was added.` : "Word added."}
          </p>
        </form>
      </div>
    </div>
  );
}