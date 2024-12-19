import React, { useEffect, useRef, useState } from 'react';
import axios from '../../services/axiosInstance';
import Loader from "../../components/Loader";
import { Link } from 'react-router-dom';
import { Toast } from 'primereact/toast';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useRef(null); // Реф для управления Toast

    const fetchOrders = async () => {
        try {
            const response = await axios.get('/orders');
            setOrders(response.data);
        } catch (error) {
            console.error('Ошибка при загрузке заказов:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async (orderId) => {
        try {
            await axios.post(`/order/${orderId}/cancel`);
            setOrders(orders.map(order =>
                order.id === orderId ? { ...order, status: 'Отменен' } : order
            ));
            toast.current.show({ severity: 'success', summary: 'Успех', detail: 'Заказ успешно отменен', life: 3000 });
        } catch (error) {
            console.error('Ошибка при отмене заказа:', error);
            toast.current.show({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось отменить заказ', life: 3000 });
        }
    };

    const handlePayOrder = async (orderId) => {
        try {
            await axios.post(`/order/${orderId}/pay`);
            setOrders(orders.map(order =>
                order.id === orderId ? { ...order, status: 'Оплачен' } : order
            ));
            toast.current.show({ severity: 'success', summary: 'Успех', detail: 'Заказ успешно оплачен', life: 3000 });
        } catch (error) {
            console.error('Ошибка при оплате заказа:', error);
            toast.current.show({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось оплатить заказ', life: 3000 });
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="container py-5">
            <Toast ref={toast} /> {/* Компонент Toast */}
            <h2 className="mb-4">Мои заказы</h2>
            {orders.length === 0 ? (
                <p>У вас нет заказов.</p>
            ) : (
                <div className="row">
                    {orders.map(order => (
                        <div className="col-md-4 mb-4" key={order.id}>
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Заказ #{order.id}</h5>
                                    <h6 className="card-subtitle mb-2 text-muted">Дата: {order.createdAt}</h6>
                                    <p className="card-text">Статус: {order.status}</p>
                                    <p className="card-text">Общая сумма: ₽{order.totalPrice.toFixed(2)}</p>

                                    <h6 className="mt-3">Товары в заказе:</h6>
                                    <ul className="list-group">
                                        {order.orderItems.map(item => (
                                            <li className="list-group-item d-flex align-items-center" key={item.productId}>
                                                <Link to={`/product/${item.productId}`} className="ml-2">
                                                    {item.productName} (x{item.quantity}) — ₽{item.price.toFixed(2)}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>

                                    {order.status === 'Новый' && (
                                        <div className="mt-3 d-flex justify-content-between">
                                            <button
                                                className="btn btn-success"
                                                onClick={() => handlePayOrder(order.id)}
                                            >
                                                Оплатить
                                            </button>
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => handleCancelOrder(order.id)}
                                            >
                                                Отменить
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;
