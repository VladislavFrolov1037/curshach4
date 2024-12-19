import React from 'react';
import { Link } from 'react-router-dom';
import './AdminCard.css';

const AdminCard = ({ title, icon, link, countLabel, count }) => {
    return (
        <Link to={link} className="admin-card">
            <div className="admin-card-content">
                <div className="admin-card-icon">
                    <i className={`bi bi-${icon}`}></i>
                </div>
                <div className="admin-card-text">
                    <h5>{title}</h5>
                    <p>{countLabel}: <strong>{count}</strong></p>
                </div>
            </div>
        </Link>
    );
};

export default AdminCard;
