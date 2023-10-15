import React, { useEffect, useState } from 'react';
import Layout from '../layout/Layout';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { get_all_category } from '../../store/Reducers/categoryReducer';
import { add_product } from '../../store/Reducers/productAddReducer';
import toast from "react-hot-toast";



const AddProduct = () => {

    const cateSlug = false;
    const dispatch = useDispatch();
    const { allCategory } = useSelector(state => state.category);

    const [options, setOptions] = useState([]);
    const [showImage, setShowImage] = useState("")

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

        if (!product || !price || !category || !image) {
            toast.error("All field is required !")
        } else {
            const formData = new FormData()

            formData.append('product', product)
            formData.append('price', price)
            formData.append('category', category)
            formData.append('productImage', image)

            dispatch(add_product(formData))
        }

    }


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
                <h5 className="p-3" style={{ backgroundColor: "#fff" }}>{cateSlug ? "Edit Product" : 'Add Product'}</h5>

                <div className='mt-4' style={{ backgroundColor: "#fff" }}>

                    <form onSubmit={add}>

                        <div className='p-3' style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ width: "90%", marginRight: "20px" }}>
                                <label for="name" className="form-label">Product name</label>
                                <input
                                    onChange={inputHendle}
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
                            <button className='btn btn-dark w-100'>Add Product</button>
                        </div>

                    </form>

                </div>

            </div>
        </Layout>
    )
}

export default AddProduct;