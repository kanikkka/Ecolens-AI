import { api } from "./client";

import type {
  ApiStatus,
  AuthToken,
  Scan,
  User,
} from "./types";

export function getApiStatus() {
  return api.get<ApiStatus>("/api/v1/status");
}

export function registerUser(
  name: string,
  email: string,
  password: string,
) {
  return api.post<User>("/api/v1/auth/register", {
    name,
    email,
    password,
  });
}

export function loginUser(
  email: string,
  password: string,
) {
  return api.post<AuthToken>("/api/v1/auth/login", {
    email,
    password,
  });
}

export function getCurrentUser(token: string) {
  return api.get<User>(
    "/api/v1/auth/me",
    token,
  );
}

export async function uploadScan(
  token: string,
  file: File,
): Promise<Scan> {
  const formData = new FormData();
  formData.append("file", file);

  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://127.0.0.1:8000";

  const response = await fetch(
    apiUrl + "/api/v1/scans/upload",
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: formData,
    },
  );

  if (!response.ok) {
    const error = await response
      .json()
      .catch(function () {
        return null;
      });

    throw new Error(
      error?.detail ||
        "Failed to upload scan",
    );
  }

  return response.json();
}

export function getMyScans(token: string) {
  return api.get<Scan[]>(
    "/api/v1/scans",
    token,
  );
}
