import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getFavorites } from "../../services/favorite";
import Loader from "../../components/Loader";
import Card from "../../components/Card/Card";

const Favorite = () => {
    const [activeMenuRef, setActiveMenuRef] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortOption, setSortOption] = useState("date_desc");
    const navigate = useNavigate();
    const location = useLocation();

    const fetchProducts = async (sortOption) => {
        try {
            setLoading(true);
            const response = await getFavorites(sortOption);
            const products = response.map(favorite => favorite.product);
            setFavorites(products);
        } catch (error) {
            console.error("Error fetching favorites:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSort = (option) => {
        setSortOption(option);
        navigate(`?sort=${option}`);
    };

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const sort = queryParams.get("sort") || "date_desc";
        setSortOption(sort);
        fetchProducts(sort);
    }, [location.search]);

    const handleRemoveFavorite = (productId) => {
        setFavorites(favorites.filter(fav => fav.id !== productId));
    };

    if (loading) {
        return <Loader />;
    }
    // TODO  2. Реализовать заказ... 3. Реализовать админу действия такие как подтвердить/отклонить заявку на регистрацию продавца + изменения статусов заказа. 4. OPTIONAL сделать отзывы + комментарии к отзывам

    return (
        <div className="container py-5">
            <h2 className="text-center mb-4">Избранные товары</h2>
            <div className="d-flex justify-content-between mb-3">
                <label htmlFor="sort" className="form-label me-2">Сортировать по:</label>
                <select
                    id="sort"
                    className="form-select w-auto"
                    value={sortOption}
                    onChange={(e) => handleSort(e.target.value)}
                >
                    <option value="date_desc">Дате добавления ↓</option>
                    <option value="date_asc">Дате добавления ↑</option>
                    <option value="price_asc">По возрастанию цены</option>
                    <option value="price_desc">По убыванию цены</option>
                </select>
            </div>
            <div className="row row-cols-1 row-cols-md-3 row-cols-lg-5 g-4">
                {favorites.map((product) => (
                    <div className="col" key={product.id}>
                        <Card
                            product={product}
                            activeMenuRef={activeMenuRef}
                            setActiveMenuRef={setActiveMenuRef}
                            handleRemoveFavorite={handleRemoveFavorite}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Favorite;
