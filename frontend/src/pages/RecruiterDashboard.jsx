import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import api from "../services/api"

export default function RecruiterDashboard() {
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await api.get("/jobs/my-postings")
                setJobs(response.data)
            } catch (error) {
                console.error("Failed to fetch jobs", error)
            } finally {
                setLoading(false)
            }
        }
        fetchJobs()
    }, [])

    if (loading)
        return (
            <div className="p-8 text-center font-bold text-slate-500">
                Initializing dashboard...
            </div>
        )

    return (
        <div className="max-w-6xl p-8 mx-auto mt-6">
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-800">
                        Command Center
                    </h1>
                    <p className="mt-2 text-sm font-semibold text-indigo-500 uppercase tracking-widest">
                        Active Deployments
                    </p>
                </div>
                <Link
                    to="/post-job"
                    className="px-6 py-3 font-bold text-white bg-indigo-600 rounded-full shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all"
                >
                    + Deploy New Job
                </Link>
            </div>

            {jobs.length === 0 ? (
                <div className="glass-panel p-10 text-center">
                    <p className="text-slate-500 font-medium">
                        No active deployments. Initiate a new job posting to
                        begin.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {jobs.map((job) => (
                        <div
                            key={job.job_id}
                            className="glass-panel p-6 flex flex-col justify-between hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all relative overflow-hidden group"
                        >
                            {/* Hover flare effect */}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-400 rounded-full mix-blend-multiply filter blur-2xl opacity-0 group-hover:opacity-20 transition-opacity"></div>

                            <div className="relative z-10">
                                <h2 className="text-xl font-bold text-slate-800 leading-tight">
                                    {job.title}
                                </h2>
                                <p className="mt-3 text-sm text-slate-500 line-clamp-3 leading-relaxed">
                                    {job.description}
                                </p>
                            </div>

                            <div className="mt-6 pt-6 border-t border-white/50 flex items-center justify-between relative z-10">
                                <div className="flex flex-col">
                                    <span className="text-2xl font-black text-indigo-600">
                                        {job.applicantCount || 0}
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                        Candidates
                                    </span>
                                </div>
                                <Link
                                    to={`/shortlist/${job.job_id}`}
                                    className="px-4 py-2 text-xs font-bold text-indigo-600 bg-white/60 border border-indigo-100 rounded-full hover:bg-indigo-600 hover:text-white transition-colors shadow-sm"
                                >
                                    View Shortlist &rarr;
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
