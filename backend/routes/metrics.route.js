import express from "express";
import metricsController from "../controllers/metrics.controller.js";
import { adminProtect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", adminProtect, metricsController.getMetrics);

export default router;
