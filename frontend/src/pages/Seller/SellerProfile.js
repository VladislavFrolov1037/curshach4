import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { FiShoppingBag } from "react-icons/fi";
import { MdDateRange } from "react-icons/md";
import {getSellerProfile} from "../../services/seller";
import Loader from "../../components/Loader";
import Card from "../../components/Card/Card";

const SellerProfile = () => {
    const { sellerId } = useParams();
    const [seller, setSeller] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeMenuRef, setActiveMenuRef] = useState(false);

    useEffect(() => {
        const fetchSellerData = async () => {
            const seller = await getSellerProfile(sellerId);
            setSeller(seller);

            setLoading(false);
        };

        fetchSellerData();
    }, [sellerId]);

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="container mt-4">
            <div className="seller-profile d-flex align-items-center p-3 border rounded shadow-sm bg-white">
                <img
                    src={`${process.env.REACT_APP_API_BASE_URL}/${seller.image}`}
                    alt={seller.name}
                    className="rounded-circle me-3"
                    style={{ width: 80, height: 80 }}
                />
                <div>
                    <h5 className="mb-1">{seller.name}</h5>
                    <div className="d-flex align-items-center text-muted">
                        <FaStar className="text-warning me-1" /> {parseFloat(seller.rating.rating).toFixed(1)}
                        <span className="mx-2">•</span> {seller.rating.count} отзывов
                        <span className="mx-2">•</span> <FiShoppingBag className="mx-1" /> {seller.salesCount} продаж
                        <span className="mx-2">•</span> <MdDateRange className="mx-1" /> На маркетплейсе {seller.yearsOnPlatform}
                    </div>
                </div>
            </div>

            <h4 className="mt-4">Товары продавца</h4>
            <div className="row">
                {seller.products.length > 0 ? (
                    seller.products.map((product) => (
                        <div key={product.id} className="col-md-3">
                            <Card
                                product={product}
                                activeMenuRef={activeMenuRef}
                                setActiveMenuRef={setActiveMenuRef}
                            />
                        </div>
                    ))
                ) : (
                    <p>Нет товаров</p>
                )}
            </div>
        </div>
    );
};

export default SellerProfile;
