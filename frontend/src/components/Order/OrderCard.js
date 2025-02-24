import {Link} from "react-router-dom";
import React from "react";

export default function OrderCard({order, handlePayOrder, handleCancelOrder}) {
    return (
        <div className="order-card d-flex align-items-center justify-content-between p-4 rounded shadow-sm mb-4">
            <div>
                <h5>Заказ от {new Date(order.createdAt).toLocaleDateString()}</h5>
                <span className={`badge bg-${order.status === "Оплачен" ? "success" : "secondary"}`}>
                    Статус: {order.status}
                </span>
                <p className="mt-2">Итоговая сумма: <strong>₽{order.totalPrice.toFixed(2)}</strong></p>
                {order.status === 'Новый' && (
                    <>
                        <button className="btn btn-success mt-2 mx-1" onClick={() => handlePayOrder(order.id)}>Оплатить заказ</button>
                        <button className="btn btn-danger mt-2 mx-1" onClick={() => handleCancelOrder(order.id)}>Отменить заказ</button>
                    </>
                )}
            </div>

            <div className="order-items-preview d-flex">
                {order.orderItems.slice(0, 5).map(item => (
                    <Link to={`/product/${item.productId}`} key={item.productId} className="product-img-wrapper">
                        <img width="74px"
                             height="84px"
                             src={`${process.env.REACT_APP_API_BASE_URL}/${item.img || "default-image.png"}`}
                             alt={item.productName}
                             className="small-product-img"
                        />
                    </Link>
                ))}
            </div>
        </div>
    );
}
