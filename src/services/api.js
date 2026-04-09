import axios from 'axios';

// Centralized API client — all components import from here instead of hardcoding URLs
const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000'
});

// Automatically attach JWT token to every request
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Global response error handler
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid — redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('adminAuthenticated');
            if (window.location.pathname.startsWith('/admin/dashboard')) {
                window.location.href = '/admin';
            }
        }
        return Promise.reject(error);
    }
);

export default API;
