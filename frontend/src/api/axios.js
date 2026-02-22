import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// JWT interceptor — attach token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('bp_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor — handle 401 (token expired)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('bp_token');
            localStorage.removeItem('bp_user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
