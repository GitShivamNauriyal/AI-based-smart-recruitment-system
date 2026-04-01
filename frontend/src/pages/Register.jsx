import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import api from "../services/api"

export default function Register() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "candidate", // Default role
    })
    const [error, setError] = useState("")

    const handleRegister = async (e) => {
        e.preventDefault()
        try {
            // Hit the Node.js registration endpoint
            await api.post("/auth/register", formData)
            alert("Account created successfully! Please log in.")
            navigate("/") // Redirect to login page
        } catch (err) {
            setError(err.response?.data?.error || "Registration failed.")
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 bg-white rounded shadow-md w-96">
                <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
                    Create Account
                </h2>

                {error && (
                    <div className="p-2 mb-4 text-sm text-red-700 bg-red-100 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister}>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-bold text-gray-700">
                            Full Name
                        </label>
                        <input
                            type="text"
                            required
                            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    name: e.target.value,
                                })
                            }
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-bold text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            required
                            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                            value={formData.email}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    email: e.target.value,
                                })
                            }
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-bold text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            required
                            minLength="6"
                            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                            value={formData.password}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    password: e.target.value,
                                })
                            }
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block mb-2 text-sm font-bold text-gray-700">
                            I am a...
                        </label>
                        <select
                            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                            value={formData.role}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    role: e.target.value,
                                })
                            }
                        >
                            <option value="candidate">
                                Job Seeker (Candidate)
                            </option>
                            <option value="recruiter">
                                Hiring Manager (Recruiter)
                            </option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full px-4 py-2 font-bold text-white bg-green-600 rounded hover:bg-green-700"
                    >
                        Register
                    </button>
                </form>

                <p className="mt-4 text-sm text-center text-gray-600">
                    Already have an account?{" "}
                    <Link to="/" className="text-blue-600 hover:underline">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    )
}
