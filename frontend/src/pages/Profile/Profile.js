import React, { useContext } from 'react';
import { FaHeart, FaShoppingCart, FaSignOutAlt, FaEye } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Profile.css';
import AuthContext from "../../context/AuthContext"; // Подключаем стили

const Profile = () => {
    const { user, logout } = useContext(AuthContext);

    if (!user) {
        return <div>Загрузка...</div>;
    }

    return (
        <div className="container py-5">
            <div className="row">
                {/* Левая колонка */}
                <div className="col-md-6">
                    <div className="card shadow-sm p-4 mb-4">
                        <h2 className="card-title">Привет, {user.username}!</h2>
                        <p className="text-muted">{user.email}</p>

                        <div className="mb-4">
                            <h5>Основная информация</h5>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Дата регистрации:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
                            <p><strong>Телефон:</strong> {user.phone || 'Не указан'}</p>
                        </div>
                    </div>
                </div>

                {/* Правая колонка */}
                <div className="col-md-6">
                    <div className="d-grid gap-3">
                        <button className="btn btn-primary btn-lg d-flex align-items-center">
                            <FaHeart className="me-3" />
                            Избранное
                        </button>
                        <button className="btn btn-success btn-lg d-flex align-items-center">
                            <FaShoppingCart className="me-3" />
                            Корзина
                        </button>
                        <button className="btn btn-warning btn-lg d-flex align-items-center">
                            <FaEye className="me-3" />
                            Просмотренные товары
                        </button>
                        <button className="btn btn-danger btn-lg d-flex align-items-center" onClick={logout}>
                            <FaSignOutAlt className="me-3" />
                            Выйти
                        </button>
                    </div>
                </div>
            </div>

            {/* Блок просмотренных товаров */}
            <div className="mt-5">
                <h4>Просмотренные товары</h4>
                {user.viewedProducts && user.viewedProducts.length > 0 ? (
                    <ul className="list-group">
                        {user.viewedProducts.map(product => (
                            <li key={product.id} className="list-group-item d-flex justify-content-between align-items-center">
                                <span>{product.name}</span>
                                <span className="badge bg-primary rounded-pill">{product.price} ₽</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Нет данных о просмотренных товарах.</p>
                )}
            </div>
        </div>
    );
};

export default Profile;
