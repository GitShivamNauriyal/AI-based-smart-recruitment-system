import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"

export default function JobPostForm() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        requiredSkills: "", // e.g., "React, Python, SQL"
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await api.post("/jobs/create", {
                ...formData,
                requiredSkills: formData.requiredSkills
                    .split(",")
                    .map((s) => s.trim()),
            })
            navigate("/dashboard")
        } catch (error) {
            alert("Error posting job.")
        }
    }

    return (
        <div className="max-w-3xl p-8 mx-auto">
            <h1 className="mb-6 text-3xl font-bold">Post a New Job</h1>
            <form
                onSubmit={handleSubmit}
                className="p-6 space-y-6 bg-white rounded shadow"
            >
                <div>
                    <label className="block mb-2 font-semibold">
                        Job Title
                    </label>
                    <input
                        type="text"
                        required
                        className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                        value={formData.title}
                        onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                        }
                    />
                </div>

                <div>
                    <label className="block mb-2 font-semibold">
                        Job Description
                    </label>
                    <textarea
                        required
                        rows="5"
                        className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                        placeholder="Paste the full job description here. The AI will use this to calculate the match score."
                        value={formData.description}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                description: e.target.value,
                            })
                        }
                    />
                </div>

                <div>
                    <label className="block mb-2 font-semibold">
                        Required Skills (comma separated)
                    </label>
                    <input
                        type="text"
                        required
                        className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., React, Node.js, Python, Machine Learning"
                        value={formData.requiredSkills}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                requiredSkills: e.target.value,
                            })
                        }
                    />
                </div>

                <button
                    type="submit"
                    className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded hover:bg-blue-700"
                >
                    Publish Job
                </button>
            </form>
        </div>
    )
}
