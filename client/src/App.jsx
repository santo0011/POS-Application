import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import EmailVerify from './components/auth/EmailVerify';
import ProtectRoute from './components/auth/ProtectRoute';
import AddCategory from './components/category/AddCategory';
import AddProduct from './components/product/AddProduct';
import AllProduct from './components/product/AllProduct';
import { useDispatch } from 'react-redux';
import Cart from './components/cart/Cart';
import Bill from './pages/Bill';
import Customer from './pages/Customer';


const App = () => {

    return (
        <>
            <Routes>
                <Route path='/register' element={<Register />} />
                <Route path='/login' element={<Login />} />
                <Route path='/register/email-verify' element={<EmailVerify />} />

                <Route path='/' element={<ProtectRoute />} >
                    <Route path='' element={<Home />} />
                    <Route path='add-category' element={<AddCategory />} />
                    <Route path='edit-category/:cateSlug' element={<AddCategory />} />
                    <Route path='all-product' element={<AllProduct />} />
                    <Route path='add-product' element={<AddProduct />} />
                    <Route path='cart-page' element={<Cart />} />

                    <Route path='bills' element={<Bill />} />
                    <Route path='customers' element={<Customer />} />

                </Route>

            </Routes>

        </>
    )
}

export default App;