import { useSearchParams } from 'react-router-dom';
import Card from "../../components/Card/Card";
import React, { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import { searchProducts } from "../../services/product";
import ProductFilter from "../../components/Filter/ProductFilter";
import useProductFilter from "../../hooks/useProductFilter";
import Pagination from "../../utils/Pagination";

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [loading, setLoading] = useState(true);
    const [allProducts, setAllProducts] = useState([]);
    const [activeMenuRef, setActiveMenuRef] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

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
        setLoading(true);
        setAllProducts([]);
        setSearchQuery(query);

        if (!query.trim()) {
            setLoading(false);
            setIsInitialLoad(false);
            return;
        }

        const fetchData = async () => {
            try {
                const fetchedProducts = await searchProducts(query);
                setAllProducts(fetchedProducts);
            } catch (error) {
                console.error('Ошибка поиска:', error);
                setAllProducts([]);
            } finally {
                setLoading(false);
                setIsInitialLoad(false);
            }
        };

        const timer = setTimeout(fetchData, 300);

        return () => clearTimeout(timer);
    }, [query]);

    if (loading || isInitialLoad) {
        return (
            <div className="container py-5">
                <h2 className="mb-4">Поиск: "{query}"</h2>
                <div className="d-flex justify-content-center py-5">
                    <Loader />
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <h2 className="mb-4">Результаты поиска: "{searchQuery}"</h2>

            <ProductFilter
                filters={filters}
                onFilterChange={setFilters}
                onResetFilters={resetFilters}
            />

            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>Найдено товаров: {allFilteredProducts.length}</div>
                {allFilteredProducts.length > 0 && (
                    <div>Страница {currentPage} из {totalPages}</div>
                )}
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
                    <p>{searchQuery ? 'Попробуйте изменить параметры поиска' : 'Введите поисковый запрос'}</p>
                </div>
            )}
        </div>
    );
};

export default SearchResults;