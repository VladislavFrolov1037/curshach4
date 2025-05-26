import { useState, useEffect } from 'react';

const useProductFilter = (initialProducts = [], itemsPerPage = 12) => {
    const [filters, setFilters] = useState({
        category: null,
        priceRange: [0, 10000],
        isNew: false,
        sortBy: null,
        saleOnly: false,
        searchQuery: ''
    });

    const [filteredProducts, setFilteredProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [paginatedProducts, setPaginatedProducts] = useState([]);

    useEffect(() => {
        let result = [...initialProducts];

        if (filters.category) {
            result = result.filter(p => p.categoryId === filters.category.id);
        }

        if (filters.priceRange) {
            result = result.filter(p =>
                p.price >= filters.priceRange[0] &&
                p.price <= filters.priceRange[1]
            );
        }

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

        if (filters.sortBy) {
            switch (filters.sortBy) {
                case 'popularity': result.sort((a, b) => b.viewsCount - a.viewsCount); break;
                case 'newest': result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); break;
                case 'price_asc': result.sort((a, b) => a.price - b.price); break;
                case 'price_desc': result.sort((a, b) => b.price - a.price); break;
                default: break;
            }
        }

        setFilteredProducts(result);
        setCurrentPage(1); // Сброс на первую страницу при изменении фильтров
    }, [initialProducts, filters]);

    useEffect(() => {
        // Вычисляем пагинацию
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

        setPaginatedProducts(currentItems);
        setTotalPages(Math.ceil(filteredProducts.length / itemsPerPage));
    }, [filteredProducts, currentPage, itemsPerPage]);

    const updateFilters = (newFilters) => {
        setFilters(prev => ({
            ...prev,
            ...newFilters
        }));
    };

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

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return {
        products: paginatedProducts,
        allFilteredProducts: filteredProducts,
        filters,
        setFilters: updateFilters,
        resetFilters,
        currentPage,
        totalPages,
        goToPage,
        itemsPerPage
    };
};

export default useProductFilter;