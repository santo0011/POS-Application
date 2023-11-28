
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';
import axios from 'axios';

// create_invoice
export const create_invoice = createAsyncThunk(
    'invoice/create_invoice',
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post('/create-invoice', info, { withCredentials: true });

            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)


// get_all_invoice
export const get_all_invoice = createAsyncThunk(
    'invoice/get_all_invoice',
    async ({ searchValue, page, parPage }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/get-all-invoice?searchValue=${searchValue}&&page=${page}&&parPage=${parPage}`, { withCredentials: true });
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)



// get_amount
export const get_amount = createAsyncThunk(
    'invoice/get_amount',
    async ({ year, month, monthLength }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/get-amount?year=${year}&&month=${month}&&monthLength=${monthLength}`, { withCredentials: true });
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)



export const invoiceReducer = createSlice({
    name: 'invoice',
    initialState: {
        loader: false,
        errorMessage: '',
        successMessage: '',
        allInvoice: [],
        invoiceCount: 0,
        totalAmountPerDay: [],
        totalAmount: 0
    },
    reducers: {
        messageClear: (state, _) => {
            state.errorMessage = ''
            state.successMessage = ''
        }
    },
    extraReducers: {
        [create_invoice.pending]: (state, _) => {
            state.loader = true
        },
        [create_invoice.rejected]: (state, { payload }) => {
            state.loader = false
            state.errorMessage = payload.error
        },
        [create_invoice.fulfilled]: (state, { payload }) => {
            state.loader = false
            state.successMessage = payload.message
        },
        [get_all_invoice.fulfilled]: (state, { payload }) => {
            state.allInvoice = payload.allInvoice
            state.invoiceCount = payload.invoiceCount
        },
        [get_amount.fulfilled]: (state, { payload }) => {
            state.totalAmountPerDay = payload.totalAmountPerDay
            state.totalAmount = payload.totalAmount
        }

    }
});



export const { messageClear } = invoiceReducer.actions;
export default invoiceReducer.reducer;