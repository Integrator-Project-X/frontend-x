"use client";

import { ReactNode, useState } from "react";
import JobPositionUpsertModal from "@/src/components/ui/organisms/JobPositionUpsertModal";

export default function JobPositionClientActions({
  children,
  mode,
  jobPositionId,
}: {
  children: ReactNode;
  mode: "create" | "edit";
  jobPositionId?: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <span onClick={() => setOpen(true)} className="inline-block">
        {children}
      </span>

      <JobPositionUpsertModal
        open={open}
        onClose={() => setOpen(false)}
        jobPositionId={mode === "edit" ? jobPositionId : null}
      />
    </>
  );
}
