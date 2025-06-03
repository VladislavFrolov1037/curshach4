import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { FiShoppingBag } from "react-icons/fi";
import { MdDateRange } from "react-icons/md";
import { getSellerProfile } from "../../services/seller";
import Loader from "../../components/Loader";
import Card from "../../components/Card/Card";
import useProductFilter from "../../hooks/useProductFilter";
import ProductFilter from "../../components/Filter/ProductFilter";
import Pagination from "../../utils/Pagination";

const SellerProfile = () => {
    const { sellerId } = useParams();
    const [seller, setSeller] = useState({ products: [] });
    const [loading, setLoading] = useState(true);
    const [activeMenuRef, setActiveMenuRef] = useState(false);

    const {
        products, // товары для текущей страницы
        allFilteredProducts, // все отфильтрованные товары
        filters,
        setFilters,
        resetFilters,
        currentPage,
        totalPages,
        goToPage,
        itemsPerPage
    } = useProductFilter(seller.products, 12); // 12 товаров на странице

    useEffect(() => {
        const fetchSellerData = async () => {
            setLoading(true);
            try {
                const sellerData = await getSellerProfile(sellerId);
                setSeller(sellerData);
            } catch (error) {
                console.error("Error fetching seller data:", error);
                setSeller({ products: [] });
            } finally {
                setLoading(false);
            }
        };

        fetchSellerData();
    }, [sellerId]);

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="container mt-4">
            <div className="seller-profile d-flex align-items-center p-3 border rounded shadow-sm bg-white">
                <img
                    src={`${process.env.REACT_APP_API_BASE_URL}/${seller.image}`}
                    alt={seller.name}
                    className="rounded-circle me-3"
                    style={{width: 80, height: 80}}
                />
                <div>
                    <h5 className="mb-1">{seller.name}</h5>
                    <div className="d-flex align-items-center text-muted">
                        <FaStar className="text-warning me-1"/> {parseFloat(seller.rating?.rating || 0).toFixed(1)}
                        <span className="mx-2">•</span> {seller.rating?.count || 0} отзывов
                        <span className="mx-2">•</span> <FiShoppingBag
                        className="mx-1"/> {seller.salesCount || 0} товаров
                        <span className="mx-2">•</span> <MdDateRange className="mx-1"/> На
                        маркетплейсе {seller.yearsOnPlatform || 0}
                    </div>
                </div>
            </div>
            <h4 className="mt-4">Товары продавца</h4>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>Найдено товаров: {allFilteredProducts.length}</div>
                <div>Страница {currentPage} из {totalPages}</div>
            </div>
            <ProductFilter
                filters={filters}
                onFilterChange={setFilters}
                onResetFilters={resetFilters}
            />
            <div className="row">
                {products.length > 0 ? (
                    products.map((product) => (
                        <div key={product.id} className="col-md-3">
                            <Card
                                product={product}
                                activeMenuRef={activeMenuRef}
                                setActiveMenuRef={setActiveMenuRef}
                            />
                        </div>
                    ))
                ) : (
                    <p>Нет товаров</p>
                )}
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
        </div>
    );
};

export default SellerProfile;