import React, {useEffect, useState} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import {FaStar} from "react-icons/fa";

const RateProductModal = ({show, handleClose, product, onSubmit}) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [image, setImage] = useState(null);

    useEffect(() => {
        if (!show) {
            setRating(0);
            setComment("");
            setImage(null);
        }
    }, [show]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        console.log(file)
        if (file) {
            setImage(file);
        }
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append("rating", rating);
        formData.append("comment", comment);
        formData.append("productId", product.id);

        if (image) {
            formData.append("image", image);
        }

        await onSubmit(formData, product);
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Оставить отзыв</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex align-items-center mb-3">
                    <img
                        src={`${process.env.REACT_APP_API_BASE_URL}/${product.images?.[0]?.url || "default-image.png"}`}
                        alt={product.name}
                        className="me-3"
                        style={{width: 50, height: 50, objectFit: "cover", borderRadius: 5}}
                    />
                    <h5 className="mb-0">{product.name}</h5>
                </div>

                <Form.Group className="mb-3">
                    <Form.Label>Оценка:</Form.Label>
                    <div>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                                key={star}
                                onClick={() => setRating(star)}
                                color={star <= rating ? "#ffc107" : "#e4e5e9"}
                                size={30}
                                className="me-1"
                                style={{cursor: "pointer"}}
                            />
                        ))}
                    </div>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Комментарий:</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Введите ваш отзыв..."
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Добавить фото:</Form.Label>
                    <Form.Control type="file" accept="image/*" onChange={handleFileChange}/>
                    {image && (
                        <div className="mt-2">
                            <img
                                src={URL.createObjectURL(image)}
                                alt="preview"
                                style={{width: 80, height: 80, objectFit: "cover", borderRadius: 5}}
                            />
                        </div>
                    )}
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleSubmit} disabled={rating === 0}>
                    Отправить отзыв
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default RateProductModal;
