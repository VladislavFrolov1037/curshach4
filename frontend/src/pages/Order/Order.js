// Orders.js
import React, { useEffect, useState } from 'react';
import axios from '../../services/axiosInstance';
import Loader from "../../components/Loader";
import { Link } from 'react-router-dom'; // Для перехода по ссылке

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        fetchOrders();
    }, []);

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="container py-5">
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
                                                {/*/!* Мини-фотография товара *!/*/}
                                                {/*<img*/}
                                                {/*    src={item.productImageUrl} // предполагается, что есть поле с изображением товара*/}
                                                {/*    alt={item.productName}*/}
                                                {/*    className="img-thumbnail mr-3"*/}
                                                {/*    style={{ width: '50px', height: '50px', objectFit: 'cover' }}*/}
                                                {/*/>*/}

                                                {/* Ссылка на страницу товара */}
                                                <Link to={`/product/${item.productId}`} className="ml-2">
                                                    {item.productName} (x{item.quantity}) — ₽{item.price.toFixed(2)}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
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
