import { Link, NavLink } from "react-router";
import "./header.css";

const Header = () => {
    return (
        <div className="header-container">
            <header>
                <span className="header-logo">
                    <Link to="/">WaniKani: Relearn</Link>
                </span>

                <nav className="navigation">
                    <ul>
                        <li>
                            <NavLink 
                                to="/assignments"
                                className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                            >
                                Assignments
                            </NavLink>
                        </li>
                        <li>
                            <NavLink 
                                to="/kanji?type=kanji"
                                className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                            >
                                Kanji
                            </NavLink>
                        </li>
                        <li>
                            <NavLink 
                                to="/vocabulary?type=vocabulary"
                                className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                            >
                                Vocabulary
                            </NavLink>
                        </li>
                        <li>
                            <NavLink 
                                to="/kana-vocabulary?type=kana-vocabulary"
                                className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                            >
                                Kana vocabulary
                            </NavLink>
                        </li>
                    </ul>
                </nav>
            </header>
        </div>
    );
};

export default Header;
