import axios from '../services/axiosInstance';

export const getDashboard = async () => {
    const response = await axios.get('/admin/dashboard');

    return response.data;
}

export const getOrders = async () => {
    const response = await axios.get('admin/order');

    return response.data;
}

export const updateOrderStatus = async (id, newStatus) => {
    const response = await axios.post(`admin/order/${id}/status`, { status: newStatus });
    return response.data;
}

export const getSellers = async () => {
    const response = await axios.get('/admin-seller');

    return response.data;
}

export const updateSellerStatus = async (id) => {
    const response = await axios.post(`/admin-seller/${id}/update-status`);

    return response.data;
}

export const generatePromoCode = async (data) => {
    console.log(data)
    const response = await axios.post('/admin/tg/create-promo', data);

    return response.data;
}

export const getPromoCodes = async () => {
    const response = await axios.get('/admin/tg/promo')

    return response.data;
}