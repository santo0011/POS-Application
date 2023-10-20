import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { messageClear, verify_email } from '../../store/Reducers/authReducer';
import { Link, useNavigate } from 'react-router-dom';
import "./register.scss";
import { PropagateLoader } from 'react-spinners';
import { overrideStyle } from '../../utils/utils';



const EmailVerify = () => {

    const { errorMessage, successMessage, loader, authenticate } = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [otp, setOtp] = useState("")

    // sendOtp
    const sendOtp = () => {
        dispatch(verify_email(otp))
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
        if (authenticate) {
            navigate('/', { replace: true })
        }
    }, [errorMessage, successMessage])


    return (
        <div className="verify_email">

            <div className="verify">
                <div className="otp">
                    <p>Check your email and submit OTP</p>
                    <div className="form-group">
                        <input onChange={(e) => setOtp(e.target.value)} type="text" className='form-control' id='otp' placeholder='Enter otp' />
                    </div>

                    <p></p>

                    <div className="form-group">


                        <button disabled={loader ? true : false} onClick={sendOtp} className="btn btn-block">
                            {
                                loader ? <PropagateLoader color="#fff" cssOverride={overrideStyle} /> : 'Register'
                            }
                        </button>

                    </div>
                    <div className="form-group">
                        <div className="login-page">
                            <Link to='/login'>Login your account</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default EmailVerify;