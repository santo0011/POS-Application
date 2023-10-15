import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';
import jwt from 'jwt-decode';



// add_product
export const add_product = createAsyncThunk(
    'product/add_product',
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post('/add-product', info);

            console.log(data)


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
        loader: false
    },
    reducers: {
        messageClear: (state, _) => {
            state.errorMessage = ''
            state.successMessage = ''
        }
    },
    extraReducers: {

    }

});


export const { messageClear } = productAddReducer.actions;
export default productAddReducer.reducer;