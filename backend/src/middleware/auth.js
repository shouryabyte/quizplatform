import { env } from "../config/env.js";
import { verifyAccessToken } from "../utils/jwt.js";
import { User } from "../models/User.js";

export async function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.[env.AUTH_COOKIE_NAME];
    if (!token) return res.status(401).json({ error: "UNAUTHENTICATED" });

    const payload = verifyAccessToken(token, { secret: env.AUTH_JWT_SECRET });
    const user = await User.findById(payload.sub).lean();
    if (!user) return res.status(401).json({ error: "UNAUTHENTICATED" });

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: "UNAUTHENTICATED" });
  }
}

