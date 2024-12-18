import React, {createContext, useEffect, useState} from 'react';
import {getProfile, loginUser, registerUser} from '../services/auth';
import {useNavigate} from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigator = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            if (localStorage.getItem('token')) {
                const profile = await getProfile();

                setUser(profile);

                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const login = async (credentials) => {
        await loginUser(credentials);

        const userProfile = await getProfile();

        setUser(userProfile);
    };

    const register = async (data) => {
        await registerUser(data);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
        navigator('/login');
    };

    const updateUser = (newUser) => {
        setUser((user) => ({...user, ...newUser}));
    }

    return (
        <AuthContext.Provider value={{user, loading, login, register, logout, updateUser}}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
