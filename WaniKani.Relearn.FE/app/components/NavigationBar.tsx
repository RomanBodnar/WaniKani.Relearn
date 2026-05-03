import { NavLink } from "react-router";
import "./NavigationBar.css";

const NavigationBar = () => {
    return (
        <nav className="navigation">
            <ul>
                <li>
                    <NavLink
                        to="/kanji"
                        className={({ isActive }) => `nav-link nav-link-kanji ${isActive ? "active" : ""}`}
                    >
                        Kanji
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/vocabulary"
                        className={({ isActive }) => `nav-link nav-link-vocabulary ${isActive ? "active" : ""}`}
                    >
                        Vocabulary
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/radicals"
                        className={({ isActive }) => `nav-link nav-link-radicals ${isActive ? "active" : ""}`}
                    >
                        Radicals
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/grammar"
                        className={({ isActive }) => `nav-link nav-link-grammar ${isActive ? "active" : ""}`}
                    >
                        Grammar
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/reading-practice"
                        className={({ isActive }) => `nav-link nav-link-reading ${isActive ? "active" : ""}`}
                    >
                        Reading
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
};

export default NavigationBar;