"use client";

import { useState } from "react";
import { Eye } from "lucide-react";
import { Button } from "@/src/components/ui/atoms/button";
import AppointmentDetailsModal from "@/src/components/ui/organisms/AppointmentDetailsModal";

type Props = {
  appointmentId: string | number;
  summary?: {
    isActive?: boolean;
  };
};

export default function AppointmentViewButton({ appointmentId, summary }: Props) {
  const [open, setOpen] = useState(false);

  const id = String(appointmentId ?? "").trim();

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        disabled={!id}
      >
        <Eye className="h-4 w-4" />
        View
      </Button>

      <AppointmentDetailsModal
        open={open}
        onClose={() => setOpen(false)}
        appointmentId={id}
        initialIsActive={summary?.isActive}
      />
    </>
  );
}
