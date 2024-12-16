import React, {useContext, useEffect, useRef, useState} from 'react';
import AuthContext from '../../context/AuthContext';
import {useNavigate} from "react-router-dom";
import Loader from "../../components/Loader";
import {Toast} from "primereact/toast";
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const {login} = useContext(AuthContext);
    const [credentials, setCredentials] = useState({email: '', password: ''});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const toast = useRef(null);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setCredentials((prev) => ({...prev, [name]: value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            await login(credentials);

            navigate('/profile');
        } catch (e) {
            setLoading(false);

            credentials.password = '';
            setError(e.response.data.message);
        }
    };

    useEffect(() => {
        const authError = localStorage.getItem('authError');
        if (authError) {
            toast.current.show({severity: "error", summary: authError, life: 5000});
            localStorage.removeItem('authError');
        }
    }, []);

    if (loading) {
        return <Loader/>;
    }

    return (
        <div className="container mt-5 d-flex justify-content-center">
            <Toast ref={toast}/>
            <div className="card p-4 shadow" style={{width: '100%', maxWidth: '400px'}}>
                <h3 className="card-title text-center mb-4">Вход</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Почта</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="form-control"
                            value={credentials.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Пароль</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="form-control"
                            value={credentials.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {error && (
                        <div className="alert alert-danger text-center">
                            {error}
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary w-100 mt-3">Войти</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
