import React, { useEffect, useState } from 'react';
import { getSellerProducts } from '../../services/product';
import { useNavigate } from 'react-router-dom';
import './MyProducts.css';
import Card from "../../components/Card/Card";
import Loader from "../../components/Loader";

const MyProducts = ({ products }) => {
    const [productList, setProductList] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const getProductList = async () => {
        return await getSellerProducts();
    }

    useEffect(() => {
        const fetchData = async () => {
            const data = await getProductList();

            setProductList(data);

            setLoading(false);
        };
        fetchData();
    }, []);

    const handleAddToCart = (productId) => {
        console.log(`Товар с id ${productId} добавлен в корзину`);
    };

    if(loading) {
        return (
            <Loader/>
        )
    }

    return (
        <div className="container py-5">
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                {productList.map((product) => (
                    <Card product={product} key={product.id} />
                ))}
            </div>
        </div>
    );
};

export default MyProducts;
