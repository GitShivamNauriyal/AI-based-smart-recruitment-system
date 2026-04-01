import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom"
import { AuthProvider, AuthContext } from "./context/AuthContext"
import { useContext } from "react"

// Import all pages and components
import Navbar from "./components/Navbar"
import Register from "./pages/Register"
import Login from "./pages/Login"
import CandidatePortal from "./pages/CandidatePortal"
import RecruiterDashboard from "./pages/RecruiterDashboard"
import JobPostForm from "./pages/JobPostForm"
import ShortlistView from "./pages/ShortlistView"

const ProtectedRoute = ({ children, allowedRole }) => {
    const { user } = useContext(AuthContext)
    if (!user) return <Navigate to="/" />
    if (allowedRole && user.role !== allowedRole) return <Navigate to="/" />
    return children
}

export default function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen bg-gray-50 text-gray-900">
                    <Navbar />{" "}
                    {/* Navbar included here so it shows on all protected routes */}
                    <Routes>
                        <Route path="/" element={<Login />} />

                        {/* Candidate Routes */}
                        <Route
                            path="/portal"
                            element={
                                <ProtectedRoute allowedRole="candidate">
                                    <CandidatePortal />
                                </ProtectedRoute>
                            }
                        />

                        {/* Recruiter Routes */}
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute allowedRole="recruiter">
                                    <RecruiterDashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/post-job"
                            element={
                                <ProtectedRoute allowedRole="recruiter">
                                    <JobPostForm />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/shortlist/:jobId"
                            element={
                                <ProtectedRoute allowedRole="recruiter">
                                    <ShortlistView />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/register" element={<Register />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    )
}
