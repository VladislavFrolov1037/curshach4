import Card from "../../components/Card/Card";
import React, { useContext, useEffect, useState } from "react";
import Loader from "../../components/Loader";
import { getPurchasedUserProducts } from "../../services/product";
import AuthContext from "../../context/AuthContext";

const PurchaseProducts = () => {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [activeMenuRef, setActiveMenuRef] = useState(null);
    const { user } = useContext(AuthContext);
    const [filters, setFilters] = useState({ status: "all", minPrice: "", maxPrice: "" });

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            const productsData = await getPurchasedUserProducts();
            setProducts(productsData);
            setFilteredProducts(productsData);
            setLoading(false);
        };
        fetchProducts();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    useEffect(() => {
        let filtered = products.filter(product => {
            return (filters.status === "all" || product.status === filters.status) &&
                (!filters.minPrice || product.price >= parseFloat(filters.minPrice)) &&
                (!filters.maxPrice || product.price <= parseFloat(filters.maxPrice));
        });
        setFilteredProducts(filtered);
    }, [filters, products]);

    if (loading) return <Loader />;

    return (
        <div className="container py-5">
            <h2>Купленные товары</h2>

            <div className="row mb-4">
                <div className="col-md-4">
                    <label className="form-label">Статус</label>
                    <select className="form-select" name="status" value={filters.status} onChange={handleFilterChange}>
                        <option value="all">Все</option>
                        <option value="paid">Оплачено</option>
                        <option value="delivered">Доставлено</option>
                    </select>
                </div>
                <div className="col-md-4">
                    <label className="form-label">Цена от</label>
                    <input type="number" className="form-control" name="minPrice" value={filters.minPrice} onChange={handleFilterChange} />
                </div>
                <div className="col-md-4">
                    <label className="form-label">Цена до</label>
                    <input type="number" className="form-control" name="maxPrice" value={filters.maxPrice} onChange={handleFilterChange} />
                </div>
            </div>

            <div className="row g-3">
                {filteredProducts.map((product) => (
                    <div key={product.id} className="col-12 col-sm-6 col-lg-4">
                        <Card product={product} activeMenuRef={activeMenuRef} setActiveMenuRef={setActiveMenuRef} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PurchaseProducts;
