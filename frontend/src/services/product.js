import axios from '../services/axiosInstance';

export const getSellerProducts = async (id) => {
    const response = await axios.get(`/my-products/`);

    return response.data;
}

export const getProductDetails = async (id) => {
    const response = await axios.get(`/product/${id}`);

    return response.data;
}

export const createProduct = async (formData) => {
    const response = await axios.post("/products/create", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
};

export const getProducts = async () => {
    const response = await axios.get(`/products`, { requiresAuthRedirect: false });

    return response.data;
}

export const getCategoriesWithFields = async () => {
    const response = await axios.get(`/categories-with-fields`);

    return response.data;
}

export const getCategories = async () => {
    const response = await axios.get('/categories');

    return response.data;
}

export const getCategoryAttributes = async (id) => {
    const response = await axios.get(`/category/${id}`);

    return response.data;
}

export const hideProduct = async (id) => {
    const response = await axios.post(`/product/change/${id}`);

    return response.data;
}

export const deleteProduct = async (id) => {
    const response = await axios.delete(`/product/${id}`);

    return response.data;
}

export const updateProduct = async (id, formData) => {
    const response = await axios.put(`/product/${id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    })

    return response.data;
}

export const addView = async (id) => {
    const response = await axios.post(`/product/view/${id}`);

    return response.data.viewsCount;
}

export const getProductsByCategory = async (id) => {
    const response = await axios.get(`/products/category/${id}`);

    return response.data;
}

export const getViewedProducts = async() => {
    const response = await axios.get(`/viewed`);

    return response.data;
}