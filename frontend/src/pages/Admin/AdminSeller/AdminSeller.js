import React, {useEffect, useRef, useState} from 'react';
import { getSellers, updateSellerStatus } from "../../../services/admin";
import './AdminSeller.css';
import {Toast} from "primereact/toast";

const AdminSeller = () => {
    const [sellers, setSellers] = useState([]);
    const [selectedSeller, setSelectedSeller] = useState(null);
    const toast = useRef(null);

    // Добавляем функцию для перевода статусов
    const translateStatus = (status) => {
        const statusMap = {
            'pending': 'На рассмотрении',
            'approved': 'Одобрено',
            'rejected': 'Отклонено',
            'inactive': 'Неактивный'
        };
        return statusMap[status] || status;
    };

    useEffect(() => {
        const fetchSellers = async () => {
            try {
                const data = await getSellers();
                // Переводим статусы при загрузке
                const translatedSellers = data.map(seller => ({
                    ...seller,
                    status: translateStatus(seller.status)
                }));
                setSellers(translatedSellers);
            } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
            }
        };

        fetchSellers();
    }, []);

    const handleUpdateStatus = async (sellerId, newStatus) => {
        try {
            const data = await updateSellerStatus(sellerId, newStatus);
            if (data.success) {
                setSellers(prevSellers =>
                    prevSellers.map(seller =>
                        seller.id === sellerId ? { ...seller, status: translateStatus(newStatus) } : seller
                    )
                );
                toast.current.show({severity: "success", summary: "Статус обновлен!"});
            } else {
                toast.current.show({severity: "error", summary: "Не удалось обновить статус"});
            }
        } catch (error) {
            console.error('Ошибка при обновлении статуса:', error);
        }
    };

    const renderActionButton = (status, sellerId) => {
        switch (status) {
            case 'На рассмотрении':
                return (
                    <>
                        <button className="action-btn approve"
                                onClick={() => handleUpdateStatus(sellerId, 'approved')}>Одобрить
                        </button>
                        <button className="action-btn reject"
                                onClick={() => handleUpdateStatus(sellerId, 'rejected')}>Отклонить
                        </button>
                    </>
                );
            case 'Одобрено':
                return (
                    <button className="action-btn deactivate"
                            onClick={() => handleUpdateStatus(sellerId, 'inactive')}>Деактивировать
                    </button>
                );
            case 'Отклонено':
                return (
                    <button className="action-btn approve"
                            onClick={() => handleUpdateStatus(sellerId, 'approved')}>Одобрить
                    </button>
                );
            case 'Неактивный':
                return (
                    <button className="action-btn activate"
                            onClick={() => handleUpdateStatus(sellerId, 'approved')}>Активировать
                    </button>
                );
            default:
                return null;
        }
    };

    const handleSellerClick = (seller) => {
        setSelectedSeller(seller);
    };

    return (
        <div className="admin-container">
            <Toast ref={toast}/>
            <h1 className="page-title">Управление Продавцами</h1>
            <table className="styled-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Имя</th>
                    <th>Email</th>
                    <th>Статус</th>
                    <th>Количество товаров</th>
                    <th>Дата регистрации</th>
                    <th>Действия</th>
                </tr>
                </thead>
                <tbody>
                {sellers.map(seller => (
                    <tr key={seller.id} onClick={() => handleSellerClick(seller)}>
                        <td>{seller.id}</td>
                        <td>{seller.name}</td>
                        <td>{seller.email}</td>
                        <td>{seller.status}</td>
                        <td>{seller.products_count}</td>
                        <td>{seller.createdAt}</td>
                        <td>
                            {renderActionButton(seller.status, seller.id)}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {selectedSeller && (
                <div className="seller-details">
                    <h2>Детали продавца</h2>
                    <div><strong>Имя:</strong> {selectedSeller.name}</div>
                    <div><strong>Email:</strong> {selectedSeller.email}</div>
                    <div><strong>Телефон:</strong> {selectedSeller.phone}</div>
                    <div><strong>Тип:</strong> {selectedSeller.type}</div>
                    <div><strong>Налоговый номер:</strong> {selectedSeller.taxId}</div>
                    <div><strong>Паспорт:</strong> {selectedSeller.passport}</div>
                    <div><strong>Адрес:</strong> {selectedSeller.address}</div>
                    <div><strong>Описание:</strong> {selectedSeller.description}</div>
                    <div><strong>Баланс:</strong> {selectedSeller.balance}</div>
                    <div><strong>Изображение:</strong> <img
                        src={`${process.env.REACT_APP_API_BASE_URL}/${selectedSeller.image}`} alt="seller"
                        className="seller-image" /></div>
                </div>
            )}
        </div>
    );
};

export default AdminSeller;
