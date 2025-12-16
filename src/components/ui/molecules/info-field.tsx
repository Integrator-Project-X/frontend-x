import { cn } from "@/src/lib/utils";

type Props = {
    label: string;
    value?: string | number | null;
    className?: string;
};

export function InfoField({ label, value, className }: Props) {
    const show = value === undefined || value === null || String(value).trim() === "" ? "—" : value;

    return (
        <div className={cn("space-y-1", className)}>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="font-medium text-foreground">{show as any}</p>
        </div>
    );
}
