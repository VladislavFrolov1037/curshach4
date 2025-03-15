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
    try {
        const response = await axios.get('/profile');

        return response.data;
    } catch (e) {
        return null;
    }
};

export const editProfile = async (data) => {
    const response = await axios.patch('/user/profile', data);

    return response.data;
};

export const getUserProfile = async (id) => {
    const response = await axios.get(`/user/${id}`);

    return response.data;
}