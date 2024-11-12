import React, { createContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getProfile } from '../services/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            const profile = await getProfile();
            setUser(profile);
            setLoading(false);
        };
        fetchProfile();
    }, []);

    const login = async (credentials) => {
        const userData = await loginUser(credentials);
        setUser(userData);
    };

    const register = async (data) => {
        const userData = await registerUser(data);
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token'); // Очищаем токен при выходе
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
