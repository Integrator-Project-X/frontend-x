import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/atoms/card";
import type { VetAppointmentVM } from "@/src/types/vet.types";
import VetAppointmentItem from "@/src/components/ui/organisms/VetAppointmentItem";

type Props = {
    appointments: VetAppointmentVM[];
    title?: string;
    emptyLabel?: string;
};

export default function VetTodaysAppointments({
    appointments,
    title = "Today’s Appointments",
    emptyLabel = "No appointments.",
}: Props) {
    return (
        <Card className="border-slate-200 bg-white lg:col-span-2">
            <CardHeader>
                <CardTitle className="text-lg">{title}</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                {appointments.length === 0 ? (
                    <div className="text-sm text-muted-foreground">{emptyLabel}</div>
                ) : (
                    appointments.map((a) => <VetAppointmentItem key={a.id} appointment={a} />)
                )}
            </CardContent>
        </Card>
    );
}
