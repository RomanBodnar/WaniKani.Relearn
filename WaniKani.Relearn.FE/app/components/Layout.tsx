import { Link, Outlet } from "react-router";

export default function Layout() {
    return (
        <>
            <nav>
                <Link to="/assignments">Assignments</Link>
            </nav>
            <hr />
            <Outlet />
        </>
    );
}