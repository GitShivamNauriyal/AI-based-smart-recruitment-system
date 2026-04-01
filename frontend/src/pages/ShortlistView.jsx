import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import api from "../services/api"

export default function ShortlistView() {
    const { jobId } = useParams()
    const [applicants, setApplicants] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchShortlist = async () => {
            try {
                // Expected to return candidates sorted by matchScore descending
                const response = await api.get(`/jobs/${jobId}/shortlist`)
                setApplicants(response.data)
            } catch (error) {
                console.error("Error fetching shortlist", error)
            } finally {
                setLoading(false)
            }
        }
        fetchShortlist()
    }, [jobId])

    if (loading)
        return (
            <div className="p-8 text-center">Running AI Ranking Engine...</div>
        )

    return (
        <div className="max-w-5xl p-8 mx-auto">
            <h1 className="mb-2 text-3xl font-bold">
                Ranked Candidate Shortlist
            </h1>
            <p className="mb-8 text-red-600 text-sm font-semibold">
                * AI scores are for academic demonstration purposes only. Human
                judgment should always be applied in actual hiring decisions.
            </p>

            {applicants.length === 0 ? (
                <p className="p-6 bg-white rounded shadow">
                    No applications received yet.
                </p>
            ) : (
                <div className="space-y-4">
                    {applicants.map((candidate, index) => (
                        <div
                            key={candidate.appID}
                            className="flex items-center p-6 bg-white border-l-4 border-blue-600 rounded shadow"
                        >
                            <div className="shrink-0 w-16 text-2xl font-bold text-gray-400">
                                #{index + 1}
                            </div>
                            <div className="grow">
                                <h2 className="text-xl font-bold">
                                    {candidate.name}
                                </h2>
                                <div className="flex gap-2 mt-2">
                                    {candidate.extractedSkills?.map((skill) => (
                                        <span
                                            key={skill}
                                            className="px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <span
                                    className={`text-3xl font-bold ${candidate.matchScore > 0.75 ? "text-green-600" : "text-orange-500"}`}
                                >
                                    {(candidate.matchScore * 100).toFixed(0)}%
                                </span>
                                <span className="text-sm text-gray-500">
                                    Match Score
                                </span>
                                <a
                                    href={candidate.resumeUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-2 text-sm text-blue-600 hover:underline"
                                >
                                    View Resume
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
