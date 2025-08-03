import fs from 'fs';
import path from 'path';
import { v4 as uuid } from "uuid";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dirCodes = path.join(__dirname, 'codes');
const dirInputs = path.join(__dirname, 'inputs');

if (!fs.existsSync(dirCodes)) {
    fs.mkdirSync(dirCodes, { recursive: true });
}
if (!fs.existsSync(dirInputs)) {
    fs.mkdirSync(dirInputs, { recursive: true });
}

export const generateFile = (format, content) => {
    if (format === 'java') {
        const jobDir = path.join(dirCodes, uuid());
        fs.mkdirSync(jobDir, { recursive: true });
        const className = content.match(/public\s+class\s+([a-zA-Z_$][a-zA-Z\d_$]*)/)?.[1] || 'Main';
        const filePath = path.join(jobDir, `${className}.java`);
        fs.writeFileSync(filePath, content);
        return filePath;
    } else {
        const jobId = uuid();
        const fileName = `${jobId}.${format}`;
        const filePath = path.join(dirCodes, fileName);
        fs.writeFileSync(filePath, content);
        return filePath;
    }
};

export const generateInputFile = (input) => {
    const jobId = uuid();
    const fileName = `${jobId}.txt`;
    const filePath = path.join(dirInputs, fileName);
    fs.writeFileSync(filePath, input);
    return filePath;
};