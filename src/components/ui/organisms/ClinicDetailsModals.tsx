"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "./Modal";
import { Button } from "@/src/components/ui/atoms/button";
import { Input } from "@/src/components/ui/molecules/input";
import { Badge } from "@/src/components/ui/atoms/badge";

type ClinicDetails = {
  id_clinic: number;
  clinic_name: string;
  address: string;
  phone_number: string;
  identification_number: string;
  image_url?: string | null;
  isActive: boolean;
};

type FormState = {
  clinic_name: string;
  address: string;
  phone_number: string;
  identification_number: string;
  isActive: boolean;
  image: File | null;
};

type ClinicSummary = {
  id: number | string;
  name?: string | null;
  address?: string | null;
  phoneNumber?: string | null;
  identificationNumber?: string | null;
  imageUrl?: string | null;
  isActive?: boolean;
};

type Props = {
  open: boolean;
  onClose: () => void;
  summary: ClinicSummary;
  clinicId: string;
};

function isNumericString(v: string) {
  return /^\d+$/.test(String(v ?? "").trim());
}

const selectClassName =
  "flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background " +
  "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
  "focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

export default function ClinicDetailsModal({ open, onClose, summary, clinicId }: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [details, setDetails] = useState<ClinicDetails | null>(null);
  const [form, setForm] = useState<FormState>({
    clinic_name: "",
    address: "",
    phone_number: "",
    identification_number: "",
    isActive: true,
    image: null,
  });

  const title = useMemo(() => `Clinic #${clinicId}`, [clinicId]);

  function resetState() {
    setLoading(false);
    setEditing(false);
    setError(null);
    setDetails(null);
    setForm({
      clinic_name: "",
      address: "",
      phone_number: "",
      identification_number: "",
      isActive: true,
      image: null,
    });
  }

  function handleClose() {
    resetState();
    onClose();
  }

  // ✅ cargar details
  useEffect(() => {
    if (!open) {
      resetState();
      return;
    }

    const id = String(clinicId ?? "").trim();
    if (!id || id === "undefined" || !isNumericString(id)) {
      setError(`Invalid clinicId: "${id}"`);
      return;
    }

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/clinics/${id}`, { cache: "no-store" });
        const json = await res.json().catch(() => ({}));

        if (!res.ok) {
          const msg = json?.payload?.error?.message || json?.message || `Request failed (${res.status})`;
          setError(msg);
          setDetails(null);
          return;
        }

        const c: ClinicDetails = (json?.data ?? json) as ClinicDetails;

        setDetails(c);
        setForm({
          clinic_name: c.clinic_name ?? "",
          address: c.address ?? "",
          phone_number: c.phone_number ?? "",
          identification_number: c.identification_number ?? "",
          isActive: !!c.isActive,
          image: null,
        });

        setEditing(false);
      } catch {
        setError("Failed to load clinic details");
        setDetails(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [open, clinicId]);

  const previewUrl = useMemo(() => {
    if (form.image) return URL.createObjectURL(form.image);
    return details?.image_url ?? summary.imageUrl ?? "";
  }, [form.image, details?.image_url, summary.imageUrl]);

  useEffect(() => {
    return () => {
      if (form.image) URL.revokeObjectURL(previewUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.image]);

  async function onSave() {
    const id = String(clinicId ?? "").trim();
    if (!id || !isNumericString(id)) {
      setError(`Invalid clinicId: "${id}"`);
      return;
    }

    if (!form.clinic_name.trim()) {
      setError("Clinic name is required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const fd = new FormData();
      fd.append("clinic_name", form.clinic_name.trim());
      fd.append("address", form.address);
      fd.append("phone_number", form.phone_number);
      fd.append("identification_number", form.identification_number);
      fd.append("isActive", String(form.isActive));
      if (form.image) fd.append("image", form.image);

      const res = await fetch(`/api/clinics/${id}`, {
        method: "PATCH",
        body: fd,
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = json?.payload?.error?.message || json?.message || `Update failed (${res.status})`;
        setError(msg);
        return;
      }

      const updated: ClinicDetails = (json?.data ?? json) as ClinicDetails;
      setDetails(updated);
      setEditing(false);
      router.refresh();
    } catch {
      setError("Failed to update clinic");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} title={title} onClose={handleClose}>
      {loading && <div className="text-sm text-muted-foreground">Loading...</div>}

      {!loading && (
        <div className="space-y-4">
          {/* header */}
          <div className="grid grid-cols-2 gap-4 rounded-md border border-black/10 bg-white p-3">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Status</p>
              {details?.isActive ?? summary.isActive ? (
                <Badge>Active</Badge>
              ) : (
                <Badge variant="destructive">Inactive</Badge>
              )}
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Clinic</p>
              <Badge variant="secondary">{details?.clinic_name ?? summary.name ?? "—"}</Badge>
            </div>
          </div>

          {error && (
            <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm">
              <p className="font-medium">Error</p>
              <p className="text-muted-foreground">{error}</p>
            </div>
          )}

          {!details ? (
            <div className="text-sm text-muted-foreground">No data loaded.</div>
          ) : !editing ? (
            <div className="space-y-3">
              <div className="flex items-start gap-4">
                <div className="h-24 w-24 overflow-hidden rounded-xl border bg-white">
                  {previewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={previewUrl} alt={details.clinic_name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">
                      No image
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm flex-1">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Clinic name</p>
                    <p className="font-medium">{details.clinic_name}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p>{details.phone_number || "—"}</p>
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <p className="text-xs text-muted-foreground">Address</p>
                    <p>{details.address || "—"}</p>
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <p className="text-xs text-muted-foreground">Identification number</p>
                    <p>{details.identification_number || "—"}</p>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-start">
                <Button variant="outline" onClick={() => setEditing(true)}>
                  Edit
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1 md:col-span-2">
                  <p className="text-sm font-medium">Clinic name</p>
                  <Input
                    value={form.clinic_name}
                    onChange={(e) => setForm((p) => ({ ...p, clinic_name: e.target.value }))}
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <p className="text-sm font-medium">Address</p>
                  <Input
                    value={form.address}
                    onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                  />
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium">Phone number</p>
                  <Input
                    value={form.phone_number}
                    onChange={(e) => setForm((p) => ({ ...p, phone_number: e.target.value }))}
                  />
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium">Identification number</p>
                  <Input
                    value={form.identification_number}
                    onChange={(e) => setForm((p) => ({ ...p, identification_number: e.target.value }))}
                  />
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium">Status</p>
                  <select
                    className={selectClassName}
                    value={String(form.isActive)}
                    onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.value === "true" }))}
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>

                <div className="space-y-1 md:col-span-2">
                  <p className="text-sm font-medium">Image (optional)</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setForm((p) => ({ ...p, image: e.target.files?.[0] ?? null }))}
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-start gap-2">
                <Button onClick={onSave} disabled={loading}>
                  {loading ? "Saving..." : "Save"}
                </Button>
                <Button variant="outline" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
