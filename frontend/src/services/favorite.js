import axios from '../services/axiosInstance';

export const getFavorites = async () => {
    const response = await axios.get('/favorite');

    return response.data;
}
export const removeFavorite = async (id) => {
    const response = await axios.delete(`/favorite/product/${id}`);

    return response.data;
}
export const addFavorite = async (id) => {
    const response = await axios.post(`/favorite/product/${id}`);

    return response.data;
}