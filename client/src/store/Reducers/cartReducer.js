import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';


// add_to_cart
export const add_to_cart = createAsyncThunk(
    'cart/add_to_cart',
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post('/add-to-cart', info);
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)


// get_cart_products
export const get_cart_products = createAsyncThunk(
    'cart/get_cart_products',
    async (userId, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/get-cart-product/${userId}`);
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)


// quantity_inc
export const quantity_inc = createAsyncThunk(
    'cart/quantity_inc',
    async (card_id, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.put(`/quantity-inc/${card_id}`)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

// quantity_dec
export const quantity_dec = createAsyncThunk(
    'cart/quantity_dec',
    async (card_id, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.put(`/quantity-dec/${card_id}`)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

// remove_form_cart
export const remove_form_cart = createAsyncThunk(
    'cart/remove_form_cart',
    async (card_id, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.delete(`/remove-form-cart/${card_id}`)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)



export const cartReducer = createSlice({
    name: 'cart',
    initialState: {
        loader: false,
        errorMessage: '',
        successMessage: '',
        cart_products: [],
        card_product_count: 0,
        price: 0
    },
    reducers: {
        messageClear: (state, _) => {
            state.errorMessage = ''
            state.successMessage = ''
        }
    },
    extraReducers: {
        [add_to_cart.pending]: (state, _) => {
            state.loader = true
        },
        [add_to_cart.rejected]: (state, { payload }) => {
            state.loader = false
            state.errorMessage = payload.error
        },
        [add_to_cart.fulfilled]: (state, { payload }) => {
            state.loader = false
            state.successMessage = payload.message
        },
        [get_cart_products.fulfilled]: (state, { payload }) => {
            state.cart_products = payload.cart_products
            state.price = payload.price
            state.card_product_count = payload.card_product_count
        },
        [quantity_inc.fulfilled]: (state, { payload }) => {
            state.successMessage = payload.message
        },
        [quantity_dec.fulfilled]: (state, { payload }) => {
            state.successMessage = payload.message
        },
        [remove_form_cart.fulfilled]: (state, { payload }) => {
            state.successMessage = payload.message
        }
    }
});



export const { messageClear } = cartReducer.actions;
export default cartReducer.reducer;