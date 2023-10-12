import React from 'react';
import "./layout.scss";
import Sidebar from '../sidebar/Sidebar';
import Navbar from '../navbar/Navbar';


const Layout = ({ children }) => {
    return (
        <div className="home">
            <Sidebar />
            <div className="homeContainer">
                <Navbar />
                {children}
            </div>
        </div>
    )
}

export default Layout;