import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import api from "../services/api"

export default function ShortlistView() {
    const { jobId } = useParams()
    const [applicants, setApplicants] = useState([])

    const handleDownload = async (appId, candidateName) => {
        try {
            const response = await api.get(`/applications/${appId}/resume`, {
                responseType: "blob", // CRITICAL: Tells Axios we are downloading a file, not JSON
            })

            // Create a temporary link to force the browser download
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement("a")
            link.href = url
            link.setAttribute(
                "download",
                `${candidateName.replace(/\s+/g, "_")}_Resume.pdf`,
            )
            document.body.appendChild(link)
            link.click()
            link.remove()
        } catch (error) {
            console.error("Download failed", error)
            alert("Failed to securely download the dossier.")
        }
    }

    useEffect(() => {
        const fetchShortlist = async () => {
            try {
                const response = await api.get(`/jobs/${jobId}/shortlist`)
                setApplicants(response.data)
            } catch (error) {
                console.error(error)
            }
        }
        fetchShortlist()
    }, [jobId])

    return (
        <div className="max-w-5xl p-8 mx-auto mt-6">
            <div className="flex items-end justify-between mb-8">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-800">
                        AI Shortlist
                    </h1>
                    <p className="mt-2 text-sm font-semibold text-indigo-500 uppercase tracking-widest">
                        Powered by Semantic Parsing
                    </p>
                </div>
            </div>

            <div className="space-y-6">
                {applicants.map((candidate, idx) => (
                    <div
                        key={candidate.appID}
                        className="glass-panel p-8 flex items-center justify-between relative overflow-hidden"
                    >
                        {/* 2027 Rank Badge */}
                        <div className="absolute top-0 left-0 w-2 h-full bg-linear-to-b from-indigo-500 to-cyan-400"></div>

                        <div className="flex-1 pl-6">
                            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                                #{idx + 1} {candidate.name}
                            </h2>
                            <div className="flex flex-wrap gap-2 mt-4">
                                {candidate.extractedSkills?.map((skill, i) => (
                                    <span
                                        key={i}
                                        className="px-3 py-1 text-xs font-bold tracking-wider text-indigo-800 bg-indigo-100/50 rounded-full uppercase border border-indigo-200"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col items-end border-l border-slate-200/50 pl-8 ml-8">
                            <span
                                className={`text-5xl font-black ${candidate.matchScore > 0.75 ? "text-cyan-500" : "text-indigo-400"}`}
                            >
                                {(candidate.matchScore * 100).toFixed(0)}
                                <span className="text-2xl text-slate-400">
                                    %
                                </span>
                            </span>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                                Match Index
                            </span>

                            <button
                                onClick={() =>
                                    handleDownload(
                                        candidate.appID,
                                        candidate.name,
                                    )
                                }
                                className="mt-6 px-6 py-2 text-sm font-bold text-indigo-600 bg-white rounded-full shadow-md hover:shadow-lg hover:text-indigo-800 transition-all border border-indigo-50 cursor-pointer"
                            >
                                Download PDF Dossier
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
