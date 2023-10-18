
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';


// create_invoice
export const create_invoice = createAsyncThunk(
    'invoice/create_invoice',
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post('/create-invoice', info);

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
            const { data } = await api.get(`/get-all-invoice?searchValue=${searchValue}&&page=${page}&&parPage=${parPage}`);
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
        invoiceCount: 0
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

    }
});



export const { messageClear } = invoiceReducer.actions;
export default invoiceReducer.reducer;