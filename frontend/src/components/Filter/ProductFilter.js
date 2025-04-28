import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Dropdown } from "primereact/dropdown";
import { Button } from 'primereact/button';

const ProductFilter = ({ onFilterChange, filterOptions, onReset }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const [localFilters, setLocalFilters] = useState(() => {
        const searchParams = new URLSearchParams(location.search);
        const initialFilters = {};

        searchParams.forEach((value, key) => {
            try {
                initialFilters[key] = JSON.parse(value);
            } catch (e) {
                initialFilters[key] = value;
            }
        });

        return initialFilters;
    });

    const [tempPriceRange, setTempPriceRange] = useState(
        localFilters.priceRange || [0, 1000000]
    );
    const [showPriceInputs, setShowPriceInputs] = useState(false);

    useEffect(() => {
        const searchParams = new URLSearchParams();

        Object.keys(localFilters).forEach(key => {
            if (localFilters[key] !== undefined && localFilters[key] !== null) {
                searchParams.set(key, JSON.stringify(localFilters[key]));
            }
        });

        const newSearch = searchParams.toString();
        const currentSearch = location.search.substring(1);

        if (newSearch !== currentSearch) {
            navigate({
                pathname: location.pathname,
                search: newSearch,
            }, { replace: true });
        }

        onFilterChange(localFilters);
    }, [localFilters, navigate, location]);

    const handleFilterChange = useCallback((key, value) => {
        setLocalFilters(prev => {
            const newFilters = { ...prev, [key]: value };
            if (key !== 'page') delete newFilters.page;
            if (key === 'saleOnly' && typeof value === 'string') {
                newFilters[key] = value === 'true';
            }
            return newFilters;
        });
    }, []);

    const handleReset = () => {
        setLocalFilters({});
        setTempPriceRange([0, 1000000]);
        if (onReset) onReset();
    };

    const sortOptions = [
        { label: "Популярные", value: "popular" },
        { label: "Новинки", value: "new" },
        { label: "Дешевле", value: "cheap" },
        { label: "Дороже", value: "expensive" },
        { label: "С высоким рейтингом", value: "high_rating" },
        { label: "С большими скидками", value: "big_discount" }
    ];

    const hasActiveFilters = Object.keys(localFilters).length > 0;

    return (
        <div className="d-flex flex-wrap align-items-center gap-4 p-3 bg-light rounded">
            {filterOptions?.sale && (
                <div className="d-flex align-items-center gap-3">
                    <span>Распродажа</span>
                    <div className="form-check form-switch">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            checked={localFilters.saleOnly || false}
                            onChange={(e) => handleFilterChange('saleOnly', e.target.checked)}
                        />
                    </div>
                </div>
            )}

            {filterOptions?.categories && (
                <div className="d-flex align-items-center gap-3">
                    <span>Категория</span>
                    <Dropdown
                        value={localFilters.category || null}
                        options={filterOptions.categories}
                        onChange={(e) => handleFilterChange('category', e.value)}
                        placeholder="Выберите категорию"
                        className="w-200px p-dropdown-sm"
                    />
                </div>
            )}

            <div className="d-flex align-items-center gap-3">
                <span>Сортировка</span>
                <Dropdown
                    value={localFilters.sortOption || null}
                    options={sortOptions}
                    onChange={(e) => handleFilterChange('sortOption', e.value)}
                    placeholder="Сортировать по..."
                    className="w-200px p-dropdown-sm"
                />
            </div>

            {filterOptions?.priceRange && (
                <div className="position-relative">
                    <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={() => setShowPriceInputs(!showPriceInputs)}
                        style={{ height: '38px', minWidth: '180px', padding: '6px 12px' }}
                    >
                        {`Цена: от ${tempPriceRange[0]} до ${tempPriceRange[1]}`}
                    </button>

                    {showPriceInputs && (
                        <div className="position-absolute bg-white p-3 shadow rounded" style={{ top: "100%", left: 0, zIndex: 10, minWidth: "250px" }}>
                            <div className="d-flex gap-2">
                                <input
                                    type="number"
                                    className="form-control"
                                    value={tempPriceRange[0]}
                                    onChange={(e) => setTempPriceRange([Number(e.target.value), tempPriceRange[1]])}
                                    placeholder="Мин"
                                    style={{ height: '38px' }}
                                />
                                <input
                                    type="number"
                                    className="form-control"
                                    value={tempPriceRange[1]}
                                    onChange={(e) => setTempPriceRange([tempPriceRange[0], Number(e.target.value)])}
                                    placeholder="Макс"
                                    style={{ height: '38px' }}
                                />
                            </div>
                            <button
                                type="button"
                                className="btn btn-primary mt-2 w-100"
                                onClick={() => {
                                    handleFilterChange('priceRange', tempPriceRange);
                                    setShowPriceInputs(false);
                                }}
                                style={{ height: '38px' }}
                            >
                                Применить
                            </button>
                        </div>
                    )}
                </div>
            )}

            <Button
                icon="pi pi-times"
                label="Сбросить"
                className="p-button-outlined p-button-danger ms-auto"
                onClick={handleReset}
                disabled={!hasActiveFilters}
            />
        </div>
    );
};

export default ProductFilter;