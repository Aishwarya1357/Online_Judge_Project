import mongoose from 'mongoose';

// Define a schema for individual test cases FIRST
const testCaseSchema = new mongoose.Schema({
    input: {
        type: String,
        required: true,
    },
    expectedOutput: {
        type: String,
        required: true,
    },
});

// NOW, use testCaseSchema inside the main questionSchema
const questionSchema = new mongoose.Schema({
    qid: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    sampleInput: {
        type: String,
        required: true
    },
    sampleOutput: {
        type: String,
        required: true
    },
    // This line will now work correctly
    testCases: [testCaseSchema],
    constraints: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: false
    }
}, { timestamps: true });


export const Question = mongoose.model('Question', questionSchema);