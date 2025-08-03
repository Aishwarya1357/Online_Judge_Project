// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';

// const API_BASE = import.meta.env.DEV ? 'http://localhost:5000/api/questions' : '/api/questions';
// axios.defaults.withCredentials = true;

// export const fetchQuestions = createAsyncThunk(
//     'questions/fetchAll', async (_, { rejectWithValue }) => {
//         try {
//             const response = await axios.get(API_BASE);
//             return response.data.questions;
//         } catch (err) {
//             return rejectWithValue('Failed to fetch questions');
//         }
//     }
// );

// export const createQuestion = createAsyncThunk(
//     'questions/create', async (payload, { rejectWithValue }) => {
//         try {
//             const response = await axios.post(`${API_BASE}/create`, payload);
//             return response.data.question;
//         } catch (err) {
//             return rejectWithValue('Failed to create question');
//         }
//     }
// );

// export const updateQuestion = createAsyncThunk(
//     'questions/update', async ({ id, data }, { rejectWithValue }) => {
//         try {
//             const response = await axios.put(`${API_BASE}/update/${id}`, data);
//             return response.data.question;
//         } catch (err) {
//             return rejectWithValue('Failed to update question');
//         }
//     }
// );

// export const deleteQuestion = createAsyncThunk(
//     'questions/delete', async (id, { rejectWithValue }) => {
//         try {
//             await axios.delete(`${API_BASE}/delete/${id}`);
//             return id;
//         } catch (err) {
//             return rejectWithValue('Failed to delete question');
//         }
//     }
// );

// const questionSlice = createSlice({
//     name: 'questions',
//     initialState: {
//         list: [],
//         status: 'idle',
//         error: null
//     },
//     reducers: {},
//     extraReducers: builder => {
//         builder
//             .addCase(fetchQuestions.fulfilled, (state, action) => { state.list = action.payload; state.status = 'succeeded'; })
//             .addCase(createQuestion.fulfilled, (state, action) => { state.list.push(action.payload); })
//             .addCase(updateQuestion.fulfilled, (state, action) => {
//                 const idx = state.list.findIndex(q => q._id === action.payload._id);
//                 if (idx !== -1) state.list[idx] = action.payload;
//             })
//             .addCase(deleteQuestion.fulfilled, (state, action) => {
//                 state.list = state.list.filter(q => q._id !== action.payload);
//             });
//     }
// });

// export default questionSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = `${import.meta.env.VITE_API_URL}/api/questions`;
axios.defaults.withCredentials = true;

// This thunk fetches the ENTIRE list (for the main questions page)
export const fetchQuestions = createAsyncThunk(
    'questions/fetchAll', async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(API_BASE);
            return response.data.questions;
        } catch (err) {
            return rejectWithValue('Failed to fetch questions');
        }
    }
);

// --- NEW THUNK ---
// This thunk fetches ONLY ONE question by its ID (for the detail page)
export const fetchQuestionById = createAsyncThunk(
    'questions/fetchById', async (id, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_BASE}/${id}`);
            return response.data.question;
        } catch (err) {
            return rejectWithValue('Failed to fetch question details');
        }
    }
);


export const createQuestion = createAsyncThunk(
    'questions/create', async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_BASE}/create`, payload);
            return response.data.question;
        } catch (err) {
            return rejectWithValue('Failed to create question');
        }
    }
);

export const updateQuestion = createAsyncThunk(
    'questions/update', async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API_BASE}/update/${id}`, data);
            return response.data.question;
        } catch (err) {
            return rejectWithValue('Failed to update question');
        }
    }
);

export const deleteQuestion = createAsyncThunk(
    'questions/delete', async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_BASE}/delete/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue('Failed to delete question');
        }
    }
);

const questionSlice = createSlice({
    name: 'questions',
    initialState: {
        list: [], // For the main list page
        selectedQuestion: null, // For the detail page
        status: 'idle', // Tracks status for the LIST
        detailStatus: 'idle', // Tracks status for the DETAIL page
        error: null
    },
    reducers: {
        // Add a reducer to clear the selected question when leaving the detail page
        clearSelectedQuestion: (state) => {
            state.selectedQuestion = null;
            state.detailStatus = 'idle';
        }
    },
    extraReducers: builder => {
        builder
            // Reducers for the main list
            .addCase(fetchQuestions.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchQuestions.fulfilled, (state, action) => { state.list = action.payload; state.status = 'succeeded'; })
            .addCase(fetchQuestions.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })

            // --- NEW REDUCERS for the detail page ---
            .addCase(fetchQuestionById.pending, (state) => { state.detailStatus = 'loading'; })
            .addCase(fetchQuestionById.fulfilled, (state, action) => { state.selectedQuestion = action.payload; state.detailStatus = 'succeeded'; })
            .addCase(fetchQuestionById.rejected, (state, action) => { state.detailStatus = 'failed'; state.error = action.payload; })

            // Reducers for create, update, delete
            .addCase(createQuestion.fulfilled, (state, action) => { state.list.push(action.payload); })
            .addCase(updateQuestion.fulfilled, (state, action) => {
                // Update both the list and the selected question if it matches
                const idx = state.list.findIndex(q => q._id === action.payload._id);
                if (idx !== -1) state.list[idx] = action.payload;
                if (state.selectedQuestion && state.selectedQuestion._id === action.payload._id) {
                    state.selectedQuestion = action.payload;
                }
            })
            .addCase(deleteQuestion.fulfilled, (state, action) => {
                state.list = state.list.filter(q => q._id !== action.payload);
            });
    }
});

// Export the new clear action
export const { clearSelectedQuestion } = questionSlice.actions;

export default questionSlice.reducer;