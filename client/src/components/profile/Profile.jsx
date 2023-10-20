import React, { useEffect, useRef, useState } from 'react';
import "./profile.scss";
import Layout from '../layout/Layout';
import ImageCropping from '../../utils/ImageCropping';
import { overrideStyle } from '../../utils/utils';
import { PropagateLoader } from 'react-spinners';
import { BsImage } from 'react-icons/bs';
import toast from "react-hot-toast";
import { useDispatch, useSelector } from 'react-redux';
import { add_customer_profile, get_customer_profile, messageClear, update_customer_profile } from '../../store/Reducers/authReducer';
import { base_url } from '../../api/api';



const Profile = () => {

    const dispatch = useDispatch();

    const { loader, successMessage, errorMessage, profile } = useSelector(state => state.auth);


    // crop image state
    const [imageShow, setImageShow] = useState(null);
    const [open, setOpen] = useState(false);
    const [croppedImage, setCroppedImage] = useState();
    const imageRef = useRef(null);
    const [refImage, setRefImage] = useState(false);

    if (refImage) {
        imageRef.current.value = null
    }

    const [categoryImage, setCateImage] = useState("");
    const [oldImage, setOldImage] = useState();


    const [state, setState] = useState({
        shopName: "",
        address: "",
        mobile: ""
    });

    // handleOnchange
    const handleOnchange = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        })
    }


    // imageHandle
    const imageHandle = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedImage = e.target.files[0];
            const objectUrl = URL.createObjectURL(selectedImage);
            setImageShow(objectUrl);
            setOpen(true)
        }

    }

    // addProfile
    const addProfile = (e) => {
        e.preventDefault();
        const { shopName, address, mobile } = state;

        if (!shopName || !address || !mobile || !croppedImage) {
            toast.error("All field is requied !")
        } else {

            if (!profile) {
                const formData = new FormData();
                formData.append('shopName', shopName);
                formData.append('address', address);
                formData.append('mobile', mobile);
                formData.append('profileImage', categoryImage, `${Math.random() * 200}.png`);

                dispatch(add_customer_profile(formData))
            } else {
                const formData = new FormData();
                formData.append('shopName', shopName);
                formData.append('address', address);
                formData.append('mobile', mobile);
                formData.append('oldImage', oldImage);
                if (categoryImage) {
                    formData.append('profileImage', categoryImage, `${Math.random() * 100}.png`);
                }

                dispatch(update_customer_profile(formData))

            }

        }

    }

    useEffect(() => {

        setState({
            ...state,
            shopName: profile?.shopName,
            address: profile?.address,
            mobile: profile?.mobile
        });

        setOldImage(profile?.profileImage)
        setCroppedImage(`${base_url}/uploads/profileImg/${profile?.profileImage}`)

    }, [profile])


    useEffect(() => {
        dispatch(get_customer_profile())
    }, [successMessage])


    // profileImage
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


    return (
        <Layout>

            <div className="container-fluid profileContainer">

                <div className="profileWrapper p-3">

                    <form onSubmit={addProfile}>
                        <div className="mb-2">
                            <label for="shopName" className="form-label">Shop name</label>
                            <input
                                onChange={handleOnchange}
                                value={state.shopName}
                                className="form-control"
                                type="text"
                                id="shopName"
                                name="shopName"
                                placeholder="Enter shop name"
                            />
                        </div>
                        <div className="mb-2">
                            <label for="address" className="form-label">Address</label>
                            <input
                                onChange={handleOnchange}
                                value={state.address}
                                className="form-control"
                                type="text"
                                id="address"
                                name="address"
                                placeholder="Enter address"
                            />
                        </div>
                        <div className="mb-3">
                            <label for="mobile" className="form-label">Contact No</label>
                            <input
                                onChange={handleOnchange}
                                value={state.mobile}
                                className="form-control"
                                type="number"
                                id="mobile"
                                name="mobile"
                                placeholder="Mobile number"
                            />
                        </div>
                        <div className="mb-3">
                            <label
                                className="form-label d-flex justify-content-center align-items-center flex-column border"
                                for="image"
                            >
                                {
                                    croppedImage ? (
                                        <div className='d-flex justify-content-center align-items-center' style={{ width: "100%", height: "100px" }} >
                                            <img style={{ height: "100%", width: "auto" }} src={croppedImage} />
                                        </div>
                                    ) : (
                                        <>
                                            <span>
                                                <BsImage />
                                            </span>
                                            <span className='' style={{ height: "100px" }}>Select Image</span>
                                        </>
                                    )}

                            </label>
                        </div>
                        <input onChange={imageHandle} ref={imageRef} hidden type="file" name="image" id="image" />
                        <div className="mb-3">
                            <button
                                disabled={loader ? true : false}
                                className="btn btn-dark w-100"
                            >
                                {loader ? (
                                    <PropagateLoader
                                        color="#fff"
                                        cssOverride={overrideStyle}
                                    />
                                ) : (
                                    <> {profile ? 'Edit Profile' : 'Add Profile'}</>
                                )}
                            </button>
                        </div>
                    </form>

                </div>

                <ImageCropping
                    open={open}
                    setOpen={setOpen}
                    image={imageShow}
                    setCroppedImage={setCroppedImage}
                    setRefImage={setRefImage}
                    setCateImage={setCateImage}
                />

            </div>


        </Layout>
    )
}


export default Profile;