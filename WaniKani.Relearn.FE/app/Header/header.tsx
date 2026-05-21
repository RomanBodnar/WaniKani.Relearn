import { Link, useNavigate, useSearchParams, useRouteLoaderData, useLocation, useRevalidator } from "react-router";
import { useState, useRef, useEffect } from "react";
import "./header.css";
import NavigationBar from "~/components/NavigationBar";
import { API_ENDPOINTS } from "~/config/api";

const Header = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q") || "";
    const [isSearchOpen, setIsSearchOpen] = useState(!!query);
    const [inputValue, setInputValue] = useState(query);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const { revalidate } = useRevalidator();
    
    // Use data from root loader instead of checking document.cookie
    // This solves the hydration mismatch and flicker on refresh
    const rootData = useRouteLoaderData("root") as { isLoggedIn: boolean } | undefined;
    const isLoggedIn = rootData?.isLoggedIn || false;
    
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout>>();

    // Sync input value when URL query changes (e.g. back/forward navigation)
    useEffect(() => {
        setInputValue(query);
        if (query) setIsSearchOpen(true);
    }, [query]);

    // Close mobile and profile menus on navigation
    const location = useLocation();
    useEffect(() => {
        setIsMobileMenuOpen(false);
        setIsProfileMenuOpen(false);
    }, [location.pathname]);

    const handleLogout = async () => {
        try {
            await fetch(API_ENDPOINTS.logout, { method: 'POST', credentials: 'include' });
            revalidate();
            navigate('/login');
            setIsProfileMenuOpen(false);
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

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

    // Swipe detection for mobile menu
    useEffect(() => {
        let touchStartX = 0;
        let touchStartY = 0;

        const handleTouchStart = (e: TouchEvent) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        };

        const handleTouchEnd = (e: TouchEvent) => {
            const touchEndX = e.changedTouches[0].screenX;
            const touchEndY = e.changedTouches[0].screenY;
            
            const dx = touchEndX - touchStartX;
            const dy = touchEndY - touchStartY;
            
            // Ignore mostly vertical swipes
            if (Math.abs(dy) > Math.abs(dx) + 20) return;
            
            // Swipe Left (open menu) if starting near right edge
            if (dx < -50 && touchStartX > window.innerWidth - 40) {
                setIsMobileMenuOpen(true);
            }
            // Swipe Right (close menu)
            else if (dx > 50 && isMobileMenuOpen) {
                setIsMobileMenuOpen(false);
            }
        };

        window.addEventListener('touchstart', handleTouchStart, { passive: true });
        window.addEventListener('touchend', handleTouchEnd, { passive: true });

        return () => {
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, [isMobileMenuOpen]);

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

                    <div className={`mobile-drawer-overlay ${isMobileMenuOpen ? 'open' : ''}`} onClick={() => setIsMobileMenuOpen(false)} />
                    <div className={`header-nav-wrapper ${isMobileMenuOpen ? 'open' : ''}`}>
                        <div className="mobile-drawer-header">
                            <span className="mobile-drawer-title">Menu</span>
                            <button className="mobile-drawer-close" onClick={() => setIsMobileMenuOpen(false)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                            </button>
                        </div>
                        <NavigationBar />
                        <div className="mobile-drawer-footer">
                            <Link to="/settings" className="mobile-drawer-footer-link" aria-label="Settings">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="3" />
                                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                                </svg>
                                <span>Settings</span>
                            </Link>
                        </div>
                    </div>

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

                        <Link to="/settings" className="header-action-button header-settings-desktop" aria-label="Settings" title="Settings">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="3" />
                                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                            </svg>
                        </Link>

                        {isLoggedIn ? (
                            <div className="header-profile-menu-container">
                                <button 
                                    className={`header-action-button ${isProfileMenuOpen ? 'active' : ''}`}
                                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                    aria-label="Profile Menu" 
                                    title="Profile Menu"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                </button>
                                
                                {isProfileMenuOpen && (
                                    <>
                                        <div className="profile-menu-backdrop" onClick={() => setIsProfileMenuOpen(false)} />
                                        <div className="profile-dropdown-menu">
                                            <Link to="/profile" className="profile-dropdown-item" onClick={() => setIsProfileMenuOpen(false)}>
                                                View Profile
                                            </Link>
                                            <div className="profile-dropdown-divider" />
                                            <button className="profile-dropdown-item text-danger" onClick={handleLogout}>
                                                Log out
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" className="header-login-button" aria-label="Log in" title="Log in">
                                Log in
                            </Link>
                        )}

                        <button 
                            className="header-hamburger-button"
                            onClick={() => setIsMobileMenuOpen(true)}
                            aria-label="Open Menu"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
                        </button>
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
