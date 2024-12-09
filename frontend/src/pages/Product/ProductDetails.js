import React, {useContext, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import {addView, getProductDetails} from "../../services/product";
import Loader from "../../components/Loader";
import {SplitButton} from "primereact/splitbutton";
import "./ProductDetails.css";

const ProductDetails = () => {
    const {id} = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImage, setCurrentImage] = useState("");
    const [activeTab, setActiveTab] = useState("description");
    const {user} = useContext(AuthContext);

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

    useEffect(() => {
        fetchProductDetails();
    }, [id]);

    const handleImageClick = (imageUrl) => {
        setCurrentImage(imageUrl);
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
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

    const menuItems = [
        {
            label: "Добавить в избранное",
            icon: "pi pi-heart",
            command: () => alert(`Товар ${product?.id} добавлен в избранное`),
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
                    label:
                        status === "available"
                            ? "Снять с продажи"
                            : "Вернуть в продажу",
                    icon: "pi pi-eye-slash",
                    command: () =>
                        alert(
                            `Смена статуса товара: ${
                                status === "available"
                                    ? "discontinued"
                                    : "available"
                            }`
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
                    <p className="product-price">{`₽${parseFloat(price).toFixed(
                        2
                    )}`}</p>
                    <div className="actions d-flex justify-content-between">
                        <SplitButton
                            label="Добавить в корзину"
                            icon="pi pi-shopping-cart"
                            className="p-button-success"
                            onClick={() =>
                                alert(`Товар ${product?.id} добавлен в корзину`)
                            }
                            model={menuItems}
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
