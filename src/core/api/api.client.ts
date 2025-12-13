import { AUTH_COOKIES } from "@/src/core/auth/auth.constants";

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

type ApiClientOptions = {
  method: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
};

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

function getCookie(name: string) {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match?.[2] ? decodeURIComponent(match[2]) : undefined;
}

async function requestClient<T>(path: string, options: ApiClientOptions): Promise<T> {
  if (!BASE_URL) throw new Error("Missing NEXT_PUBLIC_API_URL in .env.local");

  const token = getCookie(AUTH_COOKIES.token);

  const res = await fetch(`${BASE_URL}${path}`, {
    method: options.method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${options.method} ${path} failed: ${res.status} ${text}`);
  }

  // si backend a veces no devuelve json:
  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) return (undefined as T);

  return (await res.json()) as T;
}

export const apiClient = {
  get: <T>(path: string, headers?: Record<string, string>) =>
    requestClient<T>(path, { method: "GET", headers }),

  post: <T>(path: string, body?: unknown, headers?: Record<string, string>) =>
    requestClient<T>(path, { method: "POST", body, headers }),

  patch: <T>(path: string, body?: unknown, headers?: Record<string, string>) =>
    requestClient<T>(path, { method: "PATCH", body, headers }),

  delete: <T>(path: string, headers?: Record<string, string>) =>
    requestClient<T>(path, { method: "DELETE", headers }),
};
