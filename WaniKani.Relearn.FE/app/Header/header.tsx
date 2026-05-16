import { Link, useNavigate, useSearchParams } from "react-router";
import { useState, useRef, useEffect } from "react";
import "./header.css";
import NavigationBar from "~/components/NavigationBar";

const Header = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q") || "";
    const [isSearchOpen, setIsSearchOpen] = useState(!!query);
    const [inputValue, setInputValue] = useState(query);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout>>();

    // Sync input value when URL query changes (e.g. back/forward navigation)
    useEffect(() => {
        setInputValue(query);
        if (query) setIsSearchOpen(true);
    }, [query]);

    // Focus input when search opens
    useEffect(() => {
        if (isSearchOpen) {
            inputRef.current?.focus();
        }
    }, [isSearchOpen]);
    
    // Close search when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsSearchOpen(false);
            }
        };

        if (isSearchOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isSearchOpen]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setInputValue(val);

        // Debounce navigation to /search
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            if (val.trim()) {
                navigate(`/search?q=${encodeURIComponent(val.trim())}`, { replace: true });
            }
        }, 300);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            if (debounceRef.current) clearTimeout(debounceRef.current);
            const val = inputValue.trim();
            if (val) {
                navigate(`/search?q=${encodeURIComponent(val)}`);
            }
        }
        if (e.key === "Escape") {
            setIsSearchOpen(false);
        }
    };

    const toggleSearch = () => {
        if (isSearchOpen) {
            setIsSearchOpen(false);
            setInputValue("");
        } else {
            setIsSearchOpen(true);
        }
    };

    return (
        <div className="header-container" ref={containerRef}>
            <header className="header-card">
                <div className="header-main-row">
                    <div className="header-logo">
                        <Link to="/">bonpom</Link>
                    </div>

                    <NavigationBar />

                    <div className="header-actions">
                        <button
                            className={`header-action-button ${isSearchOpen ? 'active' : ''}`}
                            onClick={toggleSearch}
                            aria-label="Toggle search"
                            title="Search"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                            </svg>
                        </button>

                        <Link to="/settings" className="header-action-button" aria-label="Settings" title="Settings">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="3" />
                                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                            </svg>
                        </Link>
                        
                        <Link to="/login" className="header-login-button" aria-label="Log in" title="Log in">
                            Log in
                        </Link>
                    </div>
                </div>
            </header>
            <form 
                className={`header-search-row ${isSearchOpen ? 'open' : ''}`}
                onSubmit={(e) => {
                    e.preventDefault();
                    if (inputValue.trim()) {
                        navigate(`/search?q=${encodeURIComponent(inputValue.trim())}`);
                    }
                }}
            >
                <div className="header-search-input-wrapper">
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search..."
                        value={inputValue}
                        onChange={handleSearchChange}
                        onKeyDown={handleKeyDown}
                        className="search-input"
                    />
                    <button type="submit" className="header-search-submit-btn" aria-label="Search">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m9 18 6-6-6-6" />
                        </svg>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Header;
