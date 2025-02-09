import React, {useContext, useEffect, useState} from "react";
import Loader from "../../components/Loader";
import {decreaseItem, getCart, increaseItem} from "../../services/cart";
import CartItem from "../../components/CartItem/CartItem";
import { Button } from "primereact/button";
import './Cart.css';
import CartContext from "../../context/CartContext";
import FavoriteContext from "../../context/FavouriteContext";
import { createOrder } from "../../services/order";

const Cart = () => {
    const [loading, setLoading] = useState(true);
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [shippingAddress, setShippingAddress] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
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

    const handleQuantityChange = (productId, newQuantity) => {
        setCartItems(prevItems => {
            const updatedCartItems = prevItems.map(item => {
                if (item.product.id === productId) {
                    if (newQuantity <= item.product.quantity) {
                        item.quantity = newQuantity;
                    }
                }
                return item;
            });

            const total = updatedCartItems.reduce((acc, item) => acc + item.quantity * parseFloat(item.product.price), 0);
            const quantity = updatedCartItems.reduce((acc, item) => acc + item.quantity, 0);

            setTotalPrice(total);
            setTotalQuantity(quantity);

            return updatedCartItems;
        });

        if (newQuantity > 0) {
            if (newQuantity > cartItems.find(item => item.product.id === productId).quantity) {
                increaseItem(productId).catch(error => {
                    console.error("Ошибка при увеличении количества товара:", error);
                });
            } else {
                decreaseItem(productId).catch(error => {
                    console.error("Ошибка при уменьшении количества товара:", error);
                });
            }
        }
    };

    const handleOrderSubmit = async () => {
        if (isSubmitting) return;

        setIsSubmitting(true);

        try {
            const data = await createOrder(shippingAddress, paymentMethod);
            setCartItems([]);
            setTotalPrice(0);
            setTotalQuantity(0);
            alert(`Заказ успешно оформлен! ID: ${data.orderId}`);

            const form = document.createElement("form");
            form.method = "POST";
            form.action = data.url;

            const fields = {
                paymentType: data.paymentType,
                receiver: data.receiver,
                sum: data.sum,
                "quickpay-form": "button",
                label: data.orderId
            };

            Object.entries(fields).forEach(([name, value]) => {
                const input = document.createElement("input");
                input.type = "hidden";
                input.name = name;
                input.value = value;
                form.appendChild(input);
            });

            document.body.appendChild(form);
            form.submit();
        } catch (error) {
            console.error('Ошибка при оформлении заказа:', error);
            alert('Произошла ошибка при оформлении заказа. Попробуйте снова.');
        } finally {
            setIsSubmitting(false);
        }
    };

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
                                handleQuantityChange={handleQuantityChange}
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
                            <label className="paymentType">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="PC"
                                    checked={paymentMethod === 'PC'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                /> ЮMoney
                            </label>
                            <label className="paymentType">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="AC"
                                    checked={paymentMethod === 'AC'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                /> Банковской картой
                            </label>
                        </div>

                        <input
                            type="text"
                            placeholder="Введите адрес доставки"
                            className="form-control mt-3"
                            value={shippingAddress}
                            onChange={(e) => setShippingAddress(e.target.value)}
                        />

                        <Button
                            label="Оформить заказ"
                            className="p-button p-button-success mt-4"
                            onClick={handleOrderSubmit}
                            disabled={totalQuantity === 0 || !shippingAddress || isSubmitting}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
