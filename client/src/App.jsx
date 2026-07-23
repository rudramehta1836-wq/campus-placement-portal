import { Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import StudentDashboard from "./pages/student/StudentDashboard";
import StudentProfile from "./pages/student/StudentProfile";
import Drives from "./pages/student/Drives";

import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";
import CreateDrive from "./pages/recruiter/CreateDrive";
import Applicants from "./pages/recruiter/Applicants";

function App() {
  return (
    <Routes>

      <Route path="/" element={<Login />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route
        path="/student/dashboard"
        element={<StudentDashboard />}
      />

      <Route
        path="/student/profile"
        element={<StudentProfile />}
      />

      <Route
        path="/student/drives"
        element={<Drives />}
      />

      <Route
        path="/recruiter/dashboard"
        element={<RecruiterDashboard />}
      />

      <Route
        path="/recruiter/create-drive"
        element={<CreateDrive />}
      />

      <Route
        path="/recruiter/applicants"
        element={<Applicants />}
      />

    </Routes>
  );
}

export default App;