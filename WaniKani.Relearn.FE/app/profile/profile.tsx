import { useLoaderData, redirect } from "react-router";
import { API_ENDPOINTS } from "~/config/api";
import "./profile.css";

interface UserProfile {
    email: string;
    username: string;
}

export async function clientLoader() {
    try {
        const response = await fetch(API_ENDPOINTS.authMe, {
            // credentials: 'include' should be enough for cookies in SPA mode
            credentials: 'include'
        });

        if (!response.ok) {
            if (response.status === 401) {
                return redirect("/login");
            }
            throw new Error("Failed to load user profile");
        }

        const data: UserProfile = await response.json();
        return { user: data };
    } catch (error) {
        console.error("Profile loader error:", error);
        return redirect("/login");
    }
}

export default function Profile() {
    const { user } = useLoaderData<typeof clientLoader>();

    return (
        <div className="profile-page-container">
            <div className="profile-card">
                <div className="profile-header">
                    <div className="profile-avatar">
                        {user.username ? user.username.charAt(0).toUpperCase() : "?"}
                    </div>
                    <h1 className="profile-title">Welcome, {user.username || "User"}!</h1>
                </div>

                <div className="profile-content">
                    <div className="profile-data-group">
                        <label>Email Address</label>
                        <div className="profile-data-value">{user.email || "No email provided"}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
