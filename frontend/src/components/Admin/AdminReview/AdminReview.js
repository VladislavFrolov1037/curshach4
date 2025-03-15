import React from 'react';
import { Link } from 'react-router-dom';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

const AdminReview = ({ feedback, product, handleAddReactionForReview }) => {
    return (
        <div className="card shadow-sm p-3 mb-3">
            <div className="d-flex">
                <img
                    src={`${process.env.REACT_APP_API_BASE_URL}/${product?.images?.[0]?.url || "default-image.png"}`}
                    alt="Product"
                    className="rounded"
                    width="60"
                    height="70"
                />

                <div className="ms-3 flex-grow-1">
                    <div className="d-flex align-items-center">
                        <div className="me-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    className={star <= feedback.rating ? "text-warning fs-5" : "text-secondary fs-5"}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                        <small className="text-muted">{feedback.createdAt.date.split(' ')[0]}</small>
                    </div>

                    <Link
                        to={`/product/${product.id}`}
                        className="h6 fw-bold text-primary text-decoration-none d-block mt-1"
                        style={{ cursor: 'pointer' }}
                    >
                        {product.name}
                    </Link>

                    <p className="mt-2 mb-1">{feedback.comment}</p>

                    <div className="d-flex align-items-center mt-3">
                        <button
                            className={`btn btn-sm ${feedback.userReaction === 'like' ? 'btn-primary' : 'btn-outline-primary'} me-2`}
                        >
                            <ThumbsUp size={16} className="me-1" /> {feedback.likes}
                        </button>
                        <button
                            className={`btn btn-sm ${feedback.userReaction === 'dislike' ? 'btn-danger' : 'btn-outline-danger'}`}
                        >
                            <ThumbsDown size={16} className="me-1" /> {feedback.dislikes}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminReview;
