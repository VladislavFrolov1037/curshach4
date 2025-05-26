import React from 'react';
import { Button } from 'primereact/button';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className="pagination-container">
            <Button
                icon="pi pi-angle-double-left"
                className="p-button-rounded p-button-text"
                disabled={currentPage === 1}
                onClick={() => onPageChange(1)}
                tooltip="Первая страница"
            />
            <Button
                icon="pi pi-angle-left"
                className="p-button-rounded p-button-text"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                tooltip="Предыдущая страница"
            />

            {pageNumbers[0] > 1 && <span className="pagination-ellipsis">...</span>}

            {pageNumbers.map(number => (
                <Button
                    key={number}
                    className={`p-button-rounded ${currentPage === number ? 'p-button-primary' : 'p-button-text'}`}
                    onClick={() => onPageChange(number)}
                >
                    {number}
                </Button>
            ))}

            {pageNumbers[pageNumbers.length - 1] < totalPages && <span className="pagination-ellipsis">...</span>}

            <Button
                icon="pi pi-angle-right"
                className="p-button-rounded p-button-text"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                tooltip="Следующая страница"
            />
            <Button
                icon="pi pi-angle-double-right"
                className="p-button-rounded p-button-text"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(totalPages)}
                tooltip="Последняя страница"
            />
        </div>
    );
};

export default Pagination;