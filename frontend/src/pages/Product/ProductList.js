import React, { useEffect, useState } from "react";
import Card from "../../components/Card/Card";
import Loader from "../../components/Loader";
import { getProducts } from "../../services/product";
import ProductFilter from "../../components/Filter/ProductFilter";

function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeMenuRef, setActiveMenuRef] = useState(null);
    const [filters, setFilters] = useState({
        saleOnly: false,
        sortOption: null,
        priceRange: null,
        category: null
    });

    // Функция для обновления фильтров
    const handleFilterChange = (newFilters) => {
        setFilters(newFilters); // Обновляем фильтры в состоянии
    };

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);

            // Отправляем фильтры в API
            const filteredProducts = await getProducts(filters);
            setProducts(filteredProducts);
            setLoading(false);
        };

        fetchProducts();
    }, [filters]); // Получаем данные, когда фильтры изменяются

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="container py-5">
            {/* Фильтры */}
            <ProductFilter
                onFilterChange={handleFilterChange}  // Передаем функцию для обновления фильтров
                filters={filters}  // Передаем текущие фильтры
                filterOptions={{
                    sale: true,
                    categories: [{ label: "Электроника", value: "electronics" }, { label: "Одежда", value: "clothing" }],
                    sortOptions: [
                        { label: "По популярности", value: "popular" },
                        { label: "Цена: по возрастанию", value: "price_asc" },
                        { label: "Цена: по убыванию", value: "price_desc" }
                    ],
                    priceRange: true
                }}
            />

            <div className="row row-cols-5 g-5 mt-3">
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
        </div>
    );
}

export default ProductList;
