import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";

function Register() {
    // 1. Shared state (both need this)
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("student");
    
    // 2. Student specific state
    const [name, setName] = useState("");
    const [rollNumber, setRollNumber] = useState("");
    const [branch, setBranch] = useState("");
    const [cgpa, setCgpa] = useState("");

    // 3. Recruiter specific state
    const [companyName, setCompanyName] = useState("");
    const [recruiterName, setRecruiterName] = useState("");

    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            let endpoint;
            let payload;

            // Dynamically build the data package based on the role
            if (role === "student") {
                endpoint = "/students/register";
                payload = { name, rollNumber, email, password, branch, cgpa };
            } else {
                endpoint = "/recruiters/register";
                payload = { companyName, recruiterName, email, password };
            }

            // Send it!
            const response = await api.post(endpoint, payload);

            if (response.data.success) {
                alert("Registration successful! Please login.");
                navigate("/login");
            }
        } catch (error) {
            console.error(error.response?.data || error.message);
            alert(error.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1 className="auth-title">Create an Account</h1>

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

                {/* --- SHOW THESE IF STUDENT IS SELECTED --- */}
                {role === "student" && (
                    <>
                        <div className="form-group">
                            <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <input type="text" placeholder="Roll Number" value={rollNumber} onChange={(e) => setRollNumber(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <input type="text" placeholder="Branch" value={branch} onChange={(e) => setBranch(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <input type="number" placeholder="CGPA" value={cgpa} onChange={(e) => setCgpa(e.target.value)} />
                        </div>
                    </>
                )}

                {/* --- SHOW THESE IF RECRUITER IS SELECTED --- */}
                {role === "recruiter" && (
                    <>
                        <div className="form-group">
                            <input type="text" placeholder="Company Name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <input type="text" placeholder="Recruiter Name" value={recruiterName} onChange={(e) => setRecruiterName(e.target.value)} />
                        </div>
                    </>
                )}

                {/* --- SHOW THESE FOR EVERYONE --- */}
                <div className="form-group">
                    <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>

                <div className="form-group">
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>

                <button onClick={handleRegister}>
                    Sign Up
                </button>
                
                <p style={{ textAlign: "center", marginTop: "1.5rem", color: "var(--text-muted)", fontSize: "14px" }}>
                    Already have an account? <Link to="/login" style={{ color: "var(--primary-color)", textDecoration: "none", fontWeight: "600" }}>Log In</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;
