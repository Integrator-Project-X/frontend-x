import "server-only";
import { cookies } from "next/headers";
import { AUTH_COOKIES } from "@/src/core/auth/auth.constants";

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

type ApiServerOptions = {
  method: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
};

type ApiEnvelope<T> = {
  success?: boolean;
  data?: T;
  message?: string | string[];
  error?: string;
  meta?: unknown;
};

const BASE_URL = process.env.API_URL;

function isEnvelope(obj: any): obj is ApiEnvelope<unknown> {
  return obj && typeof obj === "object" && ("data" in obj || "success" in obj);
}

async function requestServer<T>(path: string, options: ApiServerOptions): Promise<T> {
  if (!BASE_URL) throw new Error("Missing API_URL in .env.local");

  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIES.token)?.value;

  const res = await fetch(`${BASE_URL}${path}`, {
    method: options.method,
    headers: {
      Accept: "application/json",
      ...(options.body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
  });

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const rawText = await res.text().catch(() => "");

  if (!res.ok) {
    if (isJson && rawText) {
      try {
        const parsed = JSON.parse(rawText) as ApiEnvelope<any>;
        const msg = parsed.message ?? parsed.error ?? rawText;
        throw new Error(`API ${options.method} ${path} failed: ${res.status} ${String(msg)}`);
      } catch {}
    }
    throw new Error(`API ${options.method} ${path} failed: ${res.status} ${rawText}`);
  }

  if (!rawText || !isJson) return undefined as T;

  const json = JSON.parse(rawText);

  if (isEnvelope(json)) {
    if ("data" in json) return json.data as T;
    if (json.success === false) {
      throw new Error(String(json.message ?? json.error ?? "API error"));
    }
  }

  return json as T;
}

export const apiServer = {
  get: <T,>(path: string, headers?: Record<string, string>) =>
    requestServer<T>(path, { method: "GET", headers }),

  post: <T,>(path: string, body?: unknown, headers?: Record<string, string>) =>
    requestServer<T>(path, { method: "POST", body, headers }),

  patch: <T,>(path: string, body?: unknown, headers?: Record<string, string>) =>
    requestServer<T>(path, { method: "PATCH", body, headers }),

  delete: <T,>(path: string, headers?: Record<string, string>) =>
    requestServer<T>(path, { method: "DELETE", headers }),
};
