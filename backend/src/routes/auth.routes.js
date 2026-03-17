import express from "express";
import passport from "passport";
import { env } from "../config/env.js";
import { login, logout, me, register } from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { setAuthCookie } from "../utils/authCookie.js";
import { signAccessToken } from "../utils/jwt.js";

export const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.get("/me", requireAuth, me);

function oauthEnabled(provider) {
  if (provider === "google") return Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET && env.GOOGLE_CALLBACK_URL);
  if (provider === "github") return Boolean(env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET && env.GITHUB_CALLBACK_URL);
  return false;
}

authRouter.get("/google", (req, res, next) => {
  if (!oauthEnabled("google")) return res.status(501).json({ error: "OAUTH_NOT_CONFIGURED" });
  return passport.authenticate("google", { session: false, scope: ["profile", "email"] })(req, res, next);
});

authRouter.get(
  "/google/callback",
  (req, res, next) => {
    if (!oauthEnabled("google")) return res.status(501).json({ error: "OAUTH_NOT_CONFIGURED" });
    return passport.authenticate("google", { session: false, failureRedirect: `${env.CLIENT_ORIGIN}/login` })(req, res, next);
  },
  (req, res) => {
    const token = signAccessToken(
      { userId: String(req.user._id) },
      { secret: env.AUTH_JWT_SECRET, expiresIn: env.AUTH_JWT_EXPIRES_IN }
    );
    setAuthCookie(res, token);
    res.redirect(`${env.CLIENT_ORIGIN}/dashboard`);
  }
);

authRouter.get("/github", (req, res, next) => {
  if (!oauthEnabled("github")) return res.status(501).json({ error: "OAUTH_NOT_CONFIGURED" });
  return passport.authenticate("github", { session: false, scope: ["user:email"] })(req, res, next);
});

authRouter.get(
  "/github/callback",
  (req, res, next) => {
    if (!oauthEnabled("github")) return res.status(501).json({ error: "OAUTH_NOT_CONFIGURED" });
    return passport.authenticate("github", { session: false, failureRedirect: `${env.CLIENT_ORIGIN}/login` })(req, res, next);
  },
  (req, res) => {
    const token = signAccessToken(
      { userId: String(req.user._id) },
      { secret: env.AUTH_JWT_SECRET, expiresIn: env.AUTH_JWT_EXPIRES_IN }
    );
    setAuthCookie(res, token);
    res.redirect(`${env.CLIENT_ORIGIN}/dashboard`);
  }
);
