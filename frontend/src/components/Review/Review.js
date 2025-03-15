import React, {useContext, useState} from 'react';
import {CornerDownRight, Flag, MessageSquare, MoreVertical, ThumbsDown, ThumbsUp} from 'lucide-react';
import AuthContext from "../../context/AuthContext";
import {replyToReview} from "../../services/review";
import {Link} from "react-router-dom";

export default function Review({
                                   feedback,
                                   handleAddReactionForReview,
                                   handleDeleteReview,
                                   product,
                                   openComplaintDialog
                               }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [replyOpen, setReplyOpen] = useState(false);
    const [replyText, setReplyText] = useState("");
    const {user} = useContext(AuthContext);

    const isSeller = user.id === product.seller.userId;

    const toggleMenu = () => setMenuOpen(!menuOpen);
    const toggleReply = () => setReplyOpen(!replyOpen);
    const handleReplyChange = (e) => setReplyText(e.target.value);

    const handleReplySubmit = async () => {
        const response = await replyToReview(feedback.id, replyText);

        const newReply = {
            id: response.id,
            user: {name: "Продавец"},
            text: replyText,
            createdAt: new Date().toLocaleDateString(),
        };

        feedback.replies.push(newReply);
        setReplyText("");
        setReplyOpen(false);
    };

    return (
        <div className="card shadow-sm mb-3">
            <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                    <img
                        src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp"
                        alt="Avatar"
                        className="rounded-circle me-3"
                    />
                    <div className="d-flex flex-column mb-3 p-3 rounded shadow-sm bg-light">
                        <div className="d-flex align-items-center mb-2">
                            <h5 className="mb-0 me-2">
                                <Link to={`/user/${feedback.user.id}`}>{feedback.user.name}</Link>
                            </h5>
                            {user.id === feedback.user.id && (
                                <span className="badge bg-primary text-white">Ваш отзыв</span>
                            )}
                        </div>
                        <small className="text-muted">{feedback.createdAt.date.split(' ')[0]}</small>
                    </div>
                </div>
                <div className="dropdown position-absolute top-0 end-0 m-2">
                    <button
                        onClick={toggleMenu}
                        className="btn btn-light dropdown-toggle"
                        type="button"
                    >
                        <MoreVertical size={20}/>
                    </button>
                    {menuOpen && (
                        <ul className="dropdown-menu dropdown-menu-end show">
                            <li>
                                <button
                                    onClick={() => openComplaintDialog(feedback)}
                                    className="dropdown-item text-danger"
                                >
                                    <Flag size={18} className="me-2"/> Пожаловаться
                                </button>
                            </li>
                            {user.id === feedback.user.id && (
                                <li>
                                    <button onClick={() => {
                                        handleDeleteReview(feedback.id)
                                    }} className="dropdown-item text-danger">
                                        <Flag size={18} className="me-2"/> Удалить отзыв
                                    </button>
                                </li>
                            )}
                        </ul>
                    )}
                </div>
                <div className="mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            className={star <= feedback.rating ? "text-warning fs-4" : "text-secondary fs-4"}
                        >
                            ★
                        </span>
                    ))}
                </div>

                <p className="mb-3">{feedback.comment}</p>

                {feedback.image && (
                    <div className="mb-3">
                        <img
                            src={`${process.env.REACT_APP_API_BASE_URL}/${feedback.image}`}
                            alt="Review"
                            className="img-fluid rounded"
                            width="200px"
                            height="200px"
                        />
                    </div>
                )}

                {feedback.replies && feedback.replies.length > 0 && (
                    <div className="mt-3">
                        {feedback.replies.map((reply) => (
                            <div key={reply.id} className="card shadow-sm mb-3">
                                <div className="card-body">
                                    <div className="d-flex align-items-center mb-3">
                                        <img
                                            src={`${process.env.REACT_APP_API_BASE_URL}/${product.seller.image}`}
                                            alt="Avatar"
                                            className="rounded-circle me-3"
                                            style={{width: 40, height: 40}}
                                        />
                                        <div className="d-flex flex-column">
                                            <div className="d-flex align-items-center mb-2">
                                                <h6 className="mb-0 me-2">{reply.user.name}</h6>
                                                {user.id === reply.user.id && (
                                                    <span className="badge bg-secondary text-white">Ваш ответ</span>
                                                )}
                                            </div>
                                            <small className="text-muted">
                                                {typeof reply.createdAt === 'string'
                                                    ? reply.createdAt.split(' ')[0]
                                                    : new Date(reply.createdAt).toLocaleDateString().split(' ')[0]}
                                            </small>
                                        </div>
                                    </div>
                                    <div className="mb-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <span
                                                key={star}
                                                className={star <= reply.rating ? "text-warning fs-4" : "text-secondary fs-4"}
                                            >
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                    <p className="mb-3">{reply.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="d-flex justify-content-between align-items-center">
                    <div className="btn-group" role="group">
                        <button onClick={() => handleAddReactionForReview(feedback, 'like')}
                                className={`btn ${feedback.userReaction === 'like' ? 'btn-primary' : 'btn-outline-primary'}`}
                        >
                            <ThumbsUp size={20} className="me-1"/> {feedback.likes}
                        </button>
                        <button onClick={() => handleAddReactionForReview(feedback, 'dislike')}
                                className={`btn ${feedback.userReaction === 'dislike' ? 'btn-danger' : 'btn-outline-danger'}`}
                        >
                            <ThumbsDown size={20} className="me-1"/> {feedback.dislikes}
                        </button>
                        {isSeller && (
                            <button className="btn btn-outline-success" onClick={toggleReply}>
                                <MessageSquare size={20} className="me-1"/> Ответить
                            </button>
                        )}
                    </div>
                </div>

                {replyOpen && isSeller && (
                    <div className="mt-3 ps-4 border-start">
                        <div className="d-flex align-items-center mb-2">
                            <CornerDownRight size={20} className="me-2 text-secondary"/>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Ваш ответ"
                                value={replyText}
                                onChange={handleReplyChange}
                            />
                            <button className="btn btn-primary ms-2" onClick={handleReplySubmit}>Отправить</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
