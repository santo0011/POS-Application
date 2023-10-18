import React, { useEffect, useState } from 'react';
import toast from "react-hot-toast";
import "./cart.scss";
import { useDispatch, useSelector } from 'react-redux';
import { create_invoice, messageClear } from '../../store/Reducers/invoiceReducer';
import { useNavigate } from 'react-router-dom';



const CartDetails = ({ card_product_count, price, cart_products }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loader, errorMessage, successMessage } = useSelector(state => state.invoice);


    const [state, setState] = useState({
        email: "",
        totilePrice: "",
        customerName: "",
        mobileNum: ""
    });


    useEffect(() => {
        setState({
            ...state,
            totilePrice: price
        })
    }, [price]);


    // inputHendle
    const inputHendle = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        })
    };


    // create_bill
    const create_bill = (e) => {
        e.preventDefault();

        const { email, totilePrice, customerName, mobileNum } = state;

        if (card_product_count < 1) {
            toast.error("Your cart is empty !")
        } else {
            const obj = {
                email,
                totilePrice: parseInt(totilePrice),
                card_product_count,
                customerName,
                mobileNum: parseInt(mobileNum),
                cart_products
            }
            dispatch(create_invoice(obj))
        }

    }



    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage)
            dispatch(messageClear());
            navigate('/bills', { replace: true })
        }
        if (errorMessage) {
            toast.error(errorMessage)
            dispatch(messageClear())
        }
    }, [successMessage, errorMessage])



    return (
        <form onSubmit={create_bill}>

            <div className='px-3 py-2 priceDetailsStyle'>
                <h5>Create Invoice</h5>
                <hr className='hrStyle' />

                <div className='my-2'>
                    <label for="name" className="form-label">Customer name</label>
                    <input type="text" onChange={inputHendle} value={state.customerName} name='customerName' required placeholder='Enter costomer name' className="form-control" />
                </div>

                <div className='d-flex'>
                    <div style={{ marginRight: "5px" }}>
                        <label for="number" className="form-label">Mobile number</label>
                        <input type="number" onChange={inputHendle} value={state.mobileNum} name='mobileNum' required placeholder='Enter number' className="form-control" />

                    </div>
                    <div>
                        <label for="email" className="form-label">Email</label>
                        <input type="email" onChange={inputHendle} value={state.email} name='email' placeholder='Enter email' className="form-control" />

                    </div>
                </div>

                <div className='d-flex my-2'>
                    <div style={{ marginRight: "5px" }}>
                        <label for="name" className="form-label">Total item</label>
                        <input type="text" readOnly value={card_product_count} className="form-control" />
                    </div>
                    <div >
                        <label for="name" className="form-label">Total price</label>
                        <input type="number" onChange={inputHendle} value={state.totilePrice} name='totilePrice' className="form-control" />

                    </div>

                </div>


                <div className='py-3 '>
                    <button className="btn btn-dark w-100">Create Bill</button>
                </div>

            </div>
        </form>
    )
}



export default CartDetails;