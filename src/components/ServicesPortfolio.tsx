import { useState, useEffect, useCallback, useRef } from 'react'
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
      <section id="services" className="section section-alt relative overflow-hidden" aria-labelledby="services-heading">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_55%_at_50%_-8%,rgba(201,152,58,0.14),transparent_52%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-24 top-1/3 h-72 w-72 rounded-full bg-gold/5 blur-3xl"
          aria-hidden
        />
        <div className="page-wrap relative">
          <div className="section-header max-w-[56rem]">
            <p className="eyebrow">{t('nav.services')}</p>
            <h2 id="services-heading" className="section-title">
              {t('services.title')}
            </h2>
            <p className="section-sub services-lead">{t('services.catalogLead')}</p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-7">
            {sorted.map((svc, i) => (
              <ServiceCard key={svc.id} service={svc} index={i} onOpen={() => openService(svc)} />
            ))}
          </div>

          <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              to="/trabalhos"
              className="inline-flex items-center gap-2 rounded-full border border-border-hi bg-surface/60 px-6 py-3 text-[0.84rem] font-700 text-muted backdrop-blur-sm transition-all duration-200 hover:border-gold-dk hover:bg-[rgba(201,152,58,0.08)] hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-2"
            >
              {t('portfolio.allWorksCompleted')}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="size-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {(view === 'service' || view === 'work') && selectedService && (
        <ServicePanel
          service={selectedService}
          panelIn={panelIn}
          lng={i18n.language}
          onClose={closeService}
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

  return (
    <article
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-[1.2rem] border border-border/95 bg-surface/90 shadow-[0_24px_72px_-34px_rgba(0,0,0,0.75)] ring-1 ring-white/[0.04] transition-all duration-300 hover:-translate-y-1 hover:border-gold-dk/80 hover:shadow-[0_28px_90px_-26px_rgba(201,152,58,0.16),0_10px_32px_-16px_rgba(0,0,0,0.52)]"
      style={{ animationDelay: `${index * 70}ms` }}
      onClick={onOpen}
      tabIndex={0}
      role="button"
      aria-label={`${t('services.learnMore')}: ${service.name}`}
      onKeyDown={e => e.key === 'Enter' && onOpen()}
    >
      <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
        <img
          src={service.imageUrl}
          alt=""
          className="size-full object-cover transition-transform duration-[650ms] ease-out group-hover:scale-[1.06]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050a10]/96 via-[#0d1a27]/35 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/35 to-transparent opacity-80" />

        <div className="absolute right-3.5 top-3.5">
          <span className="flex items-center gap-1.5 rounded-full border border-gold-dk/60 bg-[rgba(8,14,22,0.72)] px-3 py-1.5 text-[0.65rem] font-800 uppercase tracking-[0.12em] text-gold backdrop-blur-md">
            {t('services.workCount', { count: activeWorks })}
          </span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
          <h3 className="font-[var(--font-display)] text-[1.38rem] font-700 leading-[1.14] text-white transition-colors duration-200 group-hover:text-gold-lt sm:text-[1.5rem]">
            {service.name}
          </h3>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 border-t border-border/80 bg-[linear-gradient(180deg,rgba(19,33,51,0.98)_0%,rgba(13,26,39,0.99)_100%)] p-5 sm:p-6">
        <p className="line-clamp-2 text-[0.85rem] leading-[1.7] text-muted">{service.description}</p>

        <div className="flex flex-wrap gap-1.5">
          {service.subServices.map(sub => (
            <span key={sub.id} className="rounded-full border border-border-hi/90 bg-navy-alt/80 px-2.5 py-1 text-[0.64rem] font-700 uppercase tracking-[0.08em] text-dim">
              {sub.name}
            </span>
          ))}
        </div>

        <button
          type="button"
          className="group/cta mt-auto flex items-center gap-2 self-start rounded-md text-[0.82rem] font-800 text-gold transition-colors hover:text-gold-lt focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-2"
          onClick={e => {
            e.stopPropagation()
            onOpen()
          }}
        >
          {t('services.viewWorksCta')}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            className="size-3.5 transition-transform duration-200 group-hover/cta:translate-x-1"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </button>
      </div>
    </article>
  )
}

