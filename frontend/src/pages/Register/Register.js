import React, { useContext, useState } from 'react';
import AuthContext from '../../context/AuthContext';

const Register = () => {
    const { register } = useContext(AuthContext);
    const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password === formData.confirmPassword) {
            await register(formData);
        } else {
            alert('Passwords do not match');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            <label>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
            <label>Confirm Password</label>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
            <button type="submit">Register</button>
        </form>
    );
};

export default Register;
