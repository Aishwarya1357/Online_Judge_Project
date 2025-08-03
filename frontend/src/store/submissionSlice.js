// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import client from "../api/client";

// export const fetchUserSubmissions = createAsyncThunk(
//     "submissions/fetchByUser",
//     async (_, { rejectWithValue }) => {
//         try {
//             const res = await client.get("/submissions/user");
//             return res.data.submissions; // Return the array of submissions
//         } catch (err) {
//             return rejectWithValue("Failed to fetch submissions");
//         }
//     }
// );

// const submissionSlice = createSlice({
//     name: "submissions",
//     initialState: {
//         list: [],
//         status: "idle",
//         error: null
//     },
//     reducers: {},
//     extraReducers: (builder) => {
//         builder
//             .addCase(fetchUserSubmissions.pending, (state) => {
//                 state.status = "loading";
//             })
//             .addCase(fetchUserSubmissions.fulfilled, (state, action) => {
//                 state.status = "succeeded";
//                 state.list = action.payload;
//             })
//             .addCase(fetchUserSubmissions.rejected, (state, action) => {
//                 state.status = "failed";
//                 state.error = action.payload;
//             });
//     },
// });

// export default submissionSlice.reducer;


import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import client from "../api/client";

export const fetchUserSubmissions = createAsyncThunk(
    "submissions/fetchByUser",
    async (_, { rejectWithValue }) => {
        try {
            const res = await client.get("/submissions/user");
            return res.data.submissions;
        } catch (err) {
            return rejectWithValue("Failed to fetch submissions");
        }
    }
);

// --- NEW THUNK ---
export const fetchSubmissionById = createAsyncThunk(
    "submissions/fetchById",
    async (id, { rejectWithValue }) => {
        try {
            const res = await client.get(`/submissions/${id}`);
            return res.data.submission;
        } catch (err) {
            return rejectWithValue("Failed to fetch submission details");
        }
    }
);

const submissionSlice = createSlice({
    name: "submissions",
    initialState: {
        list: [],
        selectedSubmission: null, // <-- NEW STATE
        status: "idle",
        detailStatus: "idle", // <-- NEW STATE
        error: null,
    },
    reducers: {
        // --- NEW REDUCER ---
        clearSelectedSubmission: (state) => {
            state.selectedSubmission = null;
            state.detailStatus = 'idle';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserSubmissions.pending, (state) => { state.status = "loading"; })
            .addCase(fetchUserSubmissions.fulfilled, (state, action) => { state.status = "succeeded"; state.list = action.payload; })
            .addCase(fetchUserSubmissions.rejected, (state, action) => { state.status = "failed"; state.error = action.payload; })
            // --- NEW CASES ---
            .addCase(fetchSubmissionById.pending, (state) => { state.detailStatus = "loading"; })
            .addCase(fetchSubmissionById.fulfilled, (state, action) => { state.detailStatus = "succeeded"; state.selectedSubmission = action.payload; })
            .addCase(fetchSubmissionById.rejected, (state, action) => { state.detailStatus = "failed"; state.error = action.payload; });
    },
});

export const { clearSelectedSubmission } = submissionSlice.actions;
export default submissionSlice.reducer;