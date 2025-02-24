import React, {useEffect, useState} from 'react';
import Card from "../../components/Card/Card";
import Loader from "../../components/Loader";
import {getProducts} from "../../services/product";

function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeMenuRef, setActiveMenuRef] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            setProducts(await getProducts());

            setLoading(false);
        }

        fetchProducts();
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
