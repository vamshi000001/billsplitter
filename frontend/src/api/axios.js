import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://billsplitter-backend-2.onrender.com/api',
});

// Request Interceptor to add Token
api.interceptors.request.use(
    (config) => {
        // Use adminToken for admin routes, otherwise regular token
        // Also include feedback/admin in the check
        const isAdminRoute = config.url.includes('/admin') || config.url.includes('/feedback/admin');
        const token = isAdminRoute ? localStorage.getItem('adminToken') : localStorage.getItem('token');

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
                error.config.url.includes('/auth/roommate-login') ||
                error.config.url.includes('/admin/login');

            if (!isAuthRequest) {
                // Check if we are in admin section based on URL
                const isPageAdmin = window.location.pathname.startsWith('/app-admin') ||
                    window.location.pathname.startsWith('/admin');

                if (isPageAdmin) {
                    localStorage.removeItem('adminToken');
                    window.location.href = '/appadminlogin';
                } else {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    localStorage.removeItem('loginType');
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
