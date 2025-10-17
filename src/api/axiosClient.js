import axios from 'axios';
import ENV from '../config/env';
const BASE_URL = ENV.API_BASE_URL;

const axiosClient = axios.create({
    baseURL: BASE_URL,
    timeout: 60000,
    headers: {
        // 'Content-Type': 'application/json',
        'x-app-secret': 'PanchalSamaj2025',
    },
});

axiosClient.interceptors.request.use(
    async (config) => {
        try {
            const token = '';
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (e) {
            console.warn('Error fetching token:', e);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response) {
            console.warn('API Error:', error.response.status, error.response.data);
        } else if (error.request) {
            console.warn('Network error: No response from server');
        } else {
            console.warn('Axios config error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default axiosClient;