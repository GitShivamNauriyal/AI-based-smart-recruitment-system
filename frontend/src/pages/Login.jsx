import { useState, useContext } from "react"
import { useNavigate, Link } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import api from "../services/api"

export default function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const { login } = useContext(AuthContext)
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            const response = await api.post("/auth/login", { email, password })
            login(response.data.token)
            if (response.data.role === "recruiter") navigate("/dashboard")
            else navigate("/portal")
        } catch (error) {
            const errData = error.response?.data
            alert(
                errData?.errors
                    ? errData.errors[0].msg
                    : errData?.error || "Login failed.",
            )
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="glass-panel p-10 w-104 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob"></div>
                <h2 className="mb-8 text-4xl font-black text-center text-slate-800 tracking-tight">
                    Access <span className="text-indigo-600">Portal</span>
                </h2>
                <form
                    onSubmit={handleLogin}
                    className="space-y-6 relative z-10"
                >
                    <div>
                        <input
                            type="email"
                            required
                            placeholder="Enter transmission email"
                            className="w-full px-5 py-3 bg-white/50 border border-white/40 rounded-2xl focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            required
                            placeholder="Security key"
                            className="w-full px-5 py-3 bg-white/50 border border-white/40 rounded-2xl focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full px-5 py-3 font-bold text-white bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:scale-[1.02] transition-all"
                    >
                        Initialize Session
                    </button>
                    <p className="text-sm text-center text-slate-500 font-medium">
                        Unregistered entity?{" "}
                        <Link
                            to="/register"
                            className="text-indigo-600 hover:text-indigo-800"
                        >
                            Establish connection
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    )
}
