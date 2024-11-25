import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Profile from "./pages/Profile/Profile";
import CreateSeller from "./pages/Seller/CreateSeller";
import Seller from "./pages/Seller/Seller";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/become-seller" element={<CreateSeller />} />
            <Route path="/seller" element={<Seller />} />
        </Routes>
    );
}

export default AppRoutes;