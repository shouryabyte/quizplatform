import express from "express";

import { requireAuth } from "../middleware/auth.js";
import { getLeaderboard, getMyRank } from "../controllers/leaderboard.controller.js";

export const leaderboardRouter = express.Router();

leaderboardRouter.get("/", requireAuth, getLeaderboard);
leaderboardRouter.get("/me", requireAuth, getMyRank);
