import React, { useEffect, useState } from 'react';
import { getSellerProducts } from '../../services/product';
import { useProductActions } from '../../hooks/useProductActions';
import Card from "../../components/Card/Card";
import Loader from "../../components/Loader";
import { getCart } from "../../services/cart";
import { Link } from 'react-router-dom';
import './MyProducts.css';

const MyProducts = () => {
    const [productList, setProductList] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { handleDeleteProduct, handleHideProduct } = useProductActions();
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

    const handleDelete = (productId) => {
        handleDeleteProduct(productId, setProductList);
    };

    const handleHide = (productId) => {
        handleHideProduct(productId, setProductList);
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
                                handleHideProduct={handleHide}
                                handleDeleteProduct={handleDelete}
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
