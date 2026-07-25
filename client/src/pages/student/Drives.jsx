import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

function Drives() {
    const [drives, setDrives] = useState([]);
    const [loading, setLoading] = useState(true);
    const [applyingId, setApplyingId] = useState(null);
    const [studentId, setStudentId] = useState(null);

    useEffect(() => {
        const fetchDrives = async () => {
            try {
                const token = localStorage.getItem("token");
                if (token) {
                    const payload = JSON.parse(atob(token.split(".")[1]));
                    setStudentId(payload.id);
                }
                const config = { headers: { Authorization: `Bearer ${token}` } };
                
                const response = await api.get("/drives", config);
                setDrives(response.data.drives || []);
            } catch (error) {
                console.error("Failed to fetch drives", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDrives();
    }, []);

    const handleApply = async (driveId) => {
        setApplyingId(driveId);
        try {
            const token = localStorage.getItem("token");
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            await api.post(`/drives/${driveId}/apply`, {}, config);
            
            // Update the UI immediately without a refresh
            setDrives(prevDrives => prevDrives.map(d => {
                if (d._id === driveId) {
                    // We append a fake applicant entry matching the student's ID so the UI detects it
                    return { ...d, applicants: [...(d.applicants || []), { student: studentId, status: "applied" }] };
                }
                return d;
            }));
            
            alert("Successfully applied to the drive!");
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Failed to apply");
        } finally {
            setApplyingId(null);
        }
    };

    if (loading) {
        return <div style={{ padding: "40px", textAlign: "center", color: "var(--text-main)" }}><h2>Loading Drives...</h2></div>;
    }

    return (
        <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
            
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
                <h1 style={{ fontSize: "32px", color: "var(--text-main)" }}>Available Drives</h1>
                <Link to="/student/dashboard" style={{ color: "var(--primary-color)", textDecoration: "none", fontWeight: "600" }}>
                    &larr; Back to Dashboard
                </Link>
            </div>

            {drives.length === 0 ? (
                <div className="auth-card" style={{ padding: "40px", textAlign: "center" }}>
                    <h2 style={{ color: "var(--text-main)" }}>No placement drives available right now.</h2>
                </div>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "24px" }}>
                    {drives.map(drive => {
                        // Check if the current student ID is already in the applicants array
                        const hasApplied = drive.applicants && drive.applicants.some(app => app.student === studentId);

                        return (
                            <div key={drive._id} className="auth-card" style={{ padding: "30px", maxWidth: "100%", textAlign: "left", display: "flex", flexDirection: "column" }}>
                                
                                <div style={{ marginBottom: "16px" }}>
                                    <h2 style={{ fontSize: "24px", color: "var(--primary-color)", marginBottom: "4px" }}>{drive.companyName}</h2>
                                    <h3 style={{ fontSize: "18px", color: "var(--text-main)", fontWeight: "500" }}>{drive.jobRole}</h3>
                                </div>
                                
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" }}>
                                    <div style={{ padding: "10px", backgroundColor: "var(--input-bg)", borderRadius: "8px" }}>
                                        <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Package</p>
                                        <p style={{ fontSize: "16px", color: "var(--text-main)", fontWeight: "600" }}>{drive.package}</p>
                                    </div>
                                    <div style={{ padding: "10px", backgroundColor: "var(--input-bg)", borderRadius: "8px" }}>
                                        <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Location</p>
                                        <p style={{ fontSize: "16px", color: "var(--text-main)", fontWeight: "600" }}>{drive.location}</p>
                                    </div>
                                    <div style={{ padding: "10px", backgroundColor: "var(--input-bg)", borderRadius: "8px" }}>
                                        <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Eligibility</p>
                                        <p style={{ fontSize: "16px", color: "var(--text-main)", fontWeight: "600" }}>{drive.eligibilityCGPA} CGPA</p>
                                    </div>
                                    <div style={{ padding: "10px", backgroundColor: "var(--input-bg)", borderRadius: "8px" }}>
                                        <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Deadline</p>
                                        <p style={{ fontSize: "16px", color: "#ef4444", fontWeight: "600" }}>{new Date(drive.lastDateToApply).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                
                                <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "24px", lineHeight: "1.6", flexGrow: 1 }}>
                                    {drive.description}
                                </p>
                                
                                <button 
                                    onClick={() => handleApply(drive._id)} 
                                    disabled={applyingId === drive._id || hasApplied}
                                    style={{ width: "100%", padding: "12px", marginTop: "auto", backgroundColor: (applyingId === drive._id || hasApplied) ? "var(--text-muted)" : "var(--primary-color)" }}
                                >
                                    {hasApplied ? "Already Applied" : applyingId === drive._id ? "Applying..." : "Apply Now"}
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default Drives;