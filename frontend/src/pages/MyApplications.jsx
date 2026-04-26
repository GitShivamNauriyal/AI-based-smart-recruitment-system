import { useState, useEffect } from "react"
import api from "../services/api"

export default function MyApplications() {
    const [apps, setApps] = useState([])
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchApps = async () => {
            try {
                const response = await api.get("/applications/my")
                setApps(response.data)
            } catch (err) {
                console.error("Error", err)
                setError(
                    "Failed to fetch pipeline data. Check backend connection.",
                )
            }
        }
        fetchApps()
    }, [])

    // Helper function to calculate the color gradient between Red (0%) and Indigo (100%)
    const getScoreColor = (score) => {
        // Red RGB: (239, 68, 68)
        // Indigo RGB: (79, 70, 229)
        const r = Math.round(239 + (79 - 239) * score)
        const g = Math.round(68 + (70 - 68) * score)
        const b = Math.round(68 + (229 - 68) * score)
        return `rgb(${r}, ${g}, ${b})`
    }

    return (
        <div className="max-w-4xl p-8 mx-auto mt-10">
            <h1 className="mb-8 text-4xl font-black tracking-tight text-slate-800">
                My Pipeline
            </h1>

            {error && (
                <div className="p-4 mb-6 font-bold text-red-600 bg-red-100 rounded-xl">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                {apps.length === 0 && !error ? (
                    <p className="text-slate-500 font-medium">
                        No active applications.
                    </p>
                ) : (
                    apps.map((app) => (
                        <div
                            key={app.app_id}
                            className="glass-panel p-6 flex justify-between items-center hover:-translate-y-1 transition-transform"
                        >
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">
                                    {app.title}
                                </h2>
                                <p className="text-sm text-slate-500 mt-1">
                                    Applied:{" "}
                                    {new Date(
                                        app.applied_at,
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="text-right">
                                {/* Dynamically apply the calculated RGB color to the text */}
                                <div
                                    className="text-3xl font-black"
                                    style={{
                                        color: getScoreColor(app.match_score),
                                    }}
                                >
                                    {(app.match_score * 100).toFixed(0)}%
                                </div>
                                <div className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                                    AI Match
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
