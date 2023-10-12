import React, { useState, useEffect } from 'react';
import { BsAt } from 'react-icons/bs';
import { FaLock, FaFacebook, FaGoogle } from 'react-icons/fa';
import { Link, useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import "./register.scss";
import { messageClear, user_login } from '../../store/Reducers/authReducer';


const Login = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { errorMessage, loader, successMessage } = useSelector(state => state.auth);


    const [state, setState] = useState({
        email: '',
        password: ''
    })

    const inputHandle = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        })
    }

    // login
    const login = (e) => {
        e.preventDefault()
        dispatch(user_login(state))
    }


    useEffect(() => {
        if (errorMessage) {
            toast.error(errorMessage)
            dispatch(messageClear())
        }
        if (successMessage) {
            toast.success(successMessage)
            dispatch(messageClear())
            navigate('/', { replace: true })
        }
    }, [errorMessage, successMessage])


    return (
        <>

            <div className="login">
                <div className="card">
                    <div className="auth">
                        <h3>Login</h3>
                        <form action="">
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <div className="icon-input">
                                    <div className="icon"><BsAt /></div>
                                    <input onChange={inputHandle} type="email" name='email' id='email' placeholder='Email' className="form-control" />
                                </div>
                                {/* <p>{errorMessage?.email}</p> */}
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <div className="icon-input">
                                    <div className="icon"><FaLock /></div>
                                    <input onChange={inputHandle} type="password" name='password' id='password' placeholder='Password' className="form-control" />
                                </div>
                                {/* <p>{errorMessage?.password}</p> */}
                            </div>
                            <div className="form-group">
                                {
                                    loader ? <button className="btn btn-block">
                                        <div className="spinner">
                                            <div className="spinner1"></div>
                                            <div className="spinner2"></div>
                                            <div className="spinner3"></div>
                                        </div>
                                    </button> : <button onClick={login} className="btn btn-block">
                                        Login
                                    </button>
                                }

                            </div>
                        </form>
                        <div className="or">or</div>
                        <div className="fb-google-auth">
                            <div className="fb-google-logo">
                                <div className="fb">
                                    <button><FaFacebook /> <span>Signup with facebook</span></button>
                                </div>
                                <div className="google">
                                    <button><FaGoogle /><span>Signup with google</span></button>
                                </div>
                            </div>
                        </div>
                        <div className="login-page">
                            <Link to='/register'>Register your account</Link>
                        </div>
                    </div>
                    <div className="image-logo">
                        <img src="http://localhost:3000/designImage/image4.jpg" alt="img" />
                    </div>
                </div>
            </div>

        </>
    )
}

export default Login;