import {
  getPrivateAvailability,
  protectPublicProxy,
  publicBoatId,
} from '../server/portbaseProxy.js'

const CONCURRENCY = 6

function datesInMonth(month) {
  const [year, monthNumber] = month.split('-').map(Number)
  const days = new Date(Date.UTC(year, monthNumber, 0)).getUTCDate()

  return Array.from(
    { length: days },
    (_, index) => `${month}-${String(index + 1).padStart(2, '0')}`
  )
}

async function mapWithConcurrency(items, worker) {
  const results = new Array(items.length)
  let nextIndex = 0

  async function run() {
    while (nextIndex < items.length) {
      const index = nextIndex
      nextIndex += 1
      results[index] = await worker(items[index])
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, run))
  return results
}

export default async function handler(request, response) {
  if (!protectPublicProxy(request, response, { limit: 12 })) return

  const month = String(request.query.month || '').trim()
  const boatId = String(request.query.boat || '').trim()

  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month) || !/^[A-Za-z0-9_-]{24}$/.test(boatId)) {
    response.status(400).json({ error: 'A valid month and yacht are required' })
    return
  }

  try {
    const dates = datesInMonth(month)
    const availability = await mapWithConcurrency(dates, async (date) => {
      const payload = await getPrivateAvailability({ date, query: '' })
      const ids = Array.isArray(payload.available_boat_ids) ? payload.available_boat_ids : []
      return ids.some((id) => publicBoatId(id) === boatId)
    })

    response.setHeader('Cache-Control', 'private, no-store, max-age=0')
    response.status(200).json({
      month,
      available_dates: dates.filter((_, index) => availability[index]),
      checked_at: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[month-availability-proxy] request failed', error)
    response.status(502).json({ error: 'Monthly availability temporarily unavailable' })
  }
}
