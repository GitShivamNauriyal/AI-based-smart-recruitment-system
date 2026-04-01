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
        return <div className="p-8 text-center">Loading your dashboard...</div>

    return (
        <div className="max-w-6xl p-8 mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-800">
                    Recruiter Dashboard
                </h1>
                <Link
                    to="/post-job"
                    className="px-4 py-2 text-white bg-blue-600 rounded shadow hover:bg-blue-700"
                >
                    + Create New Job
                </Link>
            </div>

            {jobs.length === 0 ? (
                <p className="p-6 text-gray-600 bg-white rounded shadow">
                    You haven't posted any jobs yet.
                </p>
            ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {jobs.map((job) => (
                        <div
                            key={job.jobID}
                            className="p-6 bg-white border rounded shadow-sm hover:shadow-md"
                        >
                            <h2 className="text-xl font-bold text-gray-800">
                                {job.title}
                            </h2>
                            <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                                {job.description}
                            </p>

                            <div className="flex items-center justify-between mt-6">
                                <span className="text-sm font-semibold text-gray-500">
                                    Applicants: {job.applicantCount || 0}
                                </span>
                                <Link
                                    to={`/shortlist/${job.jobID}`}
                                    className="font-semibold text-blue-600 hover:underline"
                                >
                                    View Ranked Shortlist &rarr;
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
