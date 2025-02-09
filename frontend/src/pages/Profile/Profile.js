import React, {useContext, useEffect, useState} from 'react';
import {FaCoins, FaEye, FaHeart, FaShoppingCart, FaSignOutAlt} from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Profile.css';
import AuthContext from "../../context/AuthContext";
import {Link} from 'react-router-dom';
import UniversalModal from "../../components/modals/UniversalModal";
import {editProfile} from "../../services/auth";
import {filterChangedFields} from "../../utils/objectUtils";
import Loader from "../../components/Loader";
import Error from "../../components/Error";
import {getViewedProducts} from "../../services/product";
import Card from "../../components/Card/Card";

const Profile = () => {
    const {user, updateUser, logout} = useContext(AuthContext);
    const [viewedProducts, setViewedProducts] = useState([]);
    const [errors, setErrors] = useState({});
    const [activeMenuRef, setActiveMenuRef] = useState(null);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        gender: '',
    });

    const viewedProduct =  async () => {
        const response = await getViewedProducts();
        const products = response.map(favorite => favorite.product);
        setViewedProducts(products);
        setLoading(false);
    }

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                gender: user.gender || '',
            });
        }

        viewedProduct();
    }, [user]);

    if (!user || loading) {
        return <Loader />;
    }

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    }

    const handleSubmit = async () => {
        try {
            setErrors('');

            const response = await editProfile(filterChangedFields(formData, user));

            updateUser(response);

            return true;
        } catch (e) {
           setErrors(e.response.data.errors)
        }
    }

    return (
        <div className="container py-5">
            <div className="row">
                <div className="col-md-6">
                    <div className="card-profile shadow-sm p-4 mb-4">
                        <h2 className="card-title">Привет, {user.name}!</h2>
                        <p className="text-muted">{user.email}</p>

                        <div className="mb-5">
                            <h5>Основная информация</h5>
                            <p><strong>Почта:</strong> {user.email}</p>
                            <p><strong>Имя:</strong> {user.name}</p>
                            <p><strong>Пол:</strong> {user.gender === 'male' ? 'Мужчина' : 'Женщина'}</p>
                            <p><strong>Телефон:</strong> {user.phone || 'Не указан'}</p>
                            <p><strong>Текущая скидка:</strong> {user.discount || '0%'}</p>
                            <p><strong>Аккаунт создан: </strong> {user.createdAt}</p>
                        </div>

                        <UniversalModal
                            title="Редактировать профиль"
                            buttonLabel="Редактировать профиль"
                            onConfirm={handleSubmit}
                        >
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Имя</label>
                                    <input
                                        type="text"
                                        id="name"
                                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                        name="name"
                                        value={formData.name}
                                        placeholder="Введите имя"
                                        onChange={handleChange}
                                    />
                                    {errors.name && <Error error={errors.name}/>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Почта</label>
                                    <input
                                        type="email"
                                        id="email"
                                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                        name="email"
                                        placeholder="Введите почту"
                                        onChange={handleChange}
                                        value={formData.email}
                                    />
                                    {errors.email && <Error error={errors.email}/>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="phone" className="form-label">Телефон</label>
                                    <input
                                        type="text"
                                        id="phone"
                                        className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                        placeholder="Введите телефон"
                                        name="phone"
                                        onChange={handleChange}
                                        value={formData.phone}
                                    />
                                    {errors.phone && <Error error={errors.phone}/>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="gender" className="form-label">Пол</label>
                                    <select
                                        id="gender"
                                        className={`form-select ${errors.gender ? 'is-invalid' : ''}`}
                                        name="gender"
                                        onChange={handleChange}
                                        value={formData.gender}
                                    >
                                        <option value="male">Мужчина</option>
                                        <option value="female">Женщина</option>
                                    </select>
                                    {errors.gender && <Error error={errors.gender}/>}
                                </div>
                            </form>
                        </UniversalModal>

                        {!user.isSeller && (
                            <Link to="/become-seller" className="btn btn-primary w-100 mt-3">
                                Стать продавцом
                            </Link>
                        )}
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="d-flex flex-column gap-3">
                        <Link to="/favorites" className="card-profile shadow-sm p-3 text-decoration-none">
                            <div className="d-flex align-items-center">
                                <FaHeart size={30} className="me-3 text-danger"/>
                                <div>
                                    <h5>Избранное</h5>
                                    <p>Перейти в раздел избранных товаров</p>
                                </div>
                            </div>
                        </Link>
                        <Link to="/cart" className="card-profile shadow-sm p-3 text-decoration-none">
                            <div className="d-flex align-items-center">
                                <FaShoppingCart size={30} className="me-3 text-success"/>
                                <div>
                                    <h5>Корзина</h5>
                                    <p>Перейти в корзину для оформления заказа</p>
                                </div>
                            </div>
                        </Link>
                        <Link to="/viewed-products" className="card-profile shadow-sm p-3 text-decoration-none">
                            <div className="d-flex align-items-center">
                                <FaEye size={30} className="me-3 text-warning"/>
                                <div>
                                    <h5>Просмотренные товары</h5>
                                    <p>Посмотреть недавно просмотренные товары</p>
                                </div>
                            </div>
                        </Link>
                        <Link to="/purchase-products" className="card-profile shadow-sm p-3 text-decoration-none">
                            <div className="d-flex align-items-center">
                                <FaCoins size={30} className="me-3 text-success"/>
                                <div>
                                    <h5>Купленные товары</h5>
                                    <p>Посмотреть купленные товары</p>
                                </div>
                            </div>
                        </Link>
                        <div className="card-profile shadow-sm p-3 logout text-decoration-none" onClick={logout}>
                            <div className="d-flex align-items-center">
                                <FaSignOutAlt size={30} className="me-3 text-danger"/>
                                <div>
                                    <h5>Выйти</h5>
                                    <p>Завершить сеанс</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-5">
                <h4>Просмотренные товары</h4>
                {viewedProducts.length > 0 ? (
                    <div className="row row-cols-5 g-5">
                        {viewedProducts.map((product) => (
                            <div className="col" key={product.id}>
                                <Card
                                    product={product}
                                    activeMenuRef={activeMenuRef}
                                    setActiveMenuRef={setActiveMenuRef}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>Нет данных о просмотренных товарах.</p>
                )}
            </div>
        </div>
    );
};

export default Profile;
