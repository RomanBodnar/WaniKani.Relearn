import { Link, useNavigate } from "react-router";
import { useActionState, useState } from "react";
import { API_ENDPOINTS } from "~/config/api";
import "./auth.css";

type ActionState = {
    general?: string;
    fieldErrors?: Record<string, string>;
} | null;

export default function Register() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const [state, submitAction, isPending] = useActionState(
        async (prevState: ActionState, formData: FormData): Promise<ActionState> => {
            const username = formData.get("username") as string;
            const email = formData.get("email") as string;
            const password = formData.get("password") as string;

            try {
                const response = await fetch(API_ENDPOINTS.register, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({ username, email, password })
                });

                if (!response.ok) {
                    let errorMessage = "Registration failed. Please try again.";
                    try {
                        const errorData = await response.json();
                        
                        if (Array.isArray(errorData) && errorData.length > 0 && errorData[0].errorMessage) {
                            const fieldErrors: Record<string, string> = {};
                            errorData.forEach((err: any) => {
                                const prop = err.propertyName?.toLowerCase();
                                if (prop && !fieldErrors[prop]) {
                                    fieldErrors[prop] = err.errorMessage;
                                }
                            });
                            return { fieldErrors };
                        } else if (errorData.errors && typeof errorData.errors === "object") {
                            const fieldErrors: Record<string, string> = {};
                            for (const key in errorData.errors) {
                                fieldErrors[key.toLowerCase()] = errorData.errors[key][0];
                            }
                            return { fieldErrors };
                        } else if (errorData.message) {
                            errorMessage = errorData.message;
                        } else if (errorData.error) {
                            errorMessage = errorData.error;
                        } else if (errorData.title) {
                            errorMessage = errorData.title;
                        } else if (typeof errorData === "string") {
                            errorMessage = errorData;
                        }
                    } catch (e) {
                        // Response was not JSON
                    }
                    return { general: errorMessage };
                }

                navigate("/login");
                return null;
            } catch (error) {
                console.error("Registration error:", error);
                return { general: "A network error occurred. Please try again." };
            }
        },
        null
    );

    return (
        <div className="auth-page-container">
            <div className="auth-card">
                <h1 className="auth-title">Sign up</h1>
                <p className="auth-subtitle">Create your bonpom account</p>

                {state?.general && <div className="auth-error">{state.general}</div>}

                <form className="auth-form" action={submitAction}>
                    <div className="auth-input-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            required
                            placeholder="Choose a username"
                            disabled={isPending}
                        />
                        {state?.fieldErrors?.username && <div className="field-error">{state.fieldErrors.username}</div>}
                    </div>

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
                        {state?.fieldErrors?.email && <div className="field-error">{state.fieldErrors.email}</div>}
                    </div>

                    <div className="auth-input-group">
                        <label htmlFor="password">Password</label>
                        <div className="auth-password-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                required
                                placeholder="Create a password"
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
                        {state?.fieldErrors?.password && <div className="field-error">{state.fieldErrors.password}</div>}
                    </div>

                    <button
                        type="submit"
                        className={`auth-submit-btn ${isPending ? 'loading' : ''}`}
                        disabled={isPending}
                    >
                        {isPending ? "Signing up..." : "Sign up"}
                    </button>
                </form>

                <div className="auth-footer">
                    Already have an account? <Link to="/login">Log in</Link>
                </div>
            </div>
        </div>
    );
}
