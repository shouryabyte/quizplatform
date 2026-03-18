import express from "express";

import { requireAuth } from "../middleware/auth.js";
import { getQuizForPlay, listCategories, listQuizzes, myAttemptsForQuiz, submitQuiz } from "../controllers/quiz.controller.js";

export const quizRouter = express.Router();

quizRouter.get("/categories", requireAuth, listCategories);
quizRouter.get("/", requireAuth, listQuizzes);
quizRouter.get("/:id", requireAuth, getQuizForPlay);
quizRouter.post("/:id/submit", requireAuth, submitQuiz);
quizRouter.get("/:id/attempts/me", requireAuth, myAttemptsForQuiz);
