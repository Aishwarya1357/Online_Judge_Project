import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log("=== Environment Variables Test ===");
console.log("Current directory:", __dirname);

// Check if .env file exists in different locations
const possibleEnvPaths = [
    './backend/.env',
    './.env',
    '../.env',
    join(__dirname, '.env'),
    join(__dirname, '..', '.env')
];

console.log("\n=== Checking for .env files ===");
for (const path of possibleEnvPaths) {
    const exists = fs.existsSync(path);
    console.log(`${path}: ${exists ? '✅ Found' : '❌ Not found'}`);
    if (exists) {
        const content = fs.readFileSync(path, 'utf8');
        console.log(`  Content preview: ${content.substring(0, 100)}...`);
    }
}

// Try to load environment variables from different locations
let envLoaded = false;
for (const path of possibleEnvPaths) {
    if (fs.existsSync(path)) {
        console.log(`\nTrying to load from: ${path}`);
        const result = dotenv.config({ path });
        if (!result.error) {
            console.log(`✅ Successfully loaded from: ${path}`);
            envLoaded = true;
            break;
        } else {
            console.log(`❌ Failed to load from: ${path}: ${result.error.message}`);
        }
    }
}

if (!envLoaded) {
    console.log("\n❌ No .env file could be loaded!");
}

console.log("\n=== Environment Variables ===");
console.log("GOOGLE_API_KEY:", process.env.GOOGLE_API_KEY ? "Present" : "Missing");
console.log("API:", process.env.API ? "Present" : "Missing");
console.log("PORT:", process.env.PORT);
console.log("MONGO_URI:", process.env.MONGO_URI ? "Present" : "Missing");
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "Present" : "Missing");

// Test Google AI connection
const apiKey = process.env.GOOGLE_API_KEY || process.env.API;
if (apiKey) {
    try {
        console.log("\n=== Testing Google AI Connection ===");
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const result = await model.generateContent("Hello, this is a test message.");
        const response = await result.response;
        const text = response.text();
        
        console.log("✅ Google AI connection successful!");
        console.log("Test response:", text.substring(0, 50) + "...");
    } catch (error) {
        console.error("❌ Google AI connection failed:", error.message);
    }
} else {
    console.log("\n❌ No Google API key found in environment variables");
    console.log("Make sure your .env file contains either GOOGLE_API_KEY or API variable");
}

console.log("\n=== Test Complete ==="); 