import React, { useEffect, useRef, useState } from 'react';
import Layout from '../layout/Layout';
import Helmet from 'react-helmet';
import "./addCategory.scss";
import { Link, useNavigate, useParams } from 'react-router-dom';
import EditCalendarOutlinedIcon from '@mui/icons-material/EditCalendarOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import Pagination from '../Pagination';
import { PropagateLoader } from 'react-spinners';
import { ClipLoader } from 'react-spinners';
import { clipLoaderStyle, overrideStyle } from '../../utils/utils';
import { BsImage } from 'react-icons/bs';
import ImageCropping from '../../utils/ImageCropping';
import { useDispatch, useSelector } from 'react-redux';
import { add_category, delete_category, edit_category, get_all_category, messageClear, update_category } from '../../store/Reducers/categoryReducer';
import toast from "react-hot-toast";
import { base_url } from '../../api/api';
import { confirmMessagge } from '../../utils/aleartFunc';



const AddCategory = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { cateSlug } = useParams();

    const { loader, errorMessage, successMessage, allCategory, categoryCount, editCategory } = useSelector(state => state.category);


    const [searchValue, setSearchValue] = useState('');
    const [currentPage, setCurrentPage] = useState(1)
    const [parPage, setParPage] = useState(6)


    // crop image state
    const [imageShow, setImageShow] = useState(null);
    const [open, setOpen] = useState(false);
    const [croppedImage, setCroppedImage] = useState();
    const imageRef = useRef(null);
    const [refImage, setRefImage] = useState(false);

    if (refImage) {
        imageRef.current.value = null
    }

    const [categoryName, setCateName] = useState("");
    const [categoryImage, setCateImage] = useState("");


    const imageHandle = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedImage = e.target.files[0];
            const objectUrl = URL.createObjectURL(selectedImage);
            setImageShow(objectUrl);
            setOpen(true)
        }

    }

    // addCategory
    const addCategory = (e) => {
        e.preventDefault();
        if (!categoryName || !croppedImage) {
            toast.error("All field is reqired !")
        } else {
            if (!cateSlug) {
                const formData = new FormData();
                formData.append('categoryName', categoryName);
                formData.append('categoryImage', categoryImage, `${Math.random() * 200}.png`);
                dispatch(add_category(formData))
            } else {
                const formData = new FormData();
                formData.append('categoryName', categoryName);
                formData.append('id', cateSlug);
                if (categoryImage) {
                    formData.append('categoryImage', categoryImage, `${Math.random() * 100}.png`);
                }

                dispatch(update_category(formData))

            }
        }

    }


    useEffect(() => {
        const obj = {
            parPage: parseInt(parPage),
            page: parseInt(currentPage),
            searchValue
        }
        dispatch(get_all_category(obj))
    }, [searchValue, currentPage, parPage])


    // delete_category_func
    const delete_category_func = async (id) => {
        const returnValue = await confirmMessagge();
        if (returnValue) {
            dispatch(delete_category(id))
        }
    }


    useEffect(() => {
        const obj = {
            parPage: parseInt(parPage),
            page: parseInt(currentPage),
            searchValue
        }

        if (errorMessage) {
            toast.error(errorMessage)
            dispatch(messageClear())
        }

        if (successMessage) {
            toast.success(successMessage)
            dispatch(messageClear())
            setCroppedImage("")
            setCateImage("")
            setCateName("")
            dispatch(get_all_category(obj))
            navigate('/add-category', { replace: true })
        }
    }, [errorMessage, successMessage])



    useEffect(() => {
        if (cateSlug) {
            setCateName(editCategory.categoryName)
            setCroppedImage(`${base_url}/uploads/categoryImg/${editCategory.categoryImage}`)
        } else {
            setCateName('')
            setCroppedImage('')
        }

    }, [editCategory, cateSlug])

    // get edit category
    useEffect(() => {
        if (cateSlug) {
            dispatch(edit_category(cateSlug))
        }
    }, [cateSlug])



    return (
        <Layout>
            <div className='all-category m-3'>
                {/* <Helmet>
                    <title>{!cateSlug ? "Category add" : "Category edit"}</title>
                </Helmet> */}

                <div className="container-fluid">

                    <div className="row">
                        <div className="col-lg-8">

                            <div className='d-flex align-items-center p-2' style={{ backgroundColor: "#fff" }}>
                                <h5 className="">All Category ({categoryCount && categoryCount})</h5>
                                <input className='searchInput' value={searchValue} onChange={(e) => setSearchValue(e.target.value)} type="text" placeholder='Search' />
                            </div>
                            <p></p>

                            {
                                allCategory.length > 0 ? <table class="table" style={{ textAlign: "center" }}>
                                    <thead>
                                        <tr className=''>
                                            <th scope="col">No</th>
                                            <th style={{ textAlign: 'left' }} scope="col">Image</th>
                                            <th style={{ textAlign: 'left' }} scope="col">Name</th>
                                            <th scope="col">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            allCategory && allCategory?.map((c, i) => {
                                                return <tr>
                                                    <th scope="row">{i + 1 + (currentPage - 1) * parPage}</th>

                                                    <td style={{ textAlign: 'left' }}>
                                                        <img className='productImgStyle' src={`${base_url}/uploads/categoryImg/${c?.categoryImage}`} alt="img" />
                                                    </td>
                                                    <td style={{ textAlign: 'left' }}>{c.categoryName}</td>
                                                    <td>
                                                        <span title='edit'>
                                                            <Link to={`/edit-category/${c._id}`}>
                                                                <EditCalendarOutlinedIcon style={{ color: "green", fontSize: "22px", cursor: 'pointer', marginRight: "6px" }} />
                                                            </Link>
                                                        </span>
                                                        <span title='delete' onClick={() => delete_category_func(c._id)}>
                                                            <DeleteOutlineOutlinedIcon style={{ color: "red", fontSize: "24px", cursor: 'pointer', marginLeft: "6px" }} />
                                                        </span>
                                                    </td>
                                                </tr>
                                            })
                                        }

                                    </tbody>
                                </table> : <h4 style={{ textAlign: "center", paddingTop: "60px" }}> Category not found !</h4>
                            }


                            {
                                categoryCount >= parPage ?
                                    <Pagination
                                        pageNumber={currentPage}
                                        setPageNumber={setCurrentPage}
                                        totalItem={categoryCount}
                                        parPage={parPage}
                                        showItem={Math.floor(categoryCount / parPage)}
                                    /> : ''
                            }


                        </div>


                        <div className="col-lg-4">

                            <h5 className="" style={{ backgroundColor: "#fff", padding: "13px 8px" }}>{cateSlug ? "Edit Category" : 'Add Category'}</h5>

                            <p></p>
                            <div className='p-2' style={{ backgroundColor: "#fff" }}>

                                <form onSubmit={addCategory}>
                                    <div className="mb-3">
                                        <label for="name" className="form-label">Category name</label>
                                        <input
                                            value={categoryName}
                                            onChange={(e) => setCateName(e.target.value)}
                                            className="form-control"
                                            type="text"
                                            id="name"
                                            name="category_name"
                                            placeholder="Enter category name"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label
                                            className="form-label d-flex justify-content-center align-items-center flex-column border"
                                            for="image"
                                        >
                                            {croppedImage ? (
                                                <div className='d-flex justify-content-center align-items-center' style={{ width: "100%", height: "200px" }} >
                                                    <img style={{ height: "100%", width: "auto" }} src={croppedImage} />
                                                </div>
                                            ) : (
                                                <>
                                                    <span>
                                                        <BsImage />
                                                    </span>
                                                    <span className='' style={{ height: "180px" }}>Select Image</span>
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
                                                <> {cateSlug ? 'Edit Category' : 'Add Category'}</>
                                            )}
                                        </button>
                                    </div>
                                </form>

                            </div>

                        </div>
                    </div>

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

export default AddCategory;