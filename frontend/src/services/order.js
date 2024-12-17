import axios from '../services/axiosInstance';

export const createOrder = async (shippingAddress, paymentMethod) => {
    const response = await axios.post(`/order`, {
        shippingAddress: shippingAddress,
        paymentMethod: paymentMethod
    });

    return response.data;
}
