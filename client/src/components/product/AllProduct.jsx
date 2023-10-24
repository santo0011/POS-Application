import React, { useEffect, useState } from 'react';
import Layout from '../layout/Layout';
import "./product.scss";
import { Link, useNavigate } from 'react-router-dom';
import EditCalendarOutlinedIcon from '@mui/icons-material/EditCalendarOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { clearMessage, delete_product, get_products } from '../../store/Reducers/productAddReducer';
import Pagination from '../Pagination';
import { base_url } from '../../api/api';
import { add_to_cart, get_cart_products, messageClear } from '../../store/Reducers/cartReducer';
import toast from "react-hot-toast";
import { confirmMessagge } from '../../utils/aleartFunc';
import Select from 'react-select';



const AllProduct = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();


    const { userInfo } = useSelector(state => state.auth);
    const { allProduct, productCount, error, message } = useSelector(state => state.product);
    const { errorMessage, successMessage } = useSelector(state => state.cart);


    const [searchValue, setSearchValue] = useState('');
    const [currentPage, setCurrentPage] = useState(1)
    const [parPage, setParPage] = useState(6)
    const [findCate, setFindCate] = useState('')


    // for category
    const [selectedOption, setSelectedOption] = useState({ value: "", label: "Find by category" });
    const { allCategory } = useSelector(state => state.category);


    const { cart_products } = useSelector(state => state.cart);

    useEffect(() => {
        dispatch(get_cart_products(userInfo.id))
    }, []);


    // imageHandle
    const selectOption = (e) => {
        setFindCate(e.value)
    }

    useEffect(() => {
        if (allCategory) {
            const categoryOptions = allCategory.map((c) => ({
                value: c.categoryName,
                label: c.categoryName
            }));

            const defaultValue = {
                value: '',
                label: 'All'
            };

            const allOptions = [defaultValue, ...categoryOptions];
            setSelectedOption(allOptions);
        }
    }, [allCategory]);


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


    // delete_product
    const delete_product_func = async (id) => {
        const returnValue = await confirmMessagge();
        if (returnValue) {
            dispatch(delete_product(id))
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

        if (error) {
            toast.error(error)
            dispatch(clearMessage())
        }
        if (message) {
            toast.success(message)
            dispatch(clearMessage())

            dispatch(get_products(obj))
        }

    }, [message, error])



    useEffect(() => {
        const obj = {
            parPage: parseInt(parPage),
            page: parseInt(currentPage),
            searchValue,
            findCate
        }
        dispatch(get_products(obj))
    }, [searchValue, currentPage, parPage, findCate])


    return (
        <Layout>
            <div className='m-3'>
                <div className='d-flex align-items-center py-2 px-4' style={{ backgroundColor: "#fff", justifyContent: 'space-between' }}>
                    <h5 className="">All Products ({productCount && productCount})</h5>
                    <input style={{ width: "40%" }} className='productSearch' value={searchValue} onChange={(e) => setSearchValue(e.target.value)} type="text" placeholder='Search' />

                    <div style={{ width: "20%" }}>
                        <Select
                            defaultValue={selectedOption}
                            onChange={selectOption}
                            options={selectedOption}
                        />
                    </div>

                </div>

                {
                    allProduct.length > 0 ?
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
                                                    <>

                                                        <span title='cart' onClick={() => add_cart_product(p._id)}>
                                                            <AiOutlineShoppingCart style={{ color: "blue", fontSize: "22px" }} />
                                                        </span>
                                                    </>
                                                </th>
                                                <th>
                                                    <span title='edit'>
                                                        <Link to={`/edit-product/${p._id}`}>
                                                            <EditCalendarOutlinedIcon style={{ color: "green", fontSize: "22px", cursor: 'pointer', marginRight: "6px" }} />
                                                        </Link>
                                                    </span>
                                                    <span title='delete' onClick={() => delete_product_func(p._id)}>
                                                        <DeleteOutlineOutlinedIcon style={{ color: "red", fontSize: "24px", cursor: 'pointer', marginLeft: "6px" }} />
                                                    </span>
                                                </th>
                                            </tr>
                                        ))
                                    }

                                </tbody>

                            </table>
                        </div> : <h4 style={{ textAlign: "center", paddingTop: "60px" }}> Product not found !</h4>
                }


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