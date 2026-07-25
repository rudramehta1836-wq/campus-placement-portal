import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";

function StudentProfile() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    // Form State (Editable)
    const [name, setName] = useState("");
    const [branch, setBranch] = useState("");
    const [cgpa, setCgpa] = useState("");
    
    // Read-only state
    const [email, setEmail] = useState("");
    const [rollNumber, setRollNumber] = useState("");
    const [resumeUrl, setResumeUrl] = useState("");
    
    // File upload state
    const [resumeFile, setResumeFile] = useState(null);

    // Fetch the profile data when the page loads
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return navigate("/login");

                const config = { headers: { Authorization: `Bearer ${token}` } };
                const response = await api.get("/students/profile", config);
                const data = response.data.student;

                setName(data.name || "");
                setBranch(data.branch || "");
                setCgpa(data.cgpa || "");
                setEmail(data.email || "");
                setRollNumber(data.rollNumber || "");
                setResumeUrl(data.resume || "");
                
                setLoading(false);
            } catch (error) {
                console.error("Error fetching profile", error);
                navigate("/login");
            }
        };
        fetchProfile();
    }, [navigate]);

    // Handle "Save Changes" button
    const handleSaveProfile = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem("token");
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            await api.put("/students/profile", { name, branch, cgpa }, config);
            alert("Profile updated successfully!");
        } catch (error) {
            console.error(error);
            alert("Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    // Handle Resume Upload
    const handleResumeUpload = async () => {
        if (!resumeFile) return alert("Please select a file first");
        
        try {
            const token = localStorage.getItem("token");
            const formData = new FormData();
            formData.append("resume", resumeFile);
            
            // Axios automatically handles the Content-Type header for FormData
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            const response = await api.put("/students/upload-resume", formData, config);
            
            // The backend returns the new resume path in response.data.resume
            setResumeUrl(response.data.resume || "");
            alert("Resume uploaded successfully!");
            setResumeFile(null); // Clear the file input
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Failed to upload resume");
        }
    };

    if (loading) {
        return <div style={{ padding: "40px", textAlign: "center", color: "var(--text-main)" }}><h2>Loading Profile...</h2></div>;
    }

    return (
        <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
            
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                <h1 style={{ fontSize: "32px", color: "var(--text-main)" }}>My Profile</h1>
                <Link to="/student/dashboard" style={{ color: "var(--primary-color)", textDecoration: "none", fontWeight: "600" }}>
                    &larr; Back to Dashboard
                </Link>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "30px" }}>
                {/* Personal Details Card */}
                <div className="auth-card" style={{ padding: "30px", maxWidth: "100%", textAlign: "left", marginBottom: "0" }}>
                    <h2 style={{ fontSize: "22px", marginBottom: "20px", color: "var(--text-main)" }}>Personal Details</h2>
                    
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                        <div className="form-group">
                            <label style={{ display: "block", marginBottom: "8px", color: "var(--text-muted)" }}>Full Name</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        
                        <div className="form-group">
                            <label style={{ display: "block", marginBottom: "8px", color: "var(--text-muted)" }}>Email (Read Only)</label>
                            <input type="email" value={email} readOnly style={{ opacity: 0.7, cursor: "not-allowed" }} />
                        </div>
                        
                        <div className="form-group">
                            <label style={{ display: "block", marginBottom: "8px", color: "var(--text-muted)" }}>Roll Number (Read Only)</label>
                            <input type="text" value={rollNumber} readOnly style={{ opacity: 0.7, cursor: "not-allowed" }} />
                        </div>
                        
                        <div className="form-group">
                            <label style={{ display: "block", marginBottom: "8px", color: "var(--text-muted)" }}>Branch</label>
                            <input type="text" value={branch} onChange={(e) => setBranch(e.target.value)} />
                        </div>
                        
                        <div className="form-group" style={{ gridColumn: "span 2" }}>
                            <label style={{ display: "block", marginBottom: "8px", color: "var(--text-muted)" }}>CGPA</label>
                            <input type="number" value={cgpa} onChange={(e) => setCgpa(e.target.value)} />
                        </div>
                    </div>

                    <button onClick={handleSaveProfile} disabled={saving} style={{ width: "100%", padding: "12px 30px" }}>
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>

                {/* Resume Upload Card */}
                <div className="auth-card" style={{ padding: "30px", maxWidth: "100%", textAlign: "left", height: "fit-content" }}>
                    <h2 style={{ fontSize: "22px", marginBottom: "20px", color: "var(--text-main)" }}>Resume Upload</h2>
                    
                    {resumeUrl && (
                        <div style={{ marginBottom: "20px", padding: "15px", backgroundColor: "rgba(16, 185, 129, 0.1)", borderRadius: "8px", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
                            <p style={{ color: "#10b981", margin: 0 }}>
                                ✅ Resume is currently uploaded. 
                                <a href={`http://localhost:5000/${resumeUrl.replace(/\\/g, '/')}`} target="_blank" rel="noreferrer" style={{ marginLeft: "10px", color: "var(--text-main)", textDecoration: "underline", display: "inline-block" }}>View Resume</a>
                            </p>
                        </div>
                    )}
                    
                    <div className="form-group" style={{ marginBottom: "20px" }}>
                        <input 
                            type="file" 
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => setResumeFile(e.target.files[0])} 
                            style={{ padding: "10px", backgroundColor: "var(--input-bg)", borderRadius: "var(--radius-sm)", width: "100%", color: "var(--text-main)" }}
                        />
                    </div>
                    
                    <button onClick={handleResumeUpload} style={{ width: "100%", padding: "12px 30px", backgroundColor: "var(--primary-color)" }}>
                        Upload New Resume
                    </button>
                </div>
            </div>
            
        </div>
    );
}

export default StudentProfile;