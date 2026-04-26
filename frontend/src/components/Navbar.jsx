import { useContext } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"

export default function Navbar() {
    const { user, logout } = useContext(AuthContext)
    const navigate = useNavigate()
    const location = useLocation()

    // Hide Navbar completely on Auth screens
    if (location.pathname === "/" || location.pathname === "/register")
        return null

    const handleLogout = () => {
        logout()
        navigate("/")
    }

    return (
        <div className="pt-6 pb-2">
            <nav className="max-w-5xl mx-auto glass-panel px-8 py-4 flex items-center justify-between">
                <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500 tracking-tighter">
                    SmartRecruit
                    <span className="font-light text-indigo-900">AI</span>
                </div>

                <div className="flex items-center space-x-8 font-medium text-slate-600">
                    {user?.role === "candidate" ? (
                        <>
                            <Link
                                to="/portal"
                                className="hover:text-indigo-600 transition-colors"
                            >
                                Job Board
                            </Link>
                            <Link
                                to="/my-applications"
                                className="hover:text-indigo-600 transition-colors"
                            >
                                My Pipeline
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/dashboard"
                                className="hover:text-indigo-600 transition-colors"
                            >
                                Command Center
                            </Link>
                            <Link
                                to="/post-job"
                                className="px-5 py-2 text-white bg-indigo-600 rounded-full shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all"
                            >
                                Deploy Job
                            </Link>
                        </>
                    )}
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 text-sm text-slate-500 bg-white/50 rounded-full hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
            </nav>
        </div>
    )
}
