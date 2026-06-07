const API_BASE = import.meta.env.VITE_API_URL ?? "/api";
const TOKEN_KEY = "cjp_auth_token";

export class ApiClientError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiClientError";
  }
}

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string | null) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

async function parseError(response: Response) {
  try {
    const data = (await response.json()) as { error?: string };
    return data.error ?? `Erreur API (${response.status})`;
  } catch {
    return `Erreur API (${response.status})`;
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit & { auth?: boolean } = {},
): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  if (options.auth !== false) {
    const token = getAuthToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new ApiClientError(response.status, await parseError(response));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function apiGet<T>(path: string, auth = false) {
  return apiRequest<T>(path, { method: "GET", auth });
}

export function apiPost<T>(path: string, body: unknown, auth = false) {
  return apiRequest<T>(path, {
    method: "POST",
    body: JSON.stringify(body),
    auth,
  });
}

export function apiPatch<T>(path: string, body: unknown, auth = true) {
  return apiRequest<T>(path, {
    method: "PATCH",
    body: JSON.stringify(body),
    auth,
  });
}

export async function checkApiHealth() {
  return apiGet<{ status: string; service: string; database?: string }>("/health");
}
