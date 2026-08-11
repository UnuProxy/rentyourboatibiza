import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, Phone } from 'lucide-react'
import CookieConsent from './CookieConsent'
import { getAnalyticsConsent, setAnalyticsConsent, trackEvent } from './analytics'
import { getJournalArticle } from './journal'
import './ContentPage.css'

const legalContent = {
  privacy: {
    en: {
      eyebrow: 'Legal',
      title: 'Privacy policy',
      intro: 'How Rent Your Boat Ibiza collects, uses and protects your personal information.',
      updated: 'Last updated: 12 August 2026',
      sections: [
        ['Who is responsible', 'RIMOTECH YACHT GROUP S.L., operating as Rent Your Boat Ibiza, is responsible for personal information collected through this website. You can contact us at info@rentyourboatibiza.com or at Carrer d’Alhaueth, sn, 07800 Ibiza, Balearic Islands.'],
        ['Information we collect', 'We collect the details you choose to provide in an enquiry, including your name, contact details, preferred date, group size, yacht preferences and message. With consent, we also collect aggregated website usage information through Google Analytics and Meta Pixel.'],
        ['Why we use it', 'We use enquiry information to answer your request, recommend suitable yachts, coordinate availability and provide related customer service. The legal basis is taking steps at your request before a contract, performing a contract, our legitimate interest in operating the service, and consent where required.'],
        ['Who receives it', 'Information may be shared only when necessary with selected yacht operators, Portbase, WhatsApp, email providers and technical suppliers supporting this website. We do not sell your personal information. Some providers may process data outside the European Economic Area using appropriate safeguards.'],
        ['How long we keep it', 'Enquiry information is kept only as long as necessary to manage the request, meet legal obligations and resolve disputes. Analytics retention follows the settings of the relevant platform and is activated only after consent.'],
        ['Your rights', 'You may request access, correction, deletion, restriction, portability or objection, and you may withdraw consent at any time. Contact info@rentyourboatibiza.com. You may also complain to the Spanish Data Protection Agency (AEPD).'],
        ['Security and changes', 'We use reasonable organisational and technical measures to protect information. We may update this policy when our services or legal obligations change; the date above identifies the latest version.'],
      ],
    },
    es: {
      eyebrow: 'Legal',
      title: 'Política de privacidad',
      intro: 'Cómo Rent Your Boat Ibiza recoge, utiliza y protege tus datos personales.',
      updated: 'Última actualización: 12 de agosto de 2026',
      sections: [
        ['Responsable del tratamiento', 'RIMOTECH YACHT GROUP S.L., que opera como Rent Your Boat Ibiza, es responsable de los datos recogidos a través de esta web. Puedes escribir a info@rentyourboatibiza.com o a Carrer d’Alhaueth, sn, 07800 Ibiza, Islas Baleares.'],
        ['Datos que recogemos', 'Recogemos la información que decides facilitar en una solicitud, como nombre, contacto, fecha, tamaño del grupo, preferencias de yate y mensaje. Con tu consentimiento, también obtenemos información agregada de uso mediante Google Analytics y Meta Pixel.'],
        ['Finalidad y base legal', 'Utilizamos los datos para responder, recomendar yates, coordinar disponibilidad y prestar atención al cliente. La base legal es la aplicación de medidas precontractuales, la ejecución de un contrato, nuestro interés legítimo y el consentimiento cuando sea necesario.'],
        ['Destinatarios', 'Los datos podrán compartirse únicamente cuando sea necesario con operadores de yates seleccionados, Portbase, WhatsApp, proveedores de correo y servicios técnicos. No vendemos datos personales. Algunos proveedores pueden tratar datos fuera del Espacio Económico Europeo con garantías adecuadas.'],
        ['Conservación', 'La información se conserva solo durante el tiempo necesario para gestionar la solicitud, cumplir obligaciones legales y resolver posibles reclamaciones. La analítica solo se activa tras obtener consentimiento.'],
        ['Tus derechos', 'Puedes solicitar acceso, rectificación, supresión, limitación, portabilidad u oposición, así como retirar tu consentimiento. Escribe a info@rentyourboatibiza.com. También puedes reclamar ante la Agencia Española de Protección de Datos (AEPD).'],
        ['Seguridad y cambios', 'Aplicamos medidas organizativas y técnicas razonables para proteger los datos. Esta política puede actualizarse cuando cambien el servicio o las obligaciones legales.'],
      ],
    },
  },
  cookies: {
    en: {
      eyebrow: 'Legal',
      title: 'Cookie policy',
      intro: 'Clear choices about the technology used on this website.',
      updated: 'Last updated: 12 August 2026',
      sections: [
        ['What cookies are', 'Cookies and similar browser storage technologies remember information about your visit. Some are necessary for the website to work; analytics technologies are optional.'],
        ['Necessary storage', 'We use local browser storage to remember your language and cookie choice and to support basic interface behaviour. This does not require analytics consent.'],
        ['Google Analytics', 'If you accept analytics, Google Analytics may measure pages viewed, device information, approximate location and interactions such as WhatsApp enquiries. The measurement ID is loaded only after consent.'],
        ['Meta Pixel', 'If configured and accepted, Meta Pixel helps measure visits and enquiry actions connected with advertising. It is not loaded when you choose necessary cookies only.'],
        ['Third-party services', 'Opening WhatsApp, Instagram, Portbase or another external service takes you to that provider, whose own privacy and cookie terms apply.'],
        ['Managing your choice', 'You can accept or reject optional analytics from the banner. You may change the current choice below at any time. Browser settings can also block or delete stored information.'],
      ],
    },
    es: {
      eyebrow: 'Legal',
      title: 'Política de cookies',
      intro: 'Opciones claras sobre la tecnología utilizada en esta web.',
      updated: 'Última actualización: 12 de agosto de 2026',
      sections: [
        ['Qué son las cookies', 'Las cookies y tecnologías similares recuerdan información sobre una visita. Algunas son necesarias para el funcionamiento de la web; las herramientas de analítica son opcionales.'],
        ['Almacenamiento necesario', 'Utilizamos almacenamiento local del navegador para recordar el idioma, la elección de cookies y determinadas funciones de la interfaz. No requiere consentimiento para analítica.'],
        ['Google Analytics', 'Si aceptas la analítica, Google Analytics puede medir páginas visitadas, dispositivo, ubicación aproximada e interacciones como solicitudes por WhatsApp. Solo se carga después del consentimiento.'],
        ['Meta Pixel', 'Si está configurado y aceptado, Meta Pixel permite medir visitas y solicitudes relacionadas con publicidad. No se carga al elegir únicamente cookies necesarias.'],
        ['Servicios de terceros', 'Al abrir WhatsApp, Instagram, Portbase u otro servicio externo, accederás a ese proveedor y se aplicarán sus propias condiciones de privacidad y cookies.'],
        ['Gestionar tu elección', 'Puedes aceptar o rechazar la analítica opcional desde el aviso. También puedes cambiar la decisión actual más abajo y eliminar información desde la configuración del navegador.'],
      ],
    },
  },
}

