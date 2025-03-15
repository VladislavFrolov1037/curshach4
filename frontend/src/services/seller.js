import axios from '../services/axiosInstance';

export const registerSeller = async (data) => {
    await axios.post('/seller/become', data);
}

export const getSeller = async () => {
    const response = await axios.get('/seller/profile');

    return response.data;
}

export const editSeller = async (id, data) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
    });

    const response = await axios.post(`/seller/${id}?_method=PATCH`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;
};

export const getSellerProfile = async (id) => {
    const response = await axios.get(`/seller/${id}`);

    return response.data;
}