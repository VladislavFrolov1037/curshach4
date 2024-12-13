import React, { useContext, useRef, useMemo, useState } from "react";
import { ContextMenu } from "primereact/contextmenu";
import { Button } from "primereact/button";
import { FiEye } from "react-icons/fi";
import AuthContext from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import "./Card.css";
import { addToCart } from "../../services/cart";
import CartContext from "../../context/CartContext";

export default function Card({
                                 product,
                                 activeMenuRef,
                                 setActiveMenuRef,
                                 handleHideProduct,
                                 handleDeleteProduct,
                             }) {
    const { user } = useContext(AuthContext);
    const { cartItems, updateCartItems, addCart } = useContext(CartContext);
    const toast = useRef(null);
    const menuRef = useRef(null);
    const navigate = useNavigate();
    const isOwner = user ? user.id === product.seller.userId : null;

    const [isLoading, setIsLoading] = useState(false);

    const isInCart = useMemo(() => {
        return cartItems && cartItems.some((item) => item.product.id === product.id);
    }, [cartItems, product.id]);

    const handleCardClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    const handleMenuClick = (e) => {
        e.preventDefault();
        if (activeMenuRef && activeMenuRef.current !== menuRef.current) {
            activeMenuRef.current.hide();
        }
        setActiveMenuRef(menuRef);
        menuRef.current.show(e);
    };

    const handleCartAction = async () => {
        setIsLoading(true);

        if (isInCart) {
            navigate("/cart");
        } else {
            await addCart(product.id, toast);
        }

        setIsLoading(false);
    };

    const handleAddToFavorites = async () => {
        alert(product.id);
    };

    const handleReport = async () => {
        alert(product.id);
    };

    const menuItems = [
        {
            label: "Добавить в избранное",
            icon: "pi pi-heart",
            command: () => handleAddToFavorites(product.id),
        },
        {
            label: "Пожаловаться на товар",
            icon: "pi pi-flag",
            command: () => handleReport(product.id),
        },
        ...(isOwner
            ? [
                ...(product.status === "available"
                    ? [
                        {
                            label: "Снять с продажи",
                            icon: "pi pi-eye-slash",
                            command: () => handleHideProduct(product.id),
                        },
                    ]
                    : [
                        {
                            label: "Вернуть в продажу",
                            icon: "pi pi-eye-slash",
                            command: () => handleHideProduct(product.id),
                        },
                    ]),
                {
                    label: "Удалить",
                    icon: "pi pi-trash",
                    command: () => handleDeleteProduct(product.id),
                },
            ]
            : []),
    ];

    return (
        <div className="col-12 col-md-2_4">
            <Toast ref={toast} />
            <div
                className="card h-100 shadow-sm border-0 rounded-3 product-card"
                onClick={() => handleCardClick(product.id)}
            >
                <div className="image-container" style={{ position: "relative" }}>
                    {product.status !== "available" && (
                        <div className="status-badge bg-danger">
                            {product.status === "discontinued" ? "Снято с продажи" : ""}
                        </div>
                    )}
                    <img
                        src={`${process.env.REACT_APP_API_BASE_URL}/${
                            product.images?.[0]?.url || "default-image.png"
                        }`}
                        alt={product.name}
                        className="card-img-top main-image"
                        onError={(e) => {
                            e.target.src = "default-image.png";
                        }}
                    />
                    <ContextMenu model={menuItems} ref={menuRef} />
                    <Button
                        icon="pi pi-ellipsis-v"
                        className="p-button-rounded p-button-text menu-button"
                        onClick={handleMenuClick}
                    />
                </div>
                <div className="card-body">
                    <h5 className="card-title">
                        {product.seller.name} / {product.name}
                    </h5>
                    <p className="card-text">
                        <strong>{`₽${parseFloat(product.price).toFixed(2)}`}</strong>
                        <br />
                        {product.status === "available" ? (
                            <span className="badge bg-success">В наличии</span>
                        ) : (
                            <span className="badge bg-danger">Снято с продажи</span>
                        )}
                        <br />
                        <small className="text-muted">Продавец: {product.seller.name}</small>
                        <br />
                        {user && (
                            <span className="views-count">
                                <FiEye /> {product.viewsCount || 0} просмотров
                            </span>
                        )}
                    </p>
                    <button
                        className={`btn w-100 ${isInCart ? "btn-secondary" : "btn-success p-button-success"}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleCartAction();
                        }}
                        disabled={isLoading}
                    >
                        {isLoading
                            ? "Добавление в корзину..."
                            : isInCart
                                ? "Перейти в корзину"
                                : "Добавить в корзину"}
                    </button>
                </div>
            </div>
        </div>
    );
}
