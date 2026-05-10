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
            </header>  
        </div>
    );
};

export default Header;
