import type { User } from "@/store/user";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function req<T>(path: string, options: RequestInit & { token?: string } = {}): Promise<T> {
  const { token, headers, ...rest } = options;
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers as Record<string, string>),
    },
    ...rest,
  });
  const data = await res.json();
  if (!res.ok) {
    const errs = (data as { errors?: { msg: string }[]; message?: string });
    const message = errs.errors?.[0]?.msg || errs.message || "Request failed";
    const error = new Error(message) as Error & { status: number };
    error.status = res.status;
    throw error;
  }
  return data as T;
}

type AuthResponse = { token: string; profile: User };

export const api = {
  signup: (body: Record<string, unknown>) =>
    req<{ message: string; resent?: boolean }>("/api/auth/signup", { method: "POST", body: JSON.stringify(body) }),

  login: (email: string, password: string) =>
    req<AuthResponse>("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),

  verifyOtp: (email: string, code: string) =>
    req<AuthResponse>("/api/auth/verify", { method: "POST", body: JSON.stringify({ email, code }) }),

  resendOtp: (email: string) =>
    req<{ message: string }>("/api/auth/resend-otp", { method: "POST", body: JSON.stringify({ email }) }),

  getProfile: (token: string) =>
    req<User>("/api/profile/me", { token }),

  updateProfile: (token: string, body: Partial<User>) =>
    req<User>("/api/profile/me", { method: "PUT", body: JSON.stringify(body), token }),

  getStats: () =>
    req<{ fintechCompanies: number; opportunities: number; speakers: number; attendees: number }>("/api/stats"),

  googleAuth: (credential: string) =>
    req<AuthResponse>("/api/auth/google", { method: "POST", body: JSON.stringify({ credential }) }),

  verifyTicket: (ticketId: string) =>
    req<{ valid: boolean; message?: string; user?: { name: string; role: string } }>(`/api/tickets/verify/${ticketId}`),
};
