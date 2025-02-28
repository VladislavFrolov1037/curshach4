import React, { useEffect, useState } from 'react';
import { deleteProduct, getSellerProducts, hideProduct } from '../../services/product';
import { Link, useNavigate } from 'react-router-dom';
import './MyProducts.css';
import Card from "../../components/Card/Card";
import Loader from "../../components/Loader";
import { getCart } from "../../services/cart";

const MyProducts = () => {
    const [productList, setProductList] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeMenuRef, setActiveMenuRef] = useState(null);

    const getProductList = async () => {
        return await getSellerProducts();
    };

    useEffect(() => {
        const fetchData = async () => {
            const data = await getProductList();
            setProductList(data);
            setLoading(false);
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchCart = async () => {
            const cart = await getCart();
            setCartItems(cart.cartItems);
        };
        fetchCart();
    }, []);

    const handleHideProduct = async (productId) => {
        await hideProduct(productId);
        setProductList(prevList =>
            prevList.map(product =>
                product.id === productId
                    ? {
                        ...product,
                        status: product.status === "available" ? "discontinued" : "available",
                    }
                    : product
            )
        );
    };

    const handleDeleteProduct = async (productId) => {
        await deleteProduct(productId);
        setProductList(prevList => prevList.filter(product => product.id !== productId));
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="container py-5">
            {productList && productList.length > 0 ? (
                <div className="row row-cols-5 g-5">
                    {productList.map((product) => (
                        <div className="col" key={product.id}>
                            <Card
                                product={product}
                                cartItems={cartItems}
                                activeMenuRef={activeMenuRef}
                                setActiveMenuRef={setActiveMenuRef}
                                handleHideProduct={handleHideProduct}
                                handleDeleteProduct={handleDeleteProduct}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="mt-5 text-center">
                    <p>У вас ещё нет товаров. Создайте свой первый товар!</p>
                    <Link to="/create-product" className="btn btn-success">
                        Создать товар
                    </Link>
                </div>
            )}
        </div>
    );
};

export default MyProducts;
