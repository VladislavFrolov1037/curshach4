import axios from '../services/axiosInstance';

export const createReview = async (formData) => {
    const response = await axios.post("/review", formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;
}