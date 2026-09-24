import { createHmac } from 'node:crypto'

const PORTBASE_ORIGIN = process.env.PORTBASE_INTERNAL_ORIGIN || 'https://portbase.app'
const FLEET_PATH = '/api/public/broker-fleet/9d718f18-d6de-441f-adee-ffa0cd29c741'
const AVAILABILITY_PATH = '/api/public/fleet-availability/9d718f18-d6de-441f-adee-ffa0cd29c741'
const RATE_WINDOW_MS = 60_000
const requestBuckets = new Map()

let fleetCache = null
let fleetCacheExpiresAt = 0

function clientIp(request) {
  return String(request.headers['x-forwarded-for'] || request.socket?.remoteAddress || 'unknown')
    .split(',')[0]
    .trim()
}

function takeRateLimit(key, limit) {
  const now = Date.now()
  const current = requestBuckets.get(key)

  if (!current || current.resetAt <= now) {
    requestBuckets.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return true
  }

  current.count += 1
  return current.count <= limit
}

export function protectPublicProxy(request, response, { limit = 30 } = {}) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET')
    response.status(405).json({ error: 'Method not allowed' })
    return false
  }

  const fetchSite = String(request.headers['sec-fetch-site'] || '')
  if (fetchSite && !['same-origin', 'same-site', 'none'].includes(fetchSite)) {
    response.status(403).json({ error: 'Forbidden' })
    return false
  }

  if (!takeRateLimit(`${clientIp(request)}:${request.url}`, limit)) {
    response.setHeader('Retry-After', '60')
    response.status(429).json({ error: 'Too many requests' })
    return false
  }

  if (!process.env.PORTBASE_PROXY_TOKEN) {
    console.error('[portbase-proxy] PORTBASE_PROXY_TOKEN is not configured')
    response.status(503).json({ error: 'Fleet temporarily unavailable' })
    return false
  }

  response.setHeader('X-Content-Type-Options', 'nosniff')
  response.setHeader('Referrer-Policy', 'no-referrer')
  return true
}

async function requestPortbase(path, search = '') {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 20_000)

  try {
    const response = await fetch(`${PORTBASE_ORIGIN}${path}${search}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${process.env.PORTBASE_PROXY_TOKEN}`,
      },
      signal: controller.signal,
    })

    if (!response.ok) throw new Error(`Private fleet request failed (${response.status})`)
    return await response.json()
  } finally {
    clearTimeout(timeout)
  }
}

export async function getPrivateFleet() {
  if (fleetCache && fleetCacheExpiresAt > Date.now()) return fleetCache

  fleetCache = await requestPortbase(FLEET_PATH)
  fleetCacheExpiresAt = Date.now() + 60_000
  return fleetCache
}

export async function getPrivateAvailability({ date, query }) {
  const search = new URLSearchParams({ date })
  if (query) search.set('q', query)
  return requestPortbase(AVAILABILITY_PATH, `?${search}`)
}

export function publicBoatId(boatId) {
  return createHmac('sha256', process.env.PORTBASE_PROXY_TOKEN)
    .update(String(boatId))
    .digest('base64url')
    .slice(0, 24)
}

function safeMetadata(value) {
  const metadata = value && typeof value === 'object' ? value : {}
  return {
    boat_type: metadata.boat_type || null,
    length_m: metadata.length_m || null,
    build_year: metadata.build_year || null,
    port_name: metadata.port_name || null,
    cabins: metadata.cabins || null,
    amenities: Array.isArray(metadata.amenities) ? metadata.amenities : [],
    included_items: Array.isArray(metadata.included_items) ? metadata.included_items : [],
  }
}

export function publicFleetPayload(payload) {
  const boats = Array.isArray(payload?.boats) ? payload.boats : []

  return {
    boats: boats.map((boat) => ({
      id: publicBoatId(boat.id),
      name: String(boat.name || ''),
      model: String(boat.model || ''),
      capacity: Number.isFinite(Number(boat.capacity)) ? Number(boat.capacity) : null,
      operating_island: boat.operating_island || null,
      port_name: boat.port_name || null,
      metadata: safeMetadata(boat.metadata),
      photos: (Array.isArray(boat.photos) ? boat.photos : []).map(
        (_, index) => `/api/image?boat=${encodeURIComponent(publicBoatId(boat.id))}&index=${index}`
      ),
      price_by_month: Object.fromEntries(
        Object.entries(boat.price_by_month || {})
          .filter(([, price]) => Number.isFinite(Number(price)))
          .map(([month, price]) => [month, Number(price)])
      ),
    })),
    updated_at: payload?.updated_at || null,
  }
}

export function privatePhotoUrl(payload, boatId, index) {
  const boats = Array.isArray(payload?.boats) ? payload.boats : []
  const boat = boats.find((item) => publicBoatId(item.id) === String(boatId))
  const photos = Array.isArray(boat?.photos) ? boat.photos : []
  const url = photos[Number(index)]

  if (!url) return null

  try {
    const parsed = new URL(url)
    return parsed.protocol === 'https:' && parsed.hostname.endsWith('.supabase.co')
      ? parsed.toString()
      : null
  } catch {
    return null
  }
}
