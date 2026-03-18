import { z } from "zod";

import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

function publicLeaderUser(user) {
  return {
    id: String(user._id),
    name: user.name || "Anonymous",
    avatarUrl: user.avatarUrl || "",
    xp: user.xp || 0,
    quizzesTaken: user.quizzesTaken || 0,
    accuracy: user.accuracy || 0
  };
}

export const getLeaderboard = asyncHandler(async (req, res) => {
  const query = z.object({ limit: z.coerce.number().int().min(1).max(50).default(20) }).parse(req.query);

  const users = await User.find({})
    .sort({ xp: -1, createdAt: 1 })
    .limit(query.limit)
    .select({ name: 1, avatarUrl: 1, xp: 1, quizzesTaken: 1, totalCorrect: 1, totalAnswered: 1 })
    .lean({ virtuals: true });

  res.json({
    leaderboard: users.map((u, idx) => ({
      rank: idx + 1,
      ...publicLeaderUser(u)
    }))
  });
});

export const getMyRank = asyncHandler(async (req, res) => {
  const me = await User.findById(req.user._id).select({ xp: 1, name: 1, avatarUrl: 1, quizzesTaken: 1, totalCorrect: 1, totalAnswered: 1 });
  if (!me) return res.status(401).json({ error: "UNAUTHENTICATED" });

  const higher = await User.countDocuments({ xp: { $gt: me.xp } });
  res.json({
    me: publicLeaderUser(me),
    rank: higher + 1
  });
});
