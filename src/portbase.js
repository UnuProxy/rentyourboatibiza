const RIMOTECH_PORTBASE_ORG_ID = '9d718f18-d6de-441f-adee-ffa0cd29c741'

export const PORTBASE_FLEET_URL = import.meta.env.VITE_PORTBASE_FLEET_URL
  || `https://portbase.app/api/public/broker-fleet/${RIMOTECH_PORTBASE_ORG_ID}`
export const PORTBASE_AVAILABILITY_URL = import.meta.env.VITE_PORTBASE_AVAILABILITY_URL
  || `https://portbase.app/api/public/fleet-availability/${RIMOTECH_PORTBASE_ORG_ID}`

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
  const url = new URL(PORTBASE_AVAILABILITY_URL)
  url.searchParams.set('date', date)
  if (query.trim()) url.searchParams.set('q', query.trim())

  const response = await fetch(url, {
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
