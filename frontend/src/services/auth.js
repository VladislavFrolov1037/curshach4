import axios from '../services/axiosInstance';

export const loginUser = async (credentials) => {
    const response = await axios.post('/login', credentials);

    localStorage.setItem('token', response.data.token);

    return response.data.user;
};

export const registerUser = async (data) => {
    await axios.post('/register', data);
};

export const getProfile = async () => {
    const token = localStorage.getItem('token');

    if (!token) return null;

    const response = await axios.get('/profile', {
        headers: {Authorization: `Bearer ${token}`}
    });
    return response.data;
};
