import express from "express";

import { requireAuth } from "../middleware/auth.js";
import { getDashboard } from "../controllers/dashboard.controller.js";

export const dashboardRouter = express.Router();

dashboardRouter.get("/", requireAuth, getDashboard);
