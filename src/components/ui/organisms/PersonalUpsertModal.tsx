"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "./Modal";
import { Button } from "@/src/components/ui/atoms/button";
import { Badge } from "@/src/components/ui/atoms/badge";

type UserRow = {
  id_user: number;
  full_name: string;
  isActive?: boolean;
};

type JobPositionRow = {
  id_job_position: number;
  job_position_name: string;
  isActive?: boolean;
};

type PersonalDetails = {
  id_personal: number;
  isActive: boolean;
  createdAt?: string;
  user?: { id_user: number; full_name?: string };
  jobPosition?: { id_job_position: number; job_position_name?: string };
};

type UpsertPayload = {
  id_user: number;
  id_job_position: number;
  isActive: boolean;
};

type Props = {
  open: boolean;
  onClose: () => void;
  personalId?: number | null; // edit si viene
};

function unwrapObject<T>(payload: any): T | null {
  if (!payload) return null;
  return (payload?.data ?? payload) as T;
}

function unwrapArray<T>(payload: any): T[] {
  const arr = payload?.data ?? payload;
  return Array.isArray(arr) ? (arr as T[]) : [];
}

export default function PersonalUpsertModal({ open, onClose, personalId }: Props) {
  const router = useRouter();
  const isEdit = !!personalId;

  const title = useMemo(
    () => (isEdit ? `Edit staff #${personalId}` : "Create new staff member"),
    [isEdit, personalId]
  );

  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState<PersonalDetails | null>(null);

  const [users, setUsers] = useState<UserRow[]>([]);
  const [jobs, setJobs] = useState<JobPositionRow[]>([]);

  const [form, setForm] = useState<UpsertPayload>({
    id_user: 0,
    id_job_position: 0,
    isActive: true,
  });

  useEffect(() => {
    if (!open) return;

    setDetails(null);
    setUsers([]);
    setJobs([]);
    setForm({ id_user: 0, id_job_position: 0, isActive: true });

    (async () => {
      try {
        setLoading(true);

        // lists primero (para que el select tenga opciones)
        const [usersRes, jobsRes] = await Promise.all([
          fetch("/api/users", { cache: "no-store" }),
          fetch("/api/jobpositions", { cache: "no-store" }),
        ]);

        const usersJson = await usersRes.json().catch(() => ({}));
        const jobsJson = await jobsRes.json().catch(() => ({}));

        if (!usersRes.ok) console.error("Failed loading users", { status: usersRes.status, usersJson });
        if (!jobsRes.ok) console.error("Failed loading job positions", { status: jobsRes.status, jobsJson });

        setUsers(unwrapArray<UserRow>(usersJson));
        setJobs(unwrapArray<JobPositionRow>(jobsJson));

        // si edit: cargar details
        if (personalId) {
          const dRes = await fetch(`/api/personal/${personalId}`, { cache: "no-store" });
          const dJson = await dRes.json().catch(() => ({}));

          if (!dRes.ok) {
            console.error("Failed loading personal details", { status: dRes.status, dJson });
            return;
          }

          const d = unwrapObject<PersonalDetails>(dJson);
          if (!d) return;

          setDetails(d);
          setForm({
            id_user: Number(d.user?.id_user ?? 0),
            id_job_position: Number(d.jobPosition?.id_job_position ?? 0),
            isActive: !!d.isActive,
          });
        }
      } catch (e) {
        console.error("Personal modal load failed", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [open, personalId]);

  async function onSave() {
    try {
      setLoading(true);

      const payload: UpsertPayload = {
        id_user: Number(form.id_user),
        id_job_position: Number(form.id_job_position),
        isActive: !!form.isActive,
      };

      const res = await fetch(isEdit ? `/api/personal/${personalId}` : "/api/personal", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store",
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        console.error("Save personal failed", { status: res.status, json });
        return;
      }

      router.refresh();
      onClose();
    } catch (e) {
      console.error("Save personal failed", e);
    } finally {
      setLoading(false);
    }
  }

  const canSave = form.id_user > 0 && form.id_job_position > 0;

  return (
    <Modal open={open} title={title} onClose={onClose}>
      {loading ? (
        <div className="text-sm text-muted-foreground">Loading...</div>
      ) : (
        <div className="space-y-4">
          {isEdit ? (
            <div className="flex items-center gap-2">
              <Badge variant={details?.isActive ? "default" : "destructive"}>
                {details?.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <div className="text-sm font-medium mb-1">User</div>
              <select
                value={form.id_user ? String(form.id_user) : ""}
                onChange={(e) => setForm((p) => ({ ...p, id_user: Number(e.target.value) }))}
                className="h-10 w-full rounded-md border bg-white px-3 text-sm"
              >
                <option value="" disabled>
                  {users.length ? "Select user..." : "Loading users..."}
                </option>
                {users.map((u) => (
                  <option key={u.id_user} value={u.id_user}>
                    {u.full_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="text-sm font-medium mb-1">Job position</div>
              <select
                value={form.id_job_position ? String(form.id_job_position) : ""}
                onChange={(e) => setForm((p) => ({ ...p, id_job_position: Number(e.target.value) }))}
                className="h-10 w-full rounded-md border bg-white px-3 text-sm"
              >
                <option value="" disabled>
                  {jobs.length ? "Select job position..." : "Loading job positions..."}
                </option>
                {jobs.map((j) => (
                  <option key={j.id_job_position} value={j.id_job_position}>
                    {j.job_position_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <div className="text-sm font-medium mb-1">isActive</div>
              <select
                value={form.isActive ? "true" : "false"}
                onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.value === "true" }))}
                className="h-10 w-full rounded-md border bg-white px-3 text-sm"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex gap-2">
            <Button onClick={onSave} disabled={!canSave || loading}>
              Save
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
