import { useState, useMemo, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { MOCK_CATEGORIES, getPortfolioByCategory } from '../data/mock'
import type { PortfolioItem, LoadState } from '../types'

const WHATSAPP  = 'https://wa.me/351936284583'
const PAGE_SIZE = 6

/* ─── Icons ──────────────────────────────────────────────── */
function IconArrowLeft() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" className="size-4">
      <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
  )
}
function IconPhoto() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"
      strokeLinecap="round" strokeLinejoin="round" className="size-8 opacity-30">
      <path d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M2.25 19.5h19.5M3.75 4.5h16.5A1.5 1.5 0 0121.75 6v12a1.5 1.5 0 01-1.5 1.5H3.75A1.5 1.5 0 012.25 18V6a1.5 1.5 0 011.5-1.5z" />
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

/* ─── Skeleton card ──────────────────────────────────────── */
function PortfolioSkeleton() {
  return (
    <div className="flex flex-col gap-0 overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface animate-pulse">
      <div className="aspect-[4/3] bg-surface-hi" />
      <div className="flex flex-col gap-2 p-4">
        <div className="h-3 w-3/4 rounded bg-border-hi" />
        <div className="h-2.5 w-full rounded bg-border" />
        <div className="h-2.5 w-2/3 rounded bg-border" />
      </div>
    </div>
  )
}

/* ─── Portfolio card ─────────────────────────────────────── */
function PortfolioCard({
  item,
  onLightbox,
}: {
  item: PortfolioItem
  onLightbox: (src: string) => void
}) {
  const cat = MOCK_CATEGORIES.find(c => c.id === item.categoryId)

  return (
    <article
      className="group flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-border
                 bg-surface transition-all duration-200
                 hover:border-gold-dk hover:shadow-[0_6px_28px_rgba(201,152,58,0.09)] hover:-translate-y-0.5"
    >
      {/* Image */}
      <button
        className="relative overflow-hidden aspect-[4/3] p-0 border-none bg-surface-hi block w-full
                   focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
        onClick={() => onLightbox(item.imageUrl)}
        type="button"
        aria-label={`Ver imagem: ${item.title}`}
      >
        <img
          src={item.imageUrl}
          alt={item.title}
          className="size-full object-cover transition-transform duration-400 group-hover:scale-[1.05]"
          loading="lazy"
        />
        {item.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-gold px-2.5 py-0.5
                           text-[0.65rem] font-700 uppercase tracking-wide text-[#100d04]">
            Destaque
          </span>
        )}
      </button>

      {/* Info */}
      <div className="flex flex-col gap-2 p-4">
        {cat && (
          <Link
            to={`/trabalhos?categoria=${cat.id}`}
            className="text-[0.65rem] font-700 uppercase tracking-[0.18em] text-gold
                       hover:text-gold-lt transition-colors w-fit"
          >
            {cat.name}
          </Link>
        )}
        <h3 className="text-[0.9rem] font-700 leading-snug text-body">{item.title}</h3>
        <p className="text-[0.8rem] leading-relaxed text-muted line-clamp-2">{item.description}</p>
        <p className="mt-1 text-[0.72rem] text-dim">
          {new Date(item.date).toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' })}
        </p>
      </div>
    </article>
  )
}

/* ─── Lightbox ───────────────────────────────────────────── */
function Lightbox({ src, onClose }: { src: string; onClose: () => void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', h)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', h); document.body.style.overflow = '' }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <button
        className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full
                   border border-border-hi bg-surface text-body hover:text-gold transition-colors
                   focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
        onClick={onClose}
        aria-label="Fechar"
      >✕</button>
      <img
        src={src}
        alt=""
        className="max-h-[88vh] max-w-full rounded-[var(--radius)] object-contain shadow-2xl"
        onClick={e => e.stopPropagation()}
      />
    </div>
  )
}

