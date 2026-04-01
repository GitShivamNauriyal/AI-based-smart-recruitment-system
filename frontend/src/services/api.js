import axios from "axios"

const api = axios.create({
    baseURL: "http://localhost:5000/api", // We will set your Node backend to run on port 5000
})

// Automatically attach JWT token to headers if it exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default api
