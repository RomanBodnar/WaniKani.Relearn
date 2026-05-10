import { Link, useSearchParams } from "react-router";
import "./header.css";
import NavigationBar from "~/components/NavigationBar";

const Header = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get("q") || "";

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            const val = e.target.value;
            if (val) {
                next.set("q", val);
            } else {
                next.delete("q");
            }
            return next;
        }, { replace: true });
    };

    return (
        <div className="header-container">
            <header className="header-card">
                <div className="header-logo">
                    <Link to="/">WaniKani: Relearn</Link>
                </div>
                <div className="header-search">
                    <input 
                        type="text" 
                        placeholder="Search current list..." 
                        value={query}
                        onChange={handleSearchChange}
                        className="search-input"
                    />
                </div>
                <NavigationBar/>
                <Link to="/settings" className="header-settings-link" aria-label="Settings" title="Settings">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="3"/>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                    </svg>
                </Link>
            </header>  
        </div>
    );
};

export default Header;
