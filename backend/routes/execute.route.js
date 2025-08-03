import express from "express";
import axios from "axios";
const router = express.Router();
import dotenv from "dotenv";
dotenv.config();
const compilerServiceUrl = process.env.COMPILER_SERVICE_URL;
// POST /api/execute
router.post("/execute", async (req, res) => {
  const { code, language, input } = req.body;
  try {
    // Forward the request to the compiler service
    console.log(`Forwarding request to compiler service at ${compilerServiceUrl}`);
    
    const response = await axios.post(`${compilerServiceUrl}/run`, {
      code,
      language,
      input,
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
