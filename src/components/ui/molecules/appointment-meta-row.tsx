import { cn } from "@/src/lib/utils";
import type { LucideIcon } from "lucide-react";

type Props = {
    icon?: LucideIcon;
    label: string;
    value?: string | number | null;
    className?: string;
};

export function AppointmentMetaRow({ icon: Icon, label, value, className }: Props) {
    const show = value === undefined || value === null || String(value).trim() === "" ? "—" : value;

    return (
        <div className={cn("flex items-center gap-2 text-sm text-muted-foreground", className)}>
            {Icon ? <Icon className="h-4 w-4" /> : null}
            <span className="text-foreground/70">{label}:</span>
            <span className="text-foreground">{show as any}</span>
        </div>
    );
}
