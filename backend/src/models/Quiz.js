import mongoose from "mongoose";

const quizQuestionSchema = new mongoose.Schema(
  {
    prompt: { type: String, required: true, trim: true, maxlength: 500 },
    options: {
      type: [String],
      required: true,
      validate: {
        validator: (v) => Array.isArray(v) && v.length >= 2 && v.length <= 6,
        message: "options must have 2-6 items"
      }
    },
    correctIndex: { type: Number, required: true, min: 0 },
    explanation: { type: String, default: "", trim: true, maxlength: 800 },
    topic: { type: String, default: "", trim: true, maxlength: 80 }
  },
  { _id: false }
);

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, default: "", trim: true, maxlength: 400 },
    category: { type: String, required: true, trim: true, maxlength: 60, index: true },
    timeLimitSec: { type: Number, default: 300, min: 30, max: 3600 },
    difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "easy", index: true },
    questions: { type: [quizQuestionSchema], default: [] },
    published: { type: Boolean, default: true, index: true }
  },
  { timestamps: true }
);

quizSchema.index({ category: 1, published: 1 });

export const Quiz = mongoose.model("Quiz", quizSchema);
