import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';


// add_category
export const add_category = createAsyncThunk(
    'category/add_category',
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post('/add-category', info, { withCredentials: true });
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
            const { data } = await api.get(`/get-category?searchValue=${searchValue}&&page=${page}&&parPage=${parPage}`, { withCredentials: true });
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)


// delete_category
export const delete_category = createAsyncThunk(
    'category/delete_category',
    async (id, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.delete(`/delete-category/${id}`, { withCredentials: true });
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)


// edit_category
export const edit_category = createAsyncThunk(
    'category/edit_category',
    async (cateSlug, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/edit-category/${cateSlug}`, { withCredentials: true });
            return fulfillWithValue(data)
        } catch (error) {
            console.log(error.message)
        }
    }
)


// update_category
export const update_category = createAsyncThunk(
    'category/update_category',
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.put(`/update-category`, info, { withCredentials: true });
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
        editCategory: {}
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
            state.allCategory = [...state.allCategory, payload.category]
            state.categoryCount = state.categoryCount + 1
        },
        [get_all_category.fulfilled]: (state, { payload }) => {
            state.allCategory = payload.allCategory
            state.categoryCount = payload.categoryCount
        },
        [delete_category.fulfilled]: (state, { payload }) => {
            state.successMessage = payload.message
        },
        [edit_category.fulfilled]: (state, { payload }) => {
            state.editCategory = payload.editCategory
        },
        [update_category.pending]: (state, _) => {
            state.loader = true
        },
        [update_category.rejected]: (state, { payload }) => {
            state.loader = false
            state.errorMessage = payload.error
        },
        [update_category.fulfilled]: (state, { payload }) => {
            state.successMessage = payload.message
            state.loader = false
        }
    }
});


export const { messageClear } = categoryReducer.actions;
export default categoryReducer.reducer;