import Card from "../../components/Card/Card";
import React, {useEffect, useRef, useState} from "react";
import axios from "../../services/axiosInstance";
import Loader from "../../components/Loader";
import {getPurchasedUserProducts} from "../../services/product";
import {Nav} from "react-bootstrap";
import {Toast} from "primereact/toast";
import OrderCard from "../../components/Order/OrderCard";
import {createPaymentForm} from "../../services/order";

const Orders = () => {
    const [activeOrders, setActiveOrders] = useState([]);
    const [completedOrders, setCompletedOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [activeTab, setActiveTab] = useState("active");
    const toast = useRef(null);

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const responseActive = await axios.get("/orders");
                setActiveOrders(responseActive.data);

                const responseCompleted = await axios.get("/orders?status=end");
                setCompletedOrders(responseCompleted.data);

                const productsData = await getPurchasedUserProducts();
                setProducts(productsData);
                setFilteredProducts(productsData);
            } catch (error) {
                console.error("Ошибка при загрузке данных:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleCancelOrder = async (orderId) => {
        try {
            await axios.post(`/order/${orderId}/cancel`);
            setActiveOrders(activeOrders.map(order =>
                order.id === orderId ? {...order, status: 'Отменен'} : order
            ));
            toast.current.show({severity: 'success', summary: 'Успех', detail: 'Заказ успешно отменен', life: 3000});
        } catch (error) {
            console.error('Ошибка при отмене заказа:', error);
            toast.current.show({severity: 'error', summary: 'Ошибка', detail: 'Не удалось отменить заказ', life: 3000});
        }
    };

    const handlePayOrder = async (orderId) => {
        try {
            const data = await axios.get(`/payment-data/${orderId}`);
            const form = createPaymentForm(data.data);
            console.log(form)
            form.submit();
        } catch (error) {
            console.error('Ошибка при оплате заказа:', error);
            toast.current.show({severity: 'error', summary: 'Ошибка', detail: 'Не удалось оплатить заказ', life: 3000});
        }
    };

    if (loading) return <Loader/>;

    return (
        <div className="container py-5">
            <Toast ref={toast}/>
            <h2 className="mb-4">Мои заказы</h2>

            <Nav variant="tabs" activeKey={activeTab} onSelect={(tab) => setActiveTab(tab)}>
                <Nav.Item>
                    <Nav.Link eventKey="active">Активные заказы</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="completed">Завершенные заказы</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="purchased">Купленные товары</Nav.Link>
                </Nav.Item>
            </Nav>

            {activeTab === "active" && (
                <div className="row mt-4">
                    {activeOrders.length === 0 ? (
                        <p className="text-center">У вас нет активных заказов.</p>
                    ) : (
                        activeOrders.map((order) => (
                            <div className="col-12" key={order.id}>
                                <OrderCard
                                    order={order}
                                    handlePayOrder={handlePayOrder}
                                    handleCancelOrder={handleCancelOrder}
                                />
                            </div>
                        ))
                    )}
                </div>
            )}

            {activeTab === "completed" && (
                <div className="row mt-4">
                    {completedOrders.length === 0 ? (
                        <p className="text-center">У вас нет завершенных заказов.</p>
                    ) : (
                        completedOrders.map((order) => (
                            <div className="col-12" key={order.id}>
                                <OrderCard order={order}/>
                            </div>
                        ))
                    )}
                </div>
            )}

            {activeTab === "purchased" && (
                <div className="row row-cols-5 g-4 mt-3">
                    {filteredProducts.map((product) => (
                        <div className="col" key={product.id}>
                            <Card product={product}/>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;
