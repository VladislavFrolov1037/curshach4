import React, {useContext, useState} from 'react';
import AuthContext from '../../context/AuthContext';

const Login = () => {
    const {login} = useContext(AuthContext);
    const [credentials, setCredentials] = useState({email: '', password: ''});

    const handleChange = (e) => {
        const {name, value} = e.target;
        setCredentials((prev) => ({...prev, [name]: value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(credentials);
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>Email</label>
            <input type="email" name="email" value={credentials.email} onChange={handleChange} required/>
            <label>Password</label>
            <input type="password" name="password" value={credentials.password} onChange={handleChange} required/>
            <button type="submit">Login</button>
        </form>
    );
};

export default Login;
