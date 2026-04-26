import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"

export default function JobPostForm() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        requiredSkills: [{ skillName: "", weight: 5 }],
    })
    const [error, setError] = useState("")

    const handleSkillChange = (index, field, value) => {
        const newSkills = [...formData.requiredSkills]
        newSkills[index][field] = field === "weight" ? Number(value) : value
        setFormData({ ...formData, requiredSkills: newSkills })
    }

    const addSkill = () =>
        setFormData({
            ...formData,
            requiredSkills: [
                ...formData.requiredSkills,
                { skillName: "", weight: 5 },
            ],
        })
    const removeSkill = (index) =>
        setFormData({
            ...formData,
            requiredSkills: formData.requiredSkills.filter(
                (_, i) => i !== index,
            ),
        })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        const cleanedSkills = formData.requiredSkills.filter(
            (s) => s.skillName.trim() !== "",
        )
        if (cleanedSkills.length === 0)
            return setError("Please add at least one required skill.")

        try {
            await api.post("/jobs/create", {
                title: formData.title,
                description: formData.description,
                requiredSkills: cleanedSkills,
            })
            navigate("/dashboard")
        } catch (error) {
            setError(
                error.response?.data?.errors?.[0]?.msg || "Error posting job.",
            )
        }
    }

    return (
        <div className="max-w-3xl p-8 mx-auto mt-6">
            <div className="mb-8">
                <h1 className="text-4xl font-black tracking-tight text-slate-800">
                    Deploy Job
                </h1>
                <p className="mt-2 text-sm font-semibold text-indigo-500 uppercase tracking-widest">
                    Configure AI Parameters
                </p>
            </div>

            {error && (
                <div className="p-3 mb-6 text-sm font-bold text-red-600 bg-red-100/50 border border-red-200 rounded-xl">
                    {error}
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className="glass-panel p-8 space-y-8 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>

                <div className="relative z-10 space-y-6">
                    <div>
                        <label className="block mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Position Title
                        </label>
                        <input
                            type="text"
                            required
                            className="w-full px-5 py-3 bg-white/50 border border-indigo-500/40 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800 font-medium"
                            value={formData.title}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    title: e.target.value,
                                })
                            }
                        />
                    </div>

                    <div>
                        <label className="block mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Full Description
                        </label>
                        <textarea
                            required
                            rows="5"
                            className="w-full px-5 py-3 bg-white/50 border border-indigo-500/40 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800 font-medium resize-none"
                            placeholder="Paste the job description here to calibrate the AI model..."
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    description: e.target.value,
                                })
                            }
                        />
                    </div>

                    <div className="p-6 bg-white/30 border border-white/40 rounded-2xl shadow-inner">
                        <label className="block mb-1 text-sm font-bold text-slate-800">
                            AI Target Skills & Weightage
                        </label>
                        <p className="mb-5 text-xs text-slate-500">
                            Assign a semantic weight (1-10) to define importance
                            for the parsing engine.
                        </p>

                        <div className="space-y-3">
                            {formData.requiredSkills.map((skill, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3"
                                >
                                    <input
                                        type="text"
                                        required
                                        placeholder="Skill (e.g. Python)"
                                        className="grow px-4 py-2.5 bg-white border border-indigo-500/40 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm font-medium shadow-sm"
                                        value={skill.skillName}
                                        onChange={(e) =>
                                            handleSkillChange(
                                                index,
                                                "skillName",
                                                e.target.value,
                                            )
                                        }
                                    />

                                    <div className="relative">
                                        <input
                                            type="number"
                                            required
                                            min="1"
                                            max="10"
                                            className="w-24 px-4 py-2.5 bg-white border border-indigo-500/40 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm font-medium pl-8 shadow-sm"
                                            value={skill.weight}
                                            onChange={(e) =>
                                                handleSkillChange(
                                                    index,
                                                    "weight",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">
                                            WT
                                        </span>
                                    </div>

                                    {formData.requiredSkills.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeSkill(index)}
                                            className="w-10 h-10 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={addSkill}
                            className="mt-4 px-4 py-2 text-xs font-bold text-indigo-600 bg-white/50 border border-indigo-100 rounded-lg hover:bg-indigo-50 transition-colors shadow-sm"
                        >
                            + Append Skill Requirement
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full relative z-10 px-6 py-4 font-bold text-white bg-linear-to-r from-indigo-600 to-cyan-500 rounded-xl shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all text-lg tracking-wide"
                >
                    Initialize Job Deployment
                </button>
            </form>
        </div>
    )
}
