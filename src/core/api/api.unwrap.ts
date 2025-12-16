export function unwrapData<T>(res: any): T {
  // casos:
  // 1) { success: true, data: ... }
  // 2) data directo (array u objeto)
  if (res && typeof res === "object" && "data" in res) return res.data as T;
  return res as T;
}

export function unwrapArray<T>(res: any): T[] {
  const data = unwrapData<any>(res);
  return Array.isArray(data) ? (data as T[]) : [];
}
