import Card from "../../components/Card/Card";
import React, {useEffect, useRef, useState} from "react";
import axios from "../../services/axiosInstance";
import Loader from "../../components/Loader";
import {getPurchasedUserProducts} from "../../services/product";
import {Nav} from "react-bootstrap";
import {Toast} from "primereact/toast";
import OrderCard from "../../components/Order/OrderCard";
import RateProductModal from "../../components/RateProductModal/RateProductModal";
import {createReview} from "../../services/review";
import {createPaymentForm} from "../../services/helpers";

const Orders = () => {
    const [activeOrders, setActiveOrders] = useState([]);
    const [completedOrders, setCompletedOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [activeTab, setActiveTab] = useState("active");
    const toast = useRef(null);
    const [activeMenuRef, setActiveMenuRef] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const responseActive = await axios.get("/orders");
                setActiveOrders(responseActive.data);

                const responseCompleted = await axios.get("/orders?status=end");
                setCompletedOrders(responseCompleted.data);

                const productsData = await getPurchasedUserProducts();
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
            form.submit();
        } catch (error) {
            console.error('Ошибка при оплате заказа:', error);
            toast.current.show({severity: 'error', summary: 'Ошибка', detail: 'Не удалось оплатить заказ', life: 3000});
        }
    };

    const handleRateProduct = (product) => {
        setSelectedProduct(product);

        setShowModal(true);
    };

    const handleSubmitReview = async (formData, product) => {
        try {
            await createReview(formData);

            setFilteredProducts(prevProducts =>
                prevProducts.map(p =>
                    p.id === product.id ? { ...p, isProductReview: true } : p
                )
            );
            
            toast.current.show({severity: "success", summary: "Успех", detail: "Отзыв отправлен!", life: 3000});
        } catch (error) {
            toast.current.show({
                severity: "error",
                summary: "Ошибка",
                detail: "Ошибка при отправке отзыва",
                life: 3000
            });
        }
    };

    if (loading) return <Loader/>;

    return (
        <div className="container py-5">
            <Toast ref={toast}/>
            {selectedProduct && (
                <RateProductModal
                    show={showModal}
                    handleClose={() => setShowModal(false)}
                    product={selectedProduct}
                    onSubmit={handleSubmitReview}
                />
            )}

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
                <div className="row g-3">
                    {filteredProducts.map((product) => (
                        <div key={product.id} className="col-12 col-sm-6 col-lg-4">
                            <Card product={product} activeMenuRef={activeMenuRef} setActiveMenuRef={setActiveMenuRef}
                                  handleRateProduct={handleRateProduct}/>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;
