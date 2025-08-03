import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

import questionReducer from './questionSlice';
import submissionReducer from './submissionSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        questions: questionReducer,
        submissions: submissionReducer
    }
});


