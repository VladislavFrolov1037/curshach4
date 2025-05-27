import React, {useEffect, useState} from 'react';
import './AdminDashboard.css';
import AdminCard from "../../../components/Admin/AdminCard/AdminCard";
import Loader from "../../../components/Loader";
import {getDashboard} from "../../../services/admin";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    faBox,
    faChartBar, faCommenting,
    faCommentsDollar,
    faKey,
    faPaperPlane,
    faUser,
    faUsers
} from '@fortawesome/free-solid-svg-icons';

const AdminDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [counts, setCounts] = useState({
        orders: 0,
        users: 0,
        sellers: 0,
    });

    const fetchCounts = async () => {
        try {
            const response = await getDashboard();
            setCounts({
                orders: response.orders,
                users: response.users,
                sellers: response.sellers,
            });
        } catch (error) {
            console.error("Ошибка загрузки данных:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCounts();
    }, []);

    if (loading) {
        return <Loader/>;
    }

    const cards = [
        {
            title: 'Управление заказами',
            icon: <FontAwesomeIcon icon={faBox}/>,
            link: '/admin/orders',
            countLabel: 'Количество заказов',
            count: counts.orders,
        },
        // {
        //     title: 'Управление пользователями',
        //     icon: <FontAwesomeIcon icon={faUser}/>,
        //     link: '/admin/users',
        //     countLabel: 'Количество пользователей',
        //     count: counts.users,
        // },
        {
            title: 'Управление продавцами',
            icon: <FontAwesomeIcon icon={faUsers}/>,
            link: '/admin/sellers',
            countLabel: 'Количество продавцов',
            count: counts.sellers,
        },
        {
            title: 'Промокоды',
            icon: <FontAwesomeIcon icon={faPaperPlane}/>,
            link: '/admin/tg/promoCodes',
            countLabel: 'Управление промокодами',
        },
        {
            title: 'Токены',
            icon: <FontAwesomeIcon icon={faKey}/>,
            link: '/admin/tokens',
            countLabel: 'Управление токенами',
        },
        {
            title: 'Отзывы',
            icon: <FontAwesomeIcon icon={faCommenting}/>,
            link: '/admin/reviews',
            countLabel: 'Управление отзывами',
        }
    ];

    return (
        <div className="admin-dashboard">
            <div className="container">
                <div className="row">
                    {cards.map((card, index) => (
                        <div className="col-md-6 mb-4" key={index}>
                            <AdminCard {...card} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
