import { useState, useEffect } from 'react';

const useProductFilter = (initialProducts = []) => {
    const [filters, setFilters] = useState({
        category: null,
        priceRange: [0, 10000],
        isNew: false,
        sortBy: null,
        saleOnly: false,
        searchQuery: ''
    });

    const [filteredProducts, setFilteredProducts] = useState(initialProducts);

    useEffect(() => {
        let result = [...initialProducts];

        // Применяем фильтры
        if (filters.category) {
            result = result.filter(p => p.categoryId === filters.category.id);
        }

        result = result.filter(p =>
            p.price >= filters.priceRange[0] &&
            p.price <= filters.priceRange[1]
        );

        if (filters.isNew) {
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
            result = result.filter(p => new Date(p.createdAt) > oneMonthAgo);
        }

        if (filters.saleOnly) {
            result = result.filter(p => p.discount > 0);
        }

        if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            result = result.filter(p =>
                p.name.toLowerCase().includes(query) ||
                p.description.toLowerCase().includes(query)
            );
        }

        // Сортировка
        switch (filters.sortBy) {
            case 'popularity': result.sort((a, b) => b.viewsCount - a.viewsCount); break;
            case 'newest': result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); break;
            case 'price_asc': result.sort((a, b) => a.price - b.price); break;
            case 'price_desc': result.sort((a, b) => b.price - a.price); break;
            default: break;
        }

        setFilteredProducts(result);
    }, [initialProducts, filters]);

    const resetFilters = () => {
        setFilters({
            category: null,
            priceRange: [0, 10000],
            isNew: false,
            sortBy: null,
            saleOnly: false,
            searchQuery: ''
        });
    };

    return {
        filteredProducts,
        filters,
        setFilters,
        resetFilters
    };
};

export default useProductFilter;