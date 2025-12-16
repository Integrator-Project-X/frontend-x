'use client'

import { useEffect, useState } from 'react'
import { fetchData } from '@/src/lib/api'
import BarChart from '@/src/components/ui/charts/BarChart'
import LineChart from '@/src/components/ui/charts/LineChart'
import KpiCard from '@/src/components/ui/organisms/KpiCard'

const CLINIC_ID = 1
const YEAR = 2025

export default function VetDashboard() {
  const [topServices, setTopServices] = useState<any>(null)
  const [servicesByPeriod, setServicesByPeriod] = useState<any>(null)
  const [kpis, setKpis] = useState<Record<string, any> | null>(null)
  const [loadingKpis, setLoadingKpis] = useState(true)

  useEffect(() => {
    fetchData(`/veterinarian/analytics/top-services?clinic_id=${CLINIC_ID}`)
      .then(setTopServices)
      .catch(() => setTopServices(null))

    fetchData(
      `/veterinarian/analytics/services-by-period?clinic_id=${CLINIC_ID}&year=${YEAR}`
    )
      .then(setServicesByPeriod)
      .catch(() => setServicesByPeriod(null))

    fetchData(`/veterinarian/analytics/kpis/summary?clinic_id=${CLINIC_ID}`)
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
    <div className="p-6 space-y-10">
      <h1 className="text-3xl font-bold">Dashboard Veterinaria</h1>

      {/* ================= KPIs ================= */}
      {loadingKpis ? (
        <p>Cargando KPIs...</p>
      ) : kpis ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {Object.entries(kpis).map(([key, value]) => (
            <KpiCard
              key={key}
              title={key.replace(/_/g, ' ').toUpperCase()}
              value={
                typeof value === 'number'
                  ? value.toLocaleString()
                  : String(value)
              }
            />
          ))}
        </div>
      ) : (
        <p>No se pudieron cargar las KPIs</p>
      )}

      {/* ================= CHARTS ================= */}
      {topServices && (
        <section>
          <h2 className="text-xl mb-2">Servicios más solicitados</h2>
          <BarChart data={topServices} />
        </section>
      )}

      {servicesByPeriod && (
        <section>
          <h2 className="text-xl mb-2">Servicios por fecha</h2>
          <LineChart data={servicesByPeriod} />
        </section>
      )}
    </div>
  )
}
