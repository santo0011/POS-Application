import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';


// add_category
export const add_category = createAsyncThunk(
    'category/add_category',
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post('/add-category', info);
            return fulfillWithValue(data)
        } catch (error) {

            return rejectWithValue(error.response.data)
        }
    }
)



// get_all_category
export const get_all_category = createAsyncThunk(
    'category/get_all_category',
    async ({ searchValue, page, parPage }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/get-category?searchValue=${searchValue}&&page=${page}&&parPage=${parPage}`);
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)



export const categoryReducer = createSlice({
    name: 'category',
    initialState: {
        errorMessage: '',
        successMessage: '',
        loader: false,
        allCategory: [],
        categoryCount: 0,
    },
    reducers: {
        messageClear: (state, _) => {
            state.errorMessage = ''
            state.successMessage = ''
        }
    },
    extraReducers: {
        [add_category.pending]: (state, _) => {
            state.loader = true
        },
        [add_category.rejected]: (state, { payload }) => {
            state.loader = false
            state.errorMessage = payload.error
        },
        [add_category.fulfilled]: (state, { payload }) => {
            state.loader = false
            state.successMessage = payload.message
        },
        [get_all_category.fulfilled]: (state, { payload }) => {
            state.allCategory = payload.allCategory
            state.categoryCount = payload.categoryCount
        },
    }
});



export const { messageClear } = categoryReducer.actions;
export default categoryReducer.reducer;