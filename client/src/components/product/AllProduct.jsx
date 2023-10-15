import React, { useState } from 'react';
import Layout from '../layout/Layout';
import "./product.scss";
import { Link } from 'react-router-dom';



const AllProduct = () => {

    const [searchValue, setSearchValue] = useState('');
    const [currentPage, setCurrentPage] = useState(1)
    const [parPage, setParPage] = useState(6)


    return (
        <Layout>
            <div className='m-3'>
                <div className='d-flex align-items-center py-2 px-4' style={{ backgroundColor: "#fff", justifyContent: 'space-between' }}>
                    <h5 className="">All Products (10)</h5>
                    <input className='productSearch' value={searchValue} onChange={(e) => setSearchValue(e.target.value)} type="text" placeholder='Search' />

                    <div>
                        <Link to='/add-product' className='btn btn-dark'>Add Product</Link>
                    </div>

                </div>

                <div style={{ backgroundColor: "#fff" }} className='mt-4'>


                </div>


            </div>

        </Layout>
    )
}


export default AllProduct;