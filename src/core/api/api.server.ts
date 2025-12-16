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
  success: boolean;
  data?: T;
  message?: string | string[];
  error?: string;
};

const RAW_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const BASE_URL = RAW_BASE_URL.replace(/\/+$/, "");

function isEnvelope(value: any): value is ApiEnvelope<unknown> {
  return value && typeof value === "object" && "success" in value;
}

async function requestServer<T>(
  path: string,
  options: ApiServerOptions
): Promise<T> {
  if (!BASE_URL) {
    throw new Error("Missing NEXT_PUBLIC_API_URL in .env.local");
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIES.token)?.value;

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  const bodyString =
    options.body !== undefined ? JSON.stringify(options.body) : undefined;

  const res = await fetch(`${BASE_URL}${normalizedPath}`, {
    method: options.method,
    headers: {
      Accept: "application/json",
      ...(options.body !== undefined
        ? { "Content-Type": "application/json" }
        : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
    body: bodyString,
    cache: "no-store",
  });

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  const rawText = await res.text().catch(() => "");

  if (!res.ok) {
    throw new Error(
      `API ${options.method} ${path} failed: ${res.status} ${
        rawText || "(no response body)"
      } -- requestBody: ${bodyString ?? "(none)"}`
    );
  }

  if (!rawText || !isJson) {
    return undefined as T;
  }

  const json = JSON.parse(rawText);

  if (isEnvelope(json)) {
    if (json.success === false) {
      const msg = json.message ?? json.error ?? "API error";
      throw new Error(Array.isArray(msg) ? msg.join(", ") : String(msg));
    }

    if ("data" in json) {
      return json.data as T;
    }
  }

  return json as T;
}

export const apiServer = {
  get: <T>(path: string, headers?: Record<string, string>) =>
    requestServer<T>(path, { method: "GET", headers }),

  post: <T>(path: string, body?: unknown, headers?: Record<string, string>) =>
    requestServer<T>(path, { method: "POST", body, headers }),

  patch: <T>(path: string, body?: unknown, headers?: Record<string, string>) =>
    requestServer<T>(path, { method: "PATCH", body, headers }),

  delete: <T>(path: string, headers?: Record<string, string>) =>
    requestServer<T>(path, { method: "DELETE", headers }),
};
