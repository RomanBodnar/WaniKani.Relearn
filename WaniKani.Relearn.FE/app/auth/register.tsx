import { Link, useNavigate } from "react-router";
import { useActionState } from "react";
import axios from "axios";
import "./auth.css";

export default function Register() {
    const navigate = useNavigate();

    const [error, submitAction, isPending] = useActionState(
        async (prevState: string | null, formData: FormData) => {
            const username = formData.get("username") as string;
            const email = formData.get("email") as string;
            const password = formData.get("password") as string;
            
            try {
                await axios.post("/auth/register", { username, email, password });
                navigate("/login");
                return null;
            } catch (error) {
                console.error("Registration error:", error);
                return "Registration failed. Please try again.";
            }
        },
        null
    );

    return (
        <div className="auth-page-container">
            <div className="auth-card">
                <h1 className="auth-title">Sign up</h1>
                <p className="auth-subtitle">Create your bonpom account</p>
                
                {error && <div className="auth-error">{error}</div>}
                
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
                    </div>
                    
                    <div className="auth-input-group">
                        <label htmlFor="password">Password</label>
                        <input 
                            type="password" 
                            id="password" 
                            name="password"
                            required 
                            placeholder="Create a password"
                            disabled={isPending}
                        />
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
