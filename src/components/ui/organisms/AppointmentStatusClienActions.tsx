"use client";

import { ReactNode, useState } from "react";
import AppointmentStatusUpsertModal from "@/src/components/ui/organisms/AppointmentStatusUpserModal";

export default function AppointmentStatusClientActions({
  children,
  mode,
  statusId,
}: {
  children: ReactNode;
  mode: "create" | "edit";
  statusId?: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <span onClick={() => setOpen(true)} className="inline-block">
        {children}
      </span>

      <AppointmentStatusUpsertModal
        open={open}
        onClose={() => setOpen(false)}
        statusId={mode === "edit" ? statusId : null}
      />
    </>
  );
}
