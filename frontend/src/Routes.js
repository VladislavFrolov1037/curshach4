import React from 'react';
import {Route, Routes} from 'react-router-dom';
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
import Forbidden from "./pages/Exception/Forbidden";
import NotFound from "./pages/Exception/NotFound";
import Cart from "./pages/Cart/Cart";
import Favorite from "./pages/Favorite/Favorite";
import Orders from "./pages/Order/Order";
import OrderDetails from "./pages/Order/OrderDetails";
import AdminDashboard from "./pages/Admin/AdminDashboard/AdminDashboard";
import AdminOrder from "./pages/Admin/AdminOrder/AdminOrder";
import AdminSeller from "./pages/Admin/AdminSeller/AdminSeller";
import PurchaseProducts from "./pages/Product/PurchaseProducts";
import AdminUser from "./pages/Admin/AdminUser/AdminUser";
import AdminStatistic from "./pages/Admin/AdminStatistic/AdminStatistic";
import AdminToken from "./pages/Admin/AdminToken/AdminToken";
import UserProfile from "./pages/Profile/UserProfile";
import SellerProfile from "./pages/Seller/SellerProfile";
import AdminPromoCode from "./pages/Admin/AdminPromocode/AdminPromoCode";
import UserViewed from "./pages/Profile/UserViewed";
import AdminReview from "./pages/Admin/AdminReview/AdminReview";
import SearchResults from "./pages/Product/SearchResults";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<ProductList/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/profile" element={<Profile/>}/>
            <Route path="/become-seller" element={<CreateSeller/>}/>
            <Route path="/seller" element={<Seller/>}/>
            <Route path="/my-products" element={<MyProducts/>}/>
            <Route path="/product/:id" element={<ProductDetails/>}/>
            <Route path="/create-product" element={<CreateProduct/>}/>
            <Route path="/products/:categoryId" element={<ProductsPage/>}/>
            <Route path="/cart" element={<Cart/>}/>
            <Route path="/purchase-products" element={<PurchaseProducts/>}/>
            <Route path="/viewed-products" element={<UserViewed/>}/>
            <Route path="/favorites" element={<Favorite/>}/>
            <Route path="/orders" element={<Orders/>}/>
            <Route path="/orders/:orderId" element={<OrderDetails/>}/>
            <Route path="/user/:userId" element={<UserProfile/>}/>
            <Route path="/seller/:sellerId" element={<SellerProfile/>}/>
            <Route path="/search" element={<SearchResults />} />
            {/*  For admins  */}
            <Route path="/admin" element={<AdminDashboard/>}/>
            <Route path="/admin/orders" element={<AdminOrder/>}/>
            <Route path="/admin/reviews" element={<AdminReview/>}/>
            <Route path="/admin/sellers" element={<AdminSeller/>}/>
            <Route path="/admin/users" element={<AdminUser/>}/>
            <Route path="/admin/statistics" element={<AdminStatistic/>}/>
            <Route path="/admin/tokens" element={<AdminToken/>}/>
            <Route path="/admin/user/:userId" element={<UserProfile/>}/>
            <Route path="/admin/seller/:sellerId" element={<SellerProfile/>}/>
            <Route path="/admin/tg/promoCodes" element={<AdminPromoCode/>}/>

            {/* Exceptions */}
            <Route path="/forbidden" element={<Forbidden/>}/>
            <Route path="/not-found" element={<NotFound/>}/>
        </Routes>
    );
}

export default AppRoutes;