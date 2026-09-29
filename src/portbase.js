export const PORTBASE_FLEET_URL = '/api/fleet'
export const PORTBASE_AVAILABILITY_URL = '/api/availability'
export const PORTBASE_MONTH_AVAILABILITY_URL = '/api/month-availability'

function formatPrice(priceByMonth = {}) {
  const entries = Object.entries(priceByMonth)
    .filter(([, value]) => Number.isFinite(Number(value)))
    .sort(([left], [right]) => left.localeCompare(right))

  if (entries.length === 0) return 'Price on request'

  const now = new Date()
  const currentKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const selected = entries.find(([key]) => key === currentKey)
    || entries.find(([key]) => key >= currentKey)
    || entries[0]
  const amount = Math.round(Number(selected[1]))

  return `From ${new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(amount)} / day`
}

function formatLength(value) {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? `${parsed} m` : 'Length on request'
}

function formatCabins(value) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed <= 0) return 'Day boat'
  return `${parsed} ${parsed === 1 ? 'cabin' : 'cabins'}`
}

export function normalisePortbaseBoat(boat) {
  const metadata = boat?.metadata || {}
  const gallery = Array.isArray(boat?.photos) ? boat.photos.filter(Boolean) : []
  const model = String(boat?.model || '').trim()
  const name = String(boat?.name || model || 'Ibiza yacht').trim()
  const capacity = Number(boat?.capacity)
  const year = metadata.build_year ? ` · ${metadata.build_year}` : ''

  return {
    id: boat.id,
    name,
    tagline: `${model || 'Private charter'}${year}`,
    taglineEs: `${model || 'Alquiler privado'}${year}`,
    label: 'Charter',
    labelEs: 'En alquiler',
    price: formatPrice(boat.price_by_month),
    meta: formatLength(metadata.length_m),
    guests: Number.isFinite(capacity) ? `${capacity} guests` : 'Guests on request',
    cabins: formatCabins(metadata.cabins),
    speed: 'On request',
    image: gallery[0] || '/rimotech-logo.png',
    gallery: gallery.length > 0 ? gallery : ['/rimotech-logo.png'],
    portbase: true,
    portbaseId: boat.id,
    port: boat.port_name || metadata.port_name || 'Ibiza',
    amenities: metadata.amenities || [],
    includedItems: metadata.included_items || [],
  }
}

export async function fetchPortbaseFleet(signal) {
  const response = await fetch(PORTBASE_FLEET_URL, {
    headers: { Accept: 'application/json' },
    signal,
  })

  if (!response.ok) {
    throw new Error(`Portbase fleet request failed (${response.status})`)
  }

  const payload = await response.json()
  return Array.isArray(payload.boats)
    ? payload.boats.map(normalisePortbaseBoat)
    : []
}

export async function fetchAvailablePortbaseBoatIds({ date, query = '', signal }) {
  const search = new URLSearchParams({ date })
  if (query.trim()) search.set('q', query.trim())

  const response = await fetch(`${PORTBASE_AVAILABILITY_URL}?${search}`, {
    headers: { Accept: 'application/json' },
    signal,
  })

  if (!response.ok) {
    throw new Error(`Portbase availability request failed (${response.status})`)
  }

  const payload = await response.json()
  return {
    boatIds: Array.isArray(payload.available_boat_ids)
      ? payload.available_boat_ids.map(String)
      : [],
    checkedAt: payload.checked_at || null,
  }
}

export async function fetchPortbaseMonthAvailability({ boatId, month, signal }) {
  const search = new URLSearchParams({ boat: boatId, month })
  const response = await fetch(`${PORTBASE_MONTH_AVAILABILITY_URL}?${search}`, {
    headers: { Accept: 'application/json' },
    signal,
  })

  if (!response.ok) {
    throw new Error(`Portbase month availability request failed (${response.status})`)
  }

  const payload = await response.json()
  return Array.isArray(payload.available_dates)
    ? payload.available_dates.map(String)
    : []
}
