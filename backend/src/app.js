import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { env } from "./config/env.js";
import { authRouter } from "./routes/auth.routes.js";
import { configureOAuth } from "./services/oauth.js";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(morgan("dev"));
  app.use(express.json({ limit: "1mb" }));
  app.use(cookieParser());
  app.use(
    cors({
      origin: env.CLIENT_ORIGIN,
      credentials: true
    })
  );

  configureOAuth(app);

  app.get("/health", (_req, res) => res.json({ ok: true }));
  app.use("/api/auth", authRouter);

  app.use((err, _req, res, _next) => {
    const message = err?.message || "INTERNAL_ERROR";
    const isZod = err?.name === "ZodError";
    if (isZod) return res.status(400).json({ error: "VALIDATION_ERROR", details: err.issues });
    return res.status(500).json({ error: message });
  });

  return app;
}

