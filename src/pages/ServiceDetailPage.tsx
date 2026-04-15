import { Link, useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { getCategoryBySlug, getPortfolioPreview } from '../data/mock'

const WHATSAPP = 'https://wa.me/351936284583'

/* ─── Icons ──────────────────────────────────────────────── */
function IconCheck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
      strokeLinecap="round" strokeLinejoin="round" className="size-4 shrink-0 text-gold">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
function IconArrowLeft() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" className="size-4">
      <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
  )
}
function IconWA() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

/* ─── Lightbox ───────────────────────────────────────────── */
function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={alt}
    >
      <button
        className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full
                   border border-border-hi bg-surface text-body hover:text-gold
                   transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
        onClick={onClose}
        aria-label="Fechar"
      >✕</button>
      <img
        src={src}
        alt={alt}
        className="max-h-[88vh] max-w-full rounded-[var(--radius)] object-contain shadow-2xl"
        onClick={e => e.stopPropagation()}
      />
    </div>
  )
}

/* ─── ServiceDetailPage ──────────────────────────────────── */
export default function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [lightbox, setLightbox] = useState<string | null>(null)

  const category = slug ? getCategoryBySlug(slug) : undefined
  const preview  = category ? getPortfolioPreview(category.id, 3) : []

  if (!category) {
    return (
      <div className="min-h-screen bg-navy flex flex-col items-center justify-center gap-6 p-8">
        <p className="text-[1.1rem] text-muted">Serviço não encontrado.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full border border-border-hi px-5 py-2.5
                     text-[0.83rem] font-600 text-muted hover:text-gold hover:border-gold-dk transition-colors"
        >
          <IconArrowLeft /> Voltar ao início
        </Link>
      </div>
    )
  }

  return (
    <>
      {lightbox && (
        <Lightbox src={lightbox} alt={category.name} onClose={() => setLightbox(null)} />
      )}

      <div className="min-h-screen bg-navy">
        {/* ── Back nav ────────────────────────────────────── */}
        <div className="border-b border-border bg-navy-alt sticky top-0 z-10 backdrop-blur-sm">
          <div className="page-wrap flex h-14 items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-[0.82rem] font-600 text-muted
                         hover:text-gold transition-colors
                         focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold rounded"
            >
              <IconArrowLeft /> Serviços
            </button>
            <span className="text-dim">/</span>
            <span className="text-[0.82rem] text-body truncate">{category.name}</span>
          </div>
        </div>

        <div className="page-wrap py-14 flex flex-col gap-14">

          {/* ── Hero block ──────────────────────────────────── */}
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-14">

            {/* Left: text */}
            <div className="flex flex-col gap-5 flex-1">
              <div className="flex items-center gap-3">
                <span className="eyebrow">{t('nav.services')}</span>
              </div>
              <h1
                className="font-[var(--font-display)] text-[clamp(2rem,5vw,3rem)] font-700
                           leading-tight text-body"
              >
                {category.name}
              </h1>
              <p className="text-[0.95rem] leading-relaxed text-muted max-w-[60ch]">
                {category.fullDescription}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href={WHATSAPP}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-gold"
                >
                  <IconWA />
                  Pedir orçamento gratuito
                </a>
                <Link
                  to={`/trabalhos?categoria=${category.id}`}
                  className="inline-flex items-center gap-2 rounded-full border border-border-hi px-5 py-2.5
                             text-[0.83rem] font-600 text-muted hover:text-gold hover:border-gold-dk
                             transition-colors focus-visible:outline focus-visible:outline-2
                             focus-visible:outline-gold focus-visible:outline-offset-2"
                >
                  Ver trabalhos desta categoria
                </Link>
              </div>
            </div>

            {/* Right: highlights */}
            <div className="flex flex-col gap-4 rounded-[var(--radius-lg)] border border-border
                            bg-surface p-6 lg:w-80 lg:shrink-0">
              <p className="text-[0.7rem] font-700 uppercase tracking-[0.2em] text-gold">
                O que inclui
              </p>
              <ul className="flex flex-col gap-3">
                {category.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <IconCheck />
                    <span className="text-[0.84rem] leading-relaxed text-muted">{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── Portfolio preview ────────────────────────────── */}
          {preview.length > 0 && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between gap-4">
                <p className="works-label">Trabalhos recentes</p>
                <Link
                  to={`/trabalhos?categoria=${category.id}`}
                  className="text-[0.78rem] font-600 text-gold hover:text-gold-lt
                             underline underline-offset-4 transition-colors"
                >
                  Ver todos →
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {preview.map(item => (
                  <button
                    key={item.id}
                    className="group relative overflow-hidden rounded-[var(--radius)] border border-border
                               bg-surface-hi aspect-[4/3] p-0
                               hover:border-gold-dk hover:-translate-y-0.5 transition-all duration-200
                               focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
                    onClick={() => setLightbox(item.imageUrl)}
                    aria-label={item.title}
                    type="button"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="size-full object-cover transition-transform duration-400 group-hover:scale-[1.05]"
                    />
                    <div className="gallery-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <p className="gallery-item-title">{item.title}</p>
                      <p className="gallery-item-desc">{item.description}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex justify-center">
                <Link
                  to={`/trabalhos?categoria=${category.id}`}
                  className="inline-flex items-center gap-2 rounded-full border border-border-hi px-6 py-2.5
                             text-[0.83rem] font-600 text-muted hover:text-gold hover:border-gold-dk
                             transition-colors focus-visible:outline focus-visible:outline-2
                             focus-visible:outline-gold focus-visible:outline-offset-2"
                >
                  Ver todos os trabalhos desta categoria
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  )
}
