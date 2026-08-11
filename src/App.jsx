import { useEffect, useState } from 'react'
import {
  ArrowRight,
  AtSign,
  Check,
  ChevronRight,
  Mail,
  Menu,
  Phone,
  Ruler,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from 'lucide-react'
import './App.css'
import ContentPage from './ContentPage'
import CookieConsent from './CookieConsent'
import { initializeAnalytics, trackEvent } from './analytics'
import { journalArticles } from './journal'
import { fetchPortbaseFleet } from './portbase'

const fallbackBoats = [
  {
    name: 'Pershing 80',
    tagline: 'Performance without compromise',
    taglineEs: 'Rendimiento sin concesiones',
    label: 'For sale',
    labelEs: 'En venta',
    price: 'Price on request',
    meta: '24.50 m',
    guests: '12 guests',
    cabins: '4 cabins',
    speed: '48 knots',
    image: 'https://rentyourboatibiza.com/wp-content/uploads/2025/04/4-3-672x448.jpg',
    gallery: [
      'https://rentyourboatibiza.com/wp-content/uploads/2025/04/4-3-672x448.jpg',
      'https://rentyourboatibiza.com/wp-content/uploads/2025/04/01-5-672x448.jpg',
      'https://rentyourboatibiza.com/wp-content/uploads/2025/04/7-4-672x448.jpg',
      'https://rentyourboatibiza.com/wp-content/uploads/2025/04/1-3-672x448.jpg',
    ],
    featured: true,
  },
  {
    name: 'Predator 92',
    tagline: 'A commanding presence at sea',
    taglineEs: 'Una presencia imponente en el mar',
    label: 'For sale',
    labelEs: 'En venta',
    price: '€2,850,000',
    meta: '29.20 m',
    guests: '12 guests',
    cabins: '4 cabins',
    speed: '35 knots',
    image: 'https://rentyourboatibiza.com/wp-content/uploads/2025/04/1-3-672x448.jpg',
    gallery: [
      'https://rentyourboatibiza.com/wp-content/uploads/2025/04/1-3-672x448.jpg',
      'https://rentyourboatibiza.com/wp-content/uploads/2025/04/4-3-672x448.jpg',
      'https://rentyourboatibiza.com/wp-content/uploads/2025/04/02-8-672x448.jpg',
      'https://rentyourboatibiza.com/wp-content/uploads/2025/04/05-9-672x448.jpg',
    ],
  },
  {
    name: 'Maiora 99',
    tagline: 'Your private villa on the water',
    taglineEs: 'Tu villa privada sobre el mar',
    label: 'Charter',
    labelEs: 'En alquiler',
    price: 'From €9,999 / day',
    meta: '28.50 m',
    guests: '12 guests',
    cabins: '5 cabins',
    speed: '30 knots',
    image: 'https://rentyourboatibiza.com/wp-content/uploads/2025/04/Maiora-99-4-672x448.jpg',
    gallery: [
      'https://rentyourboatibiza.com/wp-content/uploads/2025/04/Maiora-99-4-672x448.jpg',
      'https://rentyourboatibiza.com/wp-content/uploads/2025/04/Maiora-99-5-672x448.jpg',
      'https://rentyourboatibiza.com/wp-content/uploads/2025/04/Maiora-3-scaled-1-672x448.jpg',
      'https://rentyourboatibiza.com/wp-content/uploads/2025/04/5-8-672x448.jpg',
    ],
  },
  {
    name: 'De Antonio D42',
    tagline: 'Open-air freedom, designed in Barcelona',
    taglineEs: 'Libertad al aire libre, diseñada en Barcelona',
    label: 'Charter',
    labelEs: 'En alquiler',
    price: 'From €1,300 / day',
    meta: '12.64 m',
    guests: '12 guests',
    cabins: '2 cabins',
    speed: '45 knots',
    image: 'https://rentyourboatibiza.com/wp-content/uploads/2025/04/03-6-672x448.jpg',
    gallery: [
      'https://rentyourboatibiza.com/wp-content/uploads/2025/04/03-6-672x448.jpg',
      'https://rentyourboatibiza.com/wp-content/uploads/2025/04/3-10-672x448.jpg',
      'https://rentyourboatibiza.com/wp-content/uploads/2025/04/02-17-672x448.jpg',
      'https://rentyourboatibiza.com/wp-content/uploads/2025/04/Main-Image-scaled-1-672x448.jpg',
    ],
  },
  {
    name: 'Wally 48',
    tagline: 'Iconic design for effortless days',
    taglineEs: 'Diseño icónico para días inolvidables',
    label: 'For sale',
    labelEs: 'En venta',
    price: 'Price on request',
    meta: '14.80 m',
    guests: '12 guests',
    cabins: '2 cabins',
    speed: '38 knots',
    image: 'https://rentyourboatibiza.com/wp-content/uploads/2025/04/02-1-scaled-1-672x448.jpg',
    gallery: [
      'https://rentyourboatibiza.com/wp-content/uploads/2025/04/02-1-scaled-1-672x448.jpg',
      'https://rentyourboatibiza.com/wp-content/uploads/2025/04/02-17-672x448.jpg',
      'https://rentyourboatibiza.com/wp-content/uploads/2025/04/Main-Image-scaled-1-672x448.jpg',
      'https://rentyourboatibiza.com/wp-content/uploads/2025/04/03-5-scaled-1-672x448.jpg',
    ],
  },
  {
    name: 'Arcadia 85',
    tagline: 'Quiet luxury, naturally connected',
    taglineEs: 'Lujo sereno, conectado con la naturaleza',
    label: 'Charter',
    labelEs: 'En alquiler',
    price: 'From €8,500 / day',
    meta: '27.50 m',
    guests: '12 guests',
    cabins: '4 cabins',
    speed: '18 knots',
    image: 'https://rentyourboatibiza.com/wp-content/uploads/2025/04/5-8-672x448.jpg',
    gallery: [
      'https://rentyourboatibiza.com/wp-content/uploads/2025/04/5-8-672x448.jpg',
      'https://rentyourboatibiza.com/wp-content/uploads/2025/04/Maiora-99-4-672x448.jpg',
      'https://rentyourboatibiza.com/wp-content/uploads/2025/04/2-11-672x448.jpg',
      'https://rentyourboatibiza.com/wp-content/uploads/2025/04/1-7-672x448.jpg',
    ],
  },
]

const services = [
  {
    number: '01',
    title: 'Buy a yacht',
    titleEs: 'Compra un yate',
    text: 'Private access to the finest new and pre-owned yachts, guided by real market intelligence.',
    textEs: 'Acceso privado a los mejores yates nuevos y de ocasión, con asesoramiento basado en el mercado real.',
    link: 'Explore yachts',
    linkEs: 'Explorar yates',
  },
  {
    number: '02',
    title: 'Sell your yacht',
    titleEs: 'Vende tu yate',
    text: 'Discreet positioning, premium presentation and qualified buyers from our international network.',
    textEs: 'Posicionamiento discreto, presentación premium y compradores cualificados de nuestra red internacional.',
    link: 'Request a valuation',
    linkEs: 'Solicitar valoración',
  },
  {
    number: '03',
    title: 'Charter in Ibiza',
    titleEs: 'Alquila en Ibiza',
    text: 'A handpicked fleet and a local team creating effortless days between Ibiza and Formentera.',
    textEs: 'Una flota seleccionada y un equipo local para vivir días perfectos entre Ibiza y Formentera.',
    link: 'Plan your escape',
    linkEs: 'Planifica tu escapada',
  },
]

const instagramPosts = [
  {
    image: '/instagram/mangusta-72.jpg',
    label: 'Mangusta 72',
    url: 'https://www.instagram.com/reel/DbK-l1rCDl-/?igsh=dGN0aTYwdjRtYmVy',
  },
  {
    image: '/instagram/ibiza-dream.jpg',
    label: 'The Ibiza dream',
    url: 'https://www.instagram.com/reel/Da8MFZxMIJ2/?igsh=MWpxZXppbjh4c25yNA==',
  },
  {
    image: '/instagram/nassima-experience.jpg',
    label: 'Nassima yacht',
    url: 'https://www.instagram.com/p/Da26eirjGu3/?igsh=cDk5eGR2OXdmODgx',
  },
  {
    image: '/instagram/marina-experience.jpg',
    label: 'Marina experience',
    url: 'https://www.instagram.com/reel/Daupr-1M-eb/?igsh=MXE1bjEydmJwbjg5NQ==',
  },
  {
    image: '/instagram/ibiza-blue.jpg',
    label: 'Ibiza blue',
    url: 'https://www.instagram.com/p/Dam7WxQjHU_/?igsh=MXI1OTFuYXFnZTU0dg==',
  },
  {
    image: '/instagram/season-2026.jpg',
    label: 'Season 2026',
    url: 'https://www.instagram.com/reel/DahxxZDjfwk/?igsh=a2owc3VvNjN4ajZn',
  },
]

const copy = {
  en: {
    yachts: 'Yachts', services: 'Services', about: 'About', talk: "Let's talk",
    brokerage: 'Direct yacht charter · Ibiza', heroTitle: 'Rent a yacht in Ibiza.', heroTitle2: 'From €1,300 / day.',
    heroText: 'Verified yachts, transparent daily prices and a local team planning your day from Ibiza to Formentera.',
    discover: 'View rental yachts', sell: 'WhatsApp our team', scroll: 'Scroll to explore',
    findBoat: 'Find your boat', findBoatText: 'Tell us the essentials. We will show you the right options.',
    boatType: 'Yacht type', anyYacht: 'Any yacht', viewAvailable: 'Send request to WhatsApp',
    verifiedFleet: 'Verified fleet', localTeam: 'Local Ibiza team', directBooking: 'Direct booking',
    standard: 'A new standard of brokerage', more: 'More than a yacht.', way: 'Your way to the sea.',
    guidance: 'Local knowledge, international reach, and personal guidance from first conversation to final handover.',
    meet: 'Meet Rent Your Boat', curated: 'Curated for you', featured: 'Featured yachts',
    charter: 'For rent', sale: 'For sale', all: 'All yachts', fullCollection: 'View the full collection',
    born: 'Born in Ibiza', global: 'Global expertise.', soul: 'Island soul.',
    localText: 'We know every hidden cove, every marina, and the right people to make things happen. That local instinct is backed by a trusted global brokerage network.',
    independent: 'Independent advice', personal: 'Personal service', support: 'End-to-end support', approach: 'Our approach',
    everything: 'Everything yachting', serviceTitle: 'At your service',
    serviceIntro: 'One trusted team for every step of your ownership journey.',
    feeling: 'The Balearic feeling', water: 'Ibiza looks better', water2: 'from the water.', design: 'Design my day',
    conversation: 'Start a conversation', where: 'Where would you', where2: 'like to go next?',
    visit: 'Visit us', contact: 'Contact', made: 'Made for the Mediterranean',
    close: 'Close', collection: 'Yacht collection', length: 'Length', guests: 'Guests',
    accommodation: 'Accommodation', maxSpeed: 'Max speed', experience: 'The experience',
    madeFor: 'Made for days', neverForget: 'you never forget.',
    story1: 'Step aboard {boat} and experience Ibiza from its most beautiful perspective. Generous open spaces, refined comfort and effortless performance create the perfect setting for a day between hidden coves and Formentera.',
    story2: 'Every charter is shaped around you, with an experienced local crew, a personalised itinerary and all the details handled before you arrive.',
    saleStory1: 'Discover {boat}, a distinctive ownership opportunity selected by our brokerage team for its design, condition and enduring market appeal.',
    saleStory2: 'We provide clear guidance through specifications, surveys, negotiation and handover, with discreet support at every stage of the purchase.',
    itinerary: 'Personalised itinerary and local concierge included.', availability: 'Request availability',
    privateEnquiry: 'Private, no-obligation enquiry', keepExploring: 'Keep exploring',
    moreYachts: 'More yachts, more possibilities.', selected: 'Selected for Ibiza',
    journey: 'Your journey starts here', help: 'How can we help?',
    helpText: "Tell us what you're looking for. Our Ibiza team will reply personally.",
    wantBuy: 'I want to buy', wantSell: 'I want to sell', wantCharter: 'I want to charter',
    email: 'Email us', confidential: 'Private and confidential',
    charterEnquiry: 'Private charter enquiry', planBoat: 'Plan your day on',
    charterHelp: 'Share a few details and our Ibiza team will create a personalised proposal for you.',
    preferredDate: 'Preferred date', numberGuests: 'Number of guests', yourName: 'Your name',
    contactDetails: 'Email or phone', specialRequests: 'Anything we should know?',
    optional: 'Optional — itinerary, celebration, water toys...', sendRequest: 'Request my charter',
    saleEnquiry: 'Private purchase enquiry', interestedBoat: 'Enquire about',
    saleHelp: 'Speak directly with our brokerage team for full specifications, ownership history and a private viewing.',
    purchaseTimeline: 'Purchase timeline', timelineNow: 'Ready now', timelineMonths: 'Within 3 months',
    timelineExplore: 'Just exploring', currentBoat: 'Do you have a yacht to sell?',
    yes: 'Yes', no: 'No', purchaseNotes: 'Questions or requirements',
    purchaseOptional: 'Optional — viewing, finance, trade-in...', requestDetails: 'Request yacht details',
    saleCardText: 'Full specifications, ownership history and private viewing available.',
    dayPlanner: 'Ibiza day planner', designDayTitle: 'Design your perfect day.',
    dayPlannerHelp: 'Choose the essentials and our local team will match you with the right yacht and Formentera route.',
    groupSize: 'Group size', yachtType: 'Preferred yacht type', route: 'Formentera route',
    openYacht: 'Open yacht', sportYacht: 'Sport yacht', luxuryYacht: 'Luxury yacht', noPreference: 'No preference',
    illetesRoute: 'Ses Illetes & Espalmador', calaSaonaRoute: 'Cala Saona & Illetes',
    fullIslandRoute: 'Formentera full day', sunsetRoute: 'Formentera & sunset return',
    sendDayPlan: 'Create my day plan',
    journalEyebrow: 'The Ibiza journal', journalTitle: 'Stories from the island.',
    journalIntro: 'Local routes, honest charter guidance and inspiration for a better day at sea.',
    exploreStory: 'Explore this story', instagramEyebrow: 'From the island',
    instagramTitle: 'Ibiza, as we live it.', followInstagram: 'Follow on Instagram',
  },
  es: {
    yachts: 'Yates', services: 'Servicios', about: 'Nosotros', talk: 'Hablemos',
    brokerage: 'Alquiler directo de yates · Ibiza', heroTitle: 'Alquila un yate en Ibiza.', heroTitle2: 'Desde €1.300 / día.',
    heroText: 'Yates verificados, precios diarios transparentes y un equipo local para organizar tu día de Ibiza a Formentera.',
    discover: 'Ver yates en alquiler', sell: 'WhatsApp con el equipo', scroll: 'Descubre más',
    findBoat: 'Encuentra tu yate', findBoatText: 'Cuéntanos lo esencial. Te mostraremos las mejores opciones.',
    boatType: 'Tipo de yate', anyYacht: 'Cualquier yate', viewAvailable: 'Enviar solicitud por WhatsApp',
    verifiedFleet: 'Flota verificada', localTeam: 'Equipo local en Ibiza', directBooking: 'Reserva directa',
    standard: 'Una nueva forma de entender el brokerage', more: 'Más que un yate.', way: 'Tu forma de vivir el mar.',
    guidance: 'Conocimiento local, alcance internacional y atención personal desde la primera conversación hasta la entrega.',
    meet: 'Conoce Rent Your Boat', curated: 'Seleccionados para ti', featured: 'Yates destacados',
    charter: 'En alquiler', sale: 'En venta', all: 'Todos los yates', fullCollection: 'Ver toda la colección',
    born: 'Nacidos en Ibiza', global: 'Experiencia global.', soul: 'Alma de isla.',
    localText: 'Conocemos cada cala escondida, cada puerto y a las personas adecuadas para hacerlo realidad. Nuestro instinto local está respaldado por una red internacional de confianza.',
    independent: 'Asesoramiento independiente', personal: 'Servicio personal', support: 'Atención integral', approach: 'Nuestro enfoque',
    everything: 'Todo para tu yate', serviceTitle: 'A tu servicio',
    serviceIntro: 'Un único equipo de confianza para acompañarte en cada etapa.',
    feeling: 'El espíritu balear', water: 'Ibiza se ve mejor', water2: 'desde el mar.', design: 'Diseña mi día',
    conversation: 'Empecemos a hablar', where: '¿A dónde te', where2: 'gustaría ir?',
    visit: 'Visítanos', contact: 'Contacto', made: 'Creado para el Mediterráneo',
    close: 'Cerrar', collection: 'Colección de yates', length: 'Eslora', guests: 'Invitados',
    accommodation: 'Alojamiento', maxSpeed: 'Velocidad máxima', experience: 'La experiencia',
    madeFor: 'Creado para días', neverForget: 'que nunca olvidarás.',
    story1: 'Sube a bordo de {boat} y descubre Ibiza desde su perspectiva más hermosa. Amplios espacios abiertos, confort refinado y rendimiento sin esfuerzo crean el escenario perfecto entre calas escondidas y Formentera.',
    story2: 'Cada alquiler se diseña a tu medida, con una tripulación local experta, un itinerario personalizado y todos los detalles preparados antes de tu llegada.',
    saleStory1: 'Descubre {boat}, una oportunidad de propiedad seleccionada por nuestro equipo por su diseño, estado y atractivo en el mercado.',
    saleStory2: 'Te acompañamos con claridad en especificaciones, inspección, negociación y entrega, siempre con absoluta discreción.',
    itinerary: 'Itinerario personalizado y concierge local incluidos.', availability: 'Consultar disponibilidad',
    privateEnquiry: 'Consulta privada y sin compromiso', keepExploring: 'Sigue explorando',
    moreYachts: 'Más yates, más posibilidades.', selected: 'Seleccionados para Ibiza',
    journey: 'Tu viaje comienza aquí', help: '¿Cómo podemos ayudarte?',
    helpText: 'Cuéntanos qué estás buscando. Nuestro equipo de Ibiza te responderá personalmente.',
    wantBuy: 'Quiero comprar', wantSell: 'Quiero vender', wantCharter: 'Quiero alquilar',
    email: 'Escríbenos', confidential: 'Privado y confidencial',
    charterEnquiry: 'Consulta privada de alquiler', planBoat: 'Planifica tu día en',
    charterHelp: 'Comparte algunos detalles y nuestro equipo de Ibiza preparará una propuesta personalizada.',
    preferredDate: 'Fecha preferida', numberGuests: 'Número de invitados', yourName: 'Tu nombre',
    contactDetails: 'Email o teléfono', specialRequests: '¿Hay algo que debamos saber?',
    optional: 'Opcional — itinerario, celebración, juguetes acuáticos...', sendRequest: 'Solicitar mi alquiler',
    saleEnquiry: 'Consulta privada de compra', interestedBoat: 'Consulta sobre',
    saleHelp: 'Habla directamente con nuestro equipo de brokerage para recibir especificaciones, historial y organizar una visita privada.',
    purchaseTimeline: 'Plazo de compra', timelineNow: 'Listo para comprar', timelineMonths: 'En los próximos 3 meses',
    timelineExplore: 'Solo estoy explorando', currentBoat: '¿Tienes un yate para vender?',
    yes: 'Sí', no: 'No', purchaseNotes: 'Preguntas o requisitos',
    purchaseOptional: 'Opcional — visita, financiación, entrega...', requestDetails: 'Solicitar información',
    saleCardText: 'Especificaciones, historial y visita privada disponibles.',
    dayPlanner: 'Planificador de tu día', designDayTitle: 'Diseña tu día perfecto.',
    dayPlannerHelp: 'Elige lo esencial y nuestro equipo local encontrará el yate y la ruta a Formentera perfectos.',
    groupSize: 'Tamaño del grupo', yachtType: 'Tipo de yate preferido', route: 'Ruta por Formentera',
    openYacht: 'Yate abierto', sportYacht: 'Yate deportivo', luxuryYacht: 'Yate de lujo', noPreference: 'Sin preferencia',
    illetesRoute: 'Ses Illetes y Espalmador', calaSaonaRoute: 'Cala Saona e Illetes',
    fullIslandRoute: 'Día completo en Formentera', sunsetRoute: 'Formentera y regreso al atardecer',
    sendDayPlan: 'Crear mi plan del día',
    journalEyebrow: 'El diario de Ibiza', journalTitle: 'Historias desde la isla.',
    journalIntro: 'Rutas locales, consejos honestos e inspiración para disfrutar mejor del mar.',
    exploreStory: 'Descubrir la historia', instagramEyebrow: 'Desde la isla',
    instagramTitle: 'Ibiza, como la vivimos.', followInstagram: 'Seguir en Instagram',
  },
}

function WebsiteApp() {
  const [boats, setBoats] = useState(fallbackBoats)
  const [menuOpen, setMenuOpen] = useState(false)
  const [filter, setFilter] = useState('Charter')
  const [enquiryOpen, setEnquiryOpen] = useState(false)
  const [enquiryBoat, setEnquiryBoat] = useState(null)
  const [enquiryMode, setEnquiryMode] = useState('generic')
  const [selectedBoat, setSelectedBoat] = useState(null)
  const [activeImage, setActiveImage] = useState(0)
  const [language, setLanguage] = useState('en')
  const t = copy[language]
  const enquiryIsRental = enquiryBoat?.label === 'Charter'
  const localiseValue = (value) => language === 'es'
    ? value
      .replace('guests', 'invitados')
      .replace('cabins', 'camarotes')
      .replace('From', 'Desde')
      .replace('Price on request', 'Precio a consultar')
      .replace('/ day', '/ día')
    : value

  const visibleBoats = filter === 'All' ? boats : boats.filter((boat) => boat.label === filter)

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  useEffect(() => {
    initializeAnalytics()

    const trackOutboundClick = (event) => {
      const link = event.target.closest('a')
      if (!link) return
      const href = link.href || ''
      if (href.includes('wa.me')) trackEvent('whatsapp_click', { source: link.getAttribute('aria-label') || 'website_link' })
      else if (href.includes('instagram.com')) trackEvent('instagram_click', { destination: href })
      else if (href.startsWith('tel:')) trackEvent('phone_click')
      else if (href.startsWith('mailto:')) trackEvent('email_click')
    }

    document.addEventListener('click', trackOutboundClick)
    return () => document.removeEventListener('click', trackOutboundClick)
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    fetchPortbaseFleet(controller.signal)
      .then((portbaseBoats) => {
        setBoats([
          ...portbaseBoats,
          ...fallbackBoats.filter((boat) => boat.label === 'For sale'),
        ])
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          console.warn('Using the local fleet because Portbase is unavailable.', error)
        }
      })

    return () => controller.abort()
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen || enquiryOpen || selectedBoat ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen, enquiryOpen, selectedBoat])

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === 'Escape') {
        if (enquiryOpen) {
          setEnquiryOpen(false)
          setEnquiryBoat(null)
          setEnquiryMode('generic')
        }
        else if (selectedBoat) setSelectedBoat(null)
        else setMenuOpen(false)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [enquiryOpen, selectedBoat])

  const scrollTo = (id) => {
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const showRentalFleet = () => {
    setFilter('Charter')
    scrollTo('collection')
  }

  const openBoat = (boat) => {
    setActiveImage(0)
    setSelectedBoat(boat)
  }

  const openBoatEnquiry = (boat) => {
    setEnquiryBoat(boat)
    setEnquiryMode('boat')
    setEnquiryOpen(true)
  }

  const openDayPlanner = () => {
    setEnquiryBoat(null)
    setEnquiryMode('day')
    setEnquiryOpen(true)
  }

  const closeEnquiry = () => {
    setEnquiryOpen(false)
    setEnquiryBoat(null)
    setEnquiryMode('generic')
  }

  const submitBoatEnquiry = (event) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const isRental = enquiryBoat.label === 'Charter'
    const subject = `${isRental
      ? (language === 'es' ? 'Solicitud de alquiler' : 'Charter enquiry')
      : (language === 'es' ? 'Consulta de compra' : 'Purchase enquiry')} — ${enquiryBoat.name}`
    const body = (isRental ? [
      `${language === 'es' ? 'Yate' : 'Yacht'}: ${enquiryBoat.name}`,
      `${t.preferredDate}: ${form.get('date')}`,
      `${t.numberGuests}: ${form.get('guests')}`,
      `${t.yourName}: ${form.get('name')}`,
      `${t.contactDetails}: ${form.get('contact')}`,
      `${t.specialRequests}: ${form.get('message') || '-'}`,
    ] : [
      `${language === 'es' ? 'Yate' : 'Yacht'}: ${enquiryBoat.name}`,
      `${t.yourName}: ${form.get('name')}`,
      `${t.contactDetails}: ${form.get('contact')}`,
      `${t.purchaseTimeline}: ${form.get('timeline')}`,
      `${t.currentBoat}: ${form.get('currentBoat')}`,
      `${t.purchaseNotes}: ${form.get('message') || '-'}`,
    ]).join('\n')
    trackEvent('boat_enquiry_submit', {
      boat: enquiryBoat.name,
      enquiry_type: isRental ? 'charter' : 'purchase',
    })
    window.location.href = `mailto:info@rentyourboatibiza.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  const submitDayPlan = (event) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const subject = language === 'es' ? 'Solicitud de plan para Formentera' : 'Formentera day plan request'
    const body = [
      `${t.preferredDate}: ${form.get('date')}`,
      `${t.groupSize}: ${form.get('group')}`,
      `${t.yachtType}: ${form.get('yachtType')}`,
      `${t.route}: ${form.get('route')}`,
      `${t.yourName}: ${form.get('name')}`,
      `${t.contactDetails}: ${form.get('contact')}`,
    ].join('\n')
    trackEvent('day_plan_submit', { route: form.get('route'), group_size: form.get('group') })
    window.location.href = `mailto:info@rentyourboatibiza.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  const submitHeroSearch = (event) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const date = form.get('hero-date') || (language === 'es' ? 'Flexible' : 'Flexible')
    const message = language === 'es'
      ? `Hola, quiero alquilar un yate en Ibiza.\n\nFecha: ${date}\nInvitados: ${form.get('hero-guests')}\nTipo de yate: ${form.get('hero-type')}\n\n¿Podéis enviarme las opciones disponibles?`
      : `Hello, I would like to rent a yacht in Ibiza.\n\nDate: ${date}\nGuests: ${form.get('hero-guests')}\nYacht type: ${form.get('hero-type')}\n\nCould you send me the available options?`
    trackEvent('hero_search_submit', {
      date,
      guests: form.get('hero-guests'),
      yacht_type: form.get('hero-type'),
    })
    window.open(`https://wa.me/34696826329?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <main>
      <header className="site-header">
        <button className="brand" onClick={() => scrollTo('home')} aria-label="Rent Your Boat Ibiza home">
          <img className="brand-logo" src="/rentyourboat-logo.svg" alt="" />
          <span className="brand-name">Rent Your Boat <b>Ibiza</b></span>
        </button>
        <nav className="desktop-nav" aria-label="Main navigation">
          <button onClick={() => scrollTo('collection')}>{t.yachts}</button>
          <button onClick={() => scrollTo('services')}>{t.services}</button>
          <button onClick={() => scrollTo('story')}>{t.about}</button>
        </nav>
        <div className="header-actions">
          <div className="language" aria-label="Language">
            <button className={language === 'en' ? 'active' : ''} onClick={() => setLanguage('en')}>EN</button>
            <span>/</span>
            <button className={language === 'es' ? 'active' : ''} onClick={() => setLanguage('es')}>ES</button>
          </div>
          <button className="contact-pill" onClick={showRentalFleet}>
            {t.discover} <ArrowRight size={16} />
          </button>
          <button className="menu-button" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <Menu size={21} />
          </button>
        </div>
      </header>

      <section className="hero" id="home">
        <div className="hero-image" />
        <div className="hero-shade" />
        <div className="hero-content">
          <span className="eyebrow light">{t.brokerage}</span>
          <h1>{t.heroTitle}<strong>{t.heroTitle2}</strong></h1>
          <p>{t.heroText}</p>
          <div className="hero-trust">
            <span><Check size={14} /> {t.verifiedFleet}</span>
            <span><Check size={14} /> {t.localTeam}</span>
            <span><Check size={14} /> {t.directBooking}</span>
          </div>
          <div className="hero-buttons">
            <button className="primary-button" onClick={showRentalFleet}>
              {t.discover} <ArrowRight size={18} />
            </button>
            <a className="glass-button" href="https://wa.me/34696826329" target="_blank" rel="noreferrer">
              <Phone size={17} /> {t.sell}
            </a>
          </div>
        </div>

        <form className="hero-search-card" onSubmit={submitHeroSearch}>
          <span className="eyebrow">{t.findBoat}</span>
          <h2>{t.findBoat}</h2>
          <p>{t.findBoatText}</p>
          <label>
            <span>{t.preferredDate}</span>
            <input type="date" name="hero-date" />
          </label>
          <div className="hero-search-row">
            <label>
              <span>{t.numberGuests}</span>
              <select name="hero-guests" defaultValue="8">
                {Array.from({ length: 11 }, (_, index) => index + 2).map((count) => <option key={count}>{count}</option>)}
              </select>
            </label>
            <label>
              <span>{t.boatType}</span>
              <select name="hero-type" defaultValue={t.anyYacht}>
                <option>{t.anyYacht}</option>
                <option>{t.openYacht}</option>
                <option>{t.sportYacht}</option>
                <option>{t.luxuryYacht}</option>
              </select>
            </label>
          </div>
          <button type="submit">{t.viewAvailable}<ArrowRight size={17} /></button>
        </form>

        <div className="hero-fleet-preview">
          {boats.filter((boat) => boat.label === 'Charter').map((boat) => (
            <button key={boat.name} onClick={() => openBoat(boat)}>
              <img src={boat.image} alt="" />
              <span>
                <small>{t.charter}</small>
                <b>{boat.name}</b>
                <em>{localiseValue(boat.price)} · {boat.meta}</em>
              </span>
              <ArrowRight size={17} />
            </button>
          ))}
        </div>
      </section>

      <a className="floating-whatsapp" href="https://wa.me/34696826329" target="_blank" rel="noreferrer" aria-label="WhatsApp">
        <Phone size={18} /><span>WhatsApp</span>
      </a>

      <section className="intro section-pad" id="intro">
        <div className="intro-copy">
          <span className="eyebrow">{t.standard}</span>
          <h2>{t.more}<br /><em>{t.way}</em></h2>
        </div>
        <div className="intro-note">
          <p>{t.guidance}</p>
          <button className="text-link" onClick={() => scrollTo('story')}>
            {t.meet} <ArrowRight size={17} />
          </button>
        </div>
      </section>

      <section className="collection" id="collection">
        <div className="section-heading">
          <div>
            <span className="eyebrow">{t.curated}</span>
            <h2>{t.featured}</h2>
          </div>
          <div className="filter-bar" role="group" aria-label="Filter yachts">
            {['Charter', 'For sale', 'All'].map((item) => (
              <button key={item} className={filter === item ? 'active' : ''} onClick={() => setFilter(item)}>
                {item === 'Charter' ? t.charter : item === 'For sale' ? t.sale : t.all}
              </button>
            ))}
          </div>
        </div>

        <div className="yacht-grid">
          {visibleBoats.map((boat) => (
            <article
              className={`yacht-card ${boat.featured ? 'featured' : ''}`}
              key={boat.name}
              onClick={() => openBoat(boat)}
              onKeyDown={(event) => event.key === 'Enter' && openBoat(boat)}
              role="button"
              tabIndex="0"
            >
              <div className="card-image-wrap">
                <img src={boat.image} alt={`${boat.name} yacht`} loading="lazy" />
                <span className={`card-label ${boat.label === 'Charter' ? 'rent-label' : 'sale-label'}`}>
                  {boat.label === 'Charter' ? t.charter : t.sale}
                </span>
                <span className="card-arrow" aria-hidden="true">
                  <ArrowRight size={19} />
                </span>
              </div>
              <div className="card-info">
                <div>
                  <h3>{boat.name}</h3>
                  <p>{localiseValue(boat.price)}</p>
                </div>
                <div className="card-specs">
                  <span><Ruler size={15} /> {boat.meta}</span>
                  <span><Users size={15} /> {localiseValue(boat.guests)}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
        <button className="outline-button" onClick={() => setEnquiryOpen(true)}>
          {t.fullCollection} <ArrowRight size={17} />
        </button>
      </section>

      <section className="experience" id="story">
        <div className="experience-image" role="img" aria-label="Yacht cruising in the Mediterranean" />
        <div className="experience-card">
          <span className="eyebrow light">{t.born}</span>
          <h2>{t.global}<br />{t.soul}</h2>
          <p>{t.localText}</p>
          <div className="trust-points">
            <span><Check size={15} /> {t.independent}</span>
            <span><Check size={15} /> {t.personal}</span>
            <span><Check size={15} /> {t.support}</span>
          </div>
          <button className="primary-button ivory" onClick={() => setEnquiryOpen(true)}>
            {t.approach} <ArrowRight size={18} />
          </button>
        </div>
      </section>

      <section className="services section-pad" id="services">
        <div className="section-heading services-heading">
          <div>
            <span className="eyebrow">{t.everything}</span>
            <h2>{t.serviceTitle}</h2>
          </div>
          <p>{t.serviceIntro}</p>
        </div>
        <div className="service-list">
          {services.map((service) => (
            <button className="service-row" key={service.number} onClick={() => setEnquiryOpen(true)}>
              <span className="service-number">{service.number}</span>
              <h3>{language === 'es' ? service.titleEs : service.title}</h3>
              <p>{language === 'es' ? service.textEs : service.text}</p>
              <span className="service-link">{language === 'es' ? service.linkEs : service.link} <ChevronRight size={17} /></span>
            </button>
          ))}
        </div>
      </section>

      <section className="ibiza-callout">
        <div className="ibiza-content">
          <span className="eyebrow light">{t.feeling}</span>
          <h2>{t.water}<br />{t.water2}</h2>
          <button className="glass-button" onClick={openDayPlanner}>
            {t.design} <Sparkles size={17} />
          </button>
        </div>
      </section>

      <section className="journal section-pad" id="journal">
        <div className="section-heading journal-heading">
          <div>
            <span className="eyebrow">{t.journalEyebrow}</span>
            <h2>{t.journalTitle}</h2>
          </div>
          <p>{t.journalIntro}</p>
        </div>
        <div className="journal-grid">
          {journalArticles.map((article, index) => (
            <article className={`journal-card ${index === 0 ? 'journal-featured' : ''}`} key={article.title}>
              <img src={article.image} alt="" loading="lazy" />
              <div className="journal-shade" />
              <div className="journal-card-content">
                <span>{language === 'es' ? article.categoryEs : article.category}</span>
                <h3>{language === 'es' ? article.titleEs : article.title}</h3>
                <p>{language === 'es' ? article.textEs : article.text}</p>
                <a href={`/journal/${article.slug}`}>
                  {t.exploreStory} <ArrowRight size={16} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="instagram-section section-pad">
        <div className="section-heading instagram-heading">
          <div>
            <span className="eyebrow">{t.instagramEyebrow}</span>
            <h2>{t.instagramTitle}</h2>
          </div>
          <a href="https://www.instagram.com/rentyourboat_ibiza?igsh=cXl6bG9jMW5ibDIz" target="_blank" rel="noreferrer">
            <AtSign size={18} /> {t.followInstagram} <ArrowRight size={17} />
          </a>
        </div>
        <div className="instagram-grid">
          {instagramPosts.map((post) => (
            <a
              className="instagram-tile"
              href={post.url}
              target="_blank"
              rel="noreferrer"
              key={post.label}
              aria-label={`${post.label} — Instagram`}
            >
              <img src={post.image} alt={post.label} loading="lazy" />
              <span><AtSign size={15} /> {post.label}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="contact section-pad">
        <div>
          <span className="eyebrow">{t.conversation}</span>
          <h2>{t.where}<br />{t.where2}</h2>
        </div>
        <button className="round-contact" onClick={() => setEnquiryOpen(true)}>
          <ArrowRight size={30} />
          <span>{t.talk}</span>
        </button>
      </section>

      <footer>
        <div className="footer-top">
          <div className="footer-brand">
            <img className="footer-logo" src="/rentyourboat-logo.svg" alt="Rent Your Boat Ibiza" />
            <p>Brokerage · Charter · Sales · Management</p>
          </div>
          <div className="footer-column">
            <span>{t.visit}</span>
            <p>Carrer d&apos;Alhaueth, sn<br />07800 Ibiza, Balearic Islands</p>
          </div>
          <div className="footer-column">
            <span>{t.contact}</span>
            <a href="tel:+34696826329">+34 696 82 63 29</a>
            <a href="mailto:info@rentyourboatibiza.com">info@rentyourboatibiza.com</a>
          </div>
          <a className="social-link" href="https://www.instagram.com/rentyourboat_ibiza?igsh=cXl6bG9jMW5ibDIz" target="_blank" rel="noreferrer" aria-label="Instagram">
            <AtSign size={20} />
          </a>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Rent Your Boat Ibiza</span>
          <div><a href="/privacy">Privacy</a><a href="/cookies">Cookies</a></div>
          <div className="footer-credits">
            <span>{t.made}</span>
            <a href="https://getportbase.com/" target="_blank" rel="noreferrer">Powered by Portbase</a>
          </div>
        </div>
      </footer>

      {selectedBoat && (
        <section className={`boat-experience ${selectedBoat.label === 'Charter' ? 'rent-experience' : 'sale-experience'}`} aria-label={`${selectedBoat.name} details`}>
          <div className="boat-experience-nav">
            <button className="boat-mini-brand" onClick={() => setSelectedBoat(null)}>
              <img className="brand-logo" src="/rentyourboat-logo.svg" alt="" />
              <span>{t.collection}</span>
            </button>
            <div className="boat-progress">
              <span>{String(activeImage + 1).padStart(2, '0')}</span>
              <i><b style={{ width: `${((activeImage + 1) / selectedBoat.gallery.length) * 100}%` }} /></i>
              <span>{String(selectedBoat.gallery.length).padStart(2, '0')}</span>
            </div>
            <button className="boat-close" onClick={() => setSelectedBoat(null)} aria-label="Close yacht experience">
              <X size={20} /> <span>{t.close}</span>
            </button>
          </div>

          <div className="boat-detail-hero">
            <img src={selectedBoat.gallery[activeImage]} alt={`${selectedBoat.name} view ${activeImage + 1}`} />
            <div className="boat-detail-shade" />
            <div className="boat-title">
              <span className="eyebrow light">{language === 'es' ? selectedBoat.labelEs : selectedBoat.label} · Ibiza</span>
              <h2>{selectedBoat.name}</h2>
              <p>{language === 'es' ? selectedBoat.taglineEs : selectedBoat.tagline}</p>
            </div>
            <div className="boat-quick-specs">
              <span><small>{t.length}</small>{selectedBoat.meta}</span>
              <span><small>{t.guests}</small>{localiseValue(selectedBoat.guests)}</span>
              <span><small>{t.accommodation}</small>{localiseValue(selectedBoat.cabins)}</span>
              <span><small>{t.maxSpeed}</small>{selectedBoat.speed}</span>
            </div>
            <div className="boat-thumbnails">
              {selectedBoat.gallery.map((image, index) => (
                <button
                  className={activeImage === index ? 'active' : ''}
                  key={image}
                  onClick={() => setActiveImage(index)}
                  aria-label={`View image ${index + 1}`}
                >
                  <img src={image} alt="" />
                  <span>{String(index + 1).padStart(2, '0')}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="boat-story">
            <div className="boat-story-copy">
              <span className="eyebrow">{t.experience}</span>
              <h3>{t.madeFor}<br />{t.neverForget}</h3>
            </div>
            <div className="boat-story-text">
              <p>{(selectedBoat.label === 'Charter' ? t.story1 : t.saleStory1).replace('{boat}', selectedBoat.name)}</p>
              <p>{selectedBoat.label === 'Charter' ? t.story2 : t.saleStory2}</p>
            </div>
            <aside className={`boat-booking-card ${selectedBoat.label === 'Charter' ? 'rent-card' : 'sale-card'}`}>
              <span>{selectedBoat.label === 'Charter' ? t.charter : t.sale}</span>
              <strong>{localiseValue(selectedBoat.price)}</strong>
              <p>{selectedBoat.label === 'Charter' ? t.itinerary : t.saleCardText}</p>
              <button onClick={() => openBoatEnquiry(selectedBoat)}>
                {selectedBoat.label === 'Charter' ? t.availability : t.requestDetails} <ArrowRight size={17} />
              </button>
              <small><ShieldCheck size={14} /> {t.privateEnquiry}</small>
            </aside>
          </div>

          <div className="more-boats">
            <div className="more-boats-heading">
              <div>
                <span className="eyebrow">{t.keepExploring}</span>
                <h3>{t.moreYachts}</h3>
              </div>
              <span>{t.selected}</span>
            </div>
            <div className="more-boats-track">
              {boats
                .filter((boat) => boat.name !== selectedBoat.name && boat.label === selectedBoat.label)
                .slice(0, 3)
                .map((boat) => (
                <button key={boat.name} onClick={() => openBoat(boat)}>
                  <img src={boat.image} alt={`${boat.name} yacht`} />
                  <span className={`more-boat-label ${boat.label === 'Charter' ? 'rent-label' : 'sale-label'}`}>
                    {boat.label === 'Charter' ? t.charter : t.sale}
                  </span>
                  <span className="more-boat-info">
                    <b>{boat.name}</b>
                    <small>{localiseValue(boat.price)}</small>
                  </span>
                  <ArrowRight className="more-boat-arrow" size={18} />
                </button>
                ))}
            </div>
          </div>
        </section>
      )}

      {menuOpen && (
        <div className="menu-overlay">
          <img className="menu-logo" src="/rentyourboat-logo.svg" alt="Rent Your Boat Ibiza" />
          <button className="close-button" onClick={() => setMenuOpen(false)} aria-label="Close menu"><X /></button>
          <nav>
            <button onClick={() => scrollTo('collection')}><span>01</span>{t.yachts}</button>
            <button onClick={() => scrollTo('services')}><span>02</span>{t.services}</button>
            <button onClick={() => scrollTo('story')}><span>03</span>{t.about}</button>
            <button onClick={() => { setMenuOpen(false); setEnquiryOpen(true) }}><span>04</span>{t.contact}</button>
          </nav>
        </div>
      )}

      {enquiryOpen && (
        <div className="modal-backdrop" onMouseDown={closeEnquiry}>
          <div
            className={`enquiry-modal ${
              enquiryBoat
                ? `boat-enquiry-modal ${enquiryIsRental ? 'rent-modal' : 'sale-modal'}`
                : enquiryMode === 'day' ? 'boat-enquiry-modal day-plan-modal' : ''
            }`}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button className="modal-close" onClick={closeEnquiry} aria-label="Close enquiry"><X size={20} /></button>
            <div className="modal-icon"><img src="/rentyourboat-logo.svg" alt="" /></div>
            {enquiryBoat ? (
              <>
                <span className="eyebrow">{enquiryIsRental ? t.charterEnquiry : t.saleEnquiry}</span>
                <h2>{enquiryIsRental ? t.planBoat : t.interestedBoat}<br />{enquiryBoat.name}</h2>
                <p>{enquiryIsRental ? t.charterHelp : t.saleHelp}</p>
                <div className="charter-boat-chip">
                  <img src={enquiryBoat.image} alt="" />
                  <span><b>{enquiryBoat.name}</b><small>{localiseValue(enquiryBoat.price)}</small></span>
                </div>
                <form className="charter-form" onSubmit={submitBoatEnquiry}>
                  {enquiryIsRental ? (
                    <>
                      <label>
                        <span>{t.preferredDate}</span>
                        <input name="date" type="date" required />
                      </label>
                      <label>
                        <span>{t.numberGuests}</span>
                        <select name="guests" defaultValue="8">
                          {Array.from({ length: 11 }, (_, index) => index + 2).map((count) => <option key={count}>{count}</option>)}
                        </select>
                      </label>
                    </>
                  ) : (
                    <>
                      <label>
                        <span>{t.purchaseTimeline}</span>
                        <select name="timeline" defaultValue={t.timelineMonths}>
                          <option>{t.timelineNow}</option>
                          <option>{t.timelineMonths}</option>
                          <option>{t.timelineExplore}</option>
                        </select>
                      </label>
                      <label>
                        <span>{t.currentBoat}</span>
                        <select name="currentBoat" defaultValue={t.no}>
                          <option>{t.no}</option>
                          <option>{t.yes}</option>
                        </select>
                      </label>
                    </>
                  )}
                  <label>
                    <span>{t.yourName}</span>
                    <input name="name" type="text" autoComplete="name" required />
                  </label>
                  <label>
                    <span>{t.contactDetails}</span>
                    <input name="contact" type="text" autoComplete="email" required />
                  </label>
                  <label className="full-field">
                    <span>{enquiryIsRental ? t.specialRequests : t.purchaseNotes}</span>
                    <textarea name="message" placeholder={enquiryIsRental ? t.optional : t.purchaseOptional} rows="2" />
                  </label>
                  <button className="charter-submit" type="submit">
                    {enquiryIsRental ? t.sendRequest : t.requestDetails}<ArrowRight size={17} />
                  </button>
                </form>
              </>
            ) : enquiryMode === 'day' ? (
              <>
                <span className="eyebrow">{t.dayPlanner}</span>
                <h2>{t.designDayTitle}</h2>
                <p>{t.dayPlannerHelp}</p>
                <form className="charter-form day-plan-form" onSubmit={submitDayPlan}>
                  <label>
                    <span>{t.preferredDate}</span>
                    <input name="date" type="date" required />
                  </label>
                  <label>
                    <span>{t.groupSize}</span>
                    <select name="group" defaultValue="8">
                      {Array.from({ length: 11 }, (_, index) => index + 2).map((count) => <option key={count}>{count}</option>)}
                      <option>13+</option>
                    </select>
                  </label>
                  <label>
                    <span>{t.yachtType}</span>
                    <select name="yachtType" defaultValue={t.noPreference}>
                      <option>{t.noPreference}</option>
                      <option>{t.openYacht}</option>
                      <option>{t.sportYacht}</option>
                      <option>{t.luxuryYacht}</option>
                    </select>
                  </label>
                  <label>
                    <span>{t.route}</span>
                    <select name="route" defaultValue={t.illetesRoute}>
                      <option>{t.illetesRoute}</option>
                      <option>{t.calaSaonaRoute}</option>
                      <option>{t.fullIslandRoute}</option>
                      <option>{t.sunsetRoute}</option>
                    </select>
                  </label>
                  <label>
                    <span>{t.yourName}</span>
                    <input name="name" type="text" autoComplete="name" required />
                  </label>
                  <label>
                    <span>{t.contactDetails}</span>
                    <input name="contact" type="text" autoComplete="email" required />
                  </label>
                  <button className="charter-submit" type="submit">{t.sendDayPlan}<ArrowRight size={17} /></button>
                </form>
              </>
            ) : (
              <>
                <span className="eyebrow">{t.journey}</span>
                <h2>{t.help}</h2>
                <p>{t.helpText}</p>
                <div className="enquiry-options">
                  <button onClick={() => { closeEnquiry(); setFilter('For sale'); setTimeout(() => scrollTo('collection'), 50) }}>
                    {t.wantBuy}<ArrowRight size={16} />
                  </button>
                  <button onClick={() => { window.location.href = `mailto:info@rentyourboatibiza.com?subject=${encodeURIComponent(language === 'es' ? 'Valoración de yate' : 'Yacht valuation')}` }}>
                    {t.wantSell}<ArrowRight size={16} />
                  </button>
                  <button onClick={() => { closeEnquiry(); setFilter('Charter'); setTimeout(() => scrollTo('collection'), 50) }}>
                    {t.wantCharter}<ArrowRight size={16} />
                  </button>
                </div>
                <div className="modal-contacts">
                  <a href="tel:+34696826329"><Phone size={17} /> +34 696 82 63 29</a>
                  <a href="mailto:info@rentyourboatibiza.com"><Mail size={17} /> {t.email}</a>
                </div>
              </>
            )}
            <span className="privacy-note"><ShieldCheck size={14} /> {t.confidential}</span>
          </div>
        </div>
      )}
      <CookieConsent language={language} />
    </main>
  )
}

function App() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'
  if (path === '/privacy') return <ContentPage type="privacy" />
  if (path === '/cookies') return <ContentPage type="cookies" />
  if (path.startsWith('/journal/')) {
    return <ContentPage type="journal" slug={decodeURIComponent(path.slice('/journal/'.length))} />
  }
  return <WebsiteApp />
}

export default App