/* ─── PortfolioPage ──────────────────────────────────────── */
export default function PortfolioPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { t } = useTranslation()

  const activeCategoryId = searchParams.get('categoria')
  const [page,      setPage]     = useState(1)
  const [lightbox,  setLightbox] = useState<string | null>(null)

  // Simulate async load (replace with real API call later)
  const [loadState] = useState<LoadState>('success')

  // Reset pagination when filter changes
  useEffect(() => { setPage(1) }, [activeCategoryId])

  const allItems   = useMemo(() => getPortfolioByCategory(activeCategoryId), [activeCategoryId])
  const visibleItems = allItems.slice(0, page * PAGE_SIZE)
  const hasMore    = visibleItems.length < allItems.length

  const activeCategories = MOCK_CATEGORIES.filter(c => c.active).sort((a, b) => a.order - b.order)

  function setFilter(id: string | null) {
    if (id === null) searchParams.delete('categoria')
    else searchParams.set('categoria', id)
    setSearchParams(searchParams, { replace: true })
  }

  const activeLabel = activeCategories.find(c => c.id === activeCategoryId)?.name ?? 'Todos'

  return (
    <>
      {lightbox && <Lightbox src={lightbox} onClose={() => setLightbox(null)} />}

      <div className="min-h-screen bg-navy">
        {/* ── Sticky back nav ─────────────────────────────── */}
        <div className="border-b border-border bg-navy-alt sticky top-0 z-10">
          <div className="page-wrap flex h-14 items-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-[0.82rem] font-600 text-muted
                         hover:text-gold transition-colors
                         focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold rounded"
            >
              <IconArrowLeft /> Início
            </Link>
            <span className="text-dim">/</span>
            <span className="text-[0.82rem] text-body">Trabalhos Realizados</span>
          </div>
        </div>

        <div className="page-wrap py-12 flex flex-col gap-10">

          {/* ── Page header ───────────────────────────────── */}
          <div className="flex flex-col gap-3">
            <p className="eyebrow">{t('portfolio.title')}</p>
            <h1 className="font-[var(--font-display)] text-[clamp(2rem,5vw,3rem)] font-700 leading-tight text-body">
              Trabalhos Realizados
            </h1>
            <p className="text-[0.93rem] text-muted max-w-[55ch]">
              Cada projecto é uma prova concreta do nosso trabalho na Região Autónoma da Madeira.
            </p>
          </div>

          {/* ── Category filters ──────────────────────────── */}
          <div
            role="tablist"
            aria-label="Filtrar por categoria"
            className="flex flex-wrap gap-2"
          >
            {/* All tab */}
            <button
              role="tab"
              aria-selected={activeCategoryId === null}
              onClick={() => setFilter(null)}
              type="button"
              className={`rounded-full border px-4 py-2 text-[0.8rem] font-600 transition-colors
                          focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-2
                          ${activeCategoryId === null
                            ? 'border-gold-dk bg-[rgba(201,152,58,0.12)] text-gold'
                            : 'border-border-hi bg-transparent text-muted hover:border-gold-dk hover:text-body'
                          }`}
            >
              Todos
            </button>

            {activeCategories.map(cat => (
              <button
                key={cat.id}
                role="tab"
                aria-selected={activeCategoryId === cat.id}
                onClick={() => setFilter(cat.id)}
                type="button"
                className={`rounded-full border px-4 py-2 text-[0.8rem] font-600 transition-colors
                            focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-2
                            ${activeCategoryId === cat.id
                              ? 'border-gold-dk bg-[rgba(201,152,58,0.12)] text-gold'
                              : 'border-border-hi bg-transparent text-muted hover:border-gold-dk hover:text-body'
                            }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* ── Active filter label ───────────────────────── */}
          {activeCategoryId && (
            <div className="flex items-center gap-3">
              <span className="text-[0.82rem] text-muted">
                Filtrando por: <strong className="text-gold">{activeLabel}</strong>
              </span>
              <button
                onClick={() => setFilter(null)}
                type="button"
                className="text-[0.78rem] text-dim hover:text-gold transition-colors underline underline-offset-4"
              >
                Limpar filtro
              </button>
            </div>
          )}

          {/* ── Loading state ─────────────────────────────── */}
          {loadState === 'loading' && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <PortfolioSkeleton key={i} />
              ))}
            </div>
          )}

          {/* ── Error state ───────────────────────────────── */}
          {loadState === 'error' && (
            <div className="flex flex-col items-center gap-4 py-20 text-center">
              <p className="text-muted">Erro ao carregar os trabalhos. Tente novamente.</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 rounded-full border border-border-hi px-5 py-2.5
                           text-[0.83rem] font-600 text-muted hover:text-gold hover:border-gold-dk transition-colors"
              >
                Tentar novamente
              </button>
            </div>
          )}

          {/* ── Success: grid ─────────────────────────────── */}
          {loadState === 'success' && allItems.length > 0 && (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {visibleItems.map(item => (
                  <PortfolioCard key={item.id} item={item} onLightbox={setLightbox} />
                ))}
              </div>

              {/* "Carregar mais" */}
              {hasMore && (
                <div className="flex justify-center pt-4">
                  <button
                    type="button"
                    onClick={() => setPage(p => p + 1)}
                    className="inline-flex items-center gap-2 rounded-full border border-border-hi px-8 py-3
                               text-[0.85rem] font-600 text-muted
                               hover:border-gold-dk hover:text-gold hover:bg-[rgba(201,152,58,0.06)]
                               transition-colors
                               focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-2"
                  >
                    Carregar mais
                    <span className="text-dim">({allItems.length - visibleItems.length} restantes)</span>
                  </button>
                </div>
              )}
            </>
          )}

          {/* ── Empty state ───────────────────────────────── */}
          {loadState === 'success' && allItems.length === 0 && (
            <div className="flex flex-col items-center gap-5 py-24 text-center">
              <IconPhoto />
              <div className="flex flex-col gap-2">
                <p className="text-[1rem] font-600 text-body">
                  {activeCategoryId
                    ? `Ainda não há trabalhos publicados em "${activeLabel}".`
                    : 'Ainda não há trabalhos publicados.'}
                </p>
                <p className="text-[0.85rem] text-muted">
                  Contacte-nos para saber mais sobre o nosso trabalho.
                </p>
              </div>
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noreferrer"
                className="btn-gold"
              >
                <IconWA />
                Contactar via WhatsApp
              </a>
            </div>
          )}

          {/* ── Bottom CTA ───────────────────────────────── */}
          {loadState === 'success' && allItems.length > 0 && !hasMore && (
            <div className="flex flex-col items-center gap-4 rounded-[var(--radius-lg)] border border-border
                            bg-surface p-8 text-center mt-4">
              <p className="text-[0.95rem] font-600 text-body">
                Tem um projecto em mente?
              </p>
              <p className="text-[0.85rem] text-muted max-w-[45ch]">
                Orçamento gratuito, sem compromisso. Respondemos em 24 horas.
              </p>
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noreferrer"
                className="btn-gold"
              >
                <IconWA />
                Pedir orçamento gratuito
              </a>
            </div>
          )}

        </div>
      </div>
    </>
  )
}
