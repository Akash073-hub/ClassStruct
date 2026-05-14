import type { AuthUser } from "./authApi";

let currentUser: AuthUser | null = null;

export function setCurrentUser(user: AuthUser) {
  currentUser = user;
}

export function getCurrentUser() {
  return currentUser;
}

export function clearCurrentUser() {
  currentUser = null;
}
