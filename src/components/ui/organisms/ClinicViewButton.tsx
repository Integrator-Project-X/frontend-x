"use client";

import { useState } from "react";
import { Eye } from "lucide-react";
import { Button } from "@/src/components/ui/atoms/button";
import ClinicDetailsModal from "@/src/components/ui/organisms/ClinicDetailsModals";

type ClinicSummary = {
  id: number | string;
  name?: string | null;
  address?: string | null;
  phoneNumber?: string | null;
  identificationNumber?: string | null;
  imageUrl?: string | null;
  isActive?: boolean;
};

export default function ClinicViewButton({ clinic }: { clinic: ClinicSummary }) {
  const [open, setOpen] = useState(false);
  const clinicId = clinic?.id != null ? String(clinic.id) : "";

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)} disabled={!clinicId}>
        <Eye className="h-4 w-4" />
        View
      </Button>

      <ClinicDetailsModal
        open={open}
        onClose={() => setOpen(false)}
        summary={clinic}
        clinicId={clinicId}
      />
    </>
  );
}
