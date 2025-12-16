"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/src/core/api/api.client";
import { API_ENDPOINTS } from "@/src/core/api/api.endpoints";

type Animal = {
  id?: string | number;
  _id?: string;
  id_animal?: string | number;
  name?: string;
  animal_name?: string;
};

export default function AnimalsPage() {
  const [page, setPage] = useState(1);
  const [size] = useState(20);
  const [items, setItems] = useState<Animal[]>([]);
  const [total, setTotal] = useState<number | null>(null);

  const load = async (p = page) => {
    try {
      const res = await apiClient.get<any>(
        `${API_ENDPOINTS.animals.list}?page=${p}&limit=${size}`
      );
      
      const list =
        Array.isArray(res)
          ? res
          : Array.isArray(res?.items)
          ? res.items
          : Array.isArray(res?.data)
          ? res.data
          : [];

      const totalCount =
        typeof res?.total === "number"
          ? res.total
          : Array.isArray(list)
          ? list.length
          : null;

      setItems(list);
      setTotal(totalCount);
    } catch (err) {
      console.error("Error loading animals:", err);
    }
  };

  useEffect(() => {
    load(page);
  }, [page]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Animals</h1>

      <div className="grid grid-cols-2 gap-4">
        {items.map((a) => (
          <div
            key={a.id ?? a._id ?? a.id_animal ?? a.name}
            className="border p-3 rounded"
          >
            <div className="font-semibold">
              {a.animal_name ?? a.name ?? "Unnamed"}
            </div>
            <div className="text-sm text-muted-foreground">
              id: {a.id_animal ?? a.id ?? a._id}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-4">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>

        <div>
          Page {page}
          {total !== null ? ` • ${total} total` : ""}
        </div>

        <button
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 border rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}
