import express from "express";
import { getProfile } from "./userController.js";
import authMiddleware from "../../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/users/profile
router.get("/profile", authMiddleware, getProfile);

export default router;
