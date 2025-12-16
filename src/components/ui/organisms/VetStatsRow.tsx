import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/atoms/card";
import { Badge } from "@/src/components/ui/atoms/badge";
import type { VetDashboardStats } from "@/src/types/vet.types";

type Props = {
    stats: VetDashboardStats;
};

function profileBadgeVariant(status: VetDashboardStats["profileStatus"]) {
    if (status === "VERIFIED") return "default";
    if (status === "REJECTED") return "destructive";
    return "secondary";
}

export default function VetStatsRow({ stats }: Props) {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card className="border-slate-200 bg-white">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold">Profile Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                    <Badge variant={profileBadgeVariant(stats.profileStatus)}>
                        {stats.profileStatusLabel}
                    </Badge>
                    <p className="text-sm text-muted-foreground">{stats.profileStatusHint}</p>
                </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold">Today’s Appointments</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                    <p className="text-3xl font-semibold text-foreground">
                        {stats.todaysAppointmentsCount}
                    </p>
                    <p className="text-sm text-muted-foreground">{stats.todaysAppointmentsHint}</p>
                </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold">Clinic Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                        <p className="font-medium text-foreground">{stats.clinicStatusLabel}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{stats.clinicStatusHint}</p>
                </CardContent>
            </Card>
        </div>
    );
}
