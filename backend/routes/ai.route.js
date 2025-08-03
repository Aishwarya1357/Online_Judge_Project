import express from "express";
import { getHint, reviewCode } from "../controllers/ai.controller.js"; 
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/hint", verifyToken, getHint);
router.post("/review", verifyToken, reviewCode); 

export default router;