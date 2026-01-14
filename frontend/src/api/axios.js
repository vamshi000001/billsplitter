import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://billsplitter-backend-1.onrender.com/api',
});

// Request Interceptor to add Token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor to handle 401 (Token Expired)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Only redirect if 401 AND it's not a login/register attempt
        if (error.response && error.response.status === 401) {
            const isAuthRequest = error.config.url.includes('/auth/login') ||
                error.config.url.includes('/auth/register') ||
                error.config.url.includes('/auth/roommate-login');

            if (!isAuthRequest) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('loginType');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
