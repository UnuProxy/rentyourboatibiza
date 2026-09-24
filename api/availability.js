import {
  getPrivateAvailability,
  protectPublicProxy,
  publicBoatId,
} from '../server/portbaseProxy.js'

export default async function handler(request, response) {
  if (!protectPublicProxy(request, response, { limit: 30 })) return

  const date = String(request.query.date || '').trim()
  const query = String(request.query.q || '').trim().slice(0, 100)

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    response.status(400).json({ error: 'A valid date is required' })
    return
  }

  try {
    const payload = await getPrivateAvailability({ date, query })
    response.setHeader('Cache-Control', 'private, no-store, max-age=0')
    response.status(200).json({
      date: payload.date,
      available_boat_ids: Array.isArray(payload.available_boat_ids)
        ? payload.available_boat_ids.map(publicBoatId)
        : [],
      available_boat_count: Number(payload.available_boat_count || 0),
      checked_at: payload.checked_at || null,
    })
  } catch (error) {
    console.error('[availability-proxy] request failed', error)
    response.status(502).json({ error: 'Availability temporarily unavailable' })
  }
}
