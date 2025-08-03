// // backend/routes/question.route.js
// import express from "express";
// import {
//   createQuestion,
//   listQuestions,
//   getQuestion,
//   updateQuestion,
//   deleteQuestion,
//   getSolvedStatus
// } from "../controllers/question.controller.js";
// import { verifyToken, verifyAdmin } from "../middleware/verifyToken.js";

// const router = express.Router();

// // Public: list & view
// router.get("/", listQuestions);
// router.get("/:id", getQuestion);

// // Protected: admin only
// router.post("/create", verifyToken, verifyAdmin, createQuestion);
// router.put("/update/:id", verifyToken, verifyAdmin, updateQuestion);
// router.delete("/delete/:id", verifyToken, verifyAdmin, deleteQuestion);
// router.get("/solved-status", verifyToken, getSolvedStatus);

// export default router;

import express from "express";
import {
  createQuestion,
  listQuestions,
  getQuestion,
  updateQuestion,
  deleteQuestion
} from "../controllers/question.controller.js";
import { verifyToken, verifyAdmin } from "../middleware/verifyToken.js";

const router = express.Router();

// Public: list & view
router.get("/", listQuestions);
router.get("/:id", getQuestion);

// Protected: admin only
router.post("/create", verifyToken, verifyAdmin, createQuestion);
router.put("/update/:id", verifyToken, verifyAdmin, updateQuestion);
router.delete("/delete/:id", verifyToken, verifyAdmin, deleteQuestion);

// The '/solved-status' route has been removed.

export default router;
