import React from 'react';
import {useNavigate} from 'react-router-dom';

const Forbidden = () => {
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>403 - Доступ запрещён</h1>
            <p style={styles.text}>
                У вас недостаточно прав для выполнения этого действия.
            </p>
            <button style={styles.button} onClick={goBack}>
                Вернуться назад
            </button>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f8f9fa',
        textAlign: 'center',
    },
    heading: {
        fontSize: '2rem',
        color: '#343a40',
    },
    text: {
        fontSize: '1.2rem',
        color: '#6c757d',
        marginBottom: '1rem',
    },
    button: {
        padding: '0.5rem 1rem',
        fontSize: '1rem',
        color: '#fff',
        backgroundColor: '#007bff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
};

export default Forbidden;
