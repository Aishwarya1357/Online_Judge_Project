//creates new process basically shell in backend
import { exec } from "child_process";
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { platform } from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputPath = path.join(__dirname, 'outputs');

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

// Determine the correct Python command based on platform
const getPythonCommand = () => {
    return platform() === 'win32' ? 'python' : 'python3';
};

export const executeCpp = async (filePath, inputFilePath) => {
    const jobId = path.basename(filePath).split('.')[0];
    const outPath = path.join(outputPath, `${jobId}.out`);
    return new Promise((resolve, reject) => {
        const compileCmd = `g++ "${filePath}" -o "${outPath}"`;
        const runCmd = platform() === 'win32'
            ? `cd "${outputPath}" && type "${inputFilePath}" | "${jobId}.out"`
            : `cd "${outputPath}" && ./$(basename ${outPath}) < "${inputFilePath}"`;
        
        const execCmd = `${compileCmd} && ${runCmd}`;
        
        exec(execCmd, async (error, stdout, stderr) => {
            try {
                if (error) {
                    console.error(`Error: ${error.message}`);
                    // Check if it's a missing compiler error
                    if (error.message.includes("'g++' is not recognized") || error.message.includes("command not found")) {
                        reject("C++ compiler (g++) is not installed. Please install MinGW-w64 or Visual Studio Build Tools.");
                    } else {
                        reject(error);
                    }
                    return;
                }
                if (stderr) { // compilation and runtime errors
                    console.error(`Stderr: ${stderr}`);
                    reject(stderr);
                    return;
                }
                console.log(`Stdout: ${stdout}`);
                resolve(stdout);
            } finally {
                // Delete output file after execution
                try {
                    if (await fs.pathExists(outPath)) {
                        await fs.remove(outPath);
                    }
                } catch (cleanupError) {
                    console.error('Failed to cleanup output file:', cleanupError);
                }
            }
        });
    });
}

export const executePython = async (filePath, inputFilePath) => {
    const pythonCmd = getPythonCommand();
    return new Promise((resolve, reject) => {
        // Use type command on Windows to read file content and pipe to python
        const execCmd = platform() === 'win32' 
            ? `type "${inputFilePath}" | ${pythonCmd} "${filePath}"`
            : `${pythonCmd} "${filePath}" < "${inputFilePath}"`;
        
        console.log(`Executing Python command: ${execCmd}`);
        
        exec(execCmd, { timeout: 10000 }, async (error, stdout, stderr) => {
            if (error) {
                console.error(`Python execution error: ${error.message}`);
                reject(error.message);
                return;
            }
            if (stderr) {
                console.error(`Python stderr: ${stderr}`);
                reject(stderr);
                return;
            }
            console.log(`Python stdout: ${stdout}`);
            resolve(stdout);
        });
    });
};

export const executeJava = async (filePath, inputFilePath) => {
    const className = path.basename(filePath, '.java');
    const fileDir = path.dirname(filePath);
    
    return new Promise((resolve, reject) => {
        // First compile, then run
        const compileCmd = `javac "${filePath}"`;
        const runCmd = platform() === 'win32'
            ? `cd "${fileDir}" && type "${inputFilePath}" | java ${className}`
            : `cd "${fileDir}" && java ${className} < "${inputFilePath}"`;
        
        console.log(`Compiling Java: ${compileCmd}`);
        exec(compileCmd, (compileError, compileStdout, compileStderr) => {
            if (compileError) {
                console.error(`Java compilation error: ${compileError.message}`);
                reject(compileError.message);
                return;
            }
            if (compileStderr) {
                console.error(`Java compilation stderr: ${compileStderr}`);
                reject(compileStderr);
                return;
            }
            
            console.log(`Running Java: ${runCmd}`);
            exec(runCmd, { timeout: 10000 }, async (runError, runStdout, runStderr) => {
                try {
                    if (runError) {
                        console.error(`Java execution error: ${runError.message}`);
                        reject(runError.message);
                        return;
                    }
                    if (runStderr) {
                        console.error(`Java execution stderr: ${runStderr}`);
                        reject(runStderr);
                        return;
                    }
                    console.log(`Java stdout: ${runStdout}`);
                    resolve(runStdout);
                } finally {
                    // Clean up compiled .class files
                    try {
                        const classFile = path.join(fileDir, `${className}.class`);
                        if (await fs.pathExists(classFile)) {
                            await fs.remove(classFile);
                        }
                    } catch (cleanupError) {
                        console.error('Failed to cleanup Java class file:', cleanupError);
                    }
                }
            });
        });
    });
};