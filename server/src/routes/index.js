import { Router } from "express";
import userRoutes from "./user.routes.js";

const router = Router();

// Add feature routers here
router.use("/users", userRoutes);

export default router;
