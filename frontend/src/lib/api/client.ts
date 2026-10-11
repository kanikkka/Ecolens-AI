const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";


type RequestOptions = RequestInit & {
  token?: string;
};


async function request<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { token, ...fetchOptions } = options;

  const headers = new Headers(fetchOptions.headers);

  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    let message = "Something went wrong";

    try {
      const error = await response.json();
      message = error.detail || message;
    } catch {
      // Keep default error message.
    }

    throw new Error(message);
  }

  return response.json();
}


export const api = {
  get<T>(endpoint: string, token?: string) {
    return request<T>(endpoint, {
      method: "GET",
      token,
    });
  },

  post<T>(
    endpoint: string,
    body?: unknown,
    token?: string,
  ) {
    return request<T>(endpoint, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
      token,
    });
  },
};


export { API_URL };
