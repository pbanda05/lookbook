import { Router } from "express";
import { getMe, createDemoUser } from "../controllers/user.controller.js";

const router = Router();

// Example routes
// GET /api/users/me
router.get("/me", getMe);

// POST /api/users/demo
router.post("/demo", createDemoUser);

export default router;
