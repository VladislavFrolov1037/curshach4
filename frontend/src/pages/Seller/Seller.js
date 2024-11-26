import React, {useEffect, useState} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {editSeller, getSeller} from "../../services/seller";
import UniversalModal from "../../components/modals/UniversalModal";
import {filterChangedFields} from "../../utils/objectUtils";
import Loader from "../../components/Loader";
import Error from "../../components/Error";

const Seller = () => {
    const [seller, setSeller] = useState(null);
    const [listings, setListings] = useState([]);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);

    const fetchSellerData = async () => {
        const sellerData = await getSeller();

        setSeller(sellerData);

        setFormData(sellerData);

        setLoading(false);

        // Если продавец имеет объявления, мы их подтягиваем
        if (sellerData && sellerData.id) {
            const listingsData = await getSellerListings(sellerData.id); // Функция для получения объявлений
            setListings(listingsData);
        }
    }

    useEffect(() => {
        fetchSellerData();
    }, []);


    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    }

    const handleSubmit = async () => {
        try {
            setErrors('');

            const response = await editSeller(formData.id, filterChangedFields(formData, seller));

            setSeller(response);

            return true;
        } catch (e) {
            setErrors(e.response.data.errors);
        }
    }

    const getSellerListings = async (sellerId) => {
        // Здесь пока условие на случай, если объявлений нет
        return sellerId ? [
            {
                id: 1,
                name: "Продажа телевизора",
                description: "Телевизор LG 42 дюйма",
                price: "15000 ₽",
                quantity: 10,
                image: "https://via.placeholder.com/200x150"
            },
            {
                id: 2,
                name: "Продажа смартфона",
                description: "iPhone 13, 128GB",
                price: "25000 ₽",
                quantity: 5,
                image: "https://via.placeholder.com/200x150"
            },
            {
                id: 3,
                name: "Продажа ноутбука",
                description: "Ноутбук ASUS, 16GB RAM",
                price: "35000 ₽",
                quantity: 2,
                image: "https://via.placeholder.com/200x150"
            }
        ] : [];
    };

    if (loading) {
        return <Loader/>;
    }

    return (
        <div className="container mt-5">
            <div className="card border-0 shadow-lg">
                <div className="row g-0">
                    <div className="col-lg-4 bg-light d-flex align-items-center justify-content-center">
                        <img
                            src={`${process.env.REACT_APP_API_BASE_URL}/${seller.image}`}
                            className="img-fluid rounded-circle p-3"
                            alt={seller.name || "Продавец"}
                            style={{maxWidth: "200px"}}
                        />
                    </div>

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
                                        {errors.name && <Error error={errors.name} />}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="description" className="form-label">Описание</label>
                                        <input
                                            type="text"
                                            id="description"
                                            className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                            name="description"
                                            value={formData.description}
                                            placeholder="Введите описание"
                                            onChange={handleChange}
                                        />
                                        {errors.description &&  <Error error={errors.description} />}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="taxId" className="form-label">ИНН</label>
                                        <input
                                            type="text"
                                            id="taxId"
                                            className={`form-control ${errors.taxId ? 'is-invalid' : ''}`}
                                            name="taxId"
                                            value={formData.taxId}
                                            placeholder="Введите ИНН"
                                            onChange={handleChange}
                                        />
                                        {errors.taxId && <div className="invalid-feedback">{errors.taxId}</div>}
                                    </div>
                                    {formData.passport && (
                                        <div className="mb-3">
                                            <label htmlFor="passport" className="form-label">Паспорт</label>
                                            <input
                                                type="text"
                                                id="passport"
                                                className={`form-control ${errors.passport ? 'is-invalid' : ''}`}
                                                name="passport"
                                                value={formData.passport}
                                                placeholder="Введите паспортные данные"
                                                onChange={handleChange}
                                            />
                                            {errors.passport &&
                                                <Error error={errors.passport} />}
                                        </div>
                                    )}
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
                                        {errors.email && <Error error={errors.email} />}
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
                                        {errors.phone && <Error error={errors.phone} />}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="address" className="form-label">Адрес</label>
                                        <input
                                            type="text"
                                            id="address"
                                            className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                                            placeholder="Введите адрес"
                                            name="address"
                                            onChange={handleChange}
                                            value={formData.address}
                                        />
                                        {errors.address && <Error error={errors.address} />}
                                    </div>
                                </form>
                            </UniversalModal>
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
                                        style={{maxHeight: "200px", objectFit: "cover"}}
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
