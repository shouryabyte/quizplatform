import { env } from "../config/env.js";

export function setAuthCookie(res, token) {
  res.cookie(env.AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24 * 7
  });
}

export function clearAuthCookie(res) {
  res.clearCookie(env.AUTH_COOKIE_NAME, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.NODE_ENV === "production"
  });
}
