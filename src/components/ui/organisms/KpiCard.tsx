'use client'

import React from 'react'

interface KpiCardProps {
  title: string
  value?: string | number | null
  icon?: React.ReactNode
}

function formatValue(val?: string | number | null) {
  if (val === undefined || val === null) return '-'
  if (typeof val === 'number') return val.toLocaleString()
  return val
}

export default function KpiCard({ title, value, icon }: KpiCardProps) {
  return (
    <div className="bg-white shadow-md rounded-xl p-4 flex items-center space-x-4">
      {icon && <div className="text-blue-500 text-3xl">{icon}</div>}
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-2xl font-bold">{formatValue(value)}</p>
      </div>
    </div>
  )
}
