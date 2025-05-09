
//api url
import axios from "axios";

const API_URL = 'http://localhost:8000/api';

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include JWT token in headers
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)


// Add response interceptor to handle errors globally

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If the error is 401, and we haven't tried refreshing the token yet
        if (error.response?.status === 401 && !originalRequest._retry && typeof window !== 'undefined') {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                // Attempt to refresh the token
                const response = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });

                // Store the new tokens
                localStorage.setItem('accessToken', response.data.data.accessToken);
                localStorage.setItem('refreshToken', response.data.data.refreshToken);

                // Update the Authorization header
                originalRequest.headers['Authorization'] = `Bearer ${response.data.data.accessToken}`;

                // Retry the original request
                return axios(originalRequest);
            } catch (refreshError) {
                // If refresh fails, logout the user
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');

                // We'll handle the redirect in the auth hooks
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);
