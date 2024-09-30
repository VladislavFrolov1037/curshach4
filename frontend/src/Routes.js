import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Registration from "./pages/Registration";
import Authorization from "./pages/Authorization";

function AppRoutes() {
    return (
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/registration" element={<Registration />} />
                <Route path="/login" element={<Authorization />} />
            </Routes>
    );
}

export default AppRoutes;