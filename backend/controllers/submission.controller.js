import { Submission } from "../models/submission.model.js";
import { Question } from "../models/question.model.js";
import axios from "axios";

// Handles "Run" button with custom input
export const runCustomCode = async (req, res) => {
    const { language, code, input } = req.body;
    if (!code) {
        return res.status(400).json({ success: false, output: "Code is required." });
    }
    try {
        // Call compiler service directly
        const response = await axios.post("http://localhost:8000/run", { 
            language, 
            code, 
            input: input || "" 
        });
        return res.status(200).json(response.data);
    } catch (error) {
        console.error("Error in runCustomCode:", error.message);
        return res.status(400).json({ success: false, output: error.message });
    }
};

// Handles "Submit" button
export const submitCode = async (req, res) => {
    const { language, code, questionId } = req.body;
    const userId = req.userId;

    console.log("Submit request received:", { language, questionId, userId, codeLength: code?.length });

    if (!code) {
        return res.status(400).json({ success: false, message: "Code is required" });
    }

    try {
        const question = await Question.findById(questionId);
        if (!question) {
            console.log("Question not found:", questionId);
            return res.status(404).json({ success: false, message: "Question not found" });
        }

        console.log("Creating submission for question:", question.title);
        const newSubmission = await Submission.create({ userId, questionId, language, code, status: "Pending" });
        console.log("Submission created with ID:", newSubmission._id);

        // Start async processing
        processSubmission(newSubmission._id, question, language, code);

        console.log("Returning submission response");
        return res.status(201).json({ success: true, submissionId: newSubmission._id });
    } catch (error) {
        console.error("Error in submitCode controller:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Separate function to process submission asynchronously
async function processSubmission(submissionId, question, language, code) {
    try {
        console.log("Processing submission:", submissionId);
        let finalStatus = 'Accepted';
        let finalOutput = 'All test cases passed!';
        
        for (let i = 0; i < question.testCases.length; i++) {
            const testCase = question.testCases[i];
            console.log(`Testing case ${i + 1}/${question.testCases.length}`);
            
            try {
                const response = await axios.post("http://localhost:8000/run", {
                    language,
                    code,
                    input: testCase.input,
                });
                const result = response.data;
                
                if (!result.success) {
                    finalStatus = 'Compilation Error';
                    finalOutput = result.output;
                    console.log("Compilation error on test case", i + 1);
                    break;
                }
                
                if (result.output.trim() !== testCase.expectedOutput.trim()) {
                    finalStatus = 'Wrong Answer';
                    finalOutput = `Failed on test case ${i + 1}.\nInput:\n${testCase.input}\n\nExpected Output:\n${testCase.expectedOutput}\n\nYour Output:\n${result.output}`;
                    console.log("Wrong answer on test case", i + 1);
                    break;
                }
                
                console.log(`Test case ${i + 1} passed`);
            } catch (err) {
                console.error("Error processing test case:", err);
                finalStatus = 'Runtime Error';
                finalOutput = `Error on test case ${i + 1}: ${err.message}`;
                break;
            }
        }
        
        console.log("Updating submission with result:", finalStatus);
        await Submission.findByIdAndUpdate(submissionId, { 
            status: finalStatus, 
            output: finalOutput 
        });
        console.log("Submission updated successfully");
        
    } catch (error) {
        console.error("Error in processSubmission:", error);
        await Submission.findByIdAndUpdate(submissionId, { 
            status: 'Error', 
            output: 'Internal server error during processing' 
        });
    }
}

// Gets details for a single submission
export const getSubmissionDetails = async (req, res) => {
    const { id: submissionId } = req.params;
    const userId = req.userId;
    
    console.log("Getting submission details:", submissionId, "for user:", userId);
    
    try {
        const submission = await Submission.findById(submissionId).populate('questionId', 'title');
        if (!submission) {
            console.log("Submission not found:", submissionId);
            return res.status(404).json({ success: false, message: "Submission not found." });
        }
        if (submission.userId.toString() !== userId) {
            console.log("Unauthorized access attempt");
            return res.status(403).json({ success: false, message: "Unauthorized." });
        }
        
        console.log("Returning submission:", submission.status);
        res.status(200).json({ success: true, submission });
    } catch (error) {
        console.error("Error in getSubmissionDetails:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Gets all submissions for the logged-in user
export const getUserSubmissions = async (req, res) => {
    const userId = req.userId;
    try {
        const submissions = await Submission.find({ userId })
            .sort({ createdAt: -1 })
            .populate('questionId', 'title');
        res.status(200).json({ success: true, submissions });
    } catch (error) {
        console.error("Error in getUserSubmissions:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};