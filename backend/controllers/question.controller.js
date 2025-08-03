// // backend/controllers/question.controller.js
// import { question } from "../models/question.model.js";

// // Create
// export const createQuestion = async (req, res) => {
//     const { qid, title, description, input, output, constraints, company } = req.body;
//     try {
//         if (!qid || !title || !description) {
//             throw new Error("qid, title, and description are required");
//         }
//         if (await question.findOne({ qid })) {
//             return res.status(400).json({ success: false, message: "Question already exists" });
//         }
//         const newQ = await new question(req.body).save();
//         res.status(201).json({ success: true, question: newQ });
//     } catch (err) {
//         res.status(400).json({ success: false, message: err.message });
//     }
// };

// // List all
// export const listQuestions = async (req, res) => {
//     try {
//         const all = await question.find().sort({ createdAt: -1 });
//         res.json({ success: true, questions: all });
//     } catch (err) {
//         res.status(500).json({ success: false, message: err.message });
//     }
// };

// // Get one
// export const getQuestion = async (req, res) => {
//     try {
//         const q = await question.findById(req.params.id);
//         if (!q) return res.status(404).json({ success: false, message: "Not found" });
//         res.json({ success: true, question: q });
//     } catch (err) {
//         res.status(500).json({ success: false, message: err.message });
//     }
// };

// // Update
// export const updateQuestion = async (req, res) => {
//     try {
//         const updated = await question.findByIdAndUpdate(
//             req.params.id,
//             req.body,
//             { new: true, runValidators: true }
//         );
//         if (!updated) return res.status(404).json({ success: false, message: "Not found" });
//         res.json({ success: true, question: updated });
//     } catch (err) {
//         res.status(400).json({ success: false, message: err.message });
//     }
// };

// // Delete
// export const deleteQuestion = async (req, res) => {
//     try {
//         const removed = await question.findByIdAndDelete(req.params.id);
//         if (!removed) return res.status(404).json({ success: false, message: "Not found" });
//         res.json({ success: true, message: "Deleted" });
//     } catch (err) {
//         res.status(500).json({ success: false, message: err.message });
//     }
// };



// import { Question } from "../models/question.model.js"; // Conventionally, models are capitalized

// // Create
// export const createQuestion = async (req, res) => {
//     // Destructure all the new fields from the request body
//     const { qid, title, description, sampleInput, sampleOutput, constraints, testCases, company } = req.body;

//     try {
//         // Updated validation to check for the new required fields
//         if (!qid || !title || !description || !sampleInput || !sampleOutput) {
//             return res.status(400).json({ success: false, message: "qid, title, description, sampleInput, and sampleOutput are required" });
//         }
//         if (await Question.findOne({ qid })) {
//             return res.status(400).json({ success: false, message: "A question with this QID already exists" });
//         }

//         // Create a new question instance with the entire request body, which now includes testCases
//         const newQ = new Question(req.body);
//         await newQ.save();

//         res.status(201).json({ success: true, question: newQ });
//     } catch (err) {
//         res.status(400).json({ success: false, message: err.message });
//     }
// };

// // List all
// export const listQuestions = async (req, res) => {
//     try {
//         const all = await Question.find().sort({ createdAt: -1 });
//         res.json({ success: true, questions: all });
//     } catch (err) {
//         res.status(500).json({ success: false, message: err.message });
//     }
// };

// // Get one
// export const getQuestion = async (req, res) => {
//     try {
//         const q = await Question.findById(req.params.id);
//         if (!q) return res.status(404).json({ success: false, message: "Not found" });
//         res.json({ success: true, question: q });
//     } catch (err) {
//         res.status(500).json({ success: false, message: err.message });
//     }
// };

// // Update
// export const updateQuestion = async (req, res) => {
//     try {
//         // This function works as is because req.body will contain the full updated object
//         const updated = await Question.findByIdAndUpdate(
//             req.params.id,
//             req.body,
//             { new: true, runValidators: true }
//         );
//         if (!updated) return res.status(404).json({ success: false, message: "Not found" });
//         res.json({ success: true, question: updated });
//     } catch (err) {
//         res.status(400).json({ success: false, message: err.message });
//     }
// };

// // Delete
// export const deleteQuestion = async (req, res) => {
//     try {
//         const removed = await Question.findByIdAndDelete(req.params.id);
//         if (!removed) return res.status(404).json({ success: false, message: "Not found" });
//         res.json({ success: true, message: "Deleted" });
//     } catch (err) {
//         res.status(500).json({ success: false, message: err.message });
//     }
// };

import { Submission } from "../models/submission.model.js";
import { Question } from "../models/question.model.js";

// Create
export const createQuestion = async (req, res) => {
    const { qid, title, description, sampleInput, sampleOutput, constraints, testCases, company } = req.body;
    try {
        if (!qid || !title || !description || !sampleInput || !sampleOutput) {
            return res.status(400).json({ success: false, message: "qid, title, description, sampleInput, and sampleOutput are required" });
        }
        if (await Question.findOne({ qid })) {
            return res.status(400).json({ success: false, message: "A question with this QID already exists" });
        }
        const newQ = new Question(req.body);
        await newQ.save();
        res.status(201).json({ success: true, question: newQ });
    } catch (err) {
        console.error("Error in createQuestion:", err); // Added for better logging
        res.status(400).json({ success: false, message: err.message });
    }
};

// List all
export const listQuestions = async (req, res) => {
    try {
        // --- FIX ---
        // Removed the .sort() for now to increase stability.
        // We can add it back later if needed, but this is a common failure point.
        const allQuestions = await Question.find({});
        res.status(200).json({ success: true, questions: allQuestions });
    } catch (err) {
        // --- FIX ---
        // Added detailed logging to the terminal. This is VERY important for debugging.
        console.error("Error in listQuestions controller:", err);
        res.status(500).json({ success: false, message: "An error occurred while fetching questions." });
    }
};

// Get one
export const getQuestion = async (req, res) => {
    try {
        const q = await Question.findById(req.params.id);
        if (!q) return res.status(404).json({ success: false, message: "Not found" });
        res.json({ success: true, question: q });
    } catch (err) {
        console.error("Error in getQuestion:", err); // Added for better logging
        res.status(500).json({ success: false, message: err.message });
    }
};

// Update
export const updateQuestion = async (req, res) => {
    try {
        const updated = await Question.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updated) return res.status(404).json({ success: false, message: "Not found" });
        res.json({ success: true, question: updated });
    } catch (err) {
        console.error("Error in updateQuestion:", err); // Added for better logging
        res.status(400).json({ success: false, message: err.message });
    }
};

// Delete
export const deleteQuestion = async (req, res) => {
    try {
        const removed = await Question.findByIdAndDelete(req.params.id);
        if (!removed) return res.status(404).json({ success: false, message: "Not found" });
        res.json({ success: true, message: "Deleted" });
    } catch (err) {
        console.error("Error in deleteQuestion:", err); // Added for better logging
        res.status(500).json({ success: false, message: err.message });
    }
};
