import axios from 'axios';

// Centralized API client — all components import from here instead of hardcoding URLs
const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'https://elite-backend-8hcx.onrender.com'
});

// Automatically attach JWT token to every request
API.interceptors.request.use((config) => {
    // Try both possible token keys (chatToken for users, adminToken for admins)
    const token = localStorage.getItem('chatToken') || localStorage.getItem('adminToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Global response error handler
API.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response?.status, error.config?.url);

        if (error.response?.status === 401) {
            // Token expired or invalid — redirect to login
            localStorage.removeItem('chatToken');
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminAuthenticated');

            if (window.location.pathname.startsWith('/admin')) {
                window.location.href = '/admin/login';
            }
        }
        return Promise.reject(error);
    }
);

export default API;