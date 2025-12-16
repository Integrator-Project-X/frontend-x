import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/atoms/card";
import { Button } from "@/src/components/ui/atoms/button";
import { ScheduleDayRow } from "@/src/components/ui/molecules/schedule-day-row";
import type { VetScheduleDay } from "@/src/types/vet.types";

type Props = {
    schedule: VetScheduleDay[];
};

export default function VetScheduleCard({ schedule }: Props) {
    return (
        <Card className="border-slate-200 bg-white">
            <CardHeader>
                <CardTitle className="text-lg">My Schedule</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
                {schedule.map((d) => {
                    const hours =
                        d.isClosed ? "Closed" : `${d.start ?? "—"} - ${d.end ?? "—"}`;

                    return (
                        <ScheduleDayRow
                            key={d.day}
                            day={d.day}
                            hoursLabel={hours}
                            badgeLabel={d.isClosed ? "Closed" : (d.slotsLabel ?? "")}
                            isClosed={!!d.isClosed}
                        />
                    );
                })}

                <div className="pt-2">
                    <Button type="button" variant="secondary" disabled>
                        Edit Schedule
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
