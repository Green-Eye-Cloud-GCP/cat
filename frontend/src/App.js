import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Navigation from './components/Navigation';
import Home from './components/Home';
import Nuevo from './components/Nuevo';

const App = () => {
    return (
        <BrowserRouter>
            <Navigation />
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/nuevo' element={<Nuevo />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App;