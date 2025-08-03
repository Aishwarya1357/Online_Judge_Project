import express from 'express';
import dotenv from "dotenv";
dotenv.config({ path: './backend/.env' });
import cors from 'cors';
import cookieParser from 'cookie-parser'

import { connectDB } from './db/connectDB.js';

import authRoutes from "./routes/auth.route.js"
import questionRoutes from "./routes/question.route.js";
import submissionRoutes from "./routes/submission.route.js";
import aiRoutes from "./routes/ai.route.js";
import executeRoutes from "./routes/execute.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enhanced CORS configuration
app.use(cors({
    origin: [
        'http://localhost:5173', 
        'http://127.0.0.1:5173', 
        'http://localhost:3000',
        'https://online-judge-project-1-es3p.onrender.com',
        'https://online-judge-project-2-f7pc.onrender.com',
        process.env.FRONTEND_URL // Add this to support environment variable
    ].filter(Boolean), // Remove any undefined values
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
}));

app.use(express.json()); //allows us to parse incoming req with json payloads or allows parsing incoming requests : req.body
app.use(cookieParser()); //allows us to parse cookies from incoming requests

app.use("/api/auth", authRoutes)
app.use("/api/questions", questionRoutes) // Assuming you want to use the same routes for questions, adjust as necessary
app.use("/api/submissions", submissionRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api", executeRoutes);

app.listen(PORT, () => {
    connectDB();
    console.log("Server is running on port: ", PORT);
})