import {
  getPrivateFleet,
  privatePhotoUrl,
  protectPublicProxy,
} from '../server/portbaseProxy.js'

export default async function handler(request, response) {
  if (!protectPublicProxy(request, response, { limit: 180 })) return

  const boatId = String(request.query.boat || '').trim()
  const index = Number(request.query.index)

  if (!/^[0-9a-f-]{36}$/i.test(boatId) || !Number.isInteger(index) || index < 0 || index > 50) {
    response.status(400).end()
    return
  }

  try {
    const fleet = await getPrivateFleet()
    const photoUrl = privatePhotoUrl(fleet, boatId, index)
    if (!photoUrl) {
      response.status(404).end()
      return
    }

    const upstream = await fetch(photoUrl, { redirect: 'error' })
    if (!upstream.ok) {
      response.status(404).end()
      return
    }

    const contentType = upstream.headers.get('content-type') || ''
    if (!contentType.startsWith('image/')) {
      response.status(415).end()
      return
    }

    const image = Buffer.from(await upstream.arrayBuffer())
    response.setHeader('Content-Type', contentType)
    response.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800')
    response.status(200).send(image)
  } catch (error) {
    console.error('[image-proxy] request failed', error)
    response.status(502).end()
  }
}
