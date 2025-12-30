import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "https://usermanagement-backend-4ly8.onrender.com/api",
});

// Add a request interceptor to include the JWT token
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;
