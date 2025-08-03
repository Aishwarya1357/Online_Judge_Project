

// import express from 'express';
// import { submitCode, getSubmissionStatus, runCustomCode, getUserSubmissions } from '../controllers/submission.controller.js';
// import { verifyToken } from '../middleware/verifyToken.js';

// const router = express.Router();

// router.post("/run", verifyToken, runCustomCode);
// router.post('/submit', verifyToken, submitCode);

// // This route MUST come before the '/:id' route to avoid conflicts
// router.get("/user", verifyToken, getUserSubmissions);

// router.get('/:id', verifyToken, getSubmissionStatus);

// export default router;

import express from 'express';
import {
    submitCode,
    runCustomCode,
    getUserSubmissions,
    getSubmissionDetails // <-- UPDATED NAME
} from '../controllers/submission.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.post("/run", verifyToken, runCustomCode);
router.post('/submit', verifyToken, submitCode);
router.get("/user", verifyToken, getUserSubmissions);
router.get('/:id', verifyToken, getSubmissionDetails); // <-- UPDATED NAME

export default router;