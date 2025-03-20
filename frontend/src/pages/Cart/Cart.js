import React, {useContext, useEffect, useRef, useState} from "react";
import Loader from "../../components/Loader";
import {decreaseItem, getCart, increaseItem} from "../../services/cart";
import CartItem from "../../components/CartItem/CartItem";
import {Button} from "primereact/button";
import './Cart.css';
import CartContext from "../../context/CartContext";
import FavoriteContext from "../../context/FavouriteContext";
import {createOrder, validatePromoCode} from "../../services/order";
import {createPaymentForm} from "../../services/helpers";
import {Toast} from 'primereact/toast';

const Cart = () => {
    const [loading, setLoading] = useState(true);
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [shippingAddress, setShippingAddress] = useState('');
    const [promoCode, setPromoCode] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const {removeCartItem} = useContext(CartContext);
    const {favorites, addFavoriteItem, removeFavoriteItem} = useContext(FavoriteContext);
    const toast = useRef(null);
    const [isPromoValid, setIsPromoValid] = useState(false);
    const [promoDiscount, setPromoDiscount] = useState(0);

    const fetchProducts = async () => {
        try {
            const response = await getCart();
            if (response && response.cartItems) {
                const availableItems = response.cartItems.filter(item => item.product.status === 'available');

                setCartItems(response.cartItems);

                const total = availableItems.reduce((acc, item) => acc + (item.quantity * parseFloat(item.product.price)), 0);
                const quantity = availableItems.reduce((acc, item) => acc + item.quantity, 0);

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
    };

    const handleRemoveFavorites = async (id) => {
        await removeFavoriteItem(id);
    };

    const handleQuantityChange = (productId, newQuantity) => {
        setCartItems(prevItems => {
            const updatedCartItems = prevItems.map(item => {
                if (item.product.id === productId && item.product.status === 'available') {
                    if (newQuantity <= item.product.quantity && newQuantity > 0) {
                        return {...item, quantity: newQuantity};
                    }
                }
                return item;
            });

            let total = updatedCartItems.reduce((acc, item) =>
                item.product.status === 'available' ? acc + item.quantity * parseFloat(item.product.price) : acc, 0);
            const quantity = updatedCartItems.reduce((acc, item) =>
                item.product.status === 'available' ? acc + item.quantity : acc, 0);

            console.log(total)
            if (promoDiscount > 0) {
                total = applyPromoDiscount(total);
            }

            setTotalPrice(total);
            setTotalQuantity(quantity);

            return updatedCartItems;
        });

        const item = cartItems.find(item => item.product.id === productId);
        if (item && newQuantity > item.product.quantity) {
            toast.current.show({
                severity: 'error',
                summary: 'Ошибка',
                detail: 'Недостаточно товара в наличии.',
                life: 3000
            });
            return;
        }

        if (newQuantity > 0) {
            if (newQuantity > item.quantity) {
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
            if (promoDiscount <= 0) {
                setPromoCode('');
            }

            const data = await createOrder(shippingAddress, paymentMethod, promoCode);

            if (data['error']) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Ошибка',
                    detail: data['error'],
                    life: 3000
                });

                return;
            }

            setCartItems((prevItems) => {
                return prevItems.filter(item => item.product.status !== 'available');
            });

            setTotalPrice(0);
            setTotalQuantity(0);

            toast.current.show({
                severity: 'success',
                summary: 'Заказ успешно оформлен',
                detail: `ID: ${data.orderId}`,
                life: 3000
            });

            const form = createPaymentForm(data);
            form.submit();
        } catch (error) {
            console.error('Ошибка при оформлении заказа:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Ошибка',
                detail: 'Что-то пошло не так. Попробуйте позже.',
                life: 3000
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const applyPromoDiscount = (total) => {
        return total - (total * (promoDiscount / 100));
    };

    const handleApplyPromo = async () => {
        if (!promoCode) {
            toast.current.show({severity: 'warn', summary: 'Ошибка', detail: 'Введите промокод', life: 3000});
            return;
        }

        try {
            const response = await validatePromoCode(promoCode);

            if (response.error) {
                toast.current.show({severity: 'error', summary: 'Ошибка', detail: response.error, life: 3000});
            } else {
                toast.current.show({severity: 'success', summary: 'Успешно', detail: 'Промокод применен!', life: 3000});
                setPromoDiscount(response.discount);
                setTotalPrice(totalPrice - (totalPrice * (response.discount / 100)));
            }
        } catch (error) {
            console.error("Ошибка при проверке промокода:", error);
            setIsPromoValid(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    if (loading) {
        return <Loader/>;
    }

    const availableItems = cartItems.filter(item => item.product.status === 'available');
    const unavailableItems = cartItems.filter(item => item.product.status !== 'available');

    return (
        <div className="container py-5">
            <Toast ref={toast}/>
            <div className="row g-3">
                <div className="col-md-8">
                    {availableItems.length > 0 && (
                        <div>
                            <h3>Доступные товары</h3>
                            {availableItems.map((cartItem) => (
                                <CartItem
                                    key={cartItem.id}
                                    cartItem={cartItem}
                                    handleRemoveFromCart={handleRemoveFromCart}
                                    handleAddToFavorites={handleAddToFavorites}
                                    handleRemoveFavorites={handleRemoveFavorites}
                                    handleQuantityChange={handleQuantityChange}
                                    isDisabled={false}
                                />
                            ))}
                        </div>
                    )}

                    {unavailableItems.length > 0 && (
                        <div className="mt-4">
                            <h3>Недоступные товары</h3>
                            {unavailableItems.map((cartItem) => (
                                <CartItem
                                    key={cartItem.id}
                                    cartItem={cartItem}
                                    handleRemoveFromCart={handleRemoveFromCart}
                                    handleAddToFavorites={handleAddToFavorites}
                                    handleRemoveFavorites={handleRemoveFavorites}
                                    handleQuantityChange={handleQuantityChange}
                                    isDisabled={true}
                                />
                            ))}
                        </div>
                    )}

                    {cartItems.length === 0 && (
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
                                    value="AC"
                                    checked
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

                        <input
                            type="text"
                            placeholder="Промокод для получения скидки"
                            className="form-control mt-3"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            disabled={promoDiscount > 0}
                        />
                        <Button
                            label="Применить промокод"
                            className="p-button-sm p-button-outlined p-button-secondary mt-2"
                            onClick={handleApplyPromo}
                            disabled={promoDiscount > 0}
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
