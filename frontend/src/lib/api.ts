export type PublicUser = {
  id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
  xp: number;
  streak: number;
  accuracy: number;
  quizzesTaken: number;
  provider: "local" | "google" | "github";
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

export function oauthUrl(provider: "google" | "github") {
  return `${API_BASE}/api/auth/${provider}`;
}
