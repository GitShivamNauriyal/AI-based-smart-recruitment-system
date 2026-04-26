import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import api from "../services/api"

export default function Register() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "candidate",
    })
    const [error, setError] = useState("")

    const handleRegister = async (e) => {
        e.preventDefault()
        try {
            await api.post("/auth/register", formData)
            alert("Account created successfully! Please log in.")
            navigate("/")
        } catch (err) {
            const errData = err.response?.data
            setError(
                errData?.errors
                    ? errData.errors[0].msg
                    : errData?.error || "Server error.",
            )
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="glass-panel p-10 w-[28rem] relative overflow-hidden shadow-2xl">
                {/* Decorative floating blur */}
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>

                <h2 className="mb-8 text-4xl font-black text-center text-slate-800 tracking-tight">
                    Create <span className="text-cyan-600">Identity</span>
                </h2>

                {error && (
                    <div className="p-3 mb-6 text-sm font-bold text-red-600 bg-red-100/50 border border-red-200 rounded-xl">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleRegister}
                    className="space-y-5 relative z-10"
                >
                    <input
                        type="text"
                        required
                        placeholder="Full Name"
                        className="w-full px-5 py-3 bg-white/50 border border-white/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition-all text-slate-700 font-medium"
                        value={formData.name}
                        onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                        }
                    />

                    <input
                        type="email"
                        required
                        placeholder="Email Address"
                        className="w-full px-5 py-3 bg-white/50 border border-white/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition-all text-slate-700 font-medium"
                        value={formData.email}
                        onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                        }
                    />

                    <input
                        type="password"
                        required
                        placeholder="Security Key (Min 6 chars)"
                        className="w-full px-5 py-3 bg-white/50 border border-white/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition-all text-slate-700 font-medium"
                        value={formData.password}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                password: e.target.value,
                            })
                        }
                    />

                    <select
                        className="w-full px-5 py-3 bg-white/50 border border-white/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition-all text-slate-700 font-medium appearance-none"
                        value={formData.role}
                        onChange={(e) =>
                            setFormData({ ...formData, role: e.target.value })
                        }
                    >
                        <option value="candidate">
                            Job Seeker (Candidate)
                        </option>
                        <option value="recruiter">
                            Hiring Manager (Recruiter)
                        </option>
                    </select>

                    <button
                        type="submit"
                        className="w-full mt-2 px-5 py-3 font-bold text-white bg-cyan-600 rounded-xl shadow-xl shadow-cyan-200 hover:bg-cyan-700 hover:-translate-y-0.5 transition-all"
                    >
                        Register Entity
                    </button>
                </form>

                <p className="mt-6 text-sm text-center text-slate-500 font-medium relative z-10">
                    Already in the system?{" "}
                    <Link to="/" className="text-cyan-600 hover:text-cyan-800">
                        Initialize Login
                    </Link>
                </p>
            </div>
        </div>
    )
}
