import React, {useContext, useState} from 'react';
import {Link} from 'react-router-dom';
import Sidebar from "./Sidebar";
import AuthContext from "../../context/AuthContext";

function Header() {
    const [searchTerm, setSearchTerm] = useState('');
    const {user, logout} = useContext(AuthContext);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        console.log('Search:', searchTerm);
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <Sidebar/>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Маркетплейс</Link>
                        </li>
                        {user && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/favorites">Избранное</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/cart">Корзина</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/orders">Заказы</Link>
                                </li>
                            </>
                        )}
                        <li className="nav-item dropdown">
                            <a
                                className="nav-link dropdown-toggle"
                                href="#"
                                id="navbarDropdown"
                                role="button"
                                data-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded="false"
                            >
                                Пользователь
                            </a>
                            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                {user ? (
                                    <>
                                        <Link className="dropdown-item" to="/profile">Личный кабинет</Link>
                                        {user.isSeller && (
                                            <>
                                                <Link className="dropdown-item" to="/seller">Профиль продавца</Link>
                                                <Link className="dropdown-item" to="/my-products">Мои товары</Link>
                                            </>
                                        )}
                                        <div className="dropdown-divider"></div>
                                        <button className="dropdown-item" onClick={logout}>Выйти</button>
                                    </>
                                ) : (
                                    <>
                                        <Link className="dropdown-item" to="/login">Войти</Link>
                                        <Link className="dropdown-item" to="/register">Зарегистрироваться</Link>
                                    </>
                                )}

                            </div>
                        </li>
                    </ul>
                    <form className="d-flex ms-auto" onSubmit={handleSearchSubmit}>
                        <input
                            className="form-control me-2"
                            type="search"
                            placeholder="Search"
                            aria-label="Search"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                        <button className="btn btn-outline-success" type="submit">Search</button>
                    </form>
                </div>
            </div>
        </nav>
    );
}

export default Header;
