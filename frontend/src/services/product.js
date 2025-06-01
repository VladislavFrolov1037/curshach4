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

export const getProducts = async (filters = {}) => {
    const response = await axios.get(`/products`, {
        params: filters
    });

    return response.data;
}

export const getPurchasedUserProducts = async (id) => {
    const response = await axios.get(`/purchase-products`);

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

export const getViewedProducts = async () => {
    const response = await axios.get(`/viewed`);

    return response.data;
}

export const createQuestion = async (productId, question) => {
    const response = await axios.post(`/product/${productId}/question`, {product_id: productId, question: question});

    return response.data;
};

export const answerQuestion = async (questionId, answer) => {
    const response = await axios.post(`/product/question/${questionId}/answer`, {answer});

    return response.data;
};

export const searchProducts = async (query) => {
    const response = await axios.get(`/product/search?text=${encodeURIComponent(query)}`);

    return response.data;
};