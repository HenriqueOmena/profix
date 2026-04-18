import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { SERVICES } from '../data/services'
import type { ServiceCategory, PortfolioWork, WorkImage } from '../data/services'

const WHATSAPP = 'https://wa.me/351936284583'

type View = 'catalog' | 'service' | 'work'

const localeMap: Record<string, string> = {
  pt: 'pt-PT',
  en: 'en-GB',
  de: 'de-DE',
  fr: 'fr-FR',
}

function formatWorkMonth(date: string, lng: string) {
  const loc = localeMap[lng] ?? 'pt-PT'
  return new Date(`${date}-01`).toLocaleDateString(loc, { month: 'long', year: 'numeric' })
}

export default function ServicesPortfolio() {
  const { t, i18n } = useTranslation()
  const [view, setView] = useState<View>('catalog')
  const [selectedService, setSelectedService] = useState<ServiceCategory | null>(null)
  const [selectedWork, setSelectedWork] = useState<PortfolioWork | null>(null)
  const [activeImg, setActiveImg] = useState(0)
  const [panelIn, setPanelIn] = useState(false)
  const [workIn, setWorkIn] = useState(false)

  const openService = useCallback((svc: ServiceCategory) => {
    setSelectedService(svc)
    setView('service')
    requestAnimationFrame(() => requestAnimationFrame(() => setPanelIn(true)))
  }, [])

  const closeService = useCallback(() => {
    setPanelIn(false)
    setTimeout(() => {
      setView('catalog')
      setSelectedService(null)
    }, 360)
  }, [])

  const openWork = useCallback((work: PortfolioWork) => {
    setSelectedWork(work)
    setActiveImg(0)
    setView('work')
    requestAnimationFrame(() => requestAnimationFrame(() => setWorkIn(true)))
  }, [])

  const closeWork = useCallback(() => {
    setWorkIn(false)
    setTimeout(() => {
      setView('service')
      setSelectedWork(null)
    }, 300)
  }, [])

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (view === 'work') closeWork()
        else if (view === 'service') closeService()
      }
      if (view === 'work' && selectedWork) {
        const imgs = selectedWork.images
        if (e.key === 'ArrowRight') setActiveImg(i => Math.min(i + 1, imgs.length - 1))
        if (e.key === 'ArrowLeft') setActiveImg(i => Math.max(i - 1, 0))
      }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [view, selectedWork, closeWork, closeService])

  useEffect(() => {
    document.body.style.overflow = view !== 'catalog' ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [view])

  const sorted = [...SERVICES].filter(s => s.active).sort((a, b) => a.order - b.order)

  return (
    <>
      <section
        id="services"
        className="svc-section relative overflow-hidden"
        aria-labelledby="services-heading"
      >
        {/* Ambient glow effects */}
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_45%_at_50%_-5%,rgba(201,152,58,0.10),transparent_55%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-32 top-[18%] h-[420px] w-[420px] rounded-full bg-gold/[0.03] blur-[100px]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-24 bottom-[12%] h-80 w-80 rounded-full bg-gold/[0.04] blur-[80px]"
          aria-hidden
        />

        <div className="page-wrap relative">
          {/* ── Section header ─────────────────────────────── */}
          <div className="svc-header">
            <div className="svc-header-accent" aria-hidden />
            <p className="svc-eyebrow">{t('nav.services')}</p>
            <h2 id="services-heading" className="svc-title">
              {t('services.title')}
            </h2>
            <p className="svc-lead">{t('services.catalogLead')}</p>
          </div>

          {/* ── Cards grid ─────────────────────────────────── */}
          <div className="svc-grid">
            {sorted.map((svc, i) => (
              <ServiceCard key={svc.id} service={svc} index={i} onOpen={() => openService(svc)} />
            ))}
          </div>

          {/* ── Bottom CTA ─────────────────────────────────── */}
          <div className="svc-bottom-cta">
            <div className="svc-bottom-line" aria-hidden />
            <Link to="/trabalhos" className="svc-all-works-link">
              <span>{t('portfolio.allWorksCompleted')}</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="svc-arrow-icon">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {(view === 'service' || view === 'work') && selectedService && (
        <ServicePanel
          service={selectedService}
          services={sorted}
          panelIn={panelIn}
          lng={i18n.language}
          onClose={closeService}
          onServiceChange={svc => setSelectedService(svc)}
          onWorkOpen={openWork}
        />
      )}

      {view === 'work' && selectedWork && (
        <WorkModal
          work={selectedWork}
          serviceName={selectedService?.name ?? ''}
          workIn={workIn}
          activeImg={activeImg}
          setActiveImg={setActiveImg}
          lng={i18n.language}
          onClose={closeWork}
        />
      )}
    </>
  )
}

