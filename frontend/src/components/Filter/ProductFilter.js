import React, {useEffect, useState} from 'react';
import {Dropdown} from 'primereact/dropdown';
import {InputNumber} from 'primereact/inputnumber';
import {Button} from 'primereact/button';
import './ProductFilter.css';

const ProductFilter = ({filters, onFilterChange, onResetFilters}) => {
    const [priceRange, setPriceRange] = useState([0, 10000]);

    useEffect(() => {
        if (filters.priceRange) {
            setPriceRange(filters.priceRange);
        }
    }, [filters.priceRange]);

    const sortOptions = [
        {label: 'По умолчанию', value: null},
        {label: 'По популярности', value: 'popularity'},
        {label: 'Новинки', value: 'newest'},
        {label: 'Цена (по возрастанию)', value: 'price_asc'},
        {label: 'Цена (по убыванию)', value: 'price_desc'},
    ];

    const handlePriceChange = (index, value) => {
        const newPriceRange = [...priceRange];
        newPriceRange[index] = value || 0;
        setPriceRange(newPriceRange);

        if (index === 1) {
            onFilterChange({priceRange: newPriceRange});
        }
    };

    return (
        <div className="product-filter-container">
            <div className="filter-row">
                <div className="filter-group">
                    <label>Ценовой диапазон</label>
                    <div className="price-range-group">
                        <InputNumber
                            value={priceRange[0]}
                            onValueChange={(e) => handlePriceChange(0, e.value)}
                            mode="currency"
                            currency="RUB"
                            locale="ru-RU"
                            min={0}
                            max={priceRange[1]}
                            className="price-input"
                        />
                        <span className="price-separator">-</span>
                        <InputNumber
                            value={priceRange[1]}
                            onValueChange={(e) => handlePriceChange(1, e.value)}
                            mode="currency"
                            currency="RUB"
                            locale="ru-RU"
                            min={priceRange[0]}
                            className="price-input"
                        />
                    </div>
                </div>

                <div className="filter-group">
                    <label>Сортировка</label>
                    <Dropdown
                        options={sortOptions}
                        optionLabel="label"
                        optionValue="value"
                        value={filters.sortBy}
                        onChange={(e) => onFilterChange({sortBy: e.value})}
                        placeholder="Сортировка"
                        className="filter-dropdown"
                    />
                </div>

                <div className="filter-group reset-group">
                    <Button
                        label="Сбросить"
                        icon="pi pi-refresh"
                        className="p-button-outlined p-button-sm"
                        onClick={onResetFilters}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProductFilter;