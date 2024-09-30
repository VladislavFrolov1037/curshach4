import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
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
