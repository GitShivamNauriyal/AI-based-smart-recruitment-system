const jwt = require("jsonwebtoken")

const authenticate = (req, res, next) => {
    const authHeader = req.header("Authorization")
    if (!authHeader)
        return res
            .status(401)
            .json({ error: "Access denied. No token provided." })

    const token = authHeader.split(" ")[1] // Format: "Bearer <token>"

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET)
        req.user = verified // Attach user payload (userId, role) to request
        next()
    } catch (err) {
        res.status(400).json({ error: "Invalid token." })
    }
}

const authorize = (role) => {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res
                .status(403)
                .json({ error: "Access denied. Insufficient permissions." })
        }
        next()
    }
}

module.exports = { authenticate, authorize }
