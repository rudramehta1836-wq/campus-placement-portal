import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function RecruiterDashboard() {
    const navigate = useNavigate();
    
    // State to hold the data we get from Node.js
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

                // Fetch dashboard stats from the backend
                const response = await api.get("/recruiters/dashboard", config);

                // Save the data to our React state
                setStats(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching dashboard data", error);
                // If token is invalid or expired, log them out
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                navigate("/login");
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
                <h1 style={{ fontSize: "32px", color: "var(--text-main)" }}>Welcome, Recruiter! 🏢</h1>
                
                <button 
                    onClick={handleLogout}
                    style={{ width: "auto", padding: "10px 20px", backgroundColor: "#ef4444", marginTop: "0" }}
                >
                    Log Out
                </button>
            </div>

            {/* Dashboard Cards Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
                
                {/* Card 1: Drive Overview */}
                <div className="auth-card" style={{ padding: "30px", maxWidth: "100%", textAlign: "left", display: "flex", flexDirection: "column" }}>
                    <h2 style={{ fontSize: "22px", marginBottom: "12px", color: "var(--text-main)" }}>Drive Overview</h2>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" }}>
                        <div style={{ padding: "10px", backgroundColor: "var(--input-bg)", borderRadius: "8px" }}>
                            <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>Total Drives</p>
                            <h3 style={{ fontSize: "24px", color: "var(--primary-color)" }}>{stats?.totalDrives || 0}</h3>
                        </div>
                        <div style={{ padding: "10px", backgroundColor: "var(--input-bg)", borderRadius: "8px" }}>
                            <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>Active Drives</p>
                            <h3 style={{ fontSize: "24px", color: "#10b981" }}>{stats?.activeDrives || 0}</h3>
                        </div>
                    </div>
                    <button onClick={() => navigate("/recruiter/create-drive")} style={{ marginTop: "auto", backgroundColor: "var(--text-main)", width: "100%" }}>Create New Drive</button>
                </div>

                {/* Card 2: Applicant Statistics */}
                <div className="auth-card" style={{ padding: "30px", maxWidth: "100%", textAlign: "left", display: "flex", flexDirection: "column" }}>
                    <h2 style={{ fontSize: "22px", marginBottom: "12px", color: "var(--text-main)" }}>Applicant Statistics</h2>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" }}>
                        <div style={{ padding: "10px", backgroundColor: "var(--input-bg)", borderRadius: "8px" }}>
                            <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>Total Applicants</p>
                            <h3 style={{ fontSize: "24px", color: "var(--primary-color)" }}>{stats?.totalApplicants || 0}</h3>
                        </div>
                        <div style={{ padding: "10px", backgroundColor: "var(--input-bg)", borderRadius: "8px" }}>
                            <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>Selected</p>
                            <h3 style={{ fontSize: "24px", color: "#10b981" }}>{stats?.selectedStudents || 0}</h3>
                        </div>
                    </div>
                    <button onClick={() => navigate("/recruiter/applicants")} style={{ marginTop: "auto", backgroundColor: "var(--primary-color)", width: "100%" }}>View Applicants</button>
                </div>

            </div>
        </div>
    );
}

export default RecruiterDashboard;