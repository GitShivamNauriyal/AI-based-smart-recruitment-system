const express = require("express")
const router = express.Router()
const { check, validationResult } = require("express-validator")
const authController = require("../controllers/authController")

router.post(
    "/register",
    [
        check("name", "Name is required").not().isEmpty().trim().escape(),
        check("email", "Please include a valid email")
            .isEmail()
            .normalizeEmail(),
        check(
            "password",
            "Please enter a password with 6 or more characters",
        ).isLength({ min: 6 }),
        check("role", "Role must be either 'candidate' or 'recruiter'").isIn([
            "candidate",
            "recruiter",
        ]),
    ],
    authController.register,
)

router.post(
    "/login",
    [
        check("email", "Please include a valid email")
            .isEmail()
            .normalizeEmail(),
        check("password", "Password is required").exists(),
    ],
    authController.login,
)

module.exports = router
