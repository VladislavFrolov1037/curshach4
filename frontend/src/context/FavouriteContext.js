import React, {createContext, useEffect, useState} from "react";
import {addFavorite, getFavorites, removeFavorite} from "../services/favorite";

const FavoriteContext = createContext(null);

export const FavoriteProvider = ({children}) => {
    const [favorites, setFavorites] = useState([]);

    const getFavoritesItems = async () => {
        const favoritesList = await getFavorites();

        setFavorites(favoritesList);
    };

    useEffect(() => {
        getFavoritesItems();
    }, []);

    const addFavoriteItem = async (id) => {
        setFavorites((prev) => [...prev, {product_id: id}]);

        await addFavorite(id);
    };

    const removeFavoriteItem = async (id) => {
        setFavorites((prev) => prev.filter((item) => item.product_id !== id));

        await removeFavorite(id);
    };

    return (
        <FavoriteContext.Provider value={{favorites, addFavoriteItem, removeFavoriteItem}}>
            {children}
        </FavoriteContext.Provider>
    );
};

export default FavoriteContext;
