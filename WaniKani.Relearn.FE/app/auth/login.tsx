import { Link, useNavigate } from "react-router";
import { useActionState } from "react";
import { API_ENDPOINTS } from "~/config/api";
import "./auth.css";

export default function Login() {
    const navigate = useNavigate();

    const [error, submitAction, isPending] = useActionState(
        async (prevState: string | null, formData: FormData) => {
            const email = formData.get("email") as string;
            const password = formData.get("password") as string;

            try {
                const response = await fetch(API_ENDPOINTS.login, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({ email, password })
                });

                if (!response.ok) {
                    throw new Error(`Login failed with status: ${response.status}`);
                }

                navigate("/");
                return null;
            } catch (error) {
                console.error("Login error:", error);
                return "Login failed. Please check your credentials and try again.";
            }
        },
        null
    );

    return (
        <div className="auth-page-container">
            <div className="auth-card">
                <h1 className="auth-title">Log in</h1>
                <p className="auth-subtitle">Welcome back to bonpom</p>

                {error && <div className="auth-error">{error}</div>}

                <form className="auth-form" action={submitAction}>
                    <div className="auth-input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            placeholder="Enter your email"
                            disabled={isPending}
                        />
                    </div>

                    <div className="auth-input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            required
                            placeholder="Enter your password"
                            disabled={isPending}
                        />
                    </div>

                    <button
                        type="submit"
                        className={`auth-submit-btn ${isPending ? 'loading' : ''}`}
                        disabled={isPending}
                    >
                        {isPending ? "Logging in..." : "Log in"}
                    </button>
                </form>

                <div className="auth-footer">
                    Don't have an account? <Link to="/register">Sign up</Link>
                </div>
            </div>
        </div>
    );
}
