import React, {useContext, useEffect, useState} from "react";
import {Button} from "primereact/button";
import {Menu} from "primereact/menu";
import AuthContext from "../../context/AuthContext";
import {getUserProfile} from "../../services/auth";
import Loader from "../../components/Loader";
import Card from "../../components/Card/Card";
import AdminReview from "../../components/Admin/AdminReview/AdminReview";
import {useParams} from "react-router-dom";

const UserProfile = () => {
    const [activeMenuRef, setActiveMenuRef] = useState(null);
    const [activeTab, setActiveTab] = useState("reviews");
    const menu = React.useRef(null);
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [products, setProducts] = useState([]);
    const {user} = useContext(AuthContext);
    const [customer, setCustomer] = useState(useParams());

    const fetchUserData = async () => {
        setLoading(true);
        try {
            const data = await getUserProfile(customer.userId);
            setReviews(data.reviews || []);
            setProducts(data.products || []);
            setCustomer(data.customer || []);
        } catch (error) {
            console.error("Ошибка при загрузке данных:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUserData();
    }, []);

    const adminActions = [
        {label: "Заблокировать пользователя", icon: "pi pi-ban", command: () => alert("Пользователь заблокирован")},
        {label: "Удалить пользователя", icon: "pi pi-trash", command: () => alert("Пользователь удален")}
    ];

    if (loading) {
        return <Loader/>;
    }

    return (
        <div className="container mt-4">
            <div className="row align-items-center border p-4 rounded shadow-sm bg-light">
                <div className="col-md-6 d-flex align-items-center">
                    <img
                        src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp"
                        alt="User Avatar"
                        className="rounded-circle me-3"
                    />
                    <div>
                        <h5 className="mb-1">{customer.name}</h5>
                        <p className="text-muted mb-0">{customer.email}</p>
                    </div>
                </div>

                <div className="col-md-6 text-md-end mt-3 mt-md-0">
                    <Button
                        label="Отзывы"
                        icon="pi pi-comments"
                        className={`p-button-outlined me-2 ${activeTab === "reviews" ? "p-button-primary" : ""}`}
                        onClick={() => setActiveTab("reviews")}
                    />
                    {user.isAdmin && (
                        <>
                            <Button
                                label="Купленные товары"
                                icon="pi pi-shopping-cart"
                                className={`p-button me-2 ${activeTab === "orders" ? "p-button-primary" : ""}`}
                                onClick={() => setActiveTab("orders")}
                            />
                        </>
                    )}
                </div>

            </div>

            <div className="mt-4">
                {activeTab === "reviews" ? (
                    <>
                        <h6>Отзывы пользователя:</h6>
                        <ul>
                            {reviews && reviews.length > 0 ? (
                                reviews.map((review, index) => (
                                    <AdminReview
                                        key={review.id}
                                        feedback={review}
                                        product={review.product}
                                    />
                                ))
                            ) : (
                                <li>Нет отзывов</li>
                            )}
                        </ul>
                    </>
                ) : user.isAdmin && (
                    <>
                        <h6>Купленные товары:</h6>
                        <ul>
                            {products && products.length > 0 ? (
                                products.map((product, index) => (
                                    <Card
                                        product={product}
                                        activeMenuRef={activeMenuRef}
                                        setActiveMenuRef={setActiveMenuRef}
                                    />
                                ))
                            ) : (
                                <li>Нет купленных товаров</li>
                            )}
                        </ul>
                    </>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
