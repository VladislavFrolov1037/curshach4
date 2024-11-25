import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { getSeller } from "../../services/seller";

const Seller = () => {
    const [seller, setSeller] = useState(null);
    const [listings, setListings] = useState([]);

    useEffect(() => {
        const fetchSellerData = async () => {
            const sellerData = await getSeller();
            setSeller(sellerData);

            // Если продавец имеет объявления, мы их подтягиваем
            if (sellerData && sellerData.id) {
                const listingsData = await getSellerListings(sellerData.id); // Функция для получения объявлений
                setListings(listingsData);
            }
        };

        fetchSellerData();
    }, []);

    const getSellerListings = async (sellerId) => {
        // Здесь пока условие на случай, если объявлений нет
        return sellerId ? [
            { id: 1, name: "Продажа телевизора", description: "Телевизор LG 42 дюйма", price: "15000 ₽", quantity: 10, image: "https://via.placeholder.com/200x150" },
            { id: 2, name: "Продажа смартфона", description: "iPhone 13, 128GB", price: "25000 ₽", quantity: 5, image: "https://via.placeholder.com/200x150" },
            { id: 3, name: "Продажа ноутбука", description: "Ноутбук ASUS, 16GB RAM", price: "35000 ₽", quantity: 2, image: "https://via.placeholder.com/200x150" }
        ] : [];
    };

    if (!seller) {
        return <div>Загрузка...</div>;
    }

    return (
        <div className="container mt-5">
            <div className="card border-0 shadow-lg">
                <div className="row g-0">
                    {/* Блок изображения продавца */}
                    <div className="col-lg-4 bg-light d-flex align-items-center justify-content-center">
                        <img
                            src={`${process.env.REACT_APP_API_BASE_URL}/${seller.image}`}
                            className="img-fluid rounded-circle p-3"
                            alt={seller.name || "Продавец"}
                            style={{ maxWidth: "200px" }}
                        />
                    </div>

                    {/* Основной контент продавца */}
                    <div className="col-lg-8">
                        <div className="card-body">
                            <h2 className="card-title text-primary fw-bold">
                                {seller.name || "Имя не указано"}
                            </h2>
                            <p className="text-muted mb-4">
                                {seller.description || "Описание отсутствует"}
                            </p>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <strong>Статус:</strong> {seller.status || "Неизвестен"}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <strong>Тип:</strong> {seller.type || "Не указан"}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <strong>ИНН:</strong> {seller.taxId || "Не указан"}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <strong>Телефон:</strong> {seller.phone || "Не указан"}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <strong>Email:</strong> {seller.email || "Не указан"}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <strong>Адрес:</strong> {seller.address || "Не указан"}
                                </div>
                            </div>
                            <div className="mt-4">
                                <h4 className="text-success">
                                    Баланс: {seller.balance || "0"} ₽
                                </h4>
                            </div>

                            {/* Кнопка для редактирования профиля */}
                            <div className="mt-3">
                                <button className="btn btn-outline-primary">Редактировать профиль</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Блок с карточками товаров */}
            <div className="mt-5">
                <h3>Ваши товары</h3>
                {listings.length > 0 ? (
                    <div className="row">
                        {listings.map((listing) => (
                            <div key={listing.id} className="col-md-4 mb-4">
                                <div className="card h-100">
                                    <img
                                        src={listing.image}
                                        className="card-img-top"
                                        alt={listing.name}
                                        style={{ maxHeight: "200px", objectFit: "cover" }}
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">{listing.name}</h5>
                                        <p className="card-text">{listing.description}</p>
                                        <p className="card-text">
                                            <strong>{listing.price}</strong>
                                        </p>
                                        <p className="card-text">
                                            <small>Остаток: {listing.quantity} шт.</small>
                                        </p>
                                    </div>
                                    <div className="card-footer text-center">
                                        <button className="btn btn-outline-success">Подробнее</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>У вас нет товаров. <strong>Добавьте их, чтобы начать продавать!</strong></p>
                )}

                {/* Кнопка для перехода ко всем объявлениям */}
                <div className="mt-3 text-center">
                    <button className="btn btn-primary">Перейти ко всем товарам</button>
                </div>
            </div>
        </div>
    );
};

export default Seller;