function ServicePanel({
  service,
  panelIn,
  lng,
  onClose,
  onWorkOpen,
}: {
  service: ServiceCategory
  panelIn: boolean
  lng: string
  onClose: () => void
  onWorkOpen: (work: PortfolioWork) => void
}) {
  const { t } = useTranslation()
  const activeWorks = service.works.filter(w => w.active)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    panelRef.current?.focus()
  }, [])

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-[rgba(3,8,14,0.78)] backdrop-blur-[4px]"
        style={{ opacity: panelIn ? 1 : 0, transition: 'opacity 0.36s ease' }}
        onClick={onClose}
        aria-hidden
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={service.name}
        tabIndex={-1}
        className="fixed bottom-0 right-0 top-0 z-50 flex flex-col bg-navy-alt outline-none"
        style={{
          width: 'min(760px, 100vw)',
          borderLeft: '1px solid var(--border)',
          boxShadow: '-28px 0 100px rgba(0,0,0,0.55), inset 3px 0 0 rgba(201,152,58,0.22)',
          transform: panelIn ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.38s cubic-bezier(0.32, 0.72, 0, 1)',
        }}
      >
        <div className="sticky top-0 z-10 flex shrink-0 items-center justify-between gap-4 border-b border-border bg-navy-alt/95 px-5 py-3.5 backdrop-blur-md sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 rounded-md text-[0.8rem] font-700 text-muted transition-colors hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            {t('services.backAll')}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex size-9 items-center justify-center rounded-full border border-border-hi text-muted transition-colors hover:border-gold-dk hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
            aria-label={t('ui.close')}
          >
            ✕
          </button>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto overscroll-contain">
          <div className="relative shrink-0 overflow-hidden" style={{ aspectRatio: '20/8' }}>
            <img src={service.imageUrl} alt="" className="size-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-alt via-navy-alt/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 px-6 pb-5 sm:px-8 sm:pb-6">
              <p className="mb-1.5 text-[0.65rem] font-800 uppercase tracking-[0.24em] text-gold">
                {t('services.panelKind')}
              </p>
              <h2 className="font-[var(--font-display)] text-[1.85rem] font-700 leading-tight text-white sm:text-[2.15rem]">
                {service.name}
              </h2>
            </div>
          </div>

          <div className="flex flex-col gap-7 px-6 py-7 sm:px-8 sm:py-8">
            <p className="border-l-2 border-gold pl-4 text-[0.9rem] leading-[1.8] text-muted">{service.description}</p>

            <div>
              <p className="mb-3 text-[0.64rem] font-800 uppercase tracking-[0.22em] text-gold">
                {t('services.scopeTitle')}
              </p>
              <div className="flex flex-wrap gap-2">
                {service.subServices.map(sub => (
                  <span
                    key={sub.id}
                    className="rounded-full border border-border-hi bg-surface px-3 py-1.5 text-[0.78rem] font-600 text-muted"
                  >
                    {sub.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-border-hi to-transparent" />

            <div>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-[0.64rem] font-800 uppercase tracking-[0.22em] text-gold">
                  {t('portfolio.title')}
                </p>
                <span className="text-[0.76rem] font-600 text-dim">
                  {t('services.projectCount', { count: activeWorks.length })}
                </span>
              </div>

              {activeWorks.length === 0 ? (
                <div className="flex flex-col items-center gap-3 rounded-[1.05rem] border border-dashed border-border-hi/80 bg-surface/40 py-14 text-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="size-9 opacity-30">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 15.75l5.16-5.16a2.25 2.25 0 013.18 0l5.16 5.16m-1.5-1.5l1.41-1.41a2.25 2.25 0 013.18 0l2.91 2.91M2.25 19.5h19.5M3.75 4.5h16.5a1.5 1.5 0 011.5 1.5v12a1.5 1.5 0 01-1.5 1.5H3.75a1.5 1.5 0 01-1.5-1.5V6a1.5 1.5 0 011.5-1.5z"
                    />
                  </svg>
                  <p className="max-w-[28ch] text-[0.86rem] text-muted">{t('services.emptyCategory')}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                  {activeWorks.map(work => (
                    <WorkCard key={work.id} work={work} lng={lng} onClick={() => onWorkOpen(work)} />
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-[1.05rem] border border-border-hi/90 bg-[linear-gradient(145deg,rgba(26,45,68,0.55)_0%,rgba(13,26,39,0.9)_100%)] p-6 text-center shadow-inner">
              <p className="mb-1 text-[0.98rem] font-800 text-body">{t('services.ctaInterested')}</p>
              <p className="mb-5 text-[0.82rem] leading-relaxed text-muted">{t('services.ctaSub')}</p>
              <a href={WHATSAPP} target="_blank" rel="noreferrer" className="btn-gold">
                <WaIcon />
                {t('services.requestQuoteShort')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function WorkCard({ work, lng, onClick }: { work: PortfolioWork; lng: string; onClick: () => void }) {
  const { t } = useTranslation()
  const hasBefore = work.images.some(img => img.isBefore)
  const dateLabel = formatWorkMonth(work.date, lng)

  return (
    <button
      type="button"
      onClick={onClick}
      className="group overflow-hidden rounded-[1rem] border border-border bg-navy text-left transition-all duration-250 hover:-translate-y-0.5 hover:border-gold-dk hover:shadow-[0_10px_30px_rgba(201,152,58,0.1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
    >
      <div className="relative overflow-hidden" style={{ aspectRatio: '3/2' }}>
        <img
          src={work.featuredImageUrl}
          alt=""
          className="size-full object-cover transition-transform duration-[520ms] group-hover:scale-[1.07]"
          loading="lazy"
        />
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 to-transparent p-3.5 opacity-0 transition-opacity duration-250 group-hover:opacity-100">
          <span className="flex items-center gap-1.5 text-[0.72rem] font-700 text-white/90">
            {t('services.viewProject')}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </span>
        </div>
        {hasBefore && (
          <span className="absolute left-2.5 top-2.5 rounded-full border border-border bg-surface-hi/92 px-2 py-0.5 text-[0.62rem] font-800 uppercase tracking-wide text-muted backdrop-blur-sm">
            {t('services.beforeAfter')}
          </span>
        )}
      </div>

      <div className="p-3.5 sm:p-4">
        <h4 className="mb-1 line-clamp-2 text-[0.9rem] font-800 leading-snug text-body transition-colors duration-200 group-hover:text-gold">
          {work.title}
        </h4>
        <p className="text-[0.72rem] capitalize text-dim">{dateLabel}</p>
      </div>
    </button>
  )
}

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

  useEffect(() => {
    const el = stripRef.current?.children[activeImg] as HTMLElement | undefined
    el?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
  }, [activeImg])

  return (
    <div
      className="fixed inset-0 z-[55] flex items-end justify-center sm:items-center"
      style={{ padding: 'clamp(0px, 3vw, 24px)' }}
    >
      <div
        className="absolute inset-0 bg-[rgba(2,6,12,0.88)] backdrop-blur-md"
        style={{ opacity: workIn ? 1 : 0, transition: 'opacity 0.28s ease' }}
        onClick={onClose}
        aria-hidden
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={work.title}
        className="relative z-10 flex max-h-[94vh] flex-col overflow-hidden bg-navy-alt"
        style={{
          width: 'min(880px, 100%)',
          borderRadius: 'clamp(0.75rem, 2vw, 1.45rem)',
          border: '1px solid var(--border-hi)',
          boxShadow: '0 36px 120px rgba(0,0,0,0.72), 0 0 0 1px rgba(201,152,58,0.08)',
          transform: workIn ? 'translateY(0) scale(1)' : 'translateY(22px) scale(0.97)',
          opacity: workIn ? 1 : 0,
          transition: 'transform 0.34s cubic-bezier(0.34, 1.35, 0.64, 1), opacity 0.26s ease',
        }}
      >
        <div className="flex shrink-0 items-start gap-3 border-b border-border px-5 py-4 sm:px-6">
          <div className="min-w-0 flex-1">
            <p className="mb-0.5 text-[0.64rem] font-800 uppercase tracking-[0.2em] text-gold">{serviceName}</p>
            <h3 className="text-[1.02rem] font-800 leading-snug text-body">{work.title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border-hi text-sm text-muted transition-colors hover:border-gold-dk hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
            aria-label={t('ui.close')}
          >
            ✕
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <div className="relative shrink-0 overflow-hidden bg-[#030609]" style={{ aspectRatio: '16/9' }}>
            <img
              key={current?.id}
              src={current?.url}
              alt={current?.caption ?? work.title}
              className="size-full object-contain"
              style={{ animation: 'svcImgFade 0.32s ease' }}
            />

            {current?.isBefore !== undefined && (
              <span
                className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[0.68rem] font-800 uppercase tracking-wide backdrop-blur-sm ${
                  current.isBefore
                    ? 'border border-border bg-surface-hi/88 text-muted'
                    : 'border border-gold-dk bg-[rgba(201,152,58,0.22)] text-gold'
                }`}
              >
                {current.isBefore ? t('services.before') : t('services.after')}
              </span>
            )}

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setActiveImg(Math.max(activeImg - 1, 0))}
                  disabled={activeImg === 0}
                  className="absolute left-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-border-hi bg-navy-alt/85 text-muted backdrop-blur-sm transition-all hover:border-gold-dk hover:text-gold disabled:cursor-not-allowed disabled:opacity-25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
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
                  className="absolute right-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-border-hi bg-navy-alt/85 text-muted backdrop-blur-sm transition-all hover:border-gold-dk hover:text-gold disabled:cursor-not-allowed disabled:opacity-25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
                  aria-label={t('portfolio.nextImage')}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {images.length > 1 && (
              <span className="absolute bottom-3 right-3 rounded-full bg-navy-alt/88 px-2.5 py-1 text-[0.68rem] font-700 text-muted backdrop-blur-sm">
                {activeImg + 1} / {images.length}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-3 px-6 py-5">
            {current?.caption && <p className="text-[0.74rem] italic text-dim">{current.caption}</p>}
            <p className="text-[0.88rem] leading-relaxed text-muted">{work.description}</p>
            <p className="text-[0.73rem] capitalize text-dim">{formatWorkMonth(work.date, lng)}</p>
          </div>

          {images.length > 1 && (
            <div className="px-6 pb-6">
              <p className="mb-3 text-[0.62rem] font-800 uppercase tracking-[0.2em] text-dim">
                {t('services.galleryThumbs', { count: images.length })}
              </p>
              <div
                ref={stripRef}
                className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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

function WaIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}
