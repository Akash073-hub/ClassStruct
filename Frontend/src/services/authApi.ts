import { Platform } from "react-native";

export type Role = "student" | "teacher";

export type AuthUser = {
  token?: string;
  role: Role;
  name: string;
  username: string;
  email: string;
};

export type RegisterPayload = {
  fullName: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: Role;
};

const API_BASE_URL =
  Platform.OS === "android" ? "http://10.0.2.2:8080" : "http://localhost:8080";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error(await messageFor(response));
  }

  return response.json();
}

async function messageFor(response: Response) {
  try {
    const data = await response.json();
    return data?.message ?? data?.error ?? "Request failed";
  } catch {
    return "Request failed";
  }
}

export const authApi = {
  lookup(email: string, role: Role) {
    const params = new URLSearchParams({ email, role });
    return request<AuthUser>(`/api/auth/lookup?${params.toString()}`, {
      method: "GET",
    });
  },

  login(payload: { username: string; email: string; password: string; role: Role }) {
    return request<AuthUser>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  register(payload: RegisterPayload) {
    return request<AuthUser>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  forgotPassword(payload: { email: string; role: Role }) {
    return request<{ message: string; email: string }>("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  socialLogin(payload: {
    provider: "google" | "linkedin";
    email: string;
    name?: string;
    role: Role;
    token?: string;
  }) {
    return request<AuthUser>("/api/auth/social-login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};
