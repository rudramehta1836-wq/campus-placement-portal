import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

function Applicants() {
    const navigate = useNavigate();
    const [drives, setDrives] = useState([]);
    const [selectedDriveId, setSelectedDriveId] = useState("");
    
    const [applicants, setApplicants] = useState([]);
    const [loadingDrives, setLoadingDrives] = useState(true);
    const [loadingApplicants, setLoadingApplicants] = useState(false);
    
    // 1. Fetch drives that belong to this recruiter
    useEffect(() => {
        const fetchDrives = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return navigate("/login");

                // We get the recruiter's ID from the token payload without needing an external library
                const payload = JSON.parse(atob(token.split(".")[1]));
                const recruiterId = payload.id;

                const config = { headers: { Authorization: `Bearer ${token}` } };
                const response = await api.get("/drives", config);
                
                // Filter drives to only ones created by this specific recruiter
                const allDrives = response.data.drives || [];
                const myDrives = allDrives.filter(d => {
                    const creatorId = typeof d.createdBy === "object" ? d.createdBy._id : d.createdBy;
                    return creatorId === recruiterId;
                });
                
                setDrives(myDrives);
                
                // Auto-select the first drive if they have any
                if (myDrives.length > 0) {
                    setSelectedDriveId(myDrives[0]._id);
                }
            } catch (error) {
                console.error("Failed to fetch drives", error);
            } finally {
                setLoadingDrives(false);
            }
        };

        fetchDrives();
    }, [navigate]);

    // 2. Fetch applicants whenever the selectedDriveId changes
    useEffect(() => {
        if (!selectedDriveId) return;

        const fetchApplicants = async () => {
            setLoadingApplicants(true);
            try {
                const token = localStorage.getItem("token");
                const config = { headers: { Authorization: `Bearer ${token}` } };
                
                const response = await api.get(`/drives/${selectedDriveId}/applicants`, config);
                setApplicants(response.data.applicants || []);
            } catch (error) {
                console.error("Failed to fetch applicants", error);
            } finally {
                setLoadingApplicants(false);
            }
        };

        fetchApplicants();
    }, [selectedDriveId]);

    // 3. Handle Status Update
    const handleStatusChange = async (studentId, newStatus) => {
        try {
            const token = localStorage.getItem("token");
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            // Tell the backend to update the status
            await api.put(`/drives/${selectedDriveId}/applicants/${studentId}/status`, { status: newStatus }, config);
            
            // Update the UI locally so the recruiter instantly sees the change
            setApplicants(prev => prev.map(app => {
                if (app.student._id === studentId) {
                    return { ...app, status: newStatus };
                }
                return app;
            }));
            
            alert(`Status successfully updated to: ${newStatus}`);
        } catch (error) {
            console.error(error);
            alert("Failed to update status");
        }
    };

    if (loadingDrives) {
        return <div style={{ padding: "40px", textAlign: "center", color: "var(--text-main)" }}><h2>Loading Data...</h2></div>;
    }

    return (
        <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
            
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
                <h1 style={{ fontSize: "32px", color: "var(--text-main)" }}>Manage Applicants</h1>
                <Link to="/recruiter/dashboard" style={{ color: "var(--primary-color)", textDecoration: "none", fontWeight: "600" }}>
                    &larr; Back to Dashboard
                </Link>
            </div>

            {drives.length === 0 ? (
                <div className="auth-card" style={{ padding: "40px", textAlign: "center" }}>
                    <h2 style={{ color: "var(--text-main)" }}>You haven't created any placement drives yet.</h2>
                    <Link to="/recruiter/create-drive">
                        <button style={{ marginTop: "20px" }}>Create Drive</button>
                    </Link>
                </div>
            ) : (
                <>
                    {/* Dropdown to select which drive to view */}
                    <div className="auth-card" style={{ padding: "30px", marginBottom: "30px", maxWidth: "100%", textAlign: "left" }}>
                        <label style={{ display: "block", marginBottom: "12px", color: "var(--text-main)", fontSize: "18px", fontWeight: "600" }}>Select a Placement Drive to view applicants:</label>
                        <select 
                            value={selectedDriveId} 
                            onChange={(e) => setSelectedDriveId(e.target.value)}
                            style={{ 
                                width: "100%", padding: "14px 18px", borderRadius: "var(--radius-sm)", 
                                backgroundColor: "var(--input-bg)", color: "var(--text-main)", 
                                border: "1px solid rgba(255,255,255,0.1)", outline: "none", fontSize: "16px", cursor: "pointer"
                            }}
                        >
                            {drives.map(drive => (
                                <option key={drive._id} value={drive._id}>
                                    {drive.companyName} - {drive.jobRole} (Deadline: {new Date(drive.lastDateToApply).toLocaleDateString()})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Applicants Table */}
                    <div className="auth-card" style={{ padding: "30px", maxWidth: "100%", textAlign: "left", overflowX: "auto" }}>
                        <h2 style={{ fontSize: "22px", marginBottom: "20px", color: "var(--text-main)" }}>Applicants ({applicants.length})</h2>
                        
                        {loadingApplicants ? (
                            <p style={{ color: "var(--text-muted)" }}>Loading applicants...</p>
                        ) : applicants.length === 0 ? (
                            <p style={{ color: "var(--text-muted)", padding: "20px 0" }}>No students have applied to this drive yet.</p>
                        ) : (
                            <table style={{ width: "100%", borderCollapse: "collapse", color: "var(--text-main)" }}>
                                <thead>
                                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", textAlign: "left" }}>
                                        <th style={{ padding: "12px" }}>Name</th>
                                        <th style={{ padding: "12px" }}>Roll No.</th>
                                        <th style={{ padding: "12px" }}>Branch</th>
                                        <th style={{ padding: "12px" }}>CGPA</th>
                                        <th style={{ padding: "12px" }}>Resume</th>
                                        <th style={{ padding: "12px" }}>Status</th>
                                        <th style={{ padding: "12px" }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {applicants.map(app => (
                                        <tr key={app.student._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                                            <td style={{ padding: "16px 12px" }}>{app.student.name}</td>
                                            <td style={{ padding: "16px 12px" }}>{app.student.rollNumber || "N/A"}</td>
                                            <td style={{ padding: "16px 12px" }}>{app.student.branch}</td>
                                            <td style={{ padding: "16px 12px", fontWeight: "600" }}>{app.student.cgpa}</td>
                                            <td style={{ padding: "16px 12px" }}>
                                                {app.student.resume ? (
                                                    <a href={`http://localhost:5000/${app.student.resume.replace(/\\/g, '/')}`} target="_blank" rel="noreferrer" style={{ color: "var(--primary-color)", textDecoration: "underline" }}>
                                                        View PDF
                                                    </a>
                                                ) : (
                                                    <span style={{ color: "var(--text-muted)" }}>No Resume</span>
                                                )}
                                            </td>
                                            <td style={{ padding: "16px 12px" }}>
                                                <span style={{ 
                                                    padding: "4px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "600",
                                                    backgroundColor: app.status === "applied" ? "rgba(255,255,255,0.1)" : 
                                                                     app.status === "shortlisted" ? "rgba(245, 158, 11, 0.2)" : 
                                                                     app.status === "interview" ? "rgba(59, 130, 246, 0.2)" : 
                                                                     app.status === "selected" ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)",
                                                    color: app.status === "applied" ? "var(--text-main)" : 
                                                           app.status === "shortlisted" ? "#f59e0b" : 
                                                           app.status === "interview" ? "#3b82f6" : 
                                                           app.status === "selected" ? "#10b981" : "#ef4444"
                                                }}>
                                                    {app.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td style={{ padding: "16px 12px" }}>
                                                <select 
                                                    value={app.status} 
                                                    onChange={(e) => handleStatusChange(app.student._id, e.target.value)}
                                                    style={{ 
                                                        padding: "6px 10px", borderRadius: "4px", backgroundColor: "var(--input-bg)", 
                                                        color: "var(--text-main)", border: "1px solid rgba(255,255,255,0.1)", outline: "none", cursor: "pointer"
                                                    }}
                                                >
                                                    <option value="applied">Applied</option>
                                                    <option value="shortlisted">Shortlisted</option>
                                                    <option value="interview">Interview</option>
                                                    <option value="selected">Selected</option>
                                                    <option value="rejected">Rejected</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export default Applicants;