/* ────────────────────────────────────────────────────────────── */
/*  ServiceCard                                                   */
/* ────────────────────────────────────────────────────────────── */

function ServiceCard({
  service,
  index,
  onOpen,
}: {
  service: ServiceCategory
  index: number
  onOpen: () => void
}) {
  const { t } = useTranslation()
  const activeWorks = service.works.filter(w => w.active).length
  const cardRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.12 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <article
      ref={cardRef}
      className="svc-card-v2"
      style={{
        transitionDelay: `${index * 100}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
      }}
      onClick={onOpen}
      tabIndex={0}
      role="button"
      aria-label={`${t('services.learnMore')}: ${service.name}`}
      onKeyDown={e => e.key === 'Enter' && onOpen()}
    >
      {/* Image area */}
      <div className="svc-card-img-wrap">
        <img
          src={service.imageUrl}
          alt=""
          className="svc-card-img"
          loading="lazy"
        />
        <div className="svc-card-img-overlay" />
        <div className="svc-card-img-shine" aria-hidden />

        {/* Work count badge */}
        <div className="svc-card-badge">
          <span className="svc-card-badge-dot" />
          {t('services.workCount', { count: activeWorks })}
        </div>

        {/* Title over image */}
        <div className="svc-card-img-text">
          <h3 className="svc-card-name">{service.name}</h3>
        </div>
      </div>

      {/* Content area */}
      <div className="svc-card-body">
        <p className="svc-card-desc">{service.description}</p>

        <div className="svc-card-tags">
          {service.subServices.map(sub => (
            <span key={sub.id} className="svc-card-tag">
              {sub.name}
            </span>
          ))}
        </div>

        <div className="svc-card-footer">
          <button
            type="button"
            className="svc-card-cta"
            onClick={e => {
              e.stopPropagation()
              onOpen()
            }}
          >
            <span>{t('services.viewWorksCta')}</span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              className="svc-card-cta-arrow"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  )
}

/* ────────────────────────────────────────────────────────────── */
/*  ServicePanel (slide-in drawer)                                */
/* ────────────────────────────────────────────────────────────── */

function ServicePanel({
  service,
  services,
  panelIn,
  lng,
  onClose,
  onServiceChange,
  onWorkOpen,
}: {
  service: ServiceCategory
  services: ServiceCategory[]
  panelIn: boolean
  lng: string
  onClose: () => void
  onServiceChange: (svc: ServiceCategory) => void
  onWorkOpen: (work: PortfolioWork) => void
}) {
  const { t } = useTranslation()
  const activeWorks = service.works.filter(w => w.active)
  const panelRef    = useRef<HTMLDivElement>(null)
  const activeTabRef = useRef<HTMLButtonElement>(null)
  const bodyRef     = useRef<HTMLDivElement>(null)

  useEffect(() => { panelRef.current?.focus() }, [])

  // Scroll active tab into view & reset body scroll on service change
  useEffect(() => {
    activeTabRef.current?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
    bodyRef.current?.scrollTo({ top: 0, behavior: 'instant' })
  }, [service.id])

  return (
    <>
      {/* Backdrop */}
      <div
        className="sp-backdrop"
        style={{ opacity: panelIn ? 1 : 0 }}
        onClick={onClose}
        aria-hidden
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={service.name}
        tabIndex={-1}
        className="sp-panel"
        style={{
          transform: panelIn ? 'translateY(0)' : 'translateY(100%)',
        }}
      >
        {/* Gold accent line at top */}
        <div className="sp-gold-line" aria-hidden />

        {/* ── Header ── */}
        <div className="sp-header">
          <div className="sp-drag-pill" />

          <div className="sp-header-row">
            <button
              type="button"
              onClick={onClose}
              className="sp-back-btn"
              aria-label={t('nav.services')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="size-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
            </button>

            <div className="sp-tabs" role="tablist">
              {services.map(svc => {
                const isActive = svc.id === service.id
                return (
                  <button
                    key={svc.id}
                    ref={isActive ? activeTabRef : undefined}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => !isActive && onServiceChange(svc)}
                    className={`sp-tab ${isActive ? 'sp-tab-active' : ''}`}
                  >
                    {svc.name.split(' ')[0]}
                  </button>
                )
              })}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="sp-close-btn"
              aria-label={t('ui.close')}
            >
              ✕
            </button>
          </div>
        </div>

        {/* ── Scrollable body ── */}
        <div ref={bodyRef} className="sp-body">

          {/* ── Hero ── */}
          <div className="sp-hero">
            <img
              key={service.id}
              src={service.imageUrl}
              alt=""
              className="sp-hero-img"
              style={{ animation: 'panelHeroFade 0.45s ease' }}
            />
            <div className="sp-hero-overlay" />
            <div className="sp-hero-shine" aria-hidden />

            <div className="svc-card-badge" style={{ top: '1.1rem', right: '1.1rem' }}>
              <span className="svc-card-badge-dot" />
              {t('services.workCount', { count: activeWorks.length })}
            </div>

            <div
              key={`title-${service.id}`}
              className="sp-hero-text"
              style={{ animation: 'panelContentFade 0.38s ease' }}
            >
              <p className="sp-hero-kicker">{t('services.panelKind')}</p>
              <h2 className="sp-hero-title">{service.name}</h2>
            </div>
          </div>

          {/* ── Content ── */}
          <div
            key={`body-${service.id}`}
            className="sp-content"
            style={{ animation: 'panelContentFade 0.42s ease' }}
          >

            {/* Left: description + tags */}
            <div className="sp-info">
              <p className="sp-desc">{service.description}</p>

              <div className="sp-scope">
                <p className="sp-scope-label">{t('services.scopeTitle')}</p>
                <div className="svc-card-tags">
                  {service.subServices.map(sub => (
                    <span key={sub.id} className="svc-card-tag">{sub.name}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: works */}
            <div className="sp-works">
              <div className="sp-works-header">
                <p className="sp-works-label">{t('portfolio.title')}</p>
                {activeWorks.length > 0 && (
                  <span className="sp-works-count">{activeWorks.length}</span>
                )}
              </div>

              {activeWorks.length === 0 ? (
                <div className="sp-works-empty">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="size-8 opacity-20">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.16-5.16a2.25 2.25 0 013.18 0l5.16 5.16m-1.5-1.5l1.41-1.41a2.25 2.25 0 013.18 0l2.91 2.91M2.25 19.5h19.5M3.75 4.5h16.5a1.5 1.5 0 011.5 1.5v12a1.5 1.5 0 01-1.5 1.5H3.75a1.5 1.5 0 01-1.5-1.5V6a1.5 1.5 0 011.5-1.5z" />
                  </svg>
                  <p className="text-[0.84rem] text-muted">{t('services.emptyCategory')}</p>
                </div>
              ) : (
                <div className="sp-works-grid">
                  {activeWorks.map(work => (
                    <WorkCard key={work.id} work={work} lng={lng} onClick={() => onWorkOpen(work)} />
                  ))}
                </div>
              )}

              {/* CTA */}
              <div className="sp-cta">
                <div className="sp-cta-inner">
                  <div>
                    <p className="sp-cta-title">{t('services.ctaInterested')}</p>
                    <p className="sp-cta-sub">{t('services.ctaSub')}</p>
                  </div>
                  <a href={WHATSAPP} target="_blank" rel="noreferrer" className="btn-gold">
                    <WaIcon />
                    {t('services.requestQuoteShort')}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes panelHeroFade {
          from { opacity: 0; transform: scale(1.02); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes panelContentFade {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  )
}

/* ────────────────────────────────────────────────────────────── */
/*  WorkCard (inside panel)                                       */
/* ────────────────────────────────────────────────────────────── */

function WorkCard({ work, lng, onClick }: { work: PortfolioWork; lng: string; onClick: () => void }) {
  const { t } = useTranslation()
  const beforeImg = work.images.find(img => img.isBefore === true)
  const afterImg  = work.images.find(img => img.isBefore === false)
  const hasBefore = Boolean(beforeImg && afterImg)
  const dateLabel = formatWorkMonth(work.date, lng)

  return (
    <button
      type="button"
      onClick={onClick}
      className="wc-card group"
    >
      {/* Image area */}
      <div className="wc-img-wrap">
        {hasBefore && beforeImg && afterImg ? (
          <>
            <img src={afterImg.url} alt="" className="wc-img" loading="lazy" draggable={false} />
            <div className="absolute inset-0 overflow-hidden" style={{ clipPath: 'inset(0 50% 0 0)' }}>
              <img src={beforeImg.url} alt="" className="wc-img" loading="lazy" draggable={false} />
            </div>
            <div className="pointer-events-none absolute bottom-0 top-0 z-10" style={{ left: '50%', transform: 'translateX(-50%)' }}>
              <div className="h-full w-px bg-gold/60" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex size-7 items-center justify-center rounded-full border border-gold/70 bg-navy-alt/90 shadow-lg backdrop-blur-sm">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: 11, height: 11, color: 'var(--gold)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l-3 3 3 3m8-6l3 3-3 3" />
                </svg>
              </div>
            </div>
            <span className="wc-label-before">Antes</span>
            <span className="wc-label-after">Depois</span>
          </>
        ) : (
          <img src={work.featuredImageUrl} alt="" className="wc-img" loading="lazy" />
        )}

        <div className="wc-hover-overlay">
          <span className="wc-hover-btn">
            {t('services.viewProject')}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="size-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="wc-body">
        <h4 className="wc-title">{work.title}</h4>
        <div className="wc-meta">
          <span className="wc-date">{dateLabel}</span>
          {hasBefore && <span className="wc-ba-badge">Antes / Depois</span>}
        </div>
      </div>
    </button>
  )
}

/* ────────────────────────────────────────────────────────────── */
/*  WorkModal                                                     */
/* ────────────────────────────────────────────────────────────── */

function WorkModal({
  work,
  serviceName,
  workIn,
  activeImg,
  setActiveImg,
  lng,
  onClose,
}: {
  work: PortfolioWork
  serviceName: string
  workIn: boolean
  activeImg: number
  setActiveImg: (i: number) => void
  lng: string
  onClose: () => void
}) {
  const { t } = useTranslation()
  const images = work.images
  const current = images[activeImg] ?? images[0]
  const stripRef = useRef<HTMLDivElement>(null)

  // Before/after detection
  const beforeImg = useMemo(() => images.find(img => img.isBefore === true), [images])
  const afterImg  = useMemo(() => images.find(img => img.isBefore === false), [images])
  const hasSlider = Boolean(beforeImg && afterImg)
  const [mode, setMode] = useState<'slider' | 'gallery'>(hasSlider ? 'slider' : 'gallery')

  // Reset to slider mode when work changes (if applicable)
  useEffect(() => {
    setMode(hasSlider ? 'slider' : 'gallery')
  }, [work.id, hasSlider])

  useEffect(() => {
    const el = stripRef.current?.children[activeImg] as HTMLElement | undefined
    el?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
  }, [activeImg])

  return (
    <div className="wm-wrapper">
      <div
        className="wm-backdrop"
        style={{ opacity: workIn ? 1 : 0 }}
        onClick={onClose}
        aria-hidden
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={work.title}
        className="wm-dialog"
        style={{
          transform: workIn ? 'translateY(0) scale(1)' : 'translateY(22px) scale(0.97)',
          opacity: workIn ? 1 : 0,
        }}
      >
        {/* Gold top accent */}
        <div className="wm-gold-line" aria-hidden />

        {/* Header */}
        <div className="wm-header">
          <div className="wm-header-text">
            <p className="wm-service-name">{serviceName}</p>
            <h3 className="wm-work-title">{work.title}</h3>
          </div>
          <button type="button" onClick={onClose} className="wm-close" aria-label={t('ui.close')}>
            ✕
          </button>
        </div>

        {/* Mode tabs */}
        {hasSlider && (
          <div className="wm-tabs">
            <button
              type="button"
              onClick={() => setMode('slider')}
              className={`wm-tab ${mode === 'slider' ? 'wm-tab-active' : ''}`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="wm-tab-icon">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l-3 3 3 3m8-6l3 3-3 3" />
              </svg>
              Antes / Depois
            </button>
            <button
              type="button"
              onClick={() => setMode('gallery')}
              className={`wm-tab ${mode === 'gallery' ? 'wm-tab-active' : ''}`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="wm-tab-icon">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              Galeria
            </button>
          </div>
        )}

        {/* Scrollable content */}
        <div className="wm-scroll">

          {/* Slider mode */}
          {mode === 'slider' && hasSlider && beforeImg && afterImg && (
            <>
              <BeforeAfterSlider before={beforeImg} after={afterImg} />

              <div className="wm-content">
                <div className="wm-captions">
                  <div className="wm-caption-col">
                    <p className="wm-caption-label">Antes</p>
                    <p className="wm-caption-text">{beforeImg.caption ?? '—'}</p>
                  </div>
                  <div className="wm-caption-divider" />
                  <div className="wm-caption-col">
                    <p className="wm-caption-label wm-caption-label-gold">Depois</p>
                    <p className="wm-caption-text">{afterImg.caption ?? '—'}</p>
                  </div>
                </div>

                <div className="wm-description">
                  <p className="wm-desc-text">{work.description}</p>
                  <p className="wm-date">{formatWorkMonth(work.date, lng)}</p>
                </div>
              </div>
            </>
          )}

          {/* Gallery mode */}
          {mode === 'gallery' && (
            <>
              <div className="wm-gallery-img">
                <img
                  key={current?.id}
                  src={current?.url}
                  alt={current?.caption ?? work.title}
                  className="size-full object-contain"
                  style={{ animation: 'svcImgFade 0.32s ease' }}
                />

                {current?.isBefore !== undefined && (
                  <span className={`wm-img-badge ${current.isBefore ? 'wm-img-badge-before' : 'wm-img-badge-after'}`}>
                    {current.isBefore ? t('services.before') : t('services.after')}
                  </span>
                )}

                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setActiveImg(Math.max(activeImg - 1, 0))}
                      disabled={activeImg === 0}
                      className="wm-nav-btn wm-nav-prev"
                      aria-label={t('portfolio.prevImage')}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveImg(Math.min(activeImg + 1, images.length - 1))}
                      disabled={activeImg === images.length - 1}
                      className="wm-nav-btn wm-nav-next"
                      aria-label={t('portfolio.nextImage')}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}

                {images.length > 1 && (
                  <span className="wm-img-counter">{activeImg + 1} / {images.length}</span>
                )}
              </div>

              <div className="wm-content">
                {current?.caption && <p className="wm-caption-text" style={{ fontStyle: 'italic' }}>{current.caption}</p>}
                <div className="wm-description">
                  <p className="wm-desc-text">{work.description}</p>
                  <p className="wm-date">{formatWorkMonth(work.date, lng)}</p>
                </div>
              </div>

              {images.length > 1 && (
                <div className="wm-thumbs-section">
                  <p className="wm-thumbs-label">
                    {t('services.galleryThumbs', { count: images.length })}
                  </p>
                  <div
                    ref={stripRef}
                    className="wm-thumbs-strip"
                    role="list"
                    aria-label={t('services.galleryThumbs', { count: images.length })}
                  >
                    {images.map((img, i) => (
                      <ThumbButton
                        key={img.id}
                        img={img}
                        index={i}
                        isActive={i === activeImg}
                        beforeLabel={t('services.before')}
                        afterLabel={t('services.after')}
                        onClick={() => setActiveImg(i)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes svcImgFade {
          from { opacity: 0; transform: scale(1.02); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────── */
/*  ThumbButton                                                   */
/* ────────────────────────────────────────────────────────────── */

function ThumbButton({
  img,
  index,
  isActive,
  beforeLabel,
  afterLabel,
  onClick,
}: {
  img: WorkImage
  index: number
  isActive: boolean
  beforeLabel: string
  afterLabel: string
  onClick: () => void
}) {
  const label = img.caption ?? `Image ${index + 1}`

  return (
    <button
      type="button"
      role="listitem"
      onClick={onClick}
      aria-label={label}
      aria-pressed={isActive}
      className="relative shrink-0 overflow-hidden rounded-lg transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
      style={{
        width: 88,
        height: 62,
        border: isActive ? '2px solid var(--gold)' : '2px solid var(--border)',
        transform: isActive ? 'scale(1.04)' : 'scale(1)',
        opacity: isActive ? 1 : 0.62,
        boxShadow: isActive ? '0 0 0 2px rgba(201,152,58,0.28)' : 'none',
      }}
    >
      <img src={img.url} alt="" className="size-full object-cover" loading="lazy" />

      {img.isBefore !== undefined && (
        <div
          className="absolute bottom-0 left-0 right-0 py-0.5 text-center text-[0.55rem] font-800 uppercase tracking-wide"
          style={{
            background: img.isBefore ? 'rgba(0,0,0,0.78)' : 'rgba(201,152,58,0.78)',
            color: img.isBefore ? 'rgba(255,255,255,0.78)' : '#0d1a27',
          }}
        >
          {img.isBefore ? beforeLabel : afterLabel}
        </div>
      )}
    </button>
  )
}

/* ────────────────────────────────────────────────────────────── */
/*  BeforeAfterSlider                                             */
/* ────────────────────────────────────────────────────────────── */

function BeforeAfterSlider({ before, after }: { before: WorkImage; after: WorkImage }) {
  const [position, setPosition] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)

  const updatePosition = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = Math.min(Math.max(clientX - rect.left, 0), rect.width)
    setPosition((x / rect.width) * 100)
  }, [])

  useEffect(() => {
    const onMove = (e: MouseEvent) => { if (isDragging.current) updatePosition(e.clientX) }
    const onUp = () => { isDragging.current = false }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [updatePosition])

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    isDragging.current = true
    updatePosition(e.clientX)
  }

  const onTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true
    updatePosition(e.touches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return
    updatePosition(e.touches[0].clientX)
  }

  const onTouchEnd = () => { isDragging.current = false }

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden bg-[#030609] select-none"
      style={{ aspectRatio: '16/9', touchAction: 'none', cursor: 'col-resize' }}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* After image — full width, bottom layer */}
      <img
        src={after.url}
        alt={after.caption ?? 'Depois'}
        className="absolute inset-0 size-full object-contain"
        draggable={false}
      />

      {/* Before image — clipped from right */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <img
          src={before.url}
          alt={before.caption ?? 'Antes'}
          className="absolute inset-0 size-full object-contain"
          draggable={false}
        />
      </div>

      {/* Labels */}
      <span
        className="pointer-events-none absolute left-3 top-3 rounded-full border border-border bg-surface-hi/88 px-3 py-1 text-[0.68rem] font-800 uppercase tracking-wide text-muted backdrop-blur-sm"
        style={{ opacity: position > 8 ? 1 : 0, transition: 'opacity 0.15s' }}
      >
        Antes
      </span>
      <span
        className="pointer-events-none absolute right-3 top-3 rounded-full border border-gold-dk bg-[rgba(201,152,58,0.22)] px-3 py-1 text-[0.68rem] font-800 uppercase tracking-wide text-gold backdrop-blur-sm"
        style={{ opacity: position < 92 ? 1 : 0, transition: 'opacity 0.15s' }}
      >
        Depois
      </span>

      {/* Divider line */}
      <div
        className="pointer-events-none absolute bottom-0 top-0 w-px bg-gold/80"
        style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
      />

      {/* Drag handle */}
      <div
        className="pointer-events-none absolute top-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-gold bg-navy-alt shadow-[0_4px_20px_rgba(0,0,0,0.6)]"
        style={{ left: `${position}%` }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" style={{ width: 18, height: 18, color: 'var(--gold)' }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l-3 3 3 3m8-6l3 3-3 3" />
        </svg>
      </div>

      {/* Hint text on first load */}
      <div
        className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-navy-alt/88 px-3 py-1 text-[0.65rem] font-600 text-muted backdrop-blur-sm"
        style={{ whiteSpace: 'nowrap' }}
      >
        ← Arraste para comparar →
      </div>
    </div>
  )
}

function WaIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}
