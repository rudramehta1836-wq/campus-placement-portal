import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("student");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const endpoint = role === "student" ? "/students/login" : "/recruiters/login";
            const response = await api.post(
                endpoint,
                {
                    email,
                    password
                }
            );

            if (response.data.success) {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("role", role);
                // Redirect based on role
                if (role === "student") {
                    navigate("/student/dashboard");
                } else {
                    navigate("/recruiter/dashboard");
                }
            }
        } catch (error) {
            console.error(error.response?.data || error.message);
            alert(error.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1 className="auth-title">Welcome Back</h1>

                <div className="radio-group">
                    <label className="radio-label">
                        <input
                            type="radio"
                            value="student"
                            checked={role === "student"}
                            onChange={() => setRole("student")}
                        />
                        <span>Student</span>
                    </label>
                    <label className="radio-label">
                        <input
                            type="radio"
                            value="recruiter"
                            checked={role === "recruiter"}
                            onChange={() => setRole("recruiter")}
                        />
                        <span>Recruiter</span>
                    </label>
                </div>

                <div className="form-group">
                    <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button onClick={handleLogin}>
                    Sign In
                </button>
                <p style={{ textAlign: "center", marginTop: "1.5rem", color: "var(--text-muted)", fontSize: "14px" }}>
                    Don't have an account? <Link to="/register" style={{ color: "var(--primary-color)", textDecoration: "none", fontWeight: "600" }}>Sign Up</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
