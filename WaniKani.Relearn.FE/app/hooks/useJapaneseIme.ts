import { useState, useEffect, useRef, useCallback } from "react";
import { romajiToHiragana, finalizeKana } from "~/grammar/exercise/kanaInputHelper";
import { fetchKanjiCandidates } from "~/services/imeService";

interface UseJapaneseImeOptions {
  initialValue?: string;
  initialKanaMode?: boolean;
  onValueChange?: (val: string) => void;
}

export function useJapaneseIme(options: UseJapaneseImeOptions = {}) {
  const { initialValue = "", initialKanaMode = false, onValueChange } = options;

  const [inputValue, setInputValue] = useState<string>(initialValue);
  const [isKanaMode, setIsKanaMode] = useState<boolean>(initialKanaMode);
  const [candidates, setCandidates] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [showCandidates, setShowCandidates] = useState<boolean>(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync external initialValue when it changes
  useEffect(() => {
    setInputValue(initialValue);
  }, [initialValue]);

  // Fetch Kanji candidates when in Kana mode
  const requestCandidates = useCallback((kanaText: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    const trimmed = kanaText.trim();
    // Only search candidates if text contains Hiragana/Katakana or Kanji
    const hasKanaOrKanji = /[ぁ-んァ-ヶ一-龥]/.test(trimmed);

    if (!trimmed || !hasKanaOrKanji) {
      setCandidates([]);
      setShowCandidates(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const results = await fetchKanjiCandidates(trimmed, 8);
        if (results && results.length > 0) {
          setCandidates(results);
          setSelectedIndex(0);
          setShowCandidates(true);
        } else {
          setCandidates([]);
          setShowCandidates(false);
        }
      } catch {
        setCandidates([]);
        setShowCandidates(false);
      }
    }, 120);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const val = isKanaMode ? romajiToHiragana(raw) : raw;
    setInputValue(val);
    onValueChange?.(val);

    if (isKanaMode) {
      requestCandidates(val);
    } else {
      setShowCandidates(false);
      setCandidates([]);
    }
  }, [isKanaMode, onValueChange, requestCandidates]);

  const commitCandidate = useCallback((candidate: string) => {
    setInputValue(candidate);
    setShowCandidates(false);
    setCandidates([]);
    setSelectedIndex(0);
    onValueChange?.(candidate);
  }, [onValueChange]);

  const closeCandidates = useCallback(() => {
    setShowCandidates(false);
  }, []);

  const toggleKanaMode = useCallback(() => {
    setIsKanaMode((prev) => {
      const next = !prev;
      if (!next) {
        setShowCandidates(false);
        setCandidates([]);
      }
      return next;
    });
  }, []);

  /**
   * Keyboard navigation handler for inputs using IME candidates.
   * Returns true if IME intercepted and handled the event.
   */
  const handleKeyDown = useCallback((
    e: React.KeyboardEvent<HTMLInputElement>,
    onEnterSubmit?: (committedVal: string) => void
  ): boolean => {
    // If candidates list is currently visible
    if (showCandidates && candidates.length > 0) {
      // Space or ArrowDown: cycle forward through candidates
      if (e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % candidates.length);
        return true;
      }

      // ArrowUp: cycle backward through candidates
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + candidates.length) % candidates.length);
        return true;
      }

      // Enter: commit currently selected candidate
      if (e.key === "Enter") {
        e.preventDefault();
        commitCandidate(candidates[selectedIndex]);
        return true;
      }

      // Escape: dismiss candidate list
      if (e.key === "Escape") {
        e.preventDefault();
        closeCandidates();
        return true;
      }

      // Number keys 1-9: choose candidate directly
      if (/^[1-9]$/.test(e.key)) {
        const numIndex = parseInt(e.key, 10) - 1;
        if (numIndex < candidates.length) {
          e.preventDefault();
          commitCandidate(candidates[numIndex]);
          return true;
        }
      }
    }

    // Normal Enter without candidates dropdown
    if (e.key === "Enter") {
      const finalVal = (isKanaMode ? finalizeKana(inputValue) : inputValue).trim();
      setInputValue(finalVal);
      onEnterSubmit?.(finalVal);
      return false;
    }

    return false;
  }, [showCandidates, candidates, selectedIndex, commitCandidate, closeCandidates, isKanaMode, inputValue]);

  return {
    inputValue,
    setInputValue,
    isKanaMode,
    setIsKanaMode,
    toggleKanaMode,
    candidates,
    selectedIndex,
    showCandidates,
    handleInputChange,
    handleKeyDown,
    commitCandidate,
    closeCandidates
  };
}
