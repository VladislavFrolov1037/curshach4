import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import "./ProductDetails.css";
import {getProductDetails} from "../../services/product";
import Loader from "../../components/Loader";

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [activeTab, setActiveTab] = useState("description");
    const [loading, setLoading] = useState(true);

    const fetchProductDetails = async () => {
        try {
            const response = await getProductDetails(id);

            setProduct(response);

            setLoading(false);
        } catch (error) {
            console.error("Ошибка при получении данных о продукте:", error);
        }
    };

    useEffect(() => {
        fetchProductDetails();
    }, [id]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    if (loading) {
        return (
            <Loader />
        );
    }

    const {
        name,
        description,
        price,
        image,
        product_attributes,
        category,
        seller,
        status,
    } = product;

    return (
        <div className="product-details container">
            <div className="row">
                {/* Левая часть: Картинка и слайдер */}
                <div className="col-md-4">
                    <div className="image-container">
                        <img
                            src={`${process.env.REACT_APP_API_BASE_URL}/${image}`}
                            alt={name}
                            className="main-image"
                        />
                        <div className="image-slider">
                            {[...Array(3)].map((_, index) => (
                                <img
                                    key={index}
                                    src={`${process.env.REACT_APP_API_BASE_URL}/${image}`}
                                    alt={`Thumbnail ${index}`}
                                    className="thumbnail"
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <h1>{name}</h1>
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
                    {status === "discontinued" ? (
                        <button className="btn btn-danger w-100" disabled>
                            Товар снят с продажи
                        </button>
                    ) : (
                        <button className="btn btn-success w-100">
                            Добавить в корзину
                        </button>
                    )}
                </div>
            </div>

            <div className="tabs mt-5">
                <div className="tab-buttons">
                    <button
                        className={`tab-button ${activeTab === "description" ? "active" : ""}`}
                        onClick={() => handleTabChange("description")}
                    >
                        О товаре
                    </button>
                    <button
                        className={`tab-button ${activeTab === "reviews" ? "active" : ""}`}
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

            {/* Похожие товары */}
            {/* Пока что можно оставить как комментарий, чтобы позже добавить */}
            {/* <div className="similar-products mt-5">
                <h4>Похожие товары</h4>
                <div className="product-slider">
                    {similarProducts.map((similarProduct) => (
                        <div key={similarProduct.id} className="similar-product-card">
                            <img
                                src={`${process.env.REACT_APP_API_BASE_URL}/${similarProduct.image}`}
                                alt={similarProduct.name}
                                className="similar-product-image"
                            />
                            <p>{similarProduct.name}</p>
                        </div>
                    ))}
                </div>
            </div> */}
        </div>
    );
};

export default ProductDetails;
