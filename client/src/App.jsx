import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Products from './components/dashboard/Products';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import EmailVerify from './components/auth/EmailVerify';
import ProtectRoute from './components/auth/ProtectRoute';
import AddCategory from './components/dashboard/AddCategory';


const App = () => {
    return (
        <>
            <Routes>
                <Route path='/register' element={<Register />} />
                <Route path='/login' element={<Login />} />
                <Route path='/register/email-verify' element={<EmailVerify />} />

                <Route path='/' element={<ProtectRoute />} >
                    <Route path='' element={<Home />} />
                    <Route path='all-product' element={<Products />} />
                    <Route path='add-category' element={<AddCategory />} />
                    <Route path='edit-category/:cateSlug' element={<AddCategory />} />

                </Route>

            </Routes>

        </>
    )
}

export default App;