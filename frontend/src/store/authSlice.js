// === File: src/store / authSlice.js ===
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api/auth`;
axios.defaults.withCredentials = true;

export const signup = createAsyncThunk(
    'auth/signup',
    async ({ email, password, name, adminCode }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/signup`, { email, password, name, adminCode });
            return response.data.user;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Signup failed');
        }
    }
);

export const login = createAsyncThunk(
    'auth/login',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/login`, { email, password });
            return response.data.user;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Login failed');
        }
    }
);

export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await axios.post(`${API_URL}/logout`);
            return;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Logout failed');
        }
    }
);

export const checkAuth = createAsyncThunk(
    'auth/checkAuth',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/check-auth`);
            if (response.data.authenticated === false) {
                return rejectWithValue('Not authenticated');
            }
            return response.data.user;
        } catch (err) {
            return rejectWithValue('Auth check failed');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        isAuthenticated: false,
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(signup.pending, state => { state.status = 'loading'; state.error = null; })
            .addCase(signup.fulfilled, (state, action) => { state.status = 'succeeded'; state.user = action.payload; state.isAuthenticated = true; })
            .addCase(signup.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })

            .addCase(login.pending, state => { state.status = 'loading'; state.error = null; })
            .addCase(login.fulfilled, (state, action) => { state.status = 'succeeded'; state.user = action.payload; state.isAuthenticated = true; })
            .addCase(login.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })

            .addCase(logout.pending, state => { // <-- ADDED: Handles loading state for logout.
                state.status = 'loading';
                state.error = null;
            })
            .addCase(logout.fulfilled, state => {
                state.user = null;
                state.isAuthenticated = false;
                state.status = 'idle';
                state.error = null;
            })
            .addCase(logout.rejected, (state, action) => { // <-- ADDED: Handles logout failure.
                // Even if logout fails on the server, clear client state for better UX.
                state.user = null;
                state.isAuthenticated = false;
                state.status = 'failed';
                state.error = action.payload;
            })

            .addCase(checkAuth.pending, state => { state.status = 'loading'; })
            .addCase(checkAuth.fulfilled, (state, action) => { state.status = 'succeeded'; state.user = action.payload; state.isAuthenticated = true; })
            .addCase(checkAuth.rejected, state => { state.status = 'failed'; state.user = null; state.isAuthenticated = false; });
            
    }
});

export default authSlice.reducer;
