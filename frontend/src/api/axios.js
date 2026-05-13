import axios from 'axios';

const getBaseURL = () => {
    const envUrl = import.meta.env.VITE_API_URL;
    if (!envUrl) return '/api';
    return envUrl.endsWith('/') ? `${envUrl}api` : `${envUrl}/api`;
};

const api = axios.create({
    baseURL: getBaseURL(),
    headers: {
        'Content-Type': 'application/json',
    },
});

const clearAuthAndRedirect = () => {
    localStorage.removeItem('bp_token');
    localStorage.removeItem('bp_user');
    if (window.location.pathname !== '/login') {
        window.location.href = '/login';
    }
};

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('bp_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const token = localStorage.getItem('bp_token');
        const requestUrl = error.config?.url || '';
        const isAuthRequest = requestUrl.includes('/auth/');

        if (status === 401 && token && !isAuthRequest) {
            clearAuthAndRedirect();
        }

        return Promise.reject(error);
    }
);

export default api;
