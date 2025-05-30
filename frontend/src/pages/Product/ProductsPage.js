import { useParams } from 'react-router-dom';
import Card from "../../components/Card/Card";
import React, { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import { getProductsByCategory } from "../../services/product";

const ProductsPage = () => {
    const { categoryId } = useParams();
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [activeMenuRef, setActiveMenuRef] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const fetchedProducts = await getProductsByCategory(categoryId);
                setProducts(fetchedProducts);
            } catch (error) {
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [categoryId]);

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="container py-5">
            <div className="row g-3">
                {products.map((product) => (
                    <div key={product.id} className="col-12 col-sm-6 col-lg-4">
                        <Card
                            product={product}
                            activeMenuRef={activeMenuRef}
                            setActiveMenuRef={setActiveMenuRef}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductsPage;
