import { Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import StudentDashboard from "./pages/student/StudentDashboard";
import StudentProfile from "./pages/student/StudentProfile";
import Drives from "./pages/student/Drives";

import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";
import CreateDrive from "./pages/recruiter/CreateDrive";
import Applicants from "./pages/recruiter/Applicants";

import ProtectedRoute from "./routes/ProtectedRoutes";

function App() {
  return (
    <Routes>

      {/* Public Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Student Routes */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute role="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/profile"
        element={
          <ProtectedRoute role="student">
            <StudentProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/drives"
        element={
          <ProtectedRoute role="student">
            <Drives />
          </ProtectedRoute>
        }
      />

      {/* Recruiter Routes */}
      <Route
        path="/recruiter/dashboard"
        element={
          <ProtectedRoute role="recruiter">
            <RecruiterDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/recruiter/create-drive"
        element={
          <ProtectedRoute role="recruiter">
            <CreateDrive />
          </ProtectedRoute>
        }
      />

      <Route
        path="/recruiter/applicants"
        element={
          <ProtectedRoute role="recruiter">
            <Applicants />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default App;