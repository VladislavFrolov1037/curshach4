import axios from '../services/axiosInstance';

export const getSellerProducts = async (id) => {
    const response = await axios.get(`/my-products/`);

    return response.data;
}

export const getProductDetails = async (id) => {
    const response = await axios.get(`/product/${id}`);

    return response.data;
}