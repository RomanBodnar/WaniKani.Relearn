import { Link, useNavigate, useRevalidator } from "react-router";
import { useActionState, useState } from "react";
import { API_ENDPOINTS } from "~/config/api";
import "./auth.css";

export default function Login() {
    const navigate = useNavigate();
    const { revalidate } = useRevalidator();
    const [showPassword, setShowPassword] = useState(false);

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

                revalidate();
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
                        <div className="auth-password-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                required
                                placeholder="Enter your password"
                                disabled={isPending}
                            />
                            <button
                                type="button"
                                className="auth-password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                title={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                )}
                            </button>
                        </div>
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
