import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Profile from "./pages/Profile/Profile";
import CreateSeller from "./pages/Seller/CreateSeller";
import Seller from "./pages/Seller/Seller";
import MyProducts from "./pages/Product/MyProducts";
import ProductDetails from "./pages/Product/ProductDetails";
import CreateProduct from "./pages/Product/CreateProduct";
import ProductList from "./pages/Product/ProductList";
import ProductsPage from "./pages/Product/ProductsPage";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/become-seller" element={<CreateSeller />} />
            <Route path="/seller" element={<Seller />} />
            <Route path="/my-products" element={<MyProducts />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/create-product" element={<CreateProduct />} />
            <Route path="/products/:categoryId" element={<ProductsPage />} />
            {/*<Route path="/edit-product" element={<CreateProduct />} />*/}
        </Routes>
    );
}

export default AppRoutes;