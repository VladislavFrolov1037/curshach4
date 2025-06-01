import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    headers: {
        'Accept': 'application/json',
    },
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.setItem('authError', 'Для данного действия необходимо авторизоваться.');

            localStorage.removeItem('token');

            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }

            return new Promise(() => {});
        }

        if (error.response && error.response.status === 403) {
            window.location.href = '/forbidden';

            return new Promise(() => {});
        }

        if (error.response && error.response.status === 404) {
            // window.location.href = '/not-found';
            //
            // return new Promise(() => {});
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
