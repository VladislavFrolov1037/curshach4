// OrderDetails.js
import React, { useEffect, useState } from 'react';
import axios from '../../services/axiosInstance';
import { useParams } from 'react-router-dom';
import Loader from "../../components/Loader";

const OrderDetails = () => {
    const { orderId } = useParams();
    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchOrderDetails = async () => {
        try {
            const response = await axios.get(`/orders/${orderId}`);
            setOrderDetails(response.data);
        } catch (error) {
            console.error('Ошибка при загрузке заказа:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrderDetails();
    }, [orderId]);

    if (loading) {
        return <Loader />;
    }

    if (!orderDetails) {
        return <div>Заказ не найден.</div>;
    }

    return (
        <div className="container py-5">
            <h2>Детали заказа #{orderDetails.id}</h2>
            <p>Дата: {orderDetails.createdAt}</p>
            <p>Статус: {orderDetails.status}</p>
            <p>Общая сумма: ₽{orderDetails.totalPrice.toFixed(2)}</p>

            <h5>Товары в заказе:</h5>
            <ul>
                {orderDetails.orderItems.map(item => (
                    <li key={item.productId}>
                        {item.productName} — {item.quantity} шт. — ₽{item.price.toFixed(2)}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OrderDetails;
