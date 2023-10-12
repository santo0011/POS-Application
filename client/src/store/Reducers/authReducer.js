import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';
import jwt from 'jwt-decode';



// user_register_function
export const register = createAsyncThunk(
    'auth/register',
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post('/user-register', info);
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)


// verify_email
export const verify_email = createAsyncThunk(
    'auth/verify_email',
    async (otp, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post('/verify-email', { otp });
            localStorage.setItem('pos_token', data.token)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)


// user_login
export const user_login = createAsyncThunk(
    'auth/user_login',
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post('/user-login', info);
            localStorage.setItem('pos_token', data.token)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)


const decodeToken = (token) => {
    if (token) {
        const decodeToken = jwt(token)
        const expireTime = new Date(decodeToken.exp * 1000)
        if (new Date() > expireTime) {
            localStorage.removeItem('pos_token')
            return ''
        } else {
            return decodeToken
        }
    } else {
        return ''
    }
}


export const authReducer = createSlice({
    name: "auth",
    initialState: {
        authenticate: false,
        userInfo: decodeToken(localStorage.getItem('pos_token')),
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
        [register.pending]: (state, _) => {
            state.loader = true
        },
        [register.rejected]: (state, { payload }) => {
            state.loader = false
            state.errorMessage = payload.error
        },
        [register.fulfilled]: (state, { payload }) => {
            state.loader = false
            state.successMessage = payload.message
        },
        [verify_email.pending]: (state, _) => {
            state.loader = true
        },
        [verify_email.rejected]: (state, { payload }) => {
            state.loader = false
            state.errorMessage = payload.error
        },
        [verify_email.fulfilled]: (state, { payload }) => {
            state.loader = false
            state.successMessage = payload.successMessage
            state.authenticate = true
            state.userInfo = decodeToken(payload.token)
        },
        [user_login.pending]: (state, _) => {
            state.loader = true
        },
        [user_login.rejected]: (state, { payload }) => {
            state.loader = false
            state.authenticate = false
            state.errorMessage = payload.error
        },
        [user_login.fulfilled]: (state, { payload }) => {
            state.loader = false
            state.authenticate = true
            state.successMessage = payload.message
            state.userInfo = decodeToken(payload.token)
        }
    }
});


export const { messageClear } = authReducer.actions;
export default authReducer.reducer;