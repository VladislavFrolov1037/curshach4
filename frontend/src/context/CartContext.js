import React, { createContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { addToCart, deleteItemForCart, getCart } from "../services/cart";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const location = useLocation();

    const fetchCartItems = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            const response = await getCart();
            setCartItems(response.cartItems);
        }
    };

    useEffect(() => {
        fetchCartItems();
    }, [location.pathname]);

    const removeCartItem = async (id) => {
        await deleteItemForCart(id);
        fetchCartItems();
    };

    const addCart = async (id, toast) => {
        try {
            toast.current.show({
                severity: "success",
                summary: "Товар добавлен в корзину!",
                life: 3000,
            });

            const cartItem = await addToCart(id);
            setCartItems((prev) => [...prev, cartItem]);
        } catch (error) {
            toast.current.show({
                severity: "error",
                summary: "Ошибка при добавлении в корзину",
                life: 3000,
            });
        }
    };

    return (
        <CartContext.Provider value={{ cartItems, addCart, removeCartItem }}>
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;
