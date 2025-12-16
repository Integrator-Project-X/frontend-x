"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "./Modal";
import { Button } from "@/src/components/ui/atoms/button";
import { Input } from "@/src/components/ui/molecules/input";
import { Badge } from "@/src/components/ui/atoms/badge";

type DiagnosisDetails = {
  id_diagnosis: number;
  diagnosisName?: string;
  description: string;
  isActive: boolean;
  personal?: {
    id_personal: number;
    user?: { full_name?: string };
    jobPosition?: { job_position_name?: string };
  };
};

type Props = {
  open: boolean;
  onClose: () => void;
  diagnosisId?: number | null; // edit si viene, create si no
};

function unwrapObject<T>(payload: any): T | null {
  if (!payload) return null;
  return (payload?.data ?? payload) as T;
}

export default function DiagnosisUpsertModal({ open, onClose, diagnosisId }: Props) {
  const router = useRouter();
  const isEdit = !!diagnosisId;

  const title = useMemo(
    () => (isEdit ? `Edit diagnosis #${diagnosisId}` : "Create new diagnosis"),
    [isEdit, diagnosisId]
  );

  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState<DiagnosisDetails | null>(null);

  const [form, setForm] = useState<{
    id_personal: number;
    diagnosisName: string;
    description: string;
    isActive: boolean;
  }>({
    id_personal: 0,
    diagnosisName: "",
    description: "",
    isActive: true,
  });

  useEffect(() => {
    if (!open) return;

    setLoaded(null);
    setForm({ id_personal: 0, diagnosisName: "", description: "", isActive: true });

    if (!diagnosisId) return;

    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/diagnosis/${diagnosisId}`, { cache: "no-store" });
        const json = await res.json().catch(() => ({}));

        if (!res.ok) {
          console.error("Failed to load diagnosis detail", { status: res.status, json });
          return;
        }

        const d = unwrapObject<DiagnosisDetails>(json);
        if (!d) return;

        setLoaded(d);
        setForm({
          id_personal: Number(d.personal?.id_personal ?? 0),
          diagnosisName: String(d.diagnosisName ?? ""),
          description: String(d.description ?? ""),
          isActive: !!d.isActive,
        });
      } catch (e) {
        console.error("Load diagnosis failed", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [open, diagnosisId]);

  async function onSave() {
    try {
      setLoading(true);

      const payload = {
        id_personal: Number(form.id_personal),
        diagnosisName: String(form.diagnosisName ?? "").trim(),
        description: String(form.description ?? "").trim(),
        isActive: !!form.isActive,
      };

      const res = await fetch(isEdit ? `/api/diagnosis/${diagnosisId}` : "/api/diagnosis", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store",
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        console.error("Save diagnosis failed", { status: res.status, json });
        return;
      }

      router.refresh();
      onClose();
    } catch (e) {
      console.error("Save diagnosis failed", e);
    } finally {
      setLoading(false);
    }
  }

  const vetName = loaded?.personal?.user?.full_name ?? "—";
  const vetJob = loaded?.personal?.jobPosition?.job_position_name ?? "—";

  return (
    <Modal open={open} title={title} onClose={onClose}>
      {loading ? (
        <div className="text-sm text-muted-foreground">Loading...</div>
      ) : (
        <div className="space-y-4">
          {isEdit ? (
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={loaded?.isActive ? "default" : "destructive"}>
                {loaded?.isActive ? "Active" : "Inactive"}
              </Badge>
              <Badge variant="secondary">{vetName}</Badge>
              {vetJob !== "—" ? <Badge variant="secondary">{vetJob}</Badge> : null}
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <div className="text-sm font-medium mb-1">id_personal (Vet)</div>
              <Input
                type="number"
                value={form.id_personal}
                onChange={(e) => setForm((p) => ({ ...p, id_personal: Number(e.target.value) }))}
                placeholder="e.g. 1"
              />
            </div>

            <div>
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

            <div className="md:col-span-2">
              <div className="text-sm font-medium mb-1">diagnosisName (optional)</div>
              <Input
                value={form.diagnosisName}
                onChange={(e) => setForm((p) => ({ ...p, diagnosisName: e.target.value }))}
                placeholder="e.g. Hypertension (Controlled)"
              />
            </div>

            <div className="md:col-span-2">
              <div className="text-sm font-medium mb-1">description</div>
              <Input
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="Diagnosis description..."
              />
            </div>
          </div>

          <div className="pt-2 flex gap-2">
            <Button onClick={onSave} disabled={loading || !form.description.trim()}>
              {loading ? "Saving..." : "Save"}
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
