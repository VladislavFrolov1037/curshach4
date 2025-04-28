import React, { useEffect, useState } from "react";
import Card from "../../components/Card/Card";
import Loader from "../../components/Loader";
import { getProducts } from "../../services/product";
import ProductFilter from "../../components/Filter/ProductFilter";
import { Button } from 'primereact/button';

function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeMenuRef, setActiveMenuRef] = useState(null);
    const [filters, setFilters] = useState({});

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    const handleResetFilters = () => {
        setFilters({});
    };

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const apiFilters = {
                    ...filters,
                    saleOnly: filters.saleOnly ? 1 : 0,
                    minPrice: filters.priceRange?.[0],
                    maxPrice: filters.priceRange?.[1],
                };
                delete apiFilters.priceRange;

                const filteredProducts = await getProducts(apiFilters);
                setProducts(filteredProducts);
            } catch (error) {
                console.error("Ошибка при загрузке:", error);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(fetchProducts, 300);
        return () => clearTimeout(timer);
    }, [filters]);

    if (loading && products.length === 0) {
        return <Loader />;
    }

    return (
        <div className="container py-5">
            <ProductFilter
                onFilterChange={handleFilterChange}
                onReset={handleResetFilters}
                filterOptions={{
                    sale: true,
                    categories: [
                        { label: "Электроника", value: "electronics" },
                        { label: "Одежда", value: "clothing" }
                    ],
                    priceRange: true
                }}
            />

            {products.length > 0 ? (
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4 mt-3">
                    {products.map((product) => (
                        <div className="col" key={product.id}>
                            <Card
                                product={product}
                                activeMenuRef={activeMenuRef}
                                setActiveMenuRef={setActiveMenuRef}
                            />
                        </div>
                    ))}
                </div>
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