import { createContext, useState, useEffect, useCallback } from "react"
import { jwtDecode } from "jwt-decode"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    // Memoize logout so it can be safely used inside useEffect
    const logout = useCallback(() => {
        localStorage.removeItem("token")
        setUser(null)
        // Force redirect to login page if they are deeply navigated into the app
        if (
            window.location.pathname !== "/" &&
            window.location.pathname !== "/register"
        ) {
            window.location.href = "/"
        }
    }, [])

    useEffect(() => {
        const token = localStorage.getItem("token")

        if (token) {
            try {
                const decoded = jwtDecode(token)
                const currentTime = Date.now() / 1000 // Convert to seconds to match JWT format

                // 1. Check if token is ALREADY expired upon page reload
                if (decoded.exp < currentTime) {
                    console.warn("Session expired while away.")
                    logout()
                } else {
                    // 2. Token is valid! Restore the session instantly.
                    setUser(decoded)

                    // 3. Set an automatic countdown timer to destroy the session in exactly 1 hour
                    const timeUntilExpiryMs = (decoded.exp - currentTime) * 1000

                    const sessionTimer = setTimeout(() => {
                        alert(
                            "Your 1-hour security session has expired. Please log in again.",
                        )
                        logout()
                    }, timeUntilExpiryMs)

                    // Cleanup the timer if the user manually logs out or closes the app
                    setLoading(false)
                    return () => clearTimeout(sessionTimer)
                }
            } catch (error) {
                console.error("Token tampering detected or invalid format.")
                logout()
            }
        }
        setLoading(false)
    }, [logout])

    const login = (token) => {
        localStorage.setItem("token", token)
        const decoded = jwtDecode(token)
        setUser(decoded)

        // Start the 1-hour destruction timer for the new login session
        const currentTime = Date.now() / 1000
        const timeUntilExpiryMs = (decoded.exp - currentTime) * 1000

        setTimeout(() => {
            alert(
                "Your 1-hour security session has expired. Please log in again.",
            )
            logout()
        }, timeUntilExpiryMs)
    }

    // Prevent rendering the app until we verify if they have an active session
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="text-xl font-bold text-indigo-600 animate-pulse">
                    Authenticating Session...
                </div>
            </div>
        )
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}
