"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/atoms/card";
import { Button } from "@/src/components/ui/atoms/button";

type Props = {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
};

export default function Modal({ open, title, onClose, children }: Props) {
  useEffect(() => {
    if (!open) return;

    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onEsc);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onEsc);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title ?? "Modal"}
    >
      {/* Overlay suave + blur */}
      <button
        aria-label="Close modal overlay"
        className="absolute inset-0 bg-black/25 backdrop-blur-[2px]"
        onClick={onClose}
        type="button"
      />

      {/* Panel */}
      <div
        className="relative w-full max-w-2xl animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ✅ Fondo blanco sólido + borde + sombra fuerte */}
        <Card className="relative w-full bg-white text-black border border-black/20 shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between gap-4 border-b border-black/10">
            <CardTitle className="text-base md:text-lg">
              {title ?? "Details"}
            </CardTitle>

            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
          </CardHeader>

          {/* Scroll interno */}
          <CardContent className="max-h-[70vh] overflow-auto bg-white">
            {children}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
