import { Router } from "express";
import * as users from "../controllers/user.controller.js"; // robust namespace import
import { auth } from "../middleware/auth.js";

const router = Router();

// TEMP: verify what's exported (watch your server logs once)
console.log("user.controller exports:", Object.keys(users));

router.get("/me", auth, users.getMe);
router.post("/sync", auth, users.syncUser);
router.post("/demo", users.createDemoUser);

export default router;
