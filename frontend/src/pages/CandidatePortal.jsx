import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"

export default function CandidatePortal() {
    const [jobs, setJobs] = useState([])
    const [selectedJobId, setSelectedJobId] = useState("")
    const [file, setFile] = useState(null)
    const [status, setStatus] = useState("")
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    // Fetch all open jobs when the portal loads
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await api.get("/jobs")
                setJobs(response.data)
            } catch (error) {
                console.error("Failed to fetch jobs", error)
            } finally {
                setLoading(false)
            }
        }
        fetchJobs()
    }, [])

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0]
        if (selectedFile && selectedFile.type === "application/pdf") {
            setFile(selectedFile)
        } else {
            alert("Security Protocol: Please upload a .pdf file only.")
            setFile(null)
        }
    }

    const handleApply = async (e) => {
        e.preventDefault()
        if (!file || !selectedJobId) return

        const formData = new FormData()
        formData.append("resume", file)
        formData.append("jobId", selectedJobId)

        try {
            setStatus("Uploading dossier and executing AI parsing...")
            await api.post("/applications/apply", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            setStatus("Application secured! Routing to your pipeline...")
            setFile(null)

            // Automatically push them to My Applications after 1.5 seconds so they don't have to reload
            setTimeout(() => navigate("/my-applications"), 1500)
        } catch (error) {
            console.error(error.response?.data)
            setStatus(
                error.response?.data?.error || "Error submitting application.",
            )
        }
    }

    if (loading)
        return (
            <div className="p-8 text-center text-slate-500 font-bold">
                Synchronizing active jobs...
            </div>
        )

    return (
        <div className="max-w-4xl p-8 mx-auto mt-10">
            <h1 className="mb-8 text-4xl font-black tracking-tight text-slate-800">
                Available Deployments
            </h1>
            <div className="glass-panel p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-400 rounded-full mix-blend-multiply filter blur-2xl opacity-10"></div>

                <h2 className="mb-6 text-xl font-bold text-slate-800 relative z-10">
                    Submit Dossier
                </h2>

                {jobs.length === 0 ? (
                    <p className="text-slate-500 font-medium">
                        No open jobs available at the moment. Please check back
                        later.
                    </p>
                ) : (
                    <form
                        onSubmit={handleApply}
                        className="space-y-6 relative z-10"
                    >
                        <div>
                            <label className="block mb-2 text-sm font-bold text-indigo-900 uppercase tracking-wider">
                                Select Position
                            </label>
                            <select
                                required
                                className="w-full px-4 py-3 bg-white/50 border border-white/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-700 font-medium"
                                value={selectedJobId}
                                onChange={(e) =>
                                    setSelectedJobId(e.target.value)
                                }
                            >
                                <option value="" disabled>
                                    -- Select a Job --
                                </option>
                                {jobs.map((job) => (
                                    <option key={job.job_id} value={job.job_id}>
                                        {job.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-bold text-indigo-900 uppercase tracking-wider">
                                Upload Resume (.PDF ONLY)
                            </label>
                            <input
                                type="file"
                                required
                                accept=".pdf"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-slate-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200 transition-all cursor-pointer"
                            />
                        </div>

                        <button
                            type="submit"
                            className="px-6 py-3 font-bold text-white bg-blue-600 rounded-xl shadow-lg hover:bg-green-700 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:-translate-y-0.5"
                            disabled={!file || !selectedJobId}
                        >
                            Execute Application
                        </button>
                    </form>
                )}
                {status && (
                    <p
                        className={`mt-6 text-sm font-bold ${status.includes("Error") ? "text-red-500" : "text-blue-600"}`}
                    >
                        {status}
                    </p>
                )}
            </div>
        </div>
    )
}
