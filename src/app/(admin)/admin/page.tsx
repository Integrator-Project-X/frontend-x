import Link from "next/link";
import {
  Users,
  Building2,
  CalendarCheck2,
  ShieldCheck,
  AlertTriangle,
  BarChart3,
  ArrowRight,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";

type Metric = {
  label: string;
  value: string;
  helper?: string;
  icon: React.ElementType;
};

type SystemAlert = {
  title: string;
  description: string;
  severity: "high" | "medium" | "low";
  href: string;
  icon: React.ElementType;
};

const metrics: Metric[] = [
  { label: "Usuarios activos", value: "1,248", helper: "+3.2% vs last 7d", icon: Users },
  { label: "Clínicas registradas", value: "86", helper: "12 nuevas este mes", icon: Building2 },
  { label: "Citas totales", value: "4,902", helper: "últimos 30 días", icon: CalendarCheck2 },
  { label: "Clínicas pendientes", value: "9", helper: "requieren aprobación", icon: ShieldCheck },
];

const alerts: SystemAlert[] = [
  {
    title: "Clínicas pendientes de verificación",
    description: "Hay 9 clínicas que requieren revisión y aprobación.",
    severity: "high",
    href: "/admin/clinics/verification",
    icon: ShieldCheck,
  },
  {
    title: "Casos problemáticos recientes",
    description: "3 citas marcadas como problemáticas en las últimas 24h.",
    severity: "medium",
    href: "/admin/appointments/problematic",
    icon: AlertTriangle,
  },
  {
    title: "Revisar reportes de citas",
    description: "Genera reportes por ciudad y horas pico para decisiones del MVP.",
    severity: "low",
    href: "/admin/appointments/reports",
    icon: BarChart3,
  },
];

function severityStyles(sev: SystemAlert["severity"]) {
  if (sev === "high") return "border-destructive/40 bg-destructive/5";
  if (sev === "medium") return "border-border bg-muted/40";
  return "border-border bg-background";
}

export default function AdminPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Control, crecimiento y calidad de la plataforma (MVP).
          </p>
        </div>

        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/admin/analytics">Ver analytics</Link>
          </Button>
          <Button asChild>
            <Link href="/admin/clinics/verification">Verificar clínicas</Link>
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <Card key={m.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardDescription>{m.label}</CardDescription>
                  <CardTitle className="mt-1 text-2xl">{m.value}</CardTitle>
                </div>
                <div className="grid h-10 w-10 place-items-center rounded-xl border bg-background">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              {m.helper && (
                <CardContent className="pt-0">
                  <p className="text-xs text-muted-foreground">{m.helper}</p>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Alerts + Quick actions */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* System Alerts */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Alertas del sistema</CardTitle>
            <CardDescription>Items que requieren atención del admin.</CardDescription>
          </CardHeader>

          <CardContent className="space-y-3">
            {alerts.map((a) => {
              const Icon = a.icon;
              return (
                <Link
                  key={a.title}
                  href={a.href}
                  className={[
                    "block rounded-2xl border p-4 transition-colors hover:bg-muted/40",
                    severityStyles(a.severity),
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-xl border bg-background">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm font-semibold">{a.title}</p>
                        <p className="text-sm text-muted-foreground">{a.description}</p>
                      </div>
                    </div>

                    <ArrowRight className="mt-1 h-4 w-4 text-muted-foreground" />
                  </div>
                </Link>
              );
            })}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Accesos rápidos</CardTitle>
            <CardDescription>Navega a módulos core.</CardDescription>
          </CardHeader>

          <CardContent className="space-y-2">
            <QuickLink href="/admin/users/pet-owners" title="Pet Owners" desc="Gestionar usuarios" />
            <QuickLink href="/admin/users/vets" title="Veterinarias" desc="Gestionar clínicas" />
            <QuickLink href="/admin/appointments" title="Citas" desc="Oversight general" />
            <QuickLink href="/admin/clinics/verification" title="Verificación" desc="Aprobar clínicas" />
            <QuickLink href="/admin/content" title="Contenido" desc="Static pages & reglas" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function QuickLink({
  href,
  title,
  desc,
}: {
  href: string;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-xl border bg-background px-3 py-2 hover:bg-muted/40"
    >
      <div className="space-y-0.5">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground" />
    </Link>
  );
}
