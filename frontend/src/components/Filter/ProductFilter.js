import React, { useState, useEffect } from "react";
import { Dropdown } from "primereact/dropdown";
import "bootstrap/dist/css/bootstrap.min.css";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";

const ProductFilter = ({ onFilterChange, filters, filterOptions }) => {
    const [localFilters, setLocalFilters] = useState(filters || {}); // Используем локальное состояние для фильтров

    const handleFilterChange = (key, value) => {
        setLocalFilters(prevState => {
            const updatedFilters = { ...prevState, [key]: value };
            onFilterChange(updatedFilters); // Передаем обновленные фильтры родительскому компоненту
            return updatedFilters;
        });
    };

    useEffect(() => {
        // Инициализация фильтров при монтировании компонента
        if (filters) {
            setLocalFilters(filters);
        }
    }, [filters]);

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
                        className="w-200px"
                        style={{ height: '38px' }} // Приводим к одинаковой высоте
                    />
                </div>
            )}

            {filterOptions?.sort && (
                <div className="d-flex align-items-center gap-3">
                    <span>Сортировка</span>
                    <Dropdown
                        value={localFilters.sortOption || null}
                        options={filterOptions.sortOptions}
                        onChange={(e) => handleFilterChange('sortOption', e.value)}
                        placeholder="Сортировать по..."
                        className="w-200px"
                        style={{ height: '38px' }}
                    />
                </div>
            )}

            {filterOptions?.priceRange && (
                <div className="position-relative">
                    <button
                        className="btn btn-outline-primary"
                        onClick={() => setLocalFilters({ ...localFilters, showPriceInputs: !localFilters.showPriceInputs })}
                        style={{ height: '38px', minWidth: '180px', padding: '6px 12px' }}
                    >
                        {`Цена: от ${localFilters.priceRange?.[0] || 0} до ${localFilters.priceRange?.[1] || 10000}`}
                    </button>

                    {localFilters.showPriceInputs && (
                        <div className="position-absolute bg-white p-3 shadow rounded" style={{ top: "100%", left: 0, zIndex: 10, minWidth: "250px" }}>
                            <div className="d-flex gap-2">
                                <input
                                    type="number"
                                    className="form-control"
                                    value={localFilters.priceRange?.[0] || 0}
                                    onChange={(e) => handleFilterChange('priceRange', [Number(e.target.value), localFilters.priceRange?.[1] || 10000])}
                                    placeholder="Мин"
                                    style={{ height: '38px' }}
                                />
                                <input
                                    type="number"
                                    className="form-control"
                                    value={localFilters.priceRange?.[1] || 10000}
                                    onChange={(e) => handleFilterChange('priceRange', [localFilters.priceRange?.[0] || 0, Number(e.target.value)])}
                                    placeholder="Макс"
                                    style={{ height: '38px' }}
                                />
                            </div>
                            <button
                                className="btn btn-primary mt-2 w-100"
                                onClick={() => setLocalFilters({ ...localFilters, showPriceInputs: false })}
                                style={{ height: '38px' }}
                            >
                                Применить
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProductFilter;
