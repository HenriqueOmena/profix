import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { ServiceCategory } from '../types'

/* ─── Icon components ────────────────────────────────────── */
function IconWrench() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" className="size-5">
      <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
    </svg>
  )
}
function IconBrush() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" className="size-5">
      <path d="M18.37 2.63 14 7l-1.59-1.59a2 2 0 00-2.82 0L8 7l9 9 1.59-1.59a2 2 0 000-2.82L17 10l4.37-4.37a2.12 2.12 0 00-3-3z" />
      <path d="M9 8c-2 3-4 3.5-7 4l8 8c1-.5 3.5-2 4-7" />
      <path d="M14.5 17.5 4.5 15" />
    </svg>
  )
}
function IconHome() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" className="size-5">
      <path d="m3 9 9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}
function IconBuilding() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" className="size-5">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <path d="M9 22V12h6v10M8 7h.01M12 7h.01M16 7h.01M8 11h.01M16 11h.01" />
    </svg>
  )
}

const ICONS: Record<string, React.ReactElement> = {
  repairs:     <IconWrench />,
  painting:    <IconBrush />,
  renovation:  <IconHome />,
  engineering: <IconBuilding />,
}

function ChevronRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" className="size-4 shrink-0">
      <path d="M9 18l6-6-6-6" />
    </svg>
  )
}

/* ─── ServiceCatalogCard ─────────────────────────────────── */
function ServiceCatalogCard({ svc }: { svc: ServiceCategory }) {
  const { t } = useTranslation()
  return (
    <Link
      to={`/servicos/${svc.slug}`}
      className="group flex flex-col gap-4 rounded-[var(--radius-lg)] border border-border bg-surface p-6
                 transition-all duration-200
                 hover:border-gold-dk hover:shadow-[0_6px_32px_rgba(201,152,58,0.10)] hover:-translate-y-0.5
                 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-2"
      aria-label={svc.name}
    >
      {/* Icon badge */}
      <span className="flex size-11 items-center justify-center rounded-[var(--radius-sm)]
                       border border-gold-dk bg-[rgba(201,152,58,0.10)] text-gold
                       transition-colors duration-200 group-hover:bg-[rgba(201,152,58,0.18)]">
        {ICONS[svc.iconKey] ?? <IconBuilding />}
      </span>

      {/* Text */}
      <div className="flex flex-col gap-2 flex-1">
        <h3 className="font-sans text-[0.97rem] font-700 leading-snug text-body">
          {svc.name}
        </h3>
        <p className="text-[0.83rem] leading-relaxed text-muted line-clamp-2">
          {svc.shortDescription}
        </p>
      </div>

      {/* Footer CTA */}
      <div className="flex items-center gap-1.5 text-[0.78rem] font-600 text-gold
                      transition-gap duration-200 group-hover:gap-2.5">
        {t('services.learnMore')}
        <ChevronRight />
      </div>
    </Link>
  )
}

/* ─── ServicesSection ────────────────────────────────────── */
export default function ServicesSection({ categories }: { categories: ServiceCategory[] }) {
  const { t } = useTranslation()
  const active = categories.filter(c => c.active).sort((a, b) => a.order - b.order)

  return (
    <section id="services" className="section section-alt">
      <div className="page-wrap">
        <div className="section-header">
          <p className="eyebrow">{t('nav.services')}</p>
          <h2 className="section-title">{t('services.title')}</h2>
          <p className="section-sub">{t('services.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {active.map(svc => (
            <ServiceCatalogCard key={svc.id} svc={svc} />
          ))}
        </div>

        {/* Bottom CTA row */}
        <div className="mt-10 flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-center">
          <Link
            to="/trabalhos"
            className="inline-flex items-center gap-2 rounded-full border border-border-hi px-5 py-2.5
                       text-[0.83rem] font-600 text-muted transition-colors duration-150
                       hover:border-gold-dk hover:text-gold hover:bg-[rgba(201,152,58,0.06)]
                       focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-2"
          >
            {t('portfolio.allWorksCompleted')}
          </Link>
        </div>
      </div>
    </section>
  )
}
