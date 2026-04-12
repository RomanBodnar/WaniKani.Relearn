import { NavLink } from "react-router";
import "./NavigationBar.css";

const NavigationBar = () => {
    return (
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
                        to="/kanji"
                        className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                    >
                        Kanji
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/vocabulary"
                        className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                    >
                        Vocabulary
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/kana-vocabulary"
                        className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                    >
                        Kana vocabulary
                    </NavLink>
                </li>
                 <li>
                    <NavLink
                        to="/radicals"
                        className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                    >
                        Radicals
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
};

export default NavigationBar;