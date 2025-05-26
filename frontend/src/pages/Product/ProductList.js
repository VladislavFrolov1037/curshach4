import React, { useEffect, useState } from "react";
import Card from "../../components/Card/Card";
import Loader from "../../components/Loader";
import { getProducts } from "../../services/product";
import ProductFilter from "../../components/Filter/ProductFilter";
import useProductFilter from "../../hooks/useProductFilter";
import Pagination from "../../utils/Pagination";

function ProductList() {
    const [activeMenuRef, setActiveMenuRef] = useState(null);
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);

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
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const products = await getProducts();
                setAllProducts(products);
            } catch (error) {
                console.error("Ошибка при загрузке:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

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
                            <div key={product.id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
                                <Card product={product} activeMenuRef={activeMenuRef} setActiveMenuRef={setActiveMenuRef} />
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
}

export default ProductList;