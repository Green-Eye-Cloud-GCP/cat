import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Navigation from './components/Navigation';
import Home from './components/Home';
import New from './components/New';
import Edit from './components/Edit';

const App = () => {
    return (
        <BrowserRouter>
            <Navigation />
            <Routes>
                <Route path='/new' element={<New />} />
                <Route path='/view/:id' element={<New />} />
                <Route path='/edit/:id' element={<Edit />} />
                <Route path='*' element={<Home />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App;