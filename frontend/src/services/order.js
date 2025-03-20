import axios from '../services/axiosInstance';

export const createOrder = async (shippingAddress, paymentMethod, promoCode) => {
    const response = await axios.post(`/order`, {
        shippingAddress: shippingAddress,
        paymentMethod: paymentMethod,
        promoCode: promoCode
    });

    return response.data;
}

export const payOrder = async (id) => {
    const response = await axios.get(`/payment-data/${id}`);

    return response.data;
}

export const validatePromoCode = async (promoCode) => {
    const response = await axios.get(`/validatePromoCode/${promoCode}`);

    return response.data;
}