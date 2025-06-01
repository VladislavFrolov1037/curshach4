import React, { useEffect, useRef, useState } from 'react';
import Loader from "../../../components/Loader";
import { getOrders, updateOrderStatus } from "../../../services/admin";
import { Button, Card, Row, Col } from 'react-bootstrap';
import { Toast } from "primereact/toast";
import { Link } from 'react-router-dom';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useRef(null);

    const fetchOrders = async () => {
        try {
            const response = await getOrders();
            setOrders(response);
        } catch (error) {
            console.error('Ошибка при загрузке заказов:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        await updateOrderStatus(orderId, newStatus);
        setOrders(prevOrders => prevOrders.map(order =>
            order.id === orderId ? { ...order, status: newStatus } : order
        ));

        toast.current.show({ severity: 'success', summary: 'Статус обновлен!', detail: 'Статус заказа успешно изменен.' });
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    if (loading) {
        return <Loader />;
    }

    const statusText = (status) => {
        switch (status) {
            case 'new':
                return 'Новый';
            case 'paid':
                return 'Оплачен';
            case 'processing':
                return 'В процессе';
            case 'shipped':
                return 'Отправлен';
            case 'delivered':
                return 'Доставлен';
            case 'cancelled':
                return 'Отменен';
            default:
                return 'Неизвестный статус';
        }
    };

    const getNextStatusOptions = (currentStatus) => {
        const transitions = {
            'paid': ['processing'],
            'processing': ['shipped'],
            'shipped': ['delivered'],
            'new': ['cancelled']
        };

        return transitions[currentStatus] || [];
    };

    return (
        <div className="container mt-4">
            <Toast ref={toast} />
            <h1 className="text-center mb-4">Заказы</h1>

            <Row>
                {orders.map(order => (
                    <Col md={6} lg={4} key={order.id} className="mb-4">
                        <Card>
                            <Card.Body>
                                <Card.Title>
                                    Заказ №{order.id} <span className="text-muted">({statusText(order.status)})</span> <br/>
                                </Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">
                                    Покупатель <Link to={`/admin/user/${order.user.id}`}>{order.user.email}</Link> <br/>
                                    Цена: {order.totalPrice} ₽
                                </Card.Subtitle>
                                <Card.Text><strong>Адрес доставки:</strong> {order.shippingAddress}</Card.Text>
                                <Card.Text><strong>Дата создания:</strong> {order.createdAt}</Card.Text>

                                <div className="mb-3">
                                    <strong>Товары в заказе:</strong>
                                    {order.orderItems.map((item, index) => (
                                        <div key={index} className="d-flex align-items-center mb-2">
                                            <img
                                                src={`${process.env.REACT_APP_API_BASE_URL}/${item.orderItem.product.images[0]?.url}`}
                                                alt={item.orderItem.product.name}
                                                className="img-thumbnail me-2"
                                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                            />
                                            <div className="ms-3">
                                                <Link to={`/product/${item.orderItem.product.id}`} className="text-decoration-none text-primary" style={{ maxWidth: '200px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                                                <div>{item.orderItem.product.name} x {item.orderItem.quantity}</div>
                                                <div className="text-muted">Продавец: {item.orderItem.product.seller.name}</div>
                                                <div className="text-muted">Цена: {item.orderItem.price} ₽</div>
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div>
                                    {getNextStatusOptions(order.status).map(status => (
                                        <Button
                                            key={status}
                                            variant="primary"
                                            className="me-2"
                                            onClick={() => handleStatusChange(order.id, status)}
                                        >
                                            {statusText(status)}
                                        </Button>
                                    ))}
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default AdminOrders;
