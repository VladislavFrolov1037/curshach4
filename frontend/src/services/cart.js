import axios from '../services/axiosInstance';

export const addToCart = async (id) => {
    const response = await axios.post(`/product/${id}/cart`);

    return response.data;
}

export const getCart = async () => {
    const response = await axios.get(`/cart`);
    console.log(response.data);
    return response.data;
}