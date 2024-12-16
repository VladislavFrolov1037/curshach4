import React, {useContext, useEffect, useState} from "react";
import Loader from "../../components/Loader";
import {getCart} from "../../services/cart";
import CartItem from "../../components/CartItem/CartItem";
import {Button} from "primereact/button";
import './Cart.css';
import CartContext from "../../context/CartContext";
import FavoriteContext from "../../context/FavouriteContext";

const Cart = () => {
    const [loading, setLoading] = useState(true);
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const {removeCartItem} = useContext(CartContext);
    const {favorites, addFavoriteItem, removeFavoriteItem} = useContext(FavoriteContext);

    const fetchProducts = async () => {
        try {
            const response = await getCart();
            if (response && response.cartItems) {
                setCartItems(response.cartItems);
                const total = response.cartItems.reduce((acc, item) => acc + (item.quantity * parseFloat(item.product.price)), 0);
                const quantity = response.cartItems.reduce((acc, item) => acc + item.quantity, 0);
                setTotalPrice(total);
                setTotalQuantity(quantity);
            }
        } catch (error) {
            console.error("Ошибка при получении данных из корзины:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFromCart = async (productId) => {
        setCartItems((prevItems) => {
            const updatedCartItems = prevItems.filter(item => item.product.id !== productId);

            const total = updatedCartItems.reduce((acc, item) => acc + item.quantity * parseFloat(item.product.price), 0);
            const quantity = updatedCartItems.reduce((acc, item) => acc + item.quantity, 0);

            setTotalPrice(total);
            setTotalQuantity(quantity);

            return updatedCartItems;
        });

        await removeCartItem(productId);
    };

    const handleAddToFavorites = async (id) => {
        await addFavoriteItem(id);
    }

    const handleRemoveFavorites = async (id) => {
        await removeFavoriteItem(id);
    }

    useEffect(() => {
        fetchProducts();
    }, []);

    if (loading) {
        return <Loader/>;
    }

    return (
        <div className="container py-5">
            <div className="row g-3">
                <div className="col-md-8">
                    {cartItems.length > 0 ? (
                        cartItems.map((cartItem) => (
                            <CartItem
                                key={cartItem.id}
                                cartItem={cartItem}
                                handleRemoveFromCart={handleRemoveFromCart}
                                handleAddToFavorites={handleAddToFavorites}
                                handleRemoveFavorites={handleRemoveFavorites}
                            />
                        ))
                    ) : (
                        <div className="col-12">У вас нет товаров в корзине</div>
                    )}
                </div>

                <div className="col-md-4">
                    <div className="order-summary">
                        <h5>Оформление заказа</h5>
                        <div className="order-details">
                            <div className="order-item">
                                <span>Кол-во товаров:</span>
                                <span>{totalQuantity}</span>
                            </div>
                            <div className="order-item">
                                <span>Итоговая сумма:</span>
                                <span>₽{totalPrice.toFixed(2)}</span>
                            </div>
                        </div>

                        <h6>Способ оплаты</h6>
                        <div className="payment-method">
                            <label className="payment-option">
                                <input type="radio" name="paymentMethod" value="cardOnDelivery"/> Картой при получении
                            </label>
                            <label className="payment-option">
                                <input type="radio" name="paymentMethod" value="cardOnline"/> Картой на сайте
                            </label>
                        </div>

                        <Button label="Оформить заказ" className="p-button p-button-success mt-4"/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
