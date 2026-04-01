import { useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"

export default function Navbar() {
    const { user, logout } = useContext(AuthContext)
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate("/")
    }

    if (!user) return null // Don't show navbar on login screen

    return (
        <nav className="p-4 text-white bg-blue-900 shadow-md">
            <div className="flex items-center justify-between max-w-6xl mx-auto">
                <div className="text-xl font-bold tracking-wider">
                    SmartRecruit AI
                </div>

                <div className="flex items-center space-x-6">
                    {user.role === "candidate" ? (
                        <>
                            <Link to="/portal" className="hover:text-blue-300">
                                Browse Jobs
                            </Link>
                            <Link
                                to="/my-applications"
                                className="hover:text-blue-300"
                            >
                                My Applications
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/dashboard"
                                className="hover:text-blue-300"
                            >
                                My Jobs
                            </Link>
                            <Link
                                to="/post-job"
                                className="px-4 py-2 font-bold text-blue-900 bg-white rounded hover:bg-gray-200"
                            >
                                Post a Job
                            </Link>
                        </>
                    )}
                    <button
                        onClick={handleLogout}
                        className="text-sm font-semibold text-red-300 hover:text-red-100"
                    >
                        Logout ({user.name || user.email})
                    </button>
                </div>
            </div>
        </nav>
    )
}
