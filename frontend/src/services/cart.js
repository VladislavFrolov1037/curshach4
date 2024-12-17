import axios from '../services/axiosInstance';

export const addToCart = async (id) => {
    const response = await axios.post(`/product/${id}/cart`);

    return response.data;
}

export const getCart = async () => {
    const response = await axios.get(`/cart`);

    return response.data;
}

export const deleteItemForCart = async (id) => {
    await axios.delete(`/product/${id}/cart`);
}

export const decreaseItem = async (id) => {
    const response = await axios.patch(`/product/${id}/cart/decrease`);

    return response.data;
}

export const increaseItem = async (id) => {
    const response = await axios.patch(`/product/${id}/cart/increase`);

    return response.data;
}