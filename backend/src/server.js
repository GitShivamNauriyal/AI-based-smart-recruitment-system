const express = require("express")
const cors = require("cors")
require("dotenv").config()

const app = express()

// Middleware
app.use(cors()) // Allows your React app to talk to this API
app.use(express.json()) // Parses incoming JSON requests

// Routes
app.use("/api/auth", require("./routes/authRoutes"))
app.use("/api", require("./routes/apiRoutes"))

// Basic health check route
app.get("/api/health", (req, res) => {
    res.json({ status: "API is running" })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
