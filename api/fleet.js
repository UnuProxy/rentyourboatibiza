import {
  getPrivateFleet,
  protectPublicProxy,
  publicFleetPayload,
} from '../server/portbaseProxy.js'

export default async function handler(request, response) {
  if (!protectPublicProxy(request, response, { limit: 30 })) return

  try {
    const fleet = await getPrivateFleet()
    response.setHeader('Cache-Control', 'private, no-store, max-age=0')
    response.status(200).json(publicFleetPayload(fleet))
  } catch (error) {
    console.error('[fleet-proxy] request failed', error)
    response.status(502).json({ error: 'Fleet temporarily unavailable' })
  }
}
