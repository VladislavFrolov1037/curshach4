import React from 'react';
import axios from 'axios'
import {BrowserRouter as Router} from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import AppRoutes from './Routes';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    return (
        <Router>
            <div className="App">
                <Header/>
                <AppRoutes/>
                <Footer/>
            </div>
        </Router>
    );
}

export default App;
