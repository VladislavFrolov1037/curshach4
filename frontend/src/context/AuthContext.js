import React, {createContext, useEffect, useState} from 'react';
import {getProfile, loginUser, registerUser} from '../services/auth';
import {useNavigate} from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(() => {
        if (localStorage.getItem("token"))
            return JSON.parse(localStorage.getItem("user")) || null;
    });
    const [loading, setLoading] = useState(true);
    const navigator = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            if (localStorage.getItem("token")) {
                try {
                    const profile = await getProfile();
                    setUser(profile);
                    localStorage.setItem("user", JSON.stringify(profile));
                } catch (error) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    setUser(null);
                }
            }
            setLoading(false);
        };

        fetchProfile();
    }, []);

    const login = async (credentials) => {
        await loginUser(credentials);
        const userProfile = await getProfile();
        setUser(userProfile);
        localStorage.setItem("user", JSON.stringify(userProfile));
    };

    const register = async (data) => {
        await registerUser(data);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigator("/login");
    };

    const updateUser = (newUser) => {
        setUser((prevUser) => {
            const updatedUser = {...prevUser, ...newUser};
            localStorage.setItem("user", JSON.stringify(updatedUser));
            return updatedUser;
        });
    };

    return (
        <AuthContext.Provider value={{user, loading, login, register, logout, updateUser}}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
