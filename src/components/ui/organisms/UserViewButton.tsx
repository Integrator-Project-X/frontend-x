"use client";

import { useState } from "react";
import { Eye } from "lucide-react";
import { Button } from "@/src/components/ui/atoms/button";
import type { BackendUser } from "@/src/types/users.types";
import UserDetailsModal from "./UserDetailsModal";

export default function UserViewButton({ user }: { user: BackendUser }) {
  const [open, setOpen] = useState(false);

  // ✅ el id que llega desde getUsersWithRoles ya es id_user
  const userId = user?.id != null ? String(user.id) : "";

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        disabled={!userId}
      >
        <Eye className="h-4 w-4" />
        View
      </Button>

      <UserDetailsModal
        open={open}
        onClose={() => setOpen(false)}
        summary={user}
        userId={userId}
      />
    </>
  );
}
