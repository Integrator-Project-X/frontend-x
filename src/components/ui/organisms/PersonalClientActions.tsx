"use client";

import { ReactNode, useState } from "react";
import PersonalUpsertModal from "@/src/components/ui/organisms/PersonalUpsertModal";

export default function PersonalClientActions({
  children,
  mode,
  personalId,
}: {
  children: ReactNode;
  mode: "create" | "edit";
  personalId?: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <span onClick={() => setOpen(true)} className="inline-block">
        {children}
      </span>

      <PersonalUpsertModal
        open={open}
        onClose={() => setOpen(false)}
        personalId={mode === "edit" ? personalId : null}
      />
    </>
  );
}
