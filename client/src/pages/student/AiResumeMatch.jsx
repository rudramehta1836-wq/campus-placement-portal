import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function AiResumeMatch() {
    const navigate = useNavigate();
    
    const [resumeText, setResumeText] = useState("");
    const [resumeFile, setResumeFile] = useState(null);
    const [inputType, setInputType] = useState("text");
    const [jobDescription, setJobDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);

    const handleAnalyze = async (e) => {
        e.preventDefault();
        
        if (!jobDescription.trim()) {
            setError("Job Description is required.");
            return;
        }
        if (inputType === "text" && !resumeText.trim()) {
            setError("Resume text is required.");
            return;
        }
        if (inputType === "file" && !resumeFile) {
            setError("Please upload a resume document.");
            return;
        }

        setError(null);
        setLoading(true);
        setResult(null);

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }

            const formData = new FormData();
            formData.append("jobDescription", jobDescription);
            
            if (inputType === "text") {
                formData.append("resumeText", resumeText);
            } else if (inputType === "file") {
                formData.append("resumeFile", resumeFile);
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            };

            const response = await api.post("/ai/match", formData, config);

            if (response.data.success) {
                console.log("AI Response received:", response.data.data);
                setResult(response.data.data);
                setTimeout(() => {
                    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                }, 100);
            } else {
                setError(response.data.message || "Failed to analyze match.");
            }
        } catch (err) {
            console.error("Match Analysis Error:", err);
            setError(err.response?.data?.message || "An error occurred while generating the match analysis.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                <h1 style={{ fontSize: "32px", color: "var(--text-main)" }}>AI Resume-to-Job Match Assistant ✨</h1>
                <button 
                    onClick={() => navigate("/student/dashboard")}
                    style={{ width: "auto", padding: "10px 20px", marginTop: "0", backgroundColor: "var(--text-muted)" }}
                >
                    Back to Dashboard
                </button>
            </div>
            
            <p style={{ color: "var(--text-muted)", marginBottom: "30px" }}>
                Paste your resume and the job description below. Our AI will analyze the match, identify missing skills, and provide tailored suggestions. 
                <br/><strong>Note:</strong> This output is an AI-generated aid and may contain errors. It is not used for automated hiring decisions.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", marginBottom: "30px" }}>
                <div className="auth-card" style={{ padding: "24px", maxWidth: "100%", width: "100%" }}>
                    <h2 style={{ fontSize: "20px", marginBottom: "16px", color: "var(--text-main)" }}>Your Resume</h2>
                    
                    <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
                        <button 
                            type="button"
                            onClick={() => setInputType("text")}
                            style={{ padding: "8px 16px", marginTop: "0", backgroundColor: inputType === "text" ? "var(--primary-color)" : "var(--text-muted)", width: "auto", flex: 1, boxShadow: "none" }}
                        >
                            Paste Text
                        </button>
                        <button 
                            type="button"
                            onClick={() => setInputType("file")}
                            style={{ padding: "8px 16px", marginTop: "0", backgroundColor: inputType === "file" ? "var(--primary-color)" : "var(--text-muted)", width: "auto", flex: 1, boxShadow: "none" }}
                        >
                            Upload Document
                        </button>
                    </div>

                    {inputType === "text" ? (
                        <textarea 
                            value={resumeText}
                            onChange={(e) => setResumeText(e.target.value)}
                            placeholder="Paste your full resume text here..."
                            style={{ 
                                width: "100%", height: "240px", padding: "14px", 
                                borderRadius: "var(--radius-sm)", border: "2px solid transparent",
                                backgroundColor: "var(--input-bg)", color: "var(--text-main)",
                                fontFamily: "inherit", fontSize: "14px", resize: "vertical"
                            }}
                        />
                    ) : (
                        <div style={{ height: "240px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", border: "2px dashed #cbd5e1", borderRadius: "var(--radius-sm)", backgroundColor: "var(--input-bg)" }}>
                            <input 
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={(e) => setResumeFile(e.target.files[0])}
                                style={{ display: "block", margin: "0 auto", padding: "20px", border: "none", backgroundColor: "transparent" }}
                            />
                            <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "10px" }}>Supports PDF, DOC, DOCX</p>
                        </div>
                    )}
                </div>

                <div className="auth-card" style={{ padding: "24px", maxWidth: "100%", width: "100%" }}>
                    <h2 style={{ fontSize: "20px", marginBottom: "16px", color: "var(--text-main)" }}>Job Description</h2>
                    <textarea 
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Paste the target job description here..."
                        style={{ 
                            width: "100%", height: "300px", padding: "14px", 
                            borderRadius: "var(--radius-sm)", border: "2px solid transparent",
                            backgroundColor: "var(--input-bg)", color: "var(--text-main)",
                            fontFamily: "inherit", fontSize: "14px", resize: "vertical"
                        }}
                    />
                </div>
            </div>

            <div style={{ textAlign: "center", marginBottom: "40px" }}>
                {error && <p style={{ color: "#ef4444", marginBottom: "16px", fontWeight: "500" }}>{error}</p>}
                <button 
                    onClick={handleAnalyze} 
                    disabled={loading}
                    style={{ 
                        width: "auto", padding: "14px 40px", fontSize: "18px",
                        backgroundColor: loading ? "var(--text-muted)" : "var(--primary-color)",
                        cursor: loading ? "not-allowed" : "pointer"
                    }}
                >
                    {loading ? "Analyzing Match..." : "Analyze Match"}
                </button>
            </div>

            {result && (
                <div className="auth-card" style={{ padding: "30px", maxWidth: "100%", width: "100%", marginBottom: "40px" }}>
                    <h2 style={{ fontSize: "24px", marginBottom: "24px", color: "var(--text-main)", borderBottom: "1px solid #e2e8f0", paddingBottom: "12px" }}>
                        Analysis Results
                    </h2>
                    
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", marginBottom: "30px" }}>
                        <div>
                            <h3 style={{ fontSize: "18px", color: "#10b981", marginBottom: "12px" }}>✅ Matching Skills</h3>
                            {result.matchingSkills && result.matchingSkills.length > 0 ? (
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                                    {result.matchingSkills.map((skill, index) => (
                                        <span key={index} style={{ backgroundColor: "#d1fae5", color: "#065f46", padding: "4px 12px", borderRadius: "16px", fontSize: "14px" }}>
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>No direct matches found.</p>
                            )}
                        </div>
                        
                        <div>
                            <h3 style={{ fontSize: "18px", color: "#ef4444", marginBottom: "12px" }}>⚠️ Missing Requirements</h3>
                            {result.missingRequirements && result.missingRequirements.length > 0 ? (
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                                    {result.missingRequirements.map((req, index) => (
                                        <span key={index} style={{ backgroundColor: "#fee2e2", color: "#991b1b", padding: "4px 12px", borderRadius: "16px", fontSize: "14px" }}>
                                            {req}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>No missing requirements found!</p>
                            )}
                        </div>
                    </div>

                    <div style={{ marginBottom: "30px" }}>
                        <h3 style={{ fontSize: "18px", color: "var(--text-main)", marginBottom: "12px" }}>📄 Evidence from Resume</h3>
                        {result.evidence && result.evidence.length > 0 ? (
                            <ul style={{ listStyleType: "none", padding: "0" }}>
                                {result.evidence.map((item, index) => (
                                    <li key={index} style={{ marginBottom: "12px", backgroundColor: "var(--input-bg)", padding: "12px", borderRadius: "8px", borderLeft: "4px solid #10b981" }}>
                                        <strong>{item.skill}:</strong> <span style={{ color: "var(--text-muted)", fontStyle: "italic" }}>"{item.excerpt}"</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>No specific evidence extracted.</p>
                        )}
                    </div>

                    <div>
                        <h3 style={{ fontSize: "18px", color: "var(--text-main)", marginBottom: "12px" }}>💡 Suggestions for Improvement</h3>
                        {result.suggestions && result.suggestions.length > 0 ? (
                            <ul style={{ paddingLeft: "20px", color: "var(--text-muted)", lineHeight: "1.8" }}>
                                {result.suggestions.map((suggestion, index) => (
                                    <li key={index}>{suggestion}</li>
                                ))}
                            </ul>
                        ) : (
                            <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>No suggestions available.</p>
                        )}
                    </div>

                </div>
            )}
        </div>
    );
}

export default AiResumeMatch;
