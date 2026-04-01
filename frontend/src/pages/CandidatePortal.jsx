import { useState } from "react"
import api from "../services/api"

export default function CandidatePortal() {
    const [file, setFile] = useState(null)
    const [status, setStatus] = useState("")

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0]
        if (
            selectedFile &&
            (selectedFile.type === "application/pdf" ||
                selectedFile.type ===
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
        ) {
            setFile(selectedFile)
        } else {
            alert("Please upload a PDF or DOCX file only.")
            setFile(null)
        }
    }

    const handleApply = async (e) => {
        e.preventDefault()
        if (!file) return

        const formData = new FormData()
        formData.append("resume", file)
        formData.append("jobId", 1) // Hardcoded for demo, normally comes from selected job

        try {
            setStatus("Uploading and running AI parsing...")
            // This will hit Node, which will then hit your Python FastAPI
            await api.post("/applications/apply", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            setStatus("Application submitted successfully!")
        } catch (error) {
            setStatus("Error submitting application.")
        }
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Candidate Portal</h1>
            <div className="bg-white p-6 rounded shadow-sm border">
                <h2 className="text-xl font-semibold mb-4">
                    Apply for: Frontend Engineer
                </h2>
                <form onSubmit={handleApply} className="space-y-4">
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                            Upload Resume (PDF/DOCX)
                        </label>
                        <input
                            type="file"
                            accept=".pdf,.docx"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-green-600 text-white font-bold rounded hover:bg-green-700"
                        disabled={!file}
                    >
                        Submit Application
                    </button>
                </form>
                {status && (
                    <p className="mt-4 text-sm font-medium text-gray-700">
                        {status}
                    </p>
                )}
            </div>
        </div>
    )
}
