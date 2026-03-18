export type PublicUser = {
  id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
  provider: "local" | "google" | "github";
  xp: number;
  streak: number;
  quizzesTaken: number;
  accuracy: number;
};

export type CategorySummary = { name: string; quizCount: number };

export type QuizSummary = {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  timeLimitSec: number;
  questionCount: number;
};

export type QuizForPlay = {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  timeLimitSec: number;
  questions: { index: number; prompt: string; options: string[]; topic: string }[];
};

export type QuizResult = {
  attemptId: string;
  quizId: string;
  title: string;
  category: string;
  score: number;
  correctCount: number;
  totalQuestions: number;
  timeTakenSec: number;
  xpAwarded: number;
  answers: {
    questionIndex: number;
    prompt: string;
    options: string[];
    selectedIndex: number;
    correctIndex: number;
    isCorrect: boolean;
    explanation: string;
    topic: string;
  }[];
};

export type LeaderUser = {
  id: string;
  name: string;
  avatarUrl: string;
  xp: number;
  quizzesTaken: number;
  accuracy: number;
};

export type LeaderRow = LeaderUser & { rank: number };

export type DashboardStats = {
  id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
  provider: "local" | "google" | "github";
  xp: number;
  rank: number;
  streak: number;
  quizzesTaken: number;
  accuracy: number;
  lastQuizAt: string | null;
};

export type RecentAttempt = {
  id: string;
  createdAt: string;
  quiz: {
    id: string;
    title: string;
    category: string;
    difficulty: "easy" | "medium" | "hard";
    timeLimitSec: number;
  } | null;
  score: number;
  correctCount: number;
  totalQuestions: number;
  timeTakenSec: number;
  xpAwarded: number;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {})
    },
    credentials: "include"
  });

  if (res.status === 204) return undefined as T;

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = (data && (data.error as string)) || `HTTP_${res.status}`;
    throw new Error(error);
  }
  return data as T;
}

export async function register(input: { name: string; email: string; password: string }) {
  return apiFetch<{ user: PublicUser }>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export async function login(input: { email: string; password: string }) {
  return apiFetch<{ user: PublicUser }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export async function logout() {
  return apiFetch<void>("/api/auth/logout", { method: "POST" });
}

export async function me() {
  return apiFetch<{ user: PublicUser }>("/api/auth/me");
}

export async function getCategories() {
  return apiFetch<{ categories: CategorySummary[] }>("/api/quizzes/categories");
}

export async function getQuizzes(params?: { category?: string; difficulty?: string }) {
  const qs = new URLSearchParams();
  if (params?.category) qs.set("category", params.category);
  if (params?.difficulty) qs.set("difficulty", params.difficulty);
  const suffix = qs.toString() ? `?${qs.toString()}` : "";
  return apiFetch<{ quizzes: QuizSummary[] }>(`/api/quizzes${suffix}`);
}

export async function getQuiz(id: string) {
  return apiFetch<{ quiz: QuizForPlay }>(`/api/quizzes/${id}`);
}

export async function submitQuiz(id: string, input: { answers: number[]; timeTakenSec: number }) {
  return apiFetch<{ result: QuizResult }>(`/api/quizzes/${id}/submit`, {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export async function getLeaderboard(limit = 20) {
  return apiFetch<{ leaderboard: LeaderRow[] }>(`/api/leaderboard?limit=${limit}`);
}

export async function getMyRank() {
  return apiFetch<{ me: LeaderUser; rank: number }>("/api/leaderboard/me");
}

export async function getDashboard() {
  return apiFetch<{ stats: DashboardStats; recentAttempts: RecentAttempt[] }>("/api/dashboard");
}

export function oauthUrl(provider: "google" | "github") {
  return `${API_BASE}/api/auth/${provider}`;
}
