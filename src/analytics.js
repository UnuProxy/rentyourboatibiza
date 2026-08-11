const CONSENT_KEY = 'ryb-cookie-consent'
let initialized = false

export function getAnalyticsConsent() {
  return window.localStorage.getItem(CONSENT_KEY)
}

export function setAnalyticsConsent(value) {
  window.localStorage.setItem(CONSENT_KEY, value)
  window.dispatchEvent(new CustomEvent('analytics-consent-change', { detail: value }))
  if (value === 'accepted') initializeAnalytics()
}

function loadGoogleAnalytics(measurementId) {
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() {
    window.dataLayer.push(arguments)
  }
  window.gtag('js', new Date())
  window.gtag('config', measurementId, {
    anonymize_ip: true,
    send_page_view: true,
  })
}

function loadMetaPixel(pixelId) {
  if (window.fbq) return

  const fbq = function fbq() {
    if (fbq.callMethod) {
      fbq.callMethod.apply(fbq, arguments)
    } else {
      fbq.queue.push(arguments)
    }
  }
  fbq.push = fbq
  fbq.loaded = true
  fbq.version = '2.0'
  fbq.queue = []
  window.fbq = fbq

  const script = document.createElement('script')
  script.async = true
  script.src = 'https://connect.facebook.net/en_US/fbevents.js'
  document.head.appendChild(script)

  window.fbq('init', pixelId)
  window.fbq('track', 'PageView')
}

export function initializeAnalytics() {
  if (initialized || getAnalyticsConsent() !== 'accepted') return

  const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim()
  const metaPixelId = import.meta.env.VITE_META_PIXEL_ID?.trim()
  if (gaId) loadGoogleAnalytics(gaId)
  if (metaPixelId) loadMetaPixel(metaPixelId)
  initialized = true
}

export function trackEvent(name, parameters = {}) {
  if (getAnalyticsConsent() !== 'accepted') return
  if (window.gtag) window.gtag('event', name, parameters)
  if (window.fbq) window.fbq('trackCustom', name, parameters)
}
