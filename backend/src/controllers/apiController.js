const pool = require("../config/db")
const axios = require("axios") // We need this to talk to your Python AI
const fs = require("fs")
const FormData = require("form-data")

// --- RECRUITER FUNCTIONS ---

exports.createJob = async (req, res) => {
    const { title, description, requiredSkills } = req.body
    try {
        const result = await pool.query(
            "INSERT INTO job_postings (recruiter_id, title, description, required_skills) VALUES ($1, $2, $3, $4) RETURNING *",
            [
                req.user.userId,
                title,
                description,
                JSON.stringify(requiredSkills),
            ],
        )
        res.json(result.rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Failed to create job" })
    }
}

exports.getMyJobs = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT j.*, COUNT(a.app_id) as "applicantCount" 
       FROM job_postings j 
       LEFT JOIN applications a ON j.job_id = a.job_id 
       WHERE j.recruiter_id = $1 
       GROUP BY j.job_id`,
            [req.user.userId],
        )
        res.json(result.rows)
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch jobs" })
    }
}

exports.getShortlist = async (req, res) => {
    const { jobId } = req.params
    try {
        const result = await pool.query(
            `SELECT a.app_id, a.match_score, a.extracted_skills, u.name 
       FROM applications a 
       JOIN users u ON a.candidate_id = u.user_id 
       WHERE a.job_id = $1 
       ORDER BY a.match_score DESC`,
            [jobId],
        )
        // Format JSONB output for React
        const formatted = result.rows.map((row) => ({
            appID: row.app_id,
            name: row.name,
            matchScore: row.match_score,
            extractedSkills:
                typeof row.extracted_skills === "string"
                    ? JSON.parse(row.extracted_skills)
                    : row.extracted_skills,
        }))
        res.json(formatted)
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch shortlist" })
    }
}

// --- CANDIDATE FUNCTIONS ---

exports.applyToJob = async (req, res) => {
    const { jobId } = req.body

    if (!req.file)
        return res.status(400).json({ error: "Resume file is required" })

    try {
        // 1. Get Job Description from DB to send to AI
        const jobResult = await pool.query(
            "SELECT description FROM job_postings WHERE job_id = $1",
            [jobId],
        )
        if (jobResult.rows.length === 0)
            return res.status(404).json({ error: "Job not found" })
        const jobDescription = jobResult.rows[0].description

        // 2. Send File to Python AI Microservice
        const formData = new FormData()
        formData.append("resume", fs.createReadStream(req.file.path))
        formData.append("jobDescription", jobDescription)

        // Call your Python FastAPI (we'll set this up on port 8000)
        const aiResponse = await axios.post(
            "http://localhost:8000/process-resume",
            formData,
            {
                headers: formData.getHeaders(),
            },
        )

        const { score, extracted_skills } = aiResponse.data

        // 3. Save Application to DB
        await pool.query(
            "INSERT INTO applications (job_id, candidate_id, resume_path, match_score, extracted_skills) VALUES ($1, $2, $3, $4, $5)",
            [
                jobId,
                req.user.userId,
                req.file.path,
                score,
                JSON.stringify(extracted_skills),
            ],
        )

        res.json({
            message: "Application processed and submitted successfully!",
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Failed to process application" })
    }
}
