const API_URL = process.env.NEXT_PUBLIC_API_URL

if (!API_URL) {
  throw new Error('NEXT_PUBLIC_API_URL no está definida')
}

export async function fetchData(endpoint: string) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    cache: 'no-store'
  })

  if (!res.ok) {
    throw new Error('Error fetching data')
  }

  return res.json()
}
