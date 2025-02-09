import axios from '../services/axiosInstance';

export const createOrder = async (shippingAddress, paymentMethod) => {
    const response = await axios.post(`/order`, {
        shippingAddress: shippingAddress,
        paymentMethod: paymentMethod
    });

    return response.data;
}

export const payOrder = async (id) => {
    const response = await axios.get(`/payment-data/${id}`);

    return response.data;
}

export const createPaymentForm = (data) => {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = data.url;

    const fields = {
        paymentType: data.paymentType,
        receiver: data.receiver,
        sum: data.sum,
        "quickpay-form": "button",
        label: data.orderId
    };

    Object.entries(fields).forEach(([name, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        input.value = value;
        form.appendChild(input);
    });

    document.body.appendChild(form);

    return form;
}