function updatePageMetadata(title, description, path, image) {
  document.title = title
  const canonicalUrl = `https://rentyourboatibiza.com${path}`
  const values = {
    description,
    'og:title': title,
    'og:description': description,
    'og:url': canonicalUrl,
    'og:image': image || 'https://rentyourboatibiza.com/og-image.jpg',
  }

  for (const [name, content] of Object.entries(values)) {
    const selector = name.startsWith('og:') ? `meta[property="${name}"]` : `meta[name="${name}"]`
    let element = document.head.querySelector(selector)
    if (!element) {
      element = document.createElement('meta')
      element.setAttribute(name.startsWith('og:') ? 'property' : 'name', name)
      document.head.appendChild(element)
    }
    element.setAttribute('content', content)
  }

  let canonical = document.head.querySelector('link[rel="canonical"]')
  if (!canonical) {
    canonical = document.createElement('link')
    canonical.setAttribute('rel', 'canonical')
    document.head.appendChild(canonical)
  }
  canonical.setAttribute('href', canonicalUrl)
}

export default function ContentPage({ type, slug }) {
  const [language, setLanguage] = useState('en')
  const article = type === 'journal' ? getJournalArticle(slug) : null
  const content = type !== 'journal' ? legalContent[type]?.[language] : null
  const spanish = language === 'es'

  useEffect(() => {
    document.documentElement.lang = language
    if (article) {
      updatePageMetadata(
        `${spanish ? article.titleEs : article.title} | Rent Your Boat Ibiza`,
        spanish ? article.textEs : article.text,
        `/journal/${article.slug}`,
        article.image
      )
    } else if (content) {
      updatePageMetadata(
        `${content.title} | Rent Your Boat Ibiza`,
        content.intro,
        `/${type}`
      )
    }
    trackEvent('content_page_view', { page_type: type, slug: slug || type, language })
  }, [article, content, language, slug, spanish, type])

  if (type === 'journal' && !article) {
    return (
      <main className="content-page">
        <div className="content-not-found">
          <h1>Story not found</h1>
          <a href="/">Return home</a>
        </div>
      </main>
    )
  }

  const title = article ? (spanish ? article.titleEs : article.title) : content.title
  const intro = article ? (spanish ? article.textEs : article.text) : content.intro
  const eyebrow = article
    ? (spanish ? article.categoryEs : article.category)
    : content.eyebrow

  return (
    <main className="content-page">
      <header className="content-nav">
        <a href="/" className="content-brand">
          <img src="/rentyourboat-logo.svg" alt="" />
          <span>Rent Your Boat Ibiza</span>
        </a>
        <div>
          <button className={language === 'en' ? 'active' : ''} onClick={() => setLanguage('en')}>EN</button>
          <span>/</span>
          <button className={language === 'es' ? 'active' : ''} onClick={() => setLanguage('es')}>ES</button>
        </div>
      </header>

      {article && (
        <div className="content-hero-image">
          <img src={article.image} alt={title} />
          <div />
        </div>
      )}

      <article className={`content-article ${article ? 'journal-article' : 'legal-article'}`}>
        <a className="content-back" href="/"><ArrowLeft size={16} /> {spanish ? 'Volver' : 'Back home'}</a>
        <span className="content-eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p className="content-intro">{intro}</p>
        <small>{article ? (spanish ? article.dateEs : article.date) : content.updated}</small>

        {article ? (
          <div className="article-body">
            {(spanish ? article.bodyEs : article.body).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
        ) : (
          <div className="legal-sections">
            {content.sections.map(([heading, text]) => (
              <section key={heading}>
                <h2>{heading}</h2>
                <p>{text}</p>
              </section>
            ))}
          </div>
        )}

        {type === 'cookies' && (
          <section className="consent-manager">
            <h2>{spanish ? 'Preferencia actual' : 'Current preference'}</h2>
            <p>{getAnalyticsConsent() === 'accepted'
              ? (spanish ? 'Analítica aceptada' : 'Analytics accepted')
              : (spanish ? 'Solo almacenamiento necesario' : 'Necessary storage only')}</p>
            <div>
              <button onClick={() => setAnalyticsConsent('rejected')}>{spanish ? 'Solo necesarias' : 'Necessary only'}</button>
              <button onClick={() => setAnalyticsConsent('accepted')}>{spanish ? 'Aceptar analítica' : 'Accept analytics'}</button>
            </div>
          </section>
        )}

        {article && (
          <aside className="article-cta">
            <span>{spanish ? 'Diseña tu día' : 'Design your day'}</span>
            <h2>{spanish ? 'Vive la historia desde el mar.' : 'Experience the story from the sea.'}</h2>
            <a
              href="https://wa.me/34696826329"
              target="_blank"
              rel="noreferrer"
              onClick={() => trackEvent('whatsapp_click', { source: `journal_${article.slug}` })}
            >
              <Phone size={17} /> WhatsApp <ArrowRight size={17} />
            </a>
          </aside>
        )}
      </article>

      <footer className="content-footer">
        <span>© 2026 Rent Your Boat Ibiza</span>
        <div><a href="/privacy">Privacy</a><a href="/cookies">Cookies</a></div>
      </footer>
      <CookieConsent language={language} />
    </main>
  )
}
