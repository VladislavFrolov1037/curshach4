import React, {useContext, useEffect, useRef, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import {addView, getProductDetails} from "../../services/product";
import Loader from "../../components/Loader";
import {SplitButton} from "primereact/splitbutton";
import {Toast} from "primereact/toast";
import "./ProductDetails.css";
import CartContext from "../../context/CartContext";
import FavoriteContext from "../../context/FavouriteContext";
import Review from "../../components/Review/Review";
import {addReactionForReview, deleteReview, reportReview} from "../../services/review";
import {FaStar} from "react-icons/fa";
import { Dialog } from 'primereact/dialog';

const ProductDetails = () => {
    const toast = useRef(null);
    const {id} = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImage, setCurrentImage] = useState("");
    const [activeTab, setActiveTab] = useState("description");
    const {user} = useContext(AuthContext);
    const {favorites, addFavoriteItem, removeFavoriteItem} = useContext(FavoriteContext);
    const {cartItems, addCart} = useContext(CartContext);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [feedbacks, setFeedbacks] = useState([]);
    const [complaintDialogVisible, setComplaintDialogVisible] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);

    const openComplaintDialog = (feedback) => {
        setSelectedReview(feedback);
        setComplaintDialogVisible(true);
    }

    const closeComplaintDialog = () => {
        setComplaintDialogVisible(false);
        setSelectedReview(null);
    }

    const fetchProductDetails = async () => {
        try {
            const response = await getProductDetails(id);

            setProduct(response);
            setCurrentImage(response.images?.[0]?.url || "");
            setFeedbacks(response.feedbacks);

            const updatedViewsCount = await addView(id);
            setProduct((prev) => ({
                ...prev,
                viewsCount: updatedViewsCount,
            }));

            setLoading(false);
        } catch (error) {
            console.error("Ошибка при получении данных о продукте:", error);
            setLoading(false);
        }
    };

    const isProductInCart = (productId) => {
        return cartItems.some((item) => item.product.id === productId);
    };

    useEffect(() => {
        fetchProductDetails();
    }, [favorites]);

    const handleImageClick = (imageUrl) => {
        setCurrentImage(imageUrl);
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    }

    const handleCartAction = async () => {
        if (product.status === 'discontinued' || product.status === 'removed') {
            toast.current.show({severity: 'error', summary: 'Товар недоступен', detail: 'Этот товар снят с продажи или удалён.', life: 3000});
            return;
        }

        setIsLoading(true);

        if (isProductInCart(product.id)) {
            navigate("/cart");
        } else {
            await addCart(product.id, toast);
        }

        setIsLoading(false);
    }

    const handleDeleteReview = async (id) => {
        try {
            setFeedbacks(feedbacks.filter((feedback) => feedback.id !== id ));

            await deleteReview(id);
        } catch (e) {
            console.error(e);
        }
    }

    const handleAddReactionForReview = async (feedback, type) => {
        setFeedbacks((prev) =>
            prev.map((fb) => {
                if (fb.id === feedback.id) {
                    let newReaction = fb.userReaction === type ? null : type;
                    let likes = fb.likes;
                    let dislikes = fb.dislikes;

                    if (fb.userReaction === "like") likes--;
                    if (fb.userReaction === "dislike") dislikes--;

                    if (newReaction === "like") likes++;
                    if (newReaction === "dislike") dislikes++;

                    return {...fb, userReaction: newReaction, likes, dislikes};
                }
                return fb;
            })
        );

        try {
            await addReactionForReview(feedback.id, type);
        } catch (error) {
            console.error("Ошибка при добавлении реакции:", error);
            toast.error("Ошибка при обновлении реакции!");
        }
    }

    if (loading) {
        return <Loader />;
    }

    if (!product) {
        return <div>Товар не найден или произошла ошибка загрузки.</div>;
    }

    const {
        name,
        description,
        price,
        images = [],
        product_attributes,
        category,
        seller,
        status,
    } = product;

    const isOwner = user?.id === seller?.userId;

    const handleAddToFavorites = async () => {
        toast.current.show({severity: "success", summary: "Добавлено в избранное"});
        await addFavoriteItem(product.id);
    }

    const handleRemoveFavorites = async () => {
        toast.current.show({severity: "info", summary: "Удалено из избранного"});
        await removeFavoriteItem(product.id);
    }

    const isFavorite = () => {
        return favorites && favorites.some((fav) => fav.product_id === product.id);
    };

    const handleReportReview = async (review) => {
        await reportReview(review, data)
    }

    const getMenuItems = () => [
        {
            label: isFavorite() ? "Удалить из избранного" : "Добавить в избранное",
            icon: "pi pi-heart",
            command: isFavorite() ? handleRemoveFavorites : handleAddToFavorites,
        },
        ...(isOwner
            ? [
                {
                    label: "Редактировать",
                    icon: "pi pi-pencil",
                    command: () => alert(`Редактирование товара ${product?.id}`),
                },
                {
                    label: status === "available" ? "Снять с продажи" : "Вернуть в продажу",
                    icon: "pi pi-eye-slash",
                    command: () =>
                        alert(
                            `Смена статуса товара: ${status === "available" ? "discontinued" : "available"}`
                        ),
                },
                {
                    label: "Удалить",
                    icon: "pi pi-trash",
                    command: () => alert(`Удаление товара ${product?.id}`),
                },
            ]
            : []),
    ];
    const items = [
        { label: "Редактировать", icon: "pi pi-pencil", command: () => alert("Редактирование") },
        { label: "Удалить", icon: "pi pi-trash", command: () => alert("Удаление") },
        { label: "Просмотр", icon: "pi pi-eye", command: () => alert("Просмотр") }
    ];
    return (
        <div className="product-details container">
            <Toast ref={toast}/>
            <div className="row">
                <div className="col-md-4">
                    <div className="image-container">
                        <img
                            src={`${process.env.REACT_APP_API_BASE_URL}/${currentImage}`}
                            alt={name}
                            className="main-image"
                        />
                        <div className="image-slider">
                            {images.map((img, index) => (
                                <img
                                    key={index}
                                    src={`${process.env.REACT_APP_API_BASE_URL}/${img.url}`}
                                    alt={`Thumbnail ${index}`}
                                    className={`thumbnail ${
                                        currentImage === img.url
                                            ? "active-thumbnail"
                                            : ""
                                    }`}
                                    onClick={() => handleImageClick(img.url)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <h1 style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                        {name}
                        <span style={{fontSize: "14px", color: "#777", display: "flex", alignItems: "center"}}>
                            <i className="pi pi-eye" style={{marginRight: "5px"}}></i>
                            {product.viewsCount}
                        </span>
                    </h1>

                    <p>Категория: {category.name}</p>
                    <p>Продавец: <Link to={`/seller/${seller.id}`}>{seller.name}</Link></p>

                    {status === "discontinued" && (
                        <div className="alert alert-warning mt-2">
                            Этот товар снят с продажи.
                        </div>
                    )}
                    {status === "removed" && (
                        <div className="alert alert-danger mt-2">
                            Этот товар временно удалён.
                        </div>
                    )}

                    <div className="d-flex align-items-center mb-5">
                        <FaStar className="text-warning" size={18}/>
                        <span className="ms-2 text-muted fw-semibold">
                            {(parseFloat(product.rating.rating) || 0).toFixed(1)}
                            <span className="mx-1 text-secondary">•</span>
                            <small className="text-muted">{(product.rating.count)} оценок</small>
                        </span>
                    </div>

                    <div className="product-attributes">
                        <h5>Характеристики:</h5>
                        <ul>
                            {product_attributes.map((attr, index) => (
                                <li key={index}>
                                    <strong>{attr.name}:</strong> {attr.value}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="col-md-4">
                    <p className="product-price">{`₽${parseFloat(price).toFixed(2)}`}</p>
                    <div className="actions d-flex justify-content-between">
                        <SplitButton
                            label={isLoading ? "Добавление в корзину" : isProductInCart(product.id) ? "Перейти в корзину" : "Добавить в корзину"}
                            icon="pi pi-shopping-cart"
                            className={`inline-flex items-center px-4 py-2 rounded-lg shadow-md transition ${
                                isProductInCart(product.id) ? "bg-gray-500 hover:bg-gray-600 text-white" : "bg-green-500 hover:bg-green-600 text-white"
                            }`}
                            onClick={handleCartAction}
                            model={getMenuItems()}
                            buttonClassName={product.status === 'discontinued' || product.status === 'removed' ? 'opacity-50 cursor-not-allowed' : ''}
                            pt={{
                                menu: { className: "bg-white border border-gray-300 rounded-lg shadow-lg mt-2" },
                                menulist: "space-y-2",
                                menubutton: { className: "block w-full text-left px-4 py-2 hover:bg-gray-100 rounded transition" }
                            }}
                        />

                    </div>
                </div>
            </div>
            <div className="tabs mt-5">
                <div className="tab-buttons">
                    <button
                        className={`tab-button ${
                            activeTab === "description" ? "active" : ""
                        }`}
                        onClick={() => handleTabChange("description")}
                    >
                        О товаре
                    </button>
                    <button
                        className={`tab-button ${
                            activeTab === "reviews" ? "active" : ""
                        }`}
                        onClick={() => handleTabChange("reviews")}
                    >
                        Отзывы
                    </button>
                </div>
                <div className="tab-content">
                    {activeTab === "description" && (
                        <div>
                            <h4>Описание</h4>
                            <p>{description}</p>
                        </div>
                    )}
                    {activeTab === "reviews" && (
                        <div>
                            <Dialog
                                visible={complaintDialogVisible}
                                style={{ width: '50vw' }}
                                header="Пожаловаться на отзыв"
                                onHide={closeComplaintDialog}
                            >
                                <div>
                                    {selectedReview && (
                                        <div>
                                            <h5>{selectedReview.user.name}</h5>
                                            <p>{selectedReview.comment}</p>
                                            <textarea
                                                placeholder="Введите описание жалобы"
                                                rows={5}
                                                className="form-control"
                                            />
                                            <div className="mt-3 text-end">
                                                <button className="btn btn-danger" onClick={handleReportReview(selectedReview)}>Отправить жалобу</button>
                                                <button className="btn btn-secondary ms-2" onClick={closeComplaintDialog}>Закрыть</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Dialog>

                            <h4>Отзывы</h4>
                            {feedbacks.map((feedback) => (
                                <Review
                                    key={feedback.id}
                                    feedback={feedback}
                                    handleAddReactionForReview={handleAddReactionForReview}
                                    handleDeleteReview={handleDeleteReview}
                                    product={product}
                                    openComplaintDialog={openComplaintDialog}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


export default ProductDetails;
