import React from "react";
import { FiHeart, FiTrash2 } from "react-icons/fi";
import { Button } from "primereact/button";
import './CartItem.css'

const CartItem = ({
                      cartItem,
                      handleAddToCart,
                      handleRemoveFromCart,
                      handleAddToFavorites,
                      handleRemoveProduct,
                  }) => {

    return (
        <div className="cart-item d-flex align-items-center py-3 border-bottom">
            <div className="cart-item-image">
                <img
                    src={`${process.env.REACT_APP_API_BASE_URL}/${cartItem.product?.images?.[0]?.url || "default-image.png"}`}
                    alt={cartItem.product.name}
                    className="cart-item-img"
                />
            </div>

            <div className="cart-item-details d-flex flex-column ms-3 flex-grow-1">
                <h5 className="cart-item-title">{cartItem.product.name}</h5>
                <span className="cart-item-price">₽{parseFloat(cartItem.product.price).toFixed(2)}</span>

                <div className="cart-item-actions d-flex align-items-center">
                    <Button
                        icon="pi pi-minus"
                        className="p-button-rounded p-button-text p-button-danger me-2"
                        onClick={() => handleRemoveFromCart(cartItem.product.id)}
                    />
                    <span>{cartItem.quantity}</span>
                    <Button
                        icon="pi pi-plus"
                        className="p-button-rounded p-button-text p-button-success ms-2"
                        onClick={() => handleAddToCart(cartItem.product.id)}
                    />
                </div>
            </div>

            <div className="cart-item-icons d-flex flex-column align-items-center ms-3">
                <Button
                    icon={<FiHeart />}
                    className="p-button-rounded p-button-text p-button-info mb-2"
                    onClick={() => handleAddToFavorites(cartItem.product.id)}
                />
                <Button
                    icon={<FiTrash2 />}
                    className="p-button-rounded p-button-text p-button-danger"
                    onClick={() => handleRemoveProduct(cartItem.product.id)}
                />
            </div>
        </div>
    );
};

export default CartItem;
