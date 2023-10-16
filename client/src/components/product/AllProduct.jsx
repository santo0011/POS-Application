import React, { useEffect, useState } from 'react';
import Layout from '../layout/Layout';
import "./product.scss";
import { Link, useNavigate } from 'react-router-dom';
import EditCalendarOutlinedIcon from '@mui/icons-material/EditCalendarOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { get_products } from '../../store/Reducers/productAddReducer';
import Pagination from '../Pagination';
import { base_url } from '../../api/api';
import { add_to_cart, messageClear } from '../../store/Reducers/cartReducer';
import toast from "react-hot-toast";



const AllProduct = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { allProduct, productCount } = useSelector(state => state.product);
    const { userInfo } = useSelector(state => state.auth);
    const { loader, errorMessage, successMessage } = useSelector(state => state.cart);


    const [searchValue, setSearchValue] = useState('');
    const [currentPage, setCurrentPage] = useState(1)
    const [parPage, setParPage] = useState(6)


    // add_to_cart
    const add_cart_product = (id) => {
        if (userInfo) {
            dispatch(add_to_cart({
                userId: userInfo.id,
                quantity: 1,
                productId: id
            }))
        } else {
            navigate('/login')
        }

    }

    useEffect(() => {

        if (errorMessage) {
            toast.error(errorMessage)
            dispatch(messageClear())
        }
        if (successMessage) {
            toast.success(successMessage)
            dispatch(messageClear())
        }

    }, [successMessage, errorMessage])




    useEffect(() => {
        const obj = {
            parPage: parseInt(parPage),
            page: parseInt(currentPage),
            searchValue
        }
        dispatch(get_products(obj))
    }, [searchValue, currentPage, parPage])

    return (
        <Layout>
            <div className='m-3'>
                <div className='d-flex align-items-center py-2 px-4' style={{ backgroundColor: "#fff", justifyContent: 'space-between' }}>
                    <h5 className="">All Products ({productCount && productCount})</h5>
                    <input className='productSearch' value={searchValue} onChange={(e) => setSearchValue(e.target.value)} type="text" placeholder='Search' />

                    <div>
                        <Link to='/add-product' className='btn btn-dark'>Add Product</Link>
                    </div>

                </div>

                <div style={{ backgroundColor: "#fff" }} className='mt-4'>

                    <table class="table" style={{ textAlign: "center" }}>
                        <thead>
                            <tr className=''>
                                <th scope="col">No</th>
                                <th style={{ textAlign: 'left' }} scope="col">Product</th>
                                <th style={{ textAlign: 'left' }} scope="col">Image</th>
                                <th style={{ textAlign: 'left' }} scope="col">Price</th>
                                <th scope="col">Cart</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>

                            {
                                allProduct && allProduct?.map((p, i) => (
                                    <tr>
                                        <th scope="row">{i + 1 + (currentPage - 1) * parPage}</th>
                                        <th style={{ textAlign: 'left' }}   >{p.product}</th>
                                        <th style={{ textAlign: 'left' }}>
                                            <img className='productImgStyle' src={`${base_url}/uploads/productImg/${p?.productImage}`} alt="img" />
                                        </th>
                                        <th style={{ textAlign: 'left' }}>₹ {p.price}</th>
                                        <th>
                                            <span title='cart' onClick={() => add_cart_product(p._id)}>
                                                <AiOutlineShoppingCart style={{ color: "blue", fontSize: "22px" }} />
                                            </span>
                                        </th>
                                        <th>
                                            <span title='edit'>
                                                <EditCalendarOutlinedIcon style={{ color: "green", fontSize: "22px", cursor: 'pointer', marginRight: "6px" }} />
                                            </span>
                                            <span title='delete'>
                                                <DeleteOutlineOutlinedIcon style={{ color: "red", fontSize: "24px", cursor: 'pointer', marginLeft: "6px" }} />
                                            </span>
                                        </th>
                                    </tr>
                                ))
                            }

                        </tbody>

                    </table>


                </div>
                {
                    productCount >= parPage ?
                        <Pagination
                            pageNumber={currentPage}
                            setPageNumber={setCurrentPage}
                            totalItem={productCount}
                            parPage={parPage}
                            showItem={Math.floor(productCount / parPage)}
                        /> : ''
                }

            </div>

        </Layout>
    )
}


export default AllProduct;