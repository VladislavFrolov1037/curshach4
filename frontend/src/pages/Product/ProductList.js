import React, { useState, useEffect } from 'react';
import Card from "../../components/Card/Card";
import {Link} from "react-router-dom";
import Loader from "../../components/Loader";
import {getProducts} from "../../services/product";
import axios from "axios";
import {getCart} from "../../services/cart";

function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeMenuRef, setActiveMenuRef] = useState(null);
    const [cartItems, setCartItems] = useState([]);

    const fetchCartItems = async () => {
        const response = await getCart();

        setCartItems(response.cartItems);
    }

    const fetchProducts = async () => {
        setProducts(await getProducts());
    }

    useEffect(() => {
        fetchProducts();
        fetchCartItems();

        setLoading(false);
    }, []);

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="container py-5">
                <div className="row row-cols-5 g-5">
                    {products.map((product) => (
                        <div className="col" key={product.id}>
                            <Card
                                cartItems={cartItems}
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
