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

export type DatabaseUser = {
  id: number;
  role: string;
  displayName: string;
  username: string;
  email: string;
  usn: string | null;
  phone: string | null;
};

export type TeacherStudent = {
  usn: string | null;
  name: string;
  email: string;
  username: string;
};

export type TeacherClass = {
  code: string;
  title: string;
  schedule: string;
  room: string;
};

export type TeacherDashboard = {
  teacherName: string;
  teacherEmail: string;
  teacherUsername: string;
  totalStudents: number;
  totalClasses: number;
  students: TeacherStudent[];
  classes: TeacherClass[];
};

export type ProfileData = {
  role: Role;
  name: string;
  username: string;
  email: string;
  phone: string | null;
  usn: string | null;
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

  listDatabaseUsers() {
    return request<DatabaseUser[]>("/api/database/users", { method: "GET" });
  },

  teacherDashboard(email: string) {
    const params = new URLSearchParams({ email });
    return request<TeacherDashboard>(`/api/teachers/dashboard?${params.toString()}`, {
      method: "GET",
    });
  },

  profile(email: string, role: Role) {
    const params = new URLSearchParams({ email, role });
    return request<ProfileData>(`/api/profile?${params.toString()}`, {
      method: "GET",
    });
  },

  updateProfile(payload: {
    currentEmail: string;
    role: Role;
    name: string;
    username: string;
    email: string;
    phone: string;
  }) {
    return request<ProfileData>("/api/profile", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },
};
