import { Badge } from "@/src/components/ui/atoms/badge";
import { cn } from "@/src/lib/utils";

type Props = {
    day: string;
    hoursLabel: string;
    badgeLabel?: string;
    isClosed?: boolean;
    className?: string;
};

export function ScheduleDayRow({ day, hoursLabel, badgeLabel, isClosed = false, className }: Props) {
    return (
        <div className={cn("flex items-center justify-between gap-3", className)}>
            <div className="min-w-0">
                <p className="font-medium text-foreground">{day}</p>
                <p className="text-sm text-muted-foreground">{hoursLabel}</p>
            </div>

            {badgeLabel ? (
                <Badge variant={isClosed ? "outline" : "secondary"}>{badgeLabel}</Badge>
            ) : null}
        </div>
    );
}
