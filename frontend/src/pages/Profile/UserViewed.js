import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Card from '../../components/Card/Card';
import useProductFilter from '../../hooks/useProductFilter';
import ProductFilter from '../../components/Filter/ProductFilter';
import Pagination from '../../utils/Pagination';
import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';
import Loader from "../../components/Loader";

const UserViewed = () => {
    const location = useLocation();
    const [viewedProducts, setViewedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeMenuRef, setActiveMenuRef] = useState(null);

    useEffect(() => {
        if (location.state?.viewedProducts) {
            setViewedProducts(location.state.viewedProducts);
            setLoading(false);
        } else {
            const savedViewed = JSON.parse(localStorage.getItem('viewedProducts') || []);
            setViewedProducts(savedViewed);
            setLoading(false);
        }
    }, [location.state]);

    const {
        products,
        allFilteredProducts,
        filters,
        setFilters,
        resetFilters,
        currentPage,
        totalPages,
        goToPage,
        itemsPerPage
    } = useProductFilter(viewedProducts, 12);

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="container py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Просмотренные товары</h2>
                <Link to="/">
                    <Button label="Вернуться на главную" className="p-button-text" />
                </Link>
            </div>

            <ProductFilter
                filters={filters}
                onFilterChange={setFilters}
                onResetFilters={resetFilters}
            />

            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>Найдено товаров: {allFilteredProducts.length}</div>
                <div>Страница {currentPage} из {totalPages}</div>
            </div>

            {products.length > 0 ? (
                <>
                    <div className="row g-3">
                        {products.map((product) => (
                            <div key={product.id} className="col-12 col-sm-6 col-lg-4">
                                <Card
                                    product={product}
                                    activeMenuRef={activeMenuRef}
                                    setActiveMenuRef={setActiveMenuRef}
                                />
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="mt-4">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={goToPage}
                            />
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-5">
                    <h4>Нет просмотренных товаров</h4>
                    <p>Вы еще не просматривали товары</p>
                </div>
            )}
        </div>
    );
};

export default UserViewed;
