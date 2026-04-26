const express = require("express")
const router = express.Router()
const multer = require("multer")
const path = require("path")
const { authenticate, authorize } = require("../middleware/authMiddleware")
const apiController = require("../controllers/apiController")
const { check, validationResult } = require("express-validator")

// 1. Configure Multer to strictly save as .pdf
const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
        cb(null, file.fieldname + "-" + uniqueSuffix + ".pdf") // Force .pdf extension
    },
})

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf") {
            cb(null, true)
        } else {
            cb(new Error("Only PDF files are allowed"))
        }
    },
})

// Recruiter Routes
router.post(
    "/jobs/create",
    authenticate,
    authorize("recruiter"),
    [
        check("title", "Job title is required").not().isEmpty().trim().escape(),
        check("description", "Job description is required")
            .not()
            .isEmpty()
            .trim()
            .escape(),
        check("requiredSkills", "Required skills must be an array")
            .isArray()
            .custom((value) => {
                if (
                    value.some(
                        (skill) =>
                            !skill.skillName ||
                            typeof skill.weight !== "number",
                    )
                ) {
                    throw new Error(
                        "Each skill must have a skillName and a numeric weight",
                    )
                }
                return true
            }),
    ],
    apiController.createJob,
)

router.get(
    "/jobs/my-postings",
    authenticate,
    authorize("recruiter"),
    apiController.getMyJobs,
)

router.get(
    "/jobs/:jobId/shortlist",
    authenticate,
    authorize("recruiter"),
    [
        check("jobId", "Job ID is required and must be an integer")
            .isInt()
            .not()
            .isEmpty(),
    ],
    apiController.getShortlist,
)

// Candidate Routes
router.get(
    "/jobs",
    authenticate,
    authorize("candidate"),
    apiController.getAllJobs,
)

router.post(
    "/applications/apply",
    authenticate,
    authorize("candidate"),
    upload.single("resume"),
    [
        check("jobId", "Job ID is required and must be an integer")
            .isInt()
            .not()
            .isEmpty(),
    ],
    apiController.applyToJob,
)

router.get(
    "/applications/my",
    authenticate,
    authorize("candidate"),
    apiController.getMyApplications,
)

module.exports = router
