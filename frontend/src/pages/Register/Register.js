import React, {useContext, useState} from 'react';
import AuthContext from '../../context/AuthContext';
import {useNavigate} from "react-router-dom";
import {InputMask} from 'primereact/inputmask';
import {Password} from "primereact/password";
import Loader from "../../components/Loader";
import Error from "../../components/Error";

const Register = () => {
    const {register} = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
        name: '',
        gender: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            await register(formData);

            navigate('/login');
        } catch (e) {
            setLoading(false);

            formData.password = '';
            formData.confirmPassword = '';

            setErrors(e.response?.data.errors || {});
        }
    };

    if (loading) {
        return (
            <Loader />
        )
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h3 className="card-title text-center mb-4">Регистрация</h3>
                            <form onSubmit={handleSubmit}>
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
                                    {errors.email && <Error error={errors.email} />}
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
                                    {errors.name && <Error error={errors.name} />}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="gender" className="form-label">Пол</label>
                                    <select
                                        id="gender"
                                        name="gender"
                                        className={`form-control ${errors.gender ? 'is-invalid' : ''}`}
                                        value={formData.gender}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Выберите пол</option>
                                        <option value="male">Мужской</option>
                                        <option value="female">Женский</option>
                                    </select>
                                    {errors.gender && <Error error={errors.gender} />}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="phone" className="form-label">Телефон</label>
                                    <InputMask
                                        type="tel" id="phone" name="phone"
                                        className={`form-control ${errors.phone ? 'is-invalid' : ''}`} required
                                        value={formData.phone} onChange={handleChange} mask="89999999999"
                                        placeholder="89999999999"
                                    />
                                    {errors.phone && <Error error={errors.phone} />}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Пароль</label>
                                    <Password
                                        type="password"
                                        id="password"
                                        name="password"
                                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        promptLabel="Введите пароль"
                                        weakLabel="Слишком простой"
                                        mediumLabel="Средняя сложность"
                                        strongLabel="Сложный пароль"
                                        toggleMask
                                    />
                                    {errors.password && <Error error={errors.password} />}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="confirmPassword" className="form-label">Подтвердите пароль</label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                    {errors.confirmPassword && <Error error={errors.confirmPassword} />}
                                </div>

                                <button type="submit" className="btn btn-primary w-100">Зарегистрироваться</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
