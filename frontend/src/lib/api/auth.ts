import type { AuthToken, User } from "./types";
import { loginUser, getCurrentUser } from "./services";

const TOKEN_KEY = "ecolens_token";

export function saveToken(token: string) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(TOKEN_KEY);
}

export function removeToken() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(TOKEN_KEY);
}

export async function login(
  email: string,
  password: string,
): Promise<User> {
  const auth: AuthToken = await loginUser(
    email,
    password,
  );

  saveToken(auth.access_token);

  return getCurrentUser(auth.access_token);
}

export async function getLoggedInUser(): Promise<User | null> {
  const token = getToken();

  if (!token) {
    return null;
  }

  try {
    return await getCurrentUser(token);
  } catch {
    removeToken();
    return null;
  }
}

export function logout() {
  removeToken();
}
