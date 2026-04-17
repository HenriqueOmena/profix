import { useState, useMemo, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { MOCK_CATEGORIES, getPortfolioByCategory } from '../data/mock'
import type { PortfolioItem, LoadState } from '../types'

const WHATSAPP  = 'https://wa.me/351936284583'
const PAGE_SIZE = 9

function IconWA() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="wa-icon">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

/* ─── Portfolio card ─────────────────────────────────────── */
function PortfolioCard({ item, onLightbox }: { item: PortfolioItem; onLightbox: (src: string) => void }) {
  const cat = MOCK_CATEGORIES.find(c => c.id === item.categoryId)
  return (
    <article className="pf-card">
      <button
        className="pf-card-img-btn"
        onClick={() => onLightbox(item.imageUrl)}
        type="button"
        aria-label={`Ver imagem: ${item.title}`}
      >
        <img src={item.imageUrl} alt={item.title} className="pf-card-img" loading="lazy" />
        {item.featured && <span className="pf-card-badge">Destaque</span>}
        <div className="pf-card-hover-overlay">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="pf-card-zoom-icon">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
          </svg>
        </div>
      </button>
      <div className="pf-card-body">
        {cat && (
          <Link to={`/trabalhos?categoria=${cat.id}`} className="pf-card-cat">
            {cat.name}
          </Link>
        )}
        <h3 className="pf-card-title">{item.title}</h3>
        <p className="pf-card-desc">{item.description}</p>
        <p className="pf-card-date">
          {new Date(item.date).toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' })}
        </p>
      </div>
    </article>
  )
}

/* ─── Skeleton ───────────────────────────────────────────── */
function PortfolioSkeleton() {
  return (
    <div className="pf-skeleton">
      <div className="pf-skeleton-img" />
      <div className="pf-skeleton-body">
        <div className="pf-skeleton-line pf-skeleton-line--title" />
        <div className="pf-skeleton-line pf-skeleton-line--desc" />
        <div className="pf-skeleton-line pf-skeleton-line--short" />
      </div>
    </div>
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
    <div className="lightbox-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <button className="lightbox-close" onClick={onClose} aria-label="Fechar">✕</button>
      <img src={src} alt="" className="lightbox-img" onClick={e => e.stopPropagation()} />
    </div>
  )
}

/* ─── PortfolioPage ──────────────────────────────────────── */
export default function PortfolioPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { t } = useTranslation()

  const activeCategoryId = searchParams.get('categoria')
  const [page,     setPage]    = useState(1)
  const [lightbox, setLightbox] = useState<string | null>(null)
  const [loadState] = useState<LoadState>('success')

  useEffect(() => { setPage(1) }, [activeCategoryId])

  const allItems     = useMemo(() => getPortfolioByCategory(activeCategoryId), [activeCategoryId])
  const visibleItems = allItems.slice(0, page * PAGE_SIZE)
  const hasMore      = visibleItems.length < allItems.length

  const activeCategories = MOCK_CATEGORIES.filter(c => c.active).sort((a, b) => a.order - b.order)
  const activeLabel      = activeCategories.find(c => c.id === activeCategoryId)?.name ?? 'Todos'

  function setFilter(id: string | null) {
    if (id === null) searchParams.delete('categoria')
    else searchParams.set('categoria', id)
    setSearchParams(searchParams, { replace: true })
  }

  return (
    <>
      {lightbox && <Lightbox src={lightbox} onClose={() => setLightbox(null)} />}

      <div className="pf-page">

        {/* ── Page header ───────────────────────────────── */}
        <div className="pf-header-wrap">
          <div className="page-wrap pf-header">
            <div className="pf-header-text">
              <p className="eyebrow">{t('portfolio.title')}</p>
              <h1 className="pf-page-title">{t('portfolio.title')}</h1>
              <p className="pf-page-sub">
                Cada projecto é uma prova concreta do nosso trabalho na Região Autónoma da Madeira.
              </p>
            </div>
            <a href={WHATSAPP} target="_blank" rel="noreferrer" className="btn-gold pf-header-cta">
              <IconWA /> Pedir orçamento
            </a>
          </div>
          <div className="pf-header-gold-bar" aria-hidden="true" />
        </div>

        <div className="page-wrap pf-content">

          {/* ── Category filters ──────────────────────────── */}
          <div className="pf-filters" role="tablist" aria-label="Filtrar por categoria">
            <button
              role="tab"
              aria-selected={activeCategoryId === null}
              onClick={() => setFilter(null)}
              type="button"
              className={`pf-filter-btn ${activeCategoryId === null ? 'is-active' : ''}`}
            >
              Todos
              <span className="pf-filter-count">{MOCK_CATEGORIES.reduce((a, c) => a + (c.active ? 1 : 0), 0) * 2}</span>
            </button>
            {activeCategories.map(cat => (
              <button
                key={cat.id}
                role="tab"
                aria-selected={activeCategoryId === cat.id}
                onClick={() => setFilter(cat.id)}
                type="button"
                className={`pf-filter-btn ${activeCategoryId === cat.id ? 'is-active' : ''}`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Active filter label */}
          {activeCategoryId && (
            <div className="pf-filter-active-row">
              <span className="pf-filter-active-label">
                Filtrando por: <strong>{activeLabel}</strong>
              </span>
              <button onClick={() => setFilter(null)} type="button" className="pf-filter-clear">
                Limpar filtro
              </button>
            </div>
          )}

          {/* ── Loading ─────────────────────────────────── */}
          {loadState === 'loading' && (
            <div className="pf-grid">
              {Array.from({ length: PAGE_SIZE }).map((_, i) => <PortfolioSkeleton key={i} />)}
            </div>
          )}

          {/* ── Grid ────────────────────────────────────── */}
          {loadState === 'success' && allItems.length > 0 && (
            <>
              <div className="pf-grid">
                {visibleItems.map(item => (
                  <PortfolioCard key={item.id} item={item} onLightbox={setLightbox} />
                ))}
              </div>

              {hasMore && (
                <div className="pf-load-more-row">
                  <button
                    type="button"
                    onClick={() => setPage(p => p + 1)}
                    className="pf-load-more-btn"
                  >
                    Carregar mais
                    <span className="pf-load-more-count">({allItems.length - visibleItems.length} restantes)</span>
                  </button>
                </div>
              )}
            </>
          )}

          {/* ── Empty ───────────────────────────────────── */}
          {loadState === 'success' && allItems.length === 0 && (
            <div className="pf-empty">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="pf-empty-icon">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M2.25 19.5h19.5M3.75 4.5h16.5A1.5 1.5 0 0121.75 6v12a1.5 1.5 0 01-1.5 1.5H3.75A1.5 1.5 0 012.25 18V6a1.5 1.5 0 011.5-1.5z" />
              </svg>
              <p className="pf-empty-text">
                {activeCategoryId
                  ? `Ainda não há trabalhos publicados em "${activeLabel}".`
                  : t('portfolio.empty')}
              </p>
              <a href={WHATSAPP} target="_blank" rel="noreferrer" className="btn-gold">
                <IconWA /> Contactar via WhatsApp
              </a>
            </div>
          )}

          {/* ── Bottom CTA ──────────────────────────────── */}
          {loadState === 'success' && allItems.length > 0 && !hasMore && (
            <div className="contact-cta-full pf-bottom-cta">
              <div className="contact-cta-full-left">
                <span className="eyebrow">Tem um projecto em mente?</span>
                <p className="contact-cta-headline">Orçamento gratuito, sem compromisso.</p>
                <p className="contact-cta-sub">Respondemos em 24 horas.</p>
              </div>
              <a href={WHATSAPP} target="_blank" rel="noreferrer" className="btn-gold btn-large">
                <IconWA /> Pedir orçamento gratuito
              </a>
            </div>
          )}

        </div>
      </div>
    </>
  )
}
