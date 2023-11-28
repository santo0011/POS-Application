import React, { useEffect } from 'react';
import Layout from '../layout/Layout';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import "./cart.scss";
import { useDispatch, useSelector } from 'react-redux';
import { get_cart_products, messageClear, quantity_dec, quantity_inc, remove_form_cart } from '../../store/Reducers/cartReducer';
import { base_url } from '../../api/api';
import toast from "react-hot-toast";
import CartDetails from './CartDetails';


const Cart = () => {

    const dispatch = useDispatch();
    const { userInfo } = useSelector(state => state.auth);

    const { cart_products, card_product_count, price, successMessage } = useSelector(state => state.cart);


    useEffect(() => {
        dispatch(get_cart_products(userInfo.id))
    }, [successMessage]);


    // incremetnt cart quantity
    const inc = (quantity, card_id) => {
        if (quantity >= 10) {
            toast.error("Limit product can be added")
        } else {
            dispatch(quantity_inc(card_id))
        }

    }

    // decrement cart quantity
    const dec = (quantity, card_id) => {
        if (quantity <= 1) {
            dispatch(remove_form_cart(card_id))
        } else {
            dispatch(quantity_dec(card_id))
        }
    }

    // remove_cart
    const remove_cart = (card_id) => {
        dispatch(remove_form_cart(card_id))
    }


    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage)
            dispatch(messageClear())
        }
    }, [successMessage])



    return (
        <Layout>
            <div className='m-3'>
                <div className="container-fluid">

                    <div className="row">
                        <div className="col-lg-7">
                            <div className='d-flex align-items-center px-3 py-2' style={{ backgroundColor: "#fff" }}>
                                <h5 className="">Total cart porduct ({card_product_count && card_product_count})</h5>
                            </div>

                            {
                                cart_products.length > 0 ?
                                    <div style={{ height: "450px", overflowY: "auto" }}>
                                        {
                                            cart_products && cart_products?.map((c, i) => {
                                                return <div key={i} className='my-3 p-3 d-flex' style={{ backgroundColor: "#fff" }}>

                                                    <div style={{ height: "90px" }}>
                                                        <img style={{ height: "100%", width: "100px", borderRadius: "5px" }} src={`${base_url}/uploads/productImg/${c.products[0]?.productImage}`} alt="productImage" />
                                                    </div>
                                                    <div className='px-3' style={{ display: 'flex', flexDirection: 'column', justifyContent: "center" }}>
                                                        <h6>{c.products[0]?.product}</h6>
                                                        <h6>Price : ₹ {c.quantity * c.products[0]?.price}</h6>

                                                        <div className='d-flex cartSpan'>
                                                            <span onClick={() => dec(c.quantity, c._id)}>
                                                                <AiOutlineMinus />
                                                            </span>
                                                            <span>
                                                                <p>{c.quantity}</p>
                                                            </span>
                                                            <span onClick={() => inc(c.quantity, c._id)}>
                                                                <AiOutlinePlus />
                                                            </span>

                                                            <div className='cartBtn'>
                                                                <p type="button" onClick={() => remove_cart(c._id)}>Remove</p>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            }

                                            )
                                        }
                                    </div> : <h4 style={{ textAlign: "center", paddingTop: "60px" }}> Your cart is empty !</h4>
                            }

                        </div>
                        <div className="col-lg-5">
                            <CartDetails
                                card_product_count={card_product_count}
                                price={price}
                                cart_products={cart_products}
                            />
                        </div>
                    </div>

                </div>

            </div>
        </Layout>
    )
}


export default Cart;