import { cookies } from "next/headers";
import { AUTH_COOKIES } from "@/src/core/auth/auth.constants";

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

type ApiServerOptions = {
  method: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
};

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function requestServer<T>(path: string, options: ApiServerOptions): Promise<T> {
  if (!BASE_URL) throw new Error("Missing NEXT_PUBLIC_API_URL in .env.local");

  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIES.token)?.value;

  const res = await fetch(`${BASE_URL}${path}`, {
    method: options.method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${options.method} ${path} failed: ${res.status} ${text}`);
  }

  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) return (undefined as T);

  return (await res.json()) as T;
}

export const apiServer = {
  get: async <T,>(path: string, headers?: Record<string, string>) =>
    requestServer<T>(path, { method: "GET", headers }),

  post: async <T,>(path: string, body?: unknown, headers?: Record<string, string>) =>
    requestServer<T>(path, { method: "POST", body, headers }),

  patch: async <T,>(path: string, body?: unknown, headers?: Record<string, string>) =>
    requestServer<T>(path, { method: "PATCH", body, headers }),

  delete: async <T,>(path: string, headers?: Record<string, string>) =>
    requestServer<T>(path, { method: "DELETE", headers }),
};
