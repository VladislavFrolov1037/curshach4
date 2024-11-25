import axios from '../services/axiosInstance';

export const registerSeller = async (data) => {
    await axios.post('/seller/become', data);
}

export const getSeller = async () => {
    const response = await axios.get('/seller/profile');

    return response.data;
}

export const editSeller = async (data) => {
    const response = await axios.post('/seller/seller', data);
}