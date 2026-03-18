import { env } from "../config/env.js";
import { connectDb } from "../db/connect.js";
import { Quiz } from "../models/Quiz.js";

async function seed() {
  await connectDb(env.MONGODB_URI);

  const existing = await Quiz.countDocuments({});
  if (existing > 0) {
    // eslint-disable-next-line no-console
    console.log(`Seed skipped: quizzes already exist (${existing}).`);
    return;
  }

  await Quiz.insertMany([
    {
      title: "JavaScript Basics",
      description: "Variables, types, and core JS concepts.",
      category: "Programming",
      difficulty: "easy",
      timeLimitSec: 300,
      questions: [
        {
          prompt: "Which keyword declares a block-scoped variable?",
          options: ["var", "let", "function", "consteval"],
          correctIndex: 1,
          explanation: "`let` is block-scoped; `var` is function-scoped.",
          topic: "JS"
        },
        {
          prompt: "What is the result of `typeof null` in JavaScript?",
          options: ["null", "object", "undefined", "number"],
          correctIndex: 1,
          explanation: "It returns `object` due to a historical quirk.",
          topic: "JS"
        },
        {
          prompt: "Which method converts JSON string to an object?",
          options: ["JSON.stringify", "JSON.parse", "JSON.object", "JSON.toObject"],
          correctIndex: 1,
          explanation: "Use `JSON.parse` to parse a JSON string.",
          topic: "JS"
        },
        {
          prompt: "What does `Array.prototype.map` return?",
          options: ["A single value", "A new array", "A boolean", "Nothing"],
          correctIndex: 1,
          explanation: "`map` returns a new array of transformed items.",
          topic: "JS"
        },
        {
          prompt: "Which is NOT a primitive type?",
          options: ["string", "number", "object", "boolean"],
          correctIndex: 2,
          explanation: "`object` is not a primitive.",
          topic: "JS"
        }
      ]
    },
    {
      title: "General Knowledge Sprint",
      description: "Quick GK questions for a daily warm-up.",
      category: "GK",
      difficulty: "easy",
      timeLimitSec: 240,
      questions: [
        {
          prompt: "Which planet is known as the Red Planet?",
          options: ["Mars", "Venus", "Jupiter", "Mercury"],
          correctIndex: 0,
          explanation: "Mars appears red due to iron oxide on its surface.",
          topic: "Space"
        },
        {
          prompt: "What is the capital of Japan?",
          options: ["Seoul", "Beijing", "Tokyo", "Kyoto"],
          correctIndex: 2,
          explanation: "Tokyo is the capital of Japan.",
          topic: "Geography"
        },
        {
          prompt: "H2O is the chemical formula for what?",
          options: ["Oxygen", "Hydrogen", "Water", "Salt"],
          correctIndex: 2,
          explanation: "H2O represents water.",
          topic: "Science"
        },
        {
          prompt: "How many continents are there?",
          options: ["5", "6", "7", "8"],
          correctIndex: 2,
          explanation: "There are 7 continents.",
          topic: "Geography"
        },
        {
          prompt: "Which instrument measures atmospheric pressure?",
          options: ["Thermometer", "Barometer", "Hygrometer", "Seismograph"],
          correctIndex: 1,
          explanation: "A barometer measures atmospheric pressure.",
          topic: "Science"
        }
      ]
    }
  ]);

  // eslint-disable-next-line no-console
  console.log("Seed complete: demo quizzes created.");
}

seed()
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  })
  .finally(() => process.exit(0));
