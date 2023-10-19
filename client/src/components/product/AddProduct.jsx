import React, { useEffect, useState } from 'react';
import Layout from '../layout/Layout';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { get_all_category } from '../../store/Reducers/categoryReducer';
import { add_product, edit_product, messageClear, update_product } from '../../store/Reducers/productAddReducer';
import toast from "react-hot-toast";
import { PropagateLoader } from 'react-spinners';
import { overrideStyle } from '../../utils/utils';
import { useNavigate, useParams } from 'react-router-dom';
import { base_url } from '../../api/api';



const AddProduct = () => {

    const { productslug } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { allCategory } = useSelector(state => state.category);
    const { loader, successMessage, errorMessage, editProduct } = useSelector(state => state.product);

    const [options, setOptions] = useState([]);
    const [showImage, setShowImage] = useState("");
    const [oldImage, setOldImage] = useState("");

    const [state, setState] = useState({
        product: "",
        price: '',
        category: '',
        image: ''
    });



    // imageHandle
    const selectOption = (e) => {
        setState({
            ...state,
            category: e.value
        })
    }


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


    useEffect(() => {
        const categoryOption = allCategory?.map((c) => ({
            value: c.categoryName,
            label: c.categoryName
        }));

        setOptions(categoryOption)
    }, [allCategory]);

    // add_product
    const add = (e) => {
        e.preventDefault();

        const { product, price, category, image } = state;

        if (!product || !price || !category || !showImage) {
            toast.error("All field is required !")
        } else {
            const formData = new FormData()

            formData.append('product', product)
            formData.append('price', price)
            formData.append('category', category)
            formData.append('productImage', image)
            formData.append('oldImage', oldImage ? oldImage : '')
            formData.append('id', productslug ? productslug : '')

            if (!productslug) {
                dispatch(add_product(formData))
            } else {
                dispatch(update_product(formData))
            }

        }

    }


    useEffect(() => {

        if (productslug) {
            setState({
                ...state,
                product: editProduct.product,
                price: editProduct.price,
                category: {
                    value: editProduct.category,
                    label: editProduct.category
                }
            });
            setShowImage(`${base_url}/uploads/productImg/${editProduct.productImage}`);
            setOldImage(editProduct.productImage)
        } else {
            setState({ product: '', price: '', image: '' });
            setShowImage('')
        }

    }, [productslug, editProduct])


    // edit data
    useEffect(() => {
        if (productslug) {
            dispatch(edit_product(productslug))
        }
    }, [productslug])


    useEffect(() => {

        if (errorMessage) {
            toast.error(errorMessage)
            dispatch(messageClear())
        }
        if (successMessage) {
            toast.success(successMessage)
            dispatch(messageClear())
            navigate('/all-product', { replace: true })
        }

    }, [successMessage, errorMessage])


    useEffect(() => {
        const obj = {
            parPage: '',
            page: '',
            searchValue: ''
        };
        dispatch(get_all_category(obj))

    }, [dispatch])


    return (
        <Layout>
            <div className='m-3'>
                <h5 className="p-3" style={{ backgroundColor: "#fff" }}>{productslug ? "Edit Product" : 'Add Product'}</h5>

                <div className='mt-4' style={{ backgroundColor: "#fff" }}>

                    <form onSubmit={add}>

                        <div className='p-3' style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ width: "90%", marginRight: "20px" }}>
                                <label for="name" className="form-label">Product name</label>
                                <input
                                    onChange={inputHendle}
                                    value={state.product}
                                    className="form-control"
                                    type="text"
                                    id="name"
                                    name="product"
                                    placeholder="Enter Product name"
                                />
                            </div>
                            <div style={{ width: "90%" }}>
                                <label for="name" className="form-label">Price</label>
                                <input
                                    onChange={inputHendle}
                                    value={state.price}
                                    className="form-control"
                                    type="number"
                                    id="name"
                                    name="price"
                                    placeholder="Enter price"
                                />
                            </div>

                        </div>


                        <div className='px-3 py-2' style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ width: "90%", marginRight: "20px" }}>
                                <label for="name" className="form-label">Select category</label>

                                <Select
                                    defaultValue={state.category}
                                    onChange={selectOption}
                                    options={options}
                                />


                            </div>
                            <div style={{ width: "90%" }}>
                                <label for="name" className="form-label">Select Image</label>
                                <input
                                    className="form-control"
                                    type="file"
                                    id="name"
                                    name="image"
                                    onChange={imageHandle}
                                />
                            </div>

                        </div>

                        {
                            showImage ?
                                <div className='px-3 py-2' style={{ width: "100%", height: "150px", textAlign: 'center' }} >
                                    <img style={{ height: "100%", width: "auto" }} src={showImage} alt="" />
                                </div> : ''
                        }

                        <div className='p-3 '>

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
                                    <> {productslug ? 'Edit Product' : 'Add Product'}</>
                                )}
                            </button>
                        </div>

                    </form>

                </div>

            </div>
        </Layout>
    )
}

export default AddProduct;