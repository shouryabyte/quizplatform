import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, maxlength: 80, default: "" },
    email: { type: String, trim: true, lowercase: true, index: true, unique: true, sparse: true },
    passwordHash: { type: String, default: "" },
    avatarUrl: { type: String, default: "" },

    provider: { type: String, enum: ["local", "google", "github"], default: "local", index: true },

    googleId: { type: String, default: "", unique: true, sparse: true, index: true },
    githubId: { type: String, default: "", unique: true, sparse: true, index: true },

    roles: { type: [String], default: ["user"] },

    xp: { type: Number, default: 0, min: 0, index: true },
    streak: { type: Number, default: 0, min: 0 },
    lastQuizAt: { type: Date, default: null },

    quizzesTaken: { type: Number, default: 0, min: 0 },
    totalCorrect: { type: Number, default: 0, min: 0 },
    totalAnswered: { type: Number, default: 0, min: 0 }
  },
  { timestamps: true }
);

userSchema.virtual("accuracy").get(function accuracy() {
  if (!this.totalAnswered) return 0;
  return Math.round((this.totalCorrect / this.totalAnswered) * 100);
});

userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

export const User = mongoose.model("User", userSchema);
