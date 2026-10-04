import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function StudentDashboard() {
    const navigate = useNavigate();
    
    // State to hold the data we get from Node.js
    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    // This runs automatically when the page loads
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Get the token to prove we are logged in
                const token = localStorage.getItem("token");
                if (!token) {
                    navigate("/login");
                    return;
                }

                // Setup the authorization header for our API requests
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };

                // Fetch both profile and dashboard stats simultaneously from the backend
                const [profileRes, statsRes] = await Promise.all([
                    api.get("/students/profile", config),
                    api.get("/students/dashboard", config)
                ]);

                // Save the data to our React state
                setProfile(profileRes.data.student);
                setStats(statsRes.data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
                // Only log out if it's an authentication error (401 or 403)
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("role");
                    navigate("/login");
                } else {
                    setLoading(false);
                }
            }
        };

        fetchDashboardData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
    };

    if (loading) {
        return <div style={{ padding: "40px", textAlign: "center", color: "var(--text-main)" }}><h2>Loading Dashboard...</h2></div>;
    }

    return (
        <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
            
            {/* Header Section */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
                <h1 style={{ fontSize: "32px", color: "var(--text-main)" }}>Welcome, {profile?.name}! 👋</h1>
                
                <button 
                    onClick={handleLogout}
                    style={{ width: "auto", padding: "10px 20px", backgroundColor: "#ef4444", marginTop: "0" }}
                >
                    Log Out
                </button>
            </div>

            {/* Dashboard Cards Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
                
                {/* Card 1: Applications Overview (Using Backend Stats) */}
                <div className="auth-card" style={{ padding: "30px", maxWidth: "100%", textAlign: "left", display: "flex", flexDirection: "column" }}>
                    <h2 style={{ fontSize: "22px", marginBottom: "12px", color: "var(--text-main)" }}>Application Status</h2>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" }}>
                        <div style={{ padding: "10px", backgroundColor: "var(--input-bg)", borderRadius: "8px" }}>
                            <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>Total Applied</p>
                            <h3 style={{ fontSize: "24px", color: "var(--primary-color)" }}>{stats?.totalApplications || 0}</h3>
                        </div>
                        <div style={{ padding: "10px", backgroundColor: "var(--input-bg)", borderRadius: "8px" }}>
                            <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>Shortlisted</p>
                            <h3 style={{ fontSize: "24px", color: "#f59e0b" }}>{stats?.shortlisted || 0}</h3>
                        </div>
                        <div style={{ padding: "10px", backgroundColor: "var(--input-bg)", borderRadius: "8px" }}>
                            <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>Interviews</p>
                            <h3 style={{ fontSize: "24px", color: "#3b82f6" }}>{stats?.interview || 0}</h3>
                        </div>
                        <div style={{ padding: "10px", backgroundColor: "var(--input-bg)", borderRadius: "8px" }}>
                            <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>Selected</p>
                            <h3 style={{ fontSize: "24px", color: "#10b981" }}>{stats?.selected || 0}</h3>
                        </div>
                    </div>
                    <button onClick={() => navigate("/student/drives")} style={{ marginTop: "auto", backgroundColor: "var(--text-main)", width: "100%" }}>View All Applications</button>
                </div>

                {/* Card 2: Profile Summary */}
                <div className="auth-card" style={{ padding: "30px", maxWidth: "100%", textAlign: "left", display: "flex", flexDirection: "column" }}>
                    <h2 style={{ fontSize: "22px", marginBottom: "12px", color: "var(--text-main)" }}>My Profile</h2>
                    <ul style={{ listStyle: "none", padding: 0, marginBottom: "24px", color: "var(--text-muted)", lineHeight: "2" }}>
                        <li><strong>Branch:</strong> {profile?.branch}</li>
                        <li><strong>CGPA:</strong> {profile?.cgpa}</li>
                        <li><strong>Roll Number:</strong> {profile?.rollNumber}</li>
                        <li><strong>Email:</strong> {profile?.email}</li>
                    </ul>
                    <button onClick={() => navigate("/student/profile")} style={{ marginTop: "auto", backgroundColor: "var(--text-main)", width: "100%" }}>Update Profile</button>
                </div>

                {/* Card 3: Drives */}
                <div className="auth-card" style={{ padding: "30px", maxWidth: "100%", textAlign: "left", display: "flex", flexDirection: "column" }}>
                    <h2 style={{ fontSize: "22px", marginBottom: "12px", color: "var(--text-main)" }}>Placement Drives</h2>
                    <p style={{ color: "var(--text-muted)", marginBottom: "24px" }}>Browse upcoming drives from top tech companies and apply with one click.</p>
                    <button onClick={() => navigate("/student/drives")} style={{ marginTop: "auto", backgroundColor: "var(--primary-color)", width: "100%" }}>Browse Drives</button>
                </div>

                {/* Card 4: AI Resume Match */}
                <div className="auth-card" style={{ padding: "30px", maxWidth: "100%", textAlign: "left", display: "flex", flexDirection: "column" }}>
                    <h2 style={{ fontSize: "22px", marginBottom: "12px", color: "var(--text-main)" }}>AI Resume Match ✨</h2>
                    <p style={{ color: "var(--text-muted)", marginBottom: "24px" }}>Analyze your resume against job descriptions to identify missing skills and get tailored suggestions.</p>
                    <button onClick={() => navigate("/student/ai-match")} style={{ marginTop: "auto", backgroundColor: "#10b981", width: "100%" }}>Analyze Match</button>
                </div>

            </div>
        </div>
    );
}

export default StudentDashboard;
