import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs-extra';
import { generateFile, generateInputFile } from "./generateFile.js";
import { executeCpp, executePython, executeJava } from "./execute.js";
import { v4 as uuid } from "uuid";

const app = express();

dotenv.config();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.json({ online: 'compiler' });
});

app.post("/run", async (req, res) => {
    const { language = 'cpp', code, input = '' } = req.body;
    console.log("Received request:", { language, codeLength: code?.length, inputLength: input?.length });

    if (!code) {
        return res.status(400).json({ success: false, output: "Code not found" });
    }

    let filePath = null;
    let inputFilePath = null;

    try {
        // Generate files
        filePath = generateFile(language, code);
        inputFilePath = generateInputFile(input);
        
        console.log(`Generated files - Code: ${filePath}, Input: ${inputFilePath}`);

        const cleanup = async () => {
            try {
                if (filePath && await fs.pathExists(filePath)) {
                    await fs.remove(filePath);
                    console.log(`Cleaned up code file: ${filePath}`);
                }
                if (inputFilePath && await fs.pathExists(inputFilePath)) {
                    await fs.remove(inputFilePath);
                    console.log(`Cleaned up input file: ${inputFilePath}`);
                }
            } catch (cleanupError) {
                console.error('Cleanup error:', cleanupError);
            }
        };

        const handleExecution = async (execFn) => {
            try {
                console.log(`Executing ${language} code...`);
                const output = await execFn(filePath, inputFilePath);
                await cleanup();
                console.log(`Execution successful for ${language}`);
                return res.json({ success: true, output });
            } catch (err) {
                console.error(`Execution failed for ${language}:`, err);
                await cleanup();
                return res.json({ success: false, output: err.toString() });
            }
        };

        // Route to appropriate execution function
        if (language === 'cpp' || language === 'c') {
            return await handleExecution(executeCpp);
        }
        if (language === 'py' || language === 'python') {
            return await handleExecution(executePython);
        }
        if (language === 'java') {
            return await handleExecution(executeJava);
        }
        
        await cleanup();
        return res.json({ success: false, output: `Unsupported language: ${language}` });
        
    } catch (error) {
        console.error('Unexpected error:', error);
        try {
            if (filePath && await fs.pathExists(filePath)) await fs.remove(filePath);
            if (inputFilePath && await fs.pathExists(inputFilePath)) await fs.remove(inputFilePath);
        } catch (cleanupError) {
            console.error('Cleanup error during exception:', cleanupError);
        }
        return res.status(500).json({ success: false, output: error.message });
    }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, (error) => {
    if (error) {
        console.error("Error starting server:", error);
    } else {
        console.log(`Compiler server is running on port ${PORT}`);
    }
});