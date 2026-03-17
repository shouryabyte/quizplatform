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

    xp: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 },
    quizzesTaken: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
