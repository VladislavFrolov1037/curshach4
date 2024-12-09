import React, {useEffect, useState} from 'react';
import {Button} from 'primereact/button';
import {FaArrowLeft, FaChevronRight} from "react-icons/fa";
import {useNavigate} from 'react-router-dom';
import {getCategories} from '../../services/product';
import './Sidebar.css';

export default function SidebarMenu() {
    const [visibleLeft, setVisibleLeft] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [categoryStack, setCategoryStack] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data);
            } catch (error) {
                setCategories([]);
            }
        };

        fetchCategories();
    }, []);

    const handleSidebarClick = () => {
        setVisibleLeft(!visibleLeft);
    };

    const handleOverlayClick = () => {
        setVisibleLeft(false);
        setSelectedCategory(null);
        setSelectedSubcategory(null);
        setCategoryStack([]);
    };

    const openSubcategories = (category) => {
        if (category.subcategories && category.subcategories.length > 0) {
            setSelectedCategory(category);
            setSelectedSubcategory(null);
            setCategoryStack([category]);
        } else {
            setSelectedCategory(category);
            setSelectedSubcategory(null);
            setCategoryStack([category]);
            navigate(`/products/${category.id}`);
        }
    };

    const openSubcategoryDetails = (subcategory) => {
        if (subcategory.subcategories && subcategory.subcategories.length > 0) {
            setSelectedSubcategory(subcategory);
            setCategoryStack([...categoryStack, subcategory]);
        } else {
            navigate(`/products/${subcategory.id}`);
        }
    };

    const goBack = () => {
        const newStack = [...categoryStack];
        newStack.pop();
        setCategoryStack(newStack);

        const lastCategory = newStack[newStack.length - 1];
        if (lastCategory && lastCategory.subcategories) {
            setSelectedCategory(lastCategory);
            setSelectedSubcategory(null);
        } else {
            setSelectedCategory(null);
            setSelectedSubcategory(null);
        }
    };

    useEffect(() => {
        setVisibleLeft(false);
        setSelectedCategory(null);
        setSelectedSubcategory(null);
        setCategoryStack([]);
    }, [window.location.pathname]);

    const renderSubcategories = (items) => (
        <div className="sidebar-right">
            {categoryStack.length > 1 && (
                <div className="back-arrow" onClick={goBack}>
                    <FaArrowLeft/>
                    <span className="bold">{categoryStack[categoryStack.length - 1].name}</span>
                </div>
            )}
            {items.map((item, idx) => (
                <div
                    key={idx}
                    className="subcategory"
                    onClick={() => item.subcategories?.length > 0 ? openSubcategoryDetails(item) : navigate(`/products/${item.id}`)}
                >
                    {item.name}
                    {item.subcategories?.length > 0 && <FaChevronRight className="arrow"/>}
                </div>
            ))}
        </div>
    );

    return (
        <div className="sidebar-container">
            {visibleLeft && <div className="overlay" onClick={handleOverlayClick}></div>}

            <div className={`sidebar ${visibleLeft ? 'visible' : ''}`}>
                <h2 className="mb-5">Категории</h2>
                {categories.length > 0 ? (
                    categories.map((category, index) => (
                        <div key={index} className="category" onClick={() => openSubcategories(category)}>
                            <div className="category-title">
                                <i className={`fas ${category.icon}`}></i>
                                {category.name}
                                {category.subcategories?.length > 0 && <FaChevronRight className="arrow"/>}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-message">Загрузка...</div>
                )}
            </div>

            {categoryStack.length > 0 && (
                <div className="sidebar-right">
                    <h3>{categoryStack[categoryStack.length - 1].name}</h3>
                    {renderSubcategories(categoryStack[categoryStack.length - 1].subcategories || [])}
                </div>
            )}

            {selectedCategory && selectedCategory.subcategories && !selectedSubcategory && (
                <div className="sidebar-right">
                    <h3>{selectedCategory.name}</h3>
                    {renderSubcategories(selectedCategory.subcategories)}
                </div>
            )}

            {selectedSubcategory && selectedSubcategory.subcategories && (
                <div className="sidebar-right">
                    <h3>{selectedSubcategory.name}</h3>
                    {renderSubcategories(selectedSubcategory.subcategories)}
                </div>
            )}

            <Button
                icon="pi pi-bars"
                onClick={handleSidebarClick}
                className="p-button-rounded p-button-text p-button-sm"
                style={{backgroundColor: 'transparent', color: 'black'}}
            />
        </div>
    );
}
