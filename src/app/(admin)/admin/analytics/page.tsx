'use client'

import { useEffect, useState } from 'react'
import { fetchDataAnalytics } from '@/src/lib/api'
import BarChart from '@/src/components/ui/charts/BarChart'
import PieChart from '@/src/components/ui/charts/PieChart'
import LineChart from '@/src/components/ui/charts/LineChart'
import KpiCard from '@/src/components/ui/organisms/KpiCard'

export default function AdminDashboard() {
  const [clinics, setClinics] = useState<any>(null)
  const [animals, setAnimals] = useState<any>(null)
  const [clientsByMonth, setClientsByMonth] = useState<any>(null)
  const [kpis, setKpis] = useState<Record<string, any> | null>(null)
  const [loadingKpis, setLoadingKpis] = useState(true)

  useEffect(() => {
    fetchDataAnalytics('/admin/analytics/clinics')
      .then(setClinics)
      .catch(() => setClinics(null))

    fetchDataAnalytics('/admin/analytics/animals')
      .then(setAnimals)
      .catch(() => setAnimals(null))

    fetchDataAnalytics('/admin/analytics/clients-by-month')
      .then(setClientsByMonth)
      .catch(() => setClientsByMonth(null))

    fetchDataAnalytics('/admin/analytics/kpis/summary')
      .then((res) => {
        const data =
          res?.data ??
          res?.data?.data ??
          res?.data?.[0] ??
          res?.[0] ??
          res

        setKpis(typeof data === 'object' ? data : null)
      })
      .catch(() => setKpis(null))
      .finally(() => setLoadingKpis(false))
  }, [])

  return (
  <div className="p-6 space-y-10 bg-slate-50/60 min-h-screen">
    {/* ===== HEADER ===== */}
    <div>
      <h1 className="text-3xl font-semibold text-slate-800">
        Dashboard Admin
      </h1>
      <p className="text-sm text-slate-500">
        Overview of platform activity and performance
      </p>
    </div>

    {/* ================= CHARTS ================= */}
    {clinics && (
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-800">
            Clínicas con más servicios
          </h2>
          <p className="text-sm text-slate-500">
            Ranking por volumen de atención
          </p>
        </div>
        <BarChart data={clinics} />
      </section>
    )}

    {animals && (
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-800">
            Servicios por tipo de animal
          </h2>
          <p className="text-sm text-slate-500">
            Distribución de servicios registrados
          </p>
        </div>

        {/* CONTENEDOR CONTROLADO PARA EL PIE */}
        <div className="flex justify-center">
          <div className="w-[260px] md:w-[300px]">
            <PieChart data={animals} />
          </div>
        </div>
      </section>
    )}

    {clientsByMonth && (
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-800">
            Clientes por mes
          </h2>
          <p className="text-sm text-slate-500">
            Crecimiento mensual de usuarios
          </p>
        </div>
        <LineChart data={clientsByMonth} />
      </section>
    )}
  </div>
);
}
