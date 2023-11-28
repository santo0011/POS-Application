import React, { useState } from 'react';
import { BsAt } from 'react-icons/bs';
import { FaLock, FaUser } from 'react-icons/fa';
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import "./register.scss";
import { messageClear, register } from '../../store/Reducers/authReducer';
import { useDispatch, useSelector } from 'react-redux';
import { overrideStyle } from '../../utils/utils';
import { PropagateLoader } from 'react-spinners';
import { client } from '../../api/api';




const Register = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { errorMessage, successMessage, loader } = useSelector((state) => state.auth);


    const [state, setState] = useState({
        name: "",
        email: '',
        password: '',
        image: ''
    });

    const [showImage, setShowImage] = useState("")


    // inputHendle
    const inputHendle = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        })
    };

    // imageHandle
    const imageHandle = (e) => {
        if (e.target.files.length !== 0) {
            setState({
                ...state,
                image: e.target.files[0]
            });
            setShowImage(URL.createObjectURL(e.target.files[0]));
        }

    }


    // user_register
    const user_register = (e) => {
        e.preventDefault();

        const formData = new FormData()

        formData.append('name', state.name)
        formData.append('email', state.email)
        formData.append('password', state.password)
        formData.append('image', state.image)

        dispatch(register(formData))
    }

    useEffect(() => {
        if (errorMessage) {
            toast.error(errorMessage)
            dispatch(messageClear())
        }
        if (successMessage) {
            toast.success(successMessage)
            dispatch(messageClear())
            navigate('/register/email-verify', { replace: true })
        }
    }, [errorMessage, successMessage])


    return (
        <div className="register">
            <div className="card">

                <div className="auth">
                    <h3>Register</h3>
                    <form>
                        <div className="form-group">
                            <label htmlFor="userName">User Name</label>
                            <div className="icon-input">
                                <div className="icon"><FaUser /></div>
                                <input onChange={inputHendle} type="text" name='name' id='userName' placeholder='User name' className="form-control" />
                            </div>
                            {/* <p>{errorMessage?.name}</p> */}
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <div className="icon-input">
                                <div className="icon"><BsAt /></div>
                                <input onChange={inputHendle} type="email" name='email' id='email' placeholder='Email' className="form-control" />
                            </div>
                            {/* <p>{errorMessage?.email}</p> */}
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="icon-input">
                                <div className="icon"><FaLock /></div>
                                <input onChange={inputHendle} type="password" name='password' id='password' placeholder='Password' className="form-control" />
                            </div>
                            {/* <p>{errorMessage?.password}</p> */}
                        </div>
                        <div className="form-group">
                            <input onChange={imageHandle} hidden type="file" name='image' id='reg-image' />
                            <div className="image-file">
                                <div className="image">
                                    {
                                        showImage && <img src={`${showImage}`} alt='profile image' />
                                    }
                                </div>
                                <div className="file-name">
                                    <div className="form-control">{state.image && state.image.name}</div>
                                    <label htmlFor="reg-image">Browser</label>
                                </div>
                            </div>
                            {/* <p>{errorMessage?.image}</p> */}
                        </div>
                        <div className="form-group">

                            <button disabled={loader ? true : false} onClick={user_register} className="btn btn-block">
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
                    </form>
                </div>
                <div className="image-logo">
                    <img src={`${client}/designImage/image4.jpg`} alt="img" />
                </div>
            </div>

        </div>
    )
}

export default Register;