import { useEffect, useState } from 'react'
import { getAnalyticsConsent, setAnalyticsConsent } from './analytics'
import './CookieConsent.css'

export default function CookieConsent({ language = 'en' }) {
  const [consent, setConsent] = useState(() => getAnalyticsConsent())

  useEffect(() => {
    const handleChange = (event) => setConsent(event.detail)
    window.addEventListener('analytics-consent-change', handleChange)
    return () => window.removeEventListener('analytics-consent-change', handleChange)
  }, [])

  if (consent) return null

  const spanish = language === 'es'
  const choose = (value) => {
    setAnalyticsConsent(value)
    setConsent(value)
  }

  return (
    <aside className="cookie-consent" aria-label={spanish ? 'Preferencias de cookies' : 'Cookie preferences'}>
      <div>
        <strong>{spanish ? 'Tu privacidad importa' : 'Your privacy matters'}</strong>
        <p>
          {spanish
            ? 'Usamos analítica opcional para entender qué ayuda a nuestros visitantes. No se activa sin tu permiso.'
            : 'We use optional analytics to understand what helps our visitors. It stays off without your permission.'}
          {' '}<a href="/cookies">{spanish ? 'Política de cookies' : 'Cookie policy'}</a>
        </p>
      </div>
      <div className="cookie-actions">
        <button className="cookie-reject" onClick={() => choose('rejected')}>
          {spanish ? 'Solo necesarias' : 'Necessary only'}
        </button>
        <button className="cookie-accept" onClick={() => choose('accepted')}>
          {spanish ? 'Aceptar analítica' : 'Accept analytics'}
        </button>
      </div>
    </aside>
  )
}
