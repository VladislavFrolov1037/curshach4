import { useParams } from 'react-router-dom';
import Card from "../../components/Card/Card";
import React, { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import { getProductsByCategory } from "../../services/product";
import ProductFilter from "../../components/Filter/ProductFilter";
import useProductFilter from "../../hooks/useProductFilter";
import Pagination from "../../utils/Pagination";

const ProductsPage = () => {
    const { categoryId } = useParams();
    const [loading, setLoading] = useState(true);
    const [allProducts, setAllProducts] = useState([]);
    const [activeMenuRef, setActiveMenuRef] = useState(null);

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
    } = useProductFilter(allProducts, 12);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const fetchedProducts = await getProductsByCategory(categoryId);
                setAllProducts(fetchedProducts);
            } catch (error) {
                setAllProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [categoryId]);

    if (loading && allProducts.length === 0) {
        return <Loader />;
    }

    return (
        <div className="container py-5">
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
                    <h4>Товары не найдены</h4>
                    <p>Попробуйте изменить параметры фильтрации</p>
                </div>
            )}
        </div>
    );
};

export default ProductsPage;