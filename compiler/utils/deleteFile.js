import fs from 'fs-extra';

async function deleteFile(filePath) {
    try {
        console.log(`Deleting file: ${filePath}`);
        await fs.remove(filePath);
        console.log('File deleted successfully');
    } catch (err) {
        console.error('Delete failed:', err.message);
        throw err;
    }
}

export default deleteFile;