'use client'

import { useState, useEffect } from 'react'

export function useFetch<T>(endpoint: string, params?: Record<string, any>) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const queryString = params ? new URLSearchParams(params).toString() : ''
    const url = queryString ? `${endpoint}?${queryString}` : endpoint

    fetch(url)
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch((err) => setError(err))
      .finally(() => setLoading(false))
  }, [endpoint, JSON.stringify(params)])

  return { data, loading, error }
}
