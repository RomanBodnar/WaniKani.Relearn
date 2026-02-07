import { Link, NavLink } from "react-router";
import "./header.css";
import NavigationBar from "~/components/NavigationBar";

const Header = () => {
    return (
        <div className="header-container">
            <header>
                <span className="header-logo">
                    <Link to="/">WaniKani: Relearn</Link>
                </span>
                <NavigationBar/>
            </header>  
        </div>
    );
};

export default Header;
