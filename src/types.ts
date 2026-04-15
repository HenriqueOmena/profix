/* ─── Locale ─────────────────────────────────────────────── */
export type Locale = 'pt' | 'en' | 'de' | 'fr'

/* ─── Legacy (admin drawer + localStorage) ───────────────── */
export type WorkItem = {
  id: string
  title: string
  description: string
  imageData: string  // base64 data-URL or CDN URL
}

export type ServiceItem = {
  id: string
  name: string
  description: string
  works: WorkItem[]
}

/* ─── API-ready catalogue types ──────────────────────────── */
export type ServiceCategory = {
  id: string
  slug: string
  name: string
  shortDescription: string
  fullDescription: string
  highlights: string[]   // scope bullet points shown in detail page
  iconKey: string        // maps to SERVICE_ICONS dict
  order: number
  active: boolean
}

export type PortfolioItem = {
  id: string
  categoryId: string
  title: string
  description: string
  imageUrl: string       // base64 (admin upload) OR https:// CDN
  date: string           // ISO 8601 "YYYY-MM-DD"
  featured: boolean
  active: boolean
}

/* ─── UI helpers ─────────────────────────────────────────── */
export type LoadState = 'idle' | 'loading' | 'success' | 'error'
