"use client";

import { ReactNode, useState } from "react";
import DiagnosisUpsertModal from "@/src/components/ui/organisms/DiagnosisUpsertModal";

export default function DiagnosisClientActions({
  children,
  mode,
  diagnosisId,
}: {
  children: ReactNode;
  mode: "create" | "edit";
  diagnosisId?: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <span onClick={() => setOpen(true)} className="inline-block">
        {children}
      </span>

      <DiagnosisUpsertModal
        open={open}
        onClose={() => setOpen(false)}
        diagnosisId={mode === "edit" ? diagnosisId : null}
      />
    </>
  );
}
