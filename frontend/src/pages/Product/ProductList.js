import React, { useEffect, useState } from "react";
import Card from "../../components/Card/Card";
import Loader from "../../components/Loader";
import { getProducts } from "../../services/product";
import ProductFilter from "../../components/Filter/ProductFilter";
import useProductFilter from "../../useProductFilter";

function ProductList() {
    const [activeMenuRef, setActiveMenuRef] = useState(null);
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Используем хук для фильтрации
    const {
        filteredProducts,
        filters,
        setFilters,
        resetFilters
    } = useProductFilter(allProducts);

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
                onFilterChange={setFilters} // Передаем setFilters из хука
                onResetFilters={resetFilters} // Передаем resetFilters из хука
            />

            {filteredProducts.length > 0 ? (
                <div className="row g-3">
                    {filteredProducts.map((product) => (
                        <div key={product.id} className="col-12 col-sm-6 col-lg-4">
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