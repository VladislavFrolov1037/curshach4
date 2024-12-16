import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import {InputMask} from "primereact/inputmask";
import {registerSeller} from "../../services/seller";
import seller from "./Seller";

const CreateSeller = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        name: '',
        description: '',
        type: '',
        taxId: '',
        passport: '',
        phone: '',
        address: '',
        image: null
    })

    const [errors, setErrors] = useState({});

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({...prev, image: file}));
        }
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.type === 'company') {
            const { passport, ...updatedFormData } = formData;
            setFormData(updatedFormData);
        }

        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                data.append(key, value);
            }
        });

        try {
            await registerSeller(data);

            navigate('/seller');
        } catch (e) {
            console.log(formData)
            setErrors(e.response.data.errors || {});
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h3 className="card-title text-center mb-4">Регистрация продавца</h3>
                            <form onSubmit={handleSubmit} encType="multipart/form-data">
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Почта</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Имя</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Описание</label>
                                    <textarea
                                        name="description" id="description" cols="30" rows="10"
                                        placeholder="Описание"
                                        className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                        value={formData.description}
                                        onChange={handleChange}
                                        required>
                                    </textarea>
                                    {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="phone" className="form-label">Телефон</label>
                                    <InputMask
                                        type="tel" id="phone" name="phone"
                                        className={`form-control ${errors.phone ? 'is-invalid' : ''}`} required
                                        value={formData.phone} onChange={handleChange} mask="89999999999"
                                        placeholder="89999999999"
                                    />
                                    {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="type" className="form-label">Тип</label>
                                    <select
                                        id="type"
                                        name="type"
                                        className={`form-control ${errors.type ? 'is-invalid' : ''}`}
                                        value={formData.type}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Выберите тип продавца</option>
                                        <option value="individual">ИП</option>
                                        <option value="company">Компания</option>
                                    </select>
                                    {errors.type && <div className="invalid-feedback">{errors.type}</div>}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="taxId" className="form-label">ИНН</label>
                                    <InputMask
                                        type="text" id="taxId" name="taxId"
                                        className={`form-control ${errors.taxId ? 'is-invalid' : ''}`} required
                                        value={formData.taxId} onChange={handleChange} mask={seller.type === "individual" ? "999999999999" : "9999999999"}
                                        placeholder="ИНН"
                                    />
                                    {errors.taxId && <div className="invalid-feedback">{errors.taxId}</div>}
                                </div>

                                {(formData.type === 'individual' || formData.type === '') && (
                                    <div className="mb-3">
                                        <label htmlFor="passport" className="form-label">Паспорт</label>
                                        <InputMask
                                            type="text" id="passport" name="passport"
                                            className={`form-control ${errors.passport ? 'is-invalid' : ''}`} required
                                            value={formData.passport} onChange={handleChange} mask="9999 999999"
                                            placeholder="Паспорт"
                                        />
                                        {errors.passport && <div className="invalid-feedback">{errors.passport}</div>}
                                    </div>
                                )}

                                <div className="mb-3">
                                    <label htmlFor="address" className="form-label">Адрес</label>
                                    <input
                                        type="text"
                                        id="address"
                                        name="address"
                                        className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="Город, улица дом"
                                        required
                                    />
                                    {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="image" className="form-label">
                                        Аватар
                                    </label>
                                    <input
                                        type="file"
                                        id="image"
                                        name="image"
                                        className={`form-control ${errors.image ? "is-invalid" : ""}`}
                                        onChange={handleFileChange}
                                        required
                                    />
                                    {errors.image && <div className="invalid-feedback">{errors.image}</div>}
                                </div>

                                <button type="submit" className="btn btn-primary w-100">Зарегистрировать</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default CreateSeller;
