import axios from "axios"

const api = axios.create({
    baseURL: "http://localhost:5000/api",
})

// Attach token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Force instant logout if session expires or token is invalid
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (
            error.response &&
            (error.response.status === 401 || error.response.status === 403)
        ) {
            localStorage.removeItem("token")
            window.location.href = "/" // Instantly kicks user to login page without needing a reload
        }
        return Promise.reject(error)
    },
)

export default api
