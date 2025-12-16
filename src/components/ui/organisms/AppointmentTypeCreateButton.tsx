"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/src/components/ui/atoms/button";
import AppointmentTypeUpsertModal from "@/src/components/ui/organisms/AppointmentTypeUpserModal";

export default function AppointmentTypeCreateButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        Create
      </Button>

      <AppointmentTypeUpsertModal
        open={open}
        onClose={() => setOpen(false)}
        mode="create"
        initial={null}
      />
    </>
  );
}
