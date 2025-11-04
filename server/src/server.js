import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import apiRouter from "./routes/index.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

// CORS (allow your Expo dev URL)
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:19006",
    credentials: true,
  })
);

// Body parsing + logs
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

// Health check
app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "lookbook-api",
    env: process.env.NODE_ENV || "dev",
  });
});

// Mount all API routes under /api
app.use("/api", apiRouter);

// 404 + error handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8080;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB connection failed:", err?.message);
    process.exit(1);
  });
