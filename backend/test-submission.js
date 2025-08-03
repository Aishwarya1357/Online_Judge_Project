import axios from "axios";

const BASE_URL = "http://localhost:5000/api";
const COMPILER_URL = "http://localhost:8000";

// Test data
const testData = {
    language: "cpp",
    code: `#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    cout << a + b << endl;
    return 0;
}`,
    input: "5 3",
    questionId: "your_question_id_here" // Replace with actual question ID
};

async function testCompiler() {
    console.log("=== Testing Compiler Service ===");
    try {
        const response = await axios.post(`${COMPILER_URL}/run`, {
            language: testData.language,
            code: testData.code,
            input: testData.input
        });
        console.log("✅ Compiler service working");
        console.log("Response:", response.data);
    } catch (error) {
        console.error("❌ Compiler service error:", error.message);
    }
}

async function testBackend() {
    console.log("\n=== Testing Backend API ===");
    try {
        const response = await axios.get(`${BASE_URL}/questions`);
        console.log("✅ Backend API working");
        console.log("Questions count:", response.data.questions?.length || 0);
    } catch (error) {
        console.error("❌ Backend API error:", error.message);
    }
}

async function testSubmission() {
    console.log("\n=== Testing Submission Flow ===");
    
    // First, get a question ID
    try {
        const questionsResponse = await axios.get(`${BASE_URL}/questions`);
        const questions = questionsResponse.data.questions;
        
        if (questions && questions.length > 0) {
            const questionId = questions[0]._id;
            console.log("Using question ID:", questionId);
            
            // Test submission (this will fail without auth, but we can see the error)
            try {
                const submitResponse = await axios.post(`${BASE_URL}/submissions/submit`, {
                    language: testData.language,
                    code: testData.code,
                    questionId: questionId
                });
                console.log("✅ Submission endpoint working");
                console.log("Response:", submitResponse.data);
            } catch (error) {
                if (error.response?.status === 401) {
                    console.log("✅ Submission endpoint working (auth required as expected)");
                } else {
                    console.error("❌ Submission endpoint error:", error.message);
                }
            }
        } else {
            console.log("No questions found in database");
        }
    } catch (error) {
        console.error("❌ Error getting questions:", error.message);
    }
}

async function runTests() {
    console.log("Starting submission flow tests...\n");
    
    await testCompiler();
    await testBackend();
    await testSubmission();
    
    console.log("\n=== Test Complete ===");
}

runTests().catch(console.error); 