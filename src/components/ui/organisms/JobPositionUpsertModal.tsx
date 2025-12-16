"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "./Modal";
import { Button } from "@/src/components/ui/atoms/button";
import { Input } from "@/src/components/ui/molecules/input";
import { Badge } from "@/src/components/ui/atoms/badge";

type JobPositionDetails = {
  id_job_position: number;
  job_position_name: string;
  isActive: boolean;
};

type Props = {
  open: boolean;
  onClose: () => void;
  jobPositionId?: number | null; // edit si viene, create si no
};

function unwrapObject<T>(payload: any): T | null {
  if (!payload) return null;
  return (payload?.data ?? payload) as T;
}

export default function JobPositionUpsertModal({ open, onClose, jobPositionId }: Props) {
  const router = useRouter();
  const isEdit = !!jobPositionId;

  const title = useMemo(
    () => (isEdit ? `Edit job position #${jobPositionId}` : "Create new job position"),
    [isEdit, jobPositionId]
  );

  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState<JobPositionDetails | null>(null);

  const [name, setName] = useState("");

  useEffect(() => {
    if (!open) return;

    setLoaded(null);
    setName("");

    if (!jobPositionId) return;

    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/jobpositions/${jobPositionId}`, { cache: "no-store" });
        const json = await res.json().catch(() => ({}));

        if (!res.ok) {
          console.error("Failed to load job position detail", { status: res.status, json });
          return;
        }

        const d = unwrapObject<JobPositionDetails>(json);
        if (!d) return;

        setLoaded(d);
        setName(String(d.job_position_name ?? ""));
      } catch (e) {
        console.error("Load job position failed", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [open, jobPositionId]);

  async function onSave() {
    try {
      setLoading(true);

      const payload = { job_position_name: String(name).trim() };

      const res = await fetch(isEdit ? `/api/jobpositions/${jobPositionId}` : "/api/jobpositions", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store",
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        console.error("Save job position failed", { status: res.status, json });
        return;
      }

      router.refresh();
      onClose();
    } catch (e) {
      console.error("Save job position failed", e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} title={title} onClose={onClose}>
      {loading ? (
        <div className="text-sm text-muted-foreground">Loading...</div>
      ) : (
        <div className="space-y-4">
          {isEdit ? (
            <div className="flex items-center gap-2">
              <Badge variant={loaded?.isActive ? "default" : "destructive"}>
                {loaded?.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          ) : null}

          <div>
            <div className="text-sm font-medium mb-1">Job position name</div>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Senior Veterinary Assistant" />
          </div>

          <div className="pt-2 flex gap-2">
            <Button onClick={onSave} disabled={!name.trim()}>
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
