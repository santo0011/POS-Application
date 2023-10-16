import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';
import jwt from 'jwt-decode';



// add_product
export const add_product = createAsyncThunk(
    'product/add_product',
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post('/add-product', info);
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)



// get_products
export const get_products = createAsyncThunk(
    'product/get_products',
    async ({ searchValue, page, parPage }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/get-products?searchValue=${searchValue}&&page=${page}&&parPage=${parPage}`);
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
        loader: false,
        allProduct: [],
        productCount: 0
    },
    reducers: {
        messageClear: (state, _) => {
            state.errorMessage = ''
            state.successMessage = ''
        }
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
    }

});



export const { messageClear } = productAddReducer.actions;
export default productAddReducer.reducer;