import React from 'react';
import style from './DynamicForm.css';

function DynamicForm({ fields, buttonText, onSubmit }) {
    const [formData, setFormData] = React.useState({});

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    return (
        <form onSubmit={onSubmit}>
            {fields.map((field, index) => (
                <div key={index} className="form-group">
                    <label htmlFor={field.name}>{field.label}</label>
                    <input
                        className="form-control"
                        type={field.type}
                        name={field.name}
                        placeholder={field.placeholder}
                        required={field.required}
                    />
                </div>
            ))}
            <button className="btn btn-primary" type="submit">
                {buttonText}
            </button>
        </form>
    );
}

export default DynamicForm;