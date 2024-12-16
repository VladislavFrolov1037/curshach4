import React, {useContext, useEffect, useRef, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import {addView, getProductDetails} from "../../services/product";
import Loader from "../../components/Loader";
import {SplitButton} from "primereact/splitbutton";
import {Toast} from "primereact/toast";
import "./ProductDetails.css";
import CartContext from "../../context/CartContext";
import FavoriteContext from "../../context/FavouriteContext";

const ProductDetails = () => {
    const toast = useRef(null);
    const {id} = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImage, setCurrentImage] = useState("");
    const [activeTab, setActiveTab] = useState("description");
    const {user} = useContext(AuthContext);
    const {favorites, addFavoriteItem, removeFavoriteItem} = useContext(FavoriteContext);
    const {cartItems, updateCartItems, addCart} = useContext(CartContext);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const fetchProductDetails = async () => {
        try {
            const response = await getProductDetails(id);

            setProduct(response);
            setCurrentImage(response.images?.[0]?.url || "");

            const updatedViewsCount = await addView(id);
            setProduct((prev) => ({
                ...prev,
                viewsCount: updatedViewsCount,
            }));

            setLoading(false);
        } catch (error) {
            console.error("Ошибка при получении данных о продукте:", error);
            setLoading(false);
        }
    };

    const isProductInCart = (productId) => {
        return cartItems.some((item) => item.product.id === productId);
    };

    useEffect(() => {
        fetchProductDetails();
    }, [favorites]);

    const handleImageClick = (imageUrl) => {
        setCurrentImage(imageUrl);
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const handleCartAction = async () => {
        setIsLoading(true);

        if (isProductInCart(product.id)) {
            navigate("/cart");
        } else {
            await addCart(product.id, toast);
        }

        setIsLoading(false);
    };

    if (loading) {
        return <Loader/>;
    }

    if (!product) {
        return <div>Товар не найден или произошла ошибка загрузки.</div>;
    }

    const {
        name,
        description,
        price,
        images = [],
        product_attributes,
        category,
        seller,
        status,
    } = product;

    const isOwner = user?.id === seller?.userId;

    const handleAddToFavorites = async () => {
        toast.current.show({severity: "success", summary: "Добавлено в избранное"});
        await addFavoriteItem(product.id);
    }

    const handleRemoveFavorites = async () => {
        toast.current.show({severity: "info", summary: "Удалено из избранного"});
        await removeFavoriteItem(product.id);
    }

    const isFavorite = () => {
        return favorites && favorites.some((fav) => fav.product_id === product.id);
    };

    const getMenuItems = () => [
        {
            label: isFavorite() ? "Удалить из избранного" : "Добавить в избранное",
            icon: "pi pi-heart",
            command: isFavorite() ? handleRemoveFavorites : handleAddToFavorites,
        },
        {
            label: "Пожаловаться",
            icon: "pi pi-flag",
            command: () => alert(`Жалоба на товар ${product?.id}`),
        },
        ...(isOwner
            ? [
                {
                    label: "Редактировать",
                    icon: "pi pi-pencil",
                    command: () => alert(`Редактирование товара ${product?.id}`),
                },
                {
                    label: status === "available" ? "Снять с продажи" : "Вернуть в продажу",
                    icon: "pi pi-eye-slash",
                    command: () =>
                        alert(
                            `Смена статуса товара: ${status === "available" ? "discontinued" : "available"}`
                        ),
                },
                {
                    label: "Удалить",
                    icon: "pi pi-trash",
                    command: () => alert(`Удаление товара ${product?.id}`),
                },
            ]
            : []),
    ];

    return (
        <div className="product-details container">
            <Toast ref={toast}/>
            <div className="row">
                <div className="col-md-4">
                    <div className="image-container">
                        <img
                            src={`${process.env.REACT_APP_API_BASE_URL}/${currentImage}`}
                            alt={name}
                            className="main-image"
                        />
                        <div className="image-slider">
                            {images.map((img, index) => (
                                <img
                                    key={index}
                                    src={`${process.env.REACT_APP_API_BASE_URL}/${img.url}`}
                                    alt={`Thumbnail ${index}`}
                                    className={`thumbnail ${
                                        currentImage === img.url
                                            ? "active-thumbnail"
                                            : ""
                                    }`}
                                    onClick={() => handleImageClick(img.url)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <h1 style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                        {name}
                        <span style={{fontSize: "14px", color: "#777", display: "flex", alignItems: "center"}}>
                            <i className="pi pi-eye" style={{marginRight: "5px"}}></i>
                            {product.viewsCount}
                        </span>
                    </h1>

                    <p>Категория: {category.name}</p>
                    <p>Продавец: {seller.name}</p>
                    <div className="product-attributes">
                        <h5>Характеристики:</h5>
                        <ul>
                            {product_attributes.map((attr, index) => (
                                <li key={index}>
                                    <strong>{attr.name}:</strong> {attr.value}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="col-md-4">
                    <p className="product-price">{`₽${parseFloat(price).toFixed(2)}`}</p>
                    <div className="actions d-flex justify-content-between">
                        <SplitButton
                            label={isLoading ? "Добавление в корзину" : isProductInCart(product.id) ? "Перейти в корзину" : "Добавить в корзину"}
                            icon="pi pi-shopping-cart"
                            className={isProductInCart(product.id) ? "p-button-secondary" : "p-button-success"}
                            onClick={() => {
                                handleCartAction(product.id);
                            }}
                            disabled={isLoading}
                            model={getMenuItems()}
                        />
                    </div>
                </div>
            </div>
            <div className="tabs mt-5">
                <div className="tab-buttons">
                    <button
                        className={`tab-button ${
                            activeTab === "description" ? "active" : ""
                        }`}
                        onClick={() => handleTabChange("description")}
                    >
                        О товаре
                    </button>
                    <button
                        className={`tab-button ${
                            activeTab === "reviews" ? "active" : ""
                        }`}
                        onClick={() => handleTabChange("reviews")}
                    >
                        Отзывы
                    </button>
                </div>
                <div className="tab-content">
                    {activeTab === "description" && (
                        <div>
                            <h4>Описание</h4>
                            <p>{description}</p>
                        </div>
                    )}
                    {activeTab === "reviews" && (
                        <div>
                            <h4>Отзывы</h4>
                            <p>Скоро тут появятся отзывы</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
