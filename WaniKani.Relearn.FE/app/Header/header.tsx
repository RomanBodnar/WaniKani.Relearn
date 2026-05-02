import { Link } from "react-router";
import "./header.css";
import NavigationBar from "~/components/NavigationBar";

const Header = () => {
    return (
        <div className="header-container">
            <header className="header-card">
                <div className="header-logo">
                    <Link to="/">WaniKani: Relearn</Link>
                </div>
                <NavigationBar/>
            </header>  
        </div>
    );
};

export default Header;
