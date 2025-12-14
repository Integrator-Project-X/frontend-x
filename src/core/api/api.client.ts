import "server-only";
import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
const TOKEN_COOKIE = "vc_token";

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

type ApiEnvelope<T> = {
  success: boolean;
  data: T;
  message?: string | string[];
  error?: string;
};

type RequestOptions = { tags?: string[] };

function safeJsonParse(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

async function request<T>(
  method: HttpMethod,
  path: string,
  body?: unknown,
  options?: RequestOptions
): Promise<T> {
  const cookieStore = await cookies(); // ✅ FIX: cookies() es async
  const token = cookieStore.get(TOKEN_COOKIE)?.value;

  const headers = new Headers();
  headers.set("Accept", "application/json");
  if (body !== undefined) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
    next: options?.tags ? { tags: options.tags } : undefined,
  });

  const text = await res.text().catch(() => "");

  if (!res.ok) {
    const maybe = safeJsonParse(text) as any;
    const msg =
      maybe?.message ??
      maybe?.error ??
      (text || "Request failed");

    const finalMsg = Array.isArray(msg) ? msg.join(", ") : String(msg);
    throw new Error(`API ${method} ${path} -> ${res.status} ${finalMsg}`);
  }

  if (!text) return undefined as T;

  const json = safeJsonParse(text) as ApiEnvelope<T> | T | null;

  // soporta { success, data } o data directa
  if (json && typeof json === "object" && "data" in json) {
    return (json as ApiEnvelope<T>).data;
  }

  return json as T;
}

export const apiServer = {
  get: <T,>(path: string, options?: RequestOptions) =>
    request<T>("GET", path, undefined, options),

  post: <T,>(path: string, body: unknown, options?: RequestOptions) =>
    request<T>("POST", path, body, options),

  patch: <T,>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>("PATCH", path, body, options),

  delete: <T,>(path: string, options?: RequestOptions) =>
    request<T>("DELETE", path, undefined, options),
};
