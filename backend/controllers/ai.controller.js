import { Question } from "../models/question.model.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const getHint = async (req, res) => {
    const { questionId } = req.body;

    if (!questionId) {
        return res.status(400).json({ message: "Question ID is required." });
    }

    // Check if API key is available (try both variable names)
    const apiKey = process.env.GOOGLE_API_KEY || process.env.API;
    if (!apiKey) {
        console.error("No Google API key found in environment variables");
        return res.status(500).json({ message: "AI service is not configured. Please contact administrator." });
    }

    try {
        const question = await Question.findById(questionId);
        if (!question) {
            return res.status(404).json({ message: "Question not found." });
        }

        console.log("Generating hint for question:", question.title);
        console.log("API Key available:", !!apiKey);

        // Initialize the Google AI client
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Construct a detailed prompt for better results
        const prompt = `
            You are a helpful programming assistant for an Online Judge platform.
            A user is stuck on the following programming problem and has requested a hint.

            Provide a concise, high-level hint to guide them in the right direction.
            Do NOT give away the full solution or write any code.
            Focus on the general approach, a key data structure, or an important observation they might be missing.

            Problem Title: ${question.title}
            Problem Description: ${question.description}

            Hint:
        `;

        console.log("Sending request to Gemini API...");
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const hintText = response.text();

        console.log("Hint generated successfully");
        res.status(200).json({ hint: hintText });

    } catch (error) {
        console.error("Error generating hint from Gemini API:", error);
        console.error("Error details:", {
            message: error.message,
            stack: error.stack,
            apiKey: apiKey ? "Present" : "Missing"
        });
        
        // Provide more specific error messages
        if (error.message.includes("API_KEY") || error.message.includes("invalid")) {
            res.status(500).json({ message: "Invalid API key. Please check configuration." });
        } else if (error.message.includes("quota")) {
            res.status(500).json({ message: "API quota exceeded. Please try again later." });
        } else {
            res.status(500).json({ message: `Failed to generate hint: ${error.message}` });
        }
    }
};

export const reviewCode = async (req, res) => {
    const { questionId, userCode, language } = req.body;

    if (!questionId || !userCode || !language) {
        return res.status(400).json({ message: "Question ID, user code, and language are required." });
    }

    // Check if API key is available (try both variable names)
    const apiKey = process.env.GOOGLE_API_KEY || process.env.API;
    if (!apiKey) {
        console.error("No Google API key found in environment variables");
        return res.status(500).json({ message: "AI service is not configured. Please contact administrator." });
    }

    try {
        const question = await Question.findById(questionId);
        if (!question) {
            return res.status(404).json({ message: "Question not found." });
        }

        // Initialize the Google AI client
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Construct a very specific prompt for a high-quality review
        const prompt = `
            As an expert programming instructor, review the following code submitted for a competitive programming problem.

            Problem Title: ${question.title}
            Problem Description: ${question.description}
            Language: ${language}

            User's Code:
            \`\`\`${language}
            ${userCode}
            \`\`\`

            Please provide a concise code review focusing on the following aspects:
            1.  **Correctness:** Does the logic correctly solve the problem? If not, what is the logical flaw?
            2.  **Efficiency:** What is the time and space complexity? Is there a more efficient approach (e.g., using a different algorithm or data structure)?
            3.  **Best Practices & Style:** Mention any improvements related to coding standards, readability, or language-specific best practices (e.g., using std::endl in C++, proper variable naming).

            Structure your review with clear headings for each section. Do NOT provide the complete corrected code, but guide the user toward the solution.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const reviewText = response.text();

        res.status(200).json({ review: reviewText });

    } catch (error) {
        console.error("Error generating code review from Gemini API:", error);
        
        // Provide more specific error messages
        if (error.message.includes("API_KEY") || error.message.includes("invalid")) {
            res.status(500).json({ message: "Invalid API key. Please check configuration." });
        } else if (error.message.includes("quota")) {
            res.status(500).json({ message: "API quota exceeded. Please try again later." });
        } else {
            res.status(500).json({ message: `Failed to generate code review: ${error.message}` });
        }
    }
};