const pool = require("../config/db")
const axios = require("axios")
const fs = require("fs")
const FormData = require("form-data")
const { validationResult } = require("express-validator")

// --- RECRUITER FUNCTIONS ---

exports.createJob = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
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
        next(err)
    }
}

exports.getMyJobs = async (req, res, next) => {
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
        next(err)
    }
}

exports.getShortlist = async (req, res, next) => {
    const { jobId } = req.params
    try {
        const result = await pool.query(
            `SELECT a.app_id, a.match_score, a.extracted_skills, a.resume_path, u.name 
             FROM applications a JOIN users u ON a.candidate_id = u.user_id 
             WHERE a.job_id = $1 ORDER BY a.match_score DESC`,
            [jobId],
        )
        const formatted = result.rows.map((row) => ({
            appID: row.app_id,
            name: row.name,
            matchScore: row.match_score,
            extractedSkills:
                typeof row.extracted_skills === "string"
                    ? JSON.parse(row.extracted_skills)
                    : row.extracted_skills,
            resumeUrl: `http://localhost:5000/${row.resume_path.replace(/\\/g, "/")}`, // Normalize path for browser
        }))
        res.json(formatted)
    } catch (err) {
        next(err)
    }
}

const path = require("path")

exports.deleteJob = async (req, res, next) => {
    const { jobId } = req.params
    try {
        // 1. Verify the job exists AND belongs to this specific recruiter
        const jobCheck = await pool.query(
            "SELECT * FROM job_postings WHERE job_id = $1 AND recruiter_id = $2",
            [jobId, req.user.userId],
        )

        if (jobCheck.rows.length === 0) {
            return res
                .status(404)
                .json({ error: "Job not found or unauthorized to delete." })
        }

        // 2. BULLETPROOF FIX: Manually delete all applications tied to this job first.
        // This prevents the PostgreSQL "Foreign Key Constraint" crash!
        await pool.query("DELETE FROM applications WHERE job_id = $1", [jobId])

        // 3. Now that it is empty, it is safe to delete the actual job posting.
        await pool.query("DELETE FROM job_postings WHERE job_id = $1", [jobId])

        res.json({
            message:
                "Job and all associated applications deleted successfully.",
        })
    } catch (err) {
        console.error("Delete Job Error:", err)
        next(err)
    }
}

exports.downloadResume = async (req, res, next) => {
    const { appId } = req.params
    try {
        const result = await pool.query(
            "SELECT a.resume_path, u.name FROM applications a JOIN users u ON a.candidate_id = u.user_id WHERE a.app_id = $1",
            [appId],
        )

        if (result.rows.length === 0)
            return res.status(404).json({ error: "Application not found" })

        const { resume_path, name } = result.rows[0]
        const absolutePath = path.resolve(resume_path)

        // Format the candidate's name to remove spaces (e.g., "John_Doe_Resume.pdf")
        const safeFileName = `${name.replace(/\s+/g, "_")}_Resume.pdf`

        // res.download automatically forces the browser to download the file instead of opening it!
        res.download(absolutePath, safeFileName)
    } catch (err) {
        next(err)
    }
}

// --- CANDIDATE FUNCTIONS ---

exports.getAllJobs = async (req, res, next) => {
    try {
        const result = await pool.query(
            "SELECT * FROM job_postings ORDER BY created_at DESC",
        )
        res.json(result.rows)
    } catch (err) {
        next(err)
    }
}

exports.applyToJob = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const { jobId } = req.body

    if (!req.file)
        return res.status(400).json({ error: "Resume file is required" })

    try {
        const jobResult = await pool.query(
            "SELECT description, required_skills FROM job_postings WHERE job_id = $1",
            [jobId],
        )
        if (jobResult.rows.length === 0)
            return res.status(404).json({ error: "Job not found" })
        const { description: jobDescription, required_skills: requiredSkills } =
            jobResult.rows[0]

        const formData = new FormData()
        formData.append("resume", fs.createReadStream(req.file.path))
        formData.append("jobDescription", jobDescription)
        formData.append("requiredSkills", JSON.stringify(requiredSkills))

        const aiResponse = await axios.post(
            "http://localhost:8000/process-resume",
            formData,
            {
                headers: formData.getHeaders(),
            },
        )

        const { score, extracted_skills } = aiResponse.data

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
        next(err)
    }
}

exports.getMyApplications = async (req, res, next) => {
    try {
        const result = await pool.query(
            `SELECT a.app_id, a.match_score, a.created_at as applied_at, j.title 
             FROM applications a JOIN job_postings j ON a.job_id = j.job_id 
             WHERE a.candidate_id = $1 ORDER BY a.created_at DESC`,
            [req.user.userId],
        )
        res.json(result.rows)
    } catch (err) {
        console.error("Pipeline Fetch Error:", err)
        next(err)
    }
}
