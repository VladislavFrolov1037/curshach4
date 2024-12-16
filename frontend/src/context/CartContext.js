import React, {createContext, useEffect, useState} from "react";
import {addToCart, deleteItemForCart, getCart} from "../services/cart";

const CartContext = createContext();

export const CartProvider = ({children}) => {
    const [cartItems, setCartItems] = useState([]);

    const fetchCartItems = async () => {
        const token = localStorage.getItem("token");

        if (token) {
            const response = await getCart();
            setCartItems(response.cartItems);
        }
    };

    const removeCartItem = async (id) => {
        await deleteItemForCart(id);
    };


    useEffect(() => {
        fetchCartItems();
    }, []);

    const updateCartItems = (updatedCartItems) => {
        setCartItems(updatedCartItems);
    };

    const addCart = async (id, toast) => {
        try {
            const cartItem = await addToCart(id);
            setCartItems((prev) => [...prev, cartItem]);

            toast.current.show({severity: "success", summary: "Товар добавлен в корзину!", life: 3000});
        } catch (error) {
            toast.current.show({severity: "error", summary: "Ошибка при добавлении в корзину", life: 3000});
        }
    };

    return (
        <CartContext.Provider value={{cartItems, updateCartItems, addCart, removeCartItem}}>
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;
