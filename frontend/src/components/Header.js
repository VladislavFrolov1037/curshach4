import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import HeadlessDemo from "./Sidebar";

function Header() {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        // Логика поиска, например, перенаправление на страницу результатов
        console.log('Search:', searchTerm);
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">
                    Маркетплейс
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Каталог</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/">О нас</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Избранное</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Корзина</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Заказы</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/">О нас</Link>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                               data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Пользователь
                            </a>
                            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                <Link className="dropdown-item" to="/profile">Личный кабинет</Link>
                                <div className="dropdown-divider"></div>
                                <Link className="dropdown-item" to="/login">Войти</Link>
                                <Link className="dropdown-item" to="/registration">Зарегистрироваться</Link>
                                <Link className="dropdown-item" to="/logout">Выйти</Link>
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
