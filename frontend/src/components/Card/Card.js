import React, {useContext} from "react";
import './Card.css';
import AuthContext from "../../context/AuthContext";
import {useNavigate} from "react-router-dom";

export default function Card({product, handleAddToCart}) {
    const {user} = useContext(AuthContext);
    const navigate = useNavigate();

    const isOwner = user.id === product.seller.userId;

    const handleCardClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    return (
        <div className="col">
            <div
                className="card h-100 shadow-sm border-0 rounded-3 cursor-pointer product-card"
                onClick={() => handleCardClick(product.id)}
            >
                <img
                    src={`${process.env.REACT_APP_API_BASE_URL}/${product.image}`}
                    alt={product.name}
                    className="card-img-top"
                />
                <div className="card-body">
                    <h5 className="card-title">
                        {product.seller.name} / {product.name}
                    </h5>
                    <p className="card-text">
                        <strong>{`₽${parseFloat(product.price).toFixed(2)}`}</strong>
                        <br/>
                        {product.status === 'available' ? (
                            <span className="badge bg-success">В наличии</span>
                        ) : (
                            <span className="badge bg-danger">Снято с продажи</span>
                        )}
                        <br/>
                        <small className="text-muted">Продавец: {product.seller.name}</small>
                    </p>
                    <button
                        className="btn btn-success w-100"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!isOwner) handleAddToCart(product.id);
                        }}
                        disabled={isOwner}
                    >
                        Добавить в корзину
                    </button>
                </div>
            </div>
        </div>
    );
}
