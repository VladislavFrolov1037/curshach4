import './NotFound.css';

const NotFound = () => {
    return (
        <div className="not-found-container">
            <div className="error-code">404</div>
            <div className="error-message">Страница не найдена</div>
            <a href="/" className="go-home">Вернуться на главную</a>
        </div>
    );
};

export default NotFound;
