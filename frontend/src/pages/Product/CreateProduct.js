import React, {useEffect, useState} from "react";
import Loader from "../../components/Loader";
import {FileUpload} from "primereact/fileupload";
import {createProduct, getCategoriesWithFields, getCategoryAttributes} from "../../services/product";
import {useNavigate} from "react-router-dom";

const CreateProduct = () => {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({attributes: {}});
    const [categories, setCategories] = useState([]);
    const [attributes, setAttributes] = useState([]);
    const [files, setFiles] = useState([]);
    const navigate = useNavigate();

    const handleFileSelect = (event) => {
        setFiles(event.files);

        console.log(files)
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        const data = new FormData();

        // Добавление обычных полей
        Object.entries(formData).forEach(([key, value]) => {
            if (key !== "attributes" && value !== null && value !== undefined) {
                data.append(key, value);
            }
        });

        // Добавление атрибутов
        Object.entries(formData.attributes).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                // Используем точку, как в Postman (например, categoryAttributes[Модель])
                data.append(`categoryAttributes[${key}]`, value);
            }
        });

        files.forEach((file, index) => {
            data.append(`images[${index}]`, file);
        });

        console.log("FormData contents:");
        data.forEach((value, key) => {
            console.log(key, value);
        });

        try {
            const product = await createProduct(data);

            const id = product.id;

            navigate(`/product/${id}`)
        } catch (e) {
            setErrors(e.response?.data?.errors || {});
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchCategories = async () => {
            const fetchedCategories = await getCategoriesWithFields();
            setCategories(fetchedCategories);
        };
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    const handleCategoryChange = async (e) => {
        const selectedCategory = e.target.value;
        setFormData((prev) => ({...prev, categoryId: selectedCategory}));
        const fetchedAttributes = await getCategoryAttributes(selectedCategory);
        setAttributes(fetchedAttributes);
    };

    const handleAttributeChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({
            ...prev,
            attributes: {
                ...prev.attributes,
                [name]: value,
            },
        }));
    };


    if (loading) {
        return <Loader/>;
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h3 className="card-title text-center mb-4">Создание товара</h3>
                            <form onSubmit={handleSubmit} encType="multipart/form-data">
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">
                                        Название
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        className={`form-control ${errors.name ? "is-invalid" : ""}`}
                                        value={formData.name || ""}
                                        onChange={handleChange}
                                        required
                                    />
                                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">
                                        Описание
                                    </label>
                                    <textarea
                                        name="description"
                                        id="description"
                                        cols="30"
                                        rows="10"
                                        placeholder="Описание"
                                        className={`form-control ${errors.description ? "is-invalid" : ""}`}
                                        value={formData.description || ""}
                                        onChange={handleChange}
                                        required
                                    ></textarea>
                                    {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="price" className="form-label">
                                        Цена
                                    </label>
                                    <input
                                        name="price"
                                        id="price"
                                        placeholder="Цена"
                                        className={`form-control ${errors.price ? "is-invalid" : ""}`}
                                        value={formData.price || ""}
                                        onChange={handleChange}
                                        required
                                    />
                                    {errors.price && <div className="invalid-feedback">{errors.price}</div>}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="quantity" className="form-label">
                                        Количество
                                    </label>
                                    <input
                                        name="quantity"
                                        id="quantity"
                                        placeholder="Количество"
                                        className={`form-control ${errors.quantity ? "is-invalid" : ""}`}
                                        value={formData.quantity || ""}
                                        onChange={handleChange}
                                        required
                                    />
                                    {errors.quantity && <div className="invalid-feedback">{errors.quantity}</div>}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="categoryId" className="form-label">
                                        Категория
                                    </label>
                                    <select
                                        id="categoryId"
                                        name="categoryIdId"
                                        className={`form-control ${errors.categoryId ? "is-invalid" : ""}`}
                                        value={formData.categoryId || ""}
                                        onChange={handleCategoryChange}
                                        required
                                    >
                                        <option value="">Выберите категорию</option>
                                        {categories.map((categoryId) => (
                                            <option key={categoryId.id} value={categoryId.id}>
                                                {categoryId.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.categoryId && <div className="invalid-feedback">{errors.categoryId}</div>}
                                </div>

                                {attributes.map((attribute) => (
                                    <div className="mb-3" key={attribute.id}>
                                        <label htmlFor={attribute.key} className="form-label">
                                            {attribute.key}
                                        </label>
                                        <input
                                            type="text"
                                            id={attribute.key}
                                            name={attribute.key}
                                            className="form-control"
                                            value={formData.attributes?.[attribute.key] || ""}
                                            onChange={handleAttributeChange}
                                            required={attribute.isRequired}
                                        />
                                    </div>
                                ))}

                                <div className="mb-3">
                                    <label htmlFor="image" className="form-label">
                                        Изображения
                                    </label>
                                    <FileUpload
                                        name="images[]"
                                        multiple
                                        auto
                                        accept="image/*"
                                        maxFileSize={1000000}
                                        customUpload
                                        onSelect={handleFileSelect}
                                        chooseLabel="Выберите файлы"
                                        emptyTemplate={
                                            <p className="m-0">Перетащите файлы сюда для загрузки.</p>
                                        }
                                    />
                                    {errors.image && <div className="invalid-feedback">{errors.image}</div>}
                                </div>

                                <button type="submit" className="btn btn-primary w-100">
                                    Зарегистрировать
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateProduct;
