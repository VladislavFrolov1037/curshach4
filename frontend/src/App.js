import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import AppRoutes from './Routes';
import {AuthProvider} from './context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import {CartProvider} from "./context/CartContext";
import {FavoriteProvider} from "./context/FavouriteContext";

function App() {
    return (
        <Router>
            <AuthProvider>
                <CartProvider>
                    <FavoriteProvider>
                        <div className="App">
                            <Header/>
                            <AppRoutes/>
                            <Footer/>
                        </div>
                    </FavoriteProvider>
                </CartProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
