import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import AppRoutes from './Routes';
import { AuthProvider } from './context/AuthContext';  // Импортируйте ваш AuthProvider
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    return (
        <Router>
            <AuthProvider> {/* Оберните в AuthProvider */}
                <div className="App">
                    <Header />
                    <AppRoutes />
                    <Footer />
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;
