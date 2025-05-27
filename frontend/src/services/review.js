import axios from '../services/axiosInstance';

export const createReview = async (formData) => {
    const response = await axios.post("/review", formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;
}

export const addReactionForReview = async (feedback, data) => {
    const response = await axios.post(`/review/${feedback}`, {'type': data});

    return response.data;
}

export const replyToReview = async (feedback, data) => {
    const response = await axios.post(`/review/${feedback}/reply`, {'comment': data});

    return response.data;
}

export const deleteReview = async (id) => {
    await axios.delete(`/review/${id}`);
}

export const reportReview = async (id, data) => {
    await axios.post(`/review/${id}/report`, {'reason': data});
}

export const getReviewsWithReport = async () => {
    const response = await axios.get(`/review-reports`);

    return response.data;
}


export const approveReport = async (reportId) => {
    await axios.patch(`/review-reports/${reportId}/approve`);
};

export const rejectReport = async (reportId) => {
    await axios.patch(`/review-reports/${reportId}/reject`);
};