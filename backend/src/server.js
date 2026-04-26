const express = require("express")
const cors = require("cors")
require("dotenv").config()

const app = express()
const path = require("path")
app.use("/uploads", express.static(path.join(__dirname, "../uploads")))

// Middleware
app.use(cors()) // Allows your React app to talk to this API
app.use(express.json()) // Parses incoming JSON requests

// Routes
app.use("/api/auth", require("./routes/authRoutes"))
app.use("/api", require("./routes/apiRoutes"))

// Global Error Handler Middleware
app.use((err, req, res, next) => {
    console.error(err.stack) // Log the error stack for debugging
    res.status(err.status || 500).json({
        message: err.message || "Something went wrong!",
        error: process.env.NODE_ENV === "production" ? {} : err, // Don't leak error details in production
    })
})

// Basic health check route
app.get("/api/health", (req, res) => {
    res.json({ status: "API is running" })
})
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
