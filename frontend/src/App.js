import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import AppRoutes from './Routes';
import {AuthProvider} from './context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import {CartProvider} from "./context/CartContext";

function App() {
    return (
        <Router>
            <AuthProvider>
                <CartProvider>
                    <div className="App">
                        <Header/>
                        <AppRoutes/>
                        <Footer/>
                    </div>
                </CartProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
