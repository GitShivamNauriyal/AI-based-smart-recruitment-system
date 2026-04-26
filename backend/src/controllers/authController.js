const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const pool = require("../config/db")
const { validationResult } = require("express-validator")

// Register a new user
exports.register = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const { name, email, password, role } = req.body

    try {
        // 1. Check if user already exists
        const userExists = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email],
        )
        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: "User already exists" })
        }

        // 2. Hash password
        const salt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(password, salt)

        // 3. Insert user into DB
        const newUser = await pool.query(
            "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING user_id, name, email, role",
            [name, email, passwordHash, role],
        )

        res.status(201).json({
            message: "User registered successfully",
            user: newUser.rows[0],
        })
    } catch (error) {
        console.error(error)
        next(error) // Pass error to global error handler
    }
}

// Login existing user
exports.login = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const { email, password } = req.body

    try {
        // 1. Find user
        const userResult = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email],
        )
        if (userResult.rows.length === 0) {
            return res.status(400).json({ error: "Invalid credentials" })
        }

        const user = userResult.rows[0]

        // 2. Check password
        const isMatch = await bcrypt.compare(password, user.password_hash)
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" })
        }

        // 3. Generate JWT Token
        const payload = {
            userId: user.user_id,
            name: user.name,
            role: user.role,
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "1h",
        })

        // React frontend expects this exact response format
        res.json({ token, role: user.role, name: user.name })
    } catch (error) {
        console.error(error)
        next(error) // Pass error to global error handler
    }
}

exports.getAllJobs = async (req, res, next) => {
    try {
        const result = await pool.query(
            "SELECT * FROM job_postings WHERE status = 'open' ORDER BY created_at DESC",
        )
        res.json(result.rows)
    } catch (err) {
        next(err)
    }
}
