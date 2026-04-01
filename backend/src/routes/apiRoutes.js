const express = require("express")
const router = express.Router()
const multer = require("multer")
const { authenticate, authorize } = require("../middleware/authMiddleware")
const apiController = require("../controllers/apiController")

// Setup Multer for local uploads
const upload = multer({ dest: "uploads/" })

// Recruiter Routes
router.post(
    "/jobs/create",
    authenticate,
    authorize("recruiter"),
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
    apiController.getShortlist,
)

// Candidate Routes
router.post(
    "/applications/apply",
    authenticate,
    authorize("candidate"),
    upload.single("resume"),
    apiController.applyToJob,
)

module.exports = router
