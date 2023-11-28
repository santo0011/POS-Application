import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';
import jwt from 'jwt-decode';



// add_product
export const add_product = createAsyncThunk(
    'product/add_product',
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post('/add-product', info, { withCredentials: true });
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)


// get_products
export const get_products = createAsyncThunk(
    'product/get_products',
    async ({ searchValue, page, parPage, findCate }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/get-products?searchValue=${searchValue}&&page=${page}&&parPage=${parPage}&&findCate=${findCate}`, { withCredentials: true });
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)



// delete_product
export const delete_product = createAsyncThunk(
    'product/delete_product',
    async (id, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.delete(`/delete-product/${id}`, { withCredentials: true });
            return fulfillWithValue(data)
        } catch (error) {

            return rejectWithValue(error.response.data)
        }
    }
)


// edit_product
export const edit_product = createAsyncThunk(
    'product/edit_product',
    async (id, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/edit-product/${id}`, { withCredentials: true });
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)



// update_product
export const update_product = createAsyncThunk(
    'product/update_product',
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.put('/update-product', info, { withCredentials: true });

            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)



export const productAddReducer = createSlice({
    name: "product",
    initialState: {
        errorMessage: '',
        successMessage: '',
        error: "",
        message: "",
        loader: false,
        allProduct: [],
        productCount: 0,
        editProduct: {}
    },
    reducers: {
        messageClear: (state, _) => {
            state.errorMessage = ''
            state.successMessage = ''
        },
        clearMessage: (state, _) => {
            state.error = ''
            state.message = ''
        },
    },
    extraReducers: {
        [add_product.pending]: (state, _) => {
            state.loader = true
        },
        [add_product.rejected]: (state, { payload }) => {
            state.loader = false
            state.errorMessage = payload.error
        },
        [add_product.fulfilled]: (state, { payload }) => {
            state.loader = false
            state.successMessage = payload.message
        },
        [get_products.pending]: (state, _) => {
            state.loader = true
        },
        [get_products.fulfilled]: (state, { payload }) => {
            state.loader = false
            state.allProduct = payload.allProduct
            state.productCount = payload.productCount
        },
        [delete_product.rejected]: (state, { payload }) => {
            state.error = payload.error
        },
        [delete_product.fulfilled]: (state, { payload }) => {
            state.message = payload.message
        },
        [edit_product.fulfilled]: (state, { payload }) => {
            state.editProduct = payload.editProduct
        },
        [update_product.fulfilled]: (state, { payload }) => {
            state.successMessage = payload.message
        }
    }

});



export const { messageClear, clearMessage } = productAddReducer.actions;
export default productAddReducer.reducer;