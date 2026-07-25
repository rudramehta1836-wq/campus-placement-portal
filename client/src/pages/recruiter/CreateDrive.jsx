import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";

function CreateDrive() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Form state
    const [companyName, setCompanyName] = useState("");
    const [jobRole, setJobRole] = useState("");
    const [packageStr, setPackageStr] = useState("");
    const [location, setLocation] = useState("");
    const [eligibilityCGPA, setEligibilityCGPA] = useState("");
    const [lastDateToApply, setLastDateToApply] = useState("");
    const [description, setDescription] = useState("");

    const handleCreateDrive = async (e) => {
        e.preventDefault(); 
        
        if (!companyName || !jobRole || !packageStr || !location || !eligibilityCGPA || !lastDateToApply || !description) {
            return alert("Please fill all fields");
        }

        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            const payload = {
                companyName,
                jobRole,
                package: packageStr,
                location,
                eligibilityCGPA: Number(eligibilityCGPA),
                lastDateToApply,
                description
            };

            const response = await api.post("/drives", payload, config);
            
            if (response.data.success) {
                alert("Placement Drive Created Successfully!");
                navigate("/recruiter/dashboard");
            }
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Failed to create drive");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}>
            
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                <h1 style={{ fontSize: "32px", color: "var(--text-main)" }}>Create New Drive</h1>
                <Link to="/recruiter/dashboard" style={{ color: "var(--primary-color)", textDecoration: "none", fontWeight: "600" }}>
                    &larr; Back to Dashboard
                </Link>
            </div>

            <div className="auth-card" style={{ padding: "40px", maxWidth: "100%", textAlign: "left" }}>
                <h2 style={{ fontSize: "22px", marginBottom: "24px", color: "var(--text-main)" }}>Drive Details</h2>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>
                    
                    <div className="form-group">
                        <label style={{ display: "block", marginBottom: "8px", color: "var(--text-muted)" }}>Company Name</label>
                        <input type="text" placeholder="e.g. Google" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                    </div>

                    <div className="form-group">
                        <label style={{ display: "block", marginBottom: "8px", color: "var(--text-muted)" }}>Job Role</label>
                        <input type="text" placeholder="e.g. Software Engineer" value={jobRole} onChange={(e) => setJobRole(e.target.value)} />
                    </div>

                    <div className="form-group">
                        <label style={{ display: "block", marginBottom: "8px", color: "var(--text-muted)" }}>Package (CTC)</label>
                        <input type="text" placeholder="e.g. 15 LPA" value={packageStr} onChange={(e) => setPackageStr(e.target.value)} />
                    </div>

                    <div className="form-group">
                        <label style={{ display: "block", marginBottom: "8px", color: "var(--text-muted)" }}>Location</label>
                        <input type="text" placeholder="e.g. Bangalore" value={location} onChange={(e) => setLocation(e.target.value)} />
                    </div>

                    <div className="form-group">
                        <label style={{ display: "block", marginBottom: "8px", color: "var(--text-muted)" }}>Minimum CGPA</label>
                        <input type="number" step="0.01" placeholder="e.g. 7.5" value={eligibilityCGPA} onChange={(e) => setEligibilityCGPA(e.target.value)} />
                    </div>

                    <div className="form-group">
                        <label style={{ display: "block", marginBottom: "8px", color: "var(--text-muted)" }}>Last Date to Apply</label>
                        {/* We use type="date" but apply our standard input styling */}
                        <input 
                            type="date" 
                            value={lastDateToApply} 
                            onChange={(e) => setLastDateToApply(e.target.value)} 
                            style={{ 
                                width: "100%", padding: "14px 18px", borderRadius: "var(--radius-sm)", 
                                border: "2px solid transparent", backgroundColor: "var(--input-bg)", 
                                color: "var(--text-main)", fontSize: "16px", fontFamily: "Outfit, sans-serif" 
                            }} 
                        />
                    </div>
                    
                    <div className="form-group" style={{ gridColumn: "span 2" }}>
                        <label style={{ display: "block", marginBottom: "8px", color: "var(--text-muted)" }}>Job Description</label>
                        <textarea 
                            placeholder="Provide a detailed job description..."
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)} 
                            style={{ 
                                width: "100%", padding: "14px 18px", borderRadius: "var(--radius-sm)", 
                                border: "2px solid transparent", backgroundColor: "var(--input-bg)", 
                                color: "var(--text-main)", fontSize: "16px", fontFamily: "Outfit, sans-serif",
                                minHeight: "120px", resize: "vertical"
                            }}
                        />
                    </div>

                </div>

                <button onClick={handleCreateDrive} disabled={loading} style={{ width: "100%", padding: "14px" }}>
                    {loading ? "Creating..." : "Publish Placement Drive"}
                </button>
            </div>
            
        </div>
    );
}

export default CreateDrive;