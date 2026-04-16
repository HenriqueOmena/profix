import { useState, useEffect, useCallback, useRef } from 'react'
import { SERVICES } from '../data/services'
import type { ServiceCategory, PortfolioWork, WorkImage } from '../data/services'

const WHATSAPP = 'https://wa.me/351936284583'

/* ─── View state machine ─────────────────────────────────── */
type View = 'catalog' | 'service' | 'work'

/* ─── Root component ─────────────────────────────────────── */
export default function ServicesPortfolio() {
  const [view,            setView]           = useState<View>('catalog')
  const [selectedService, setSelectedService] = useState<ServiceCategory | null>(null)
  const [selectedWork,    setSelectedWork]    = useState<PortfolioWork | null>(null)
  const [activeImg,       setActiveImg]       = useState(0)

  // Animated-in flags (set 1 frame after mount so CSS transitions fire)
  const [panelIn, setPanelIn] = useState(false)
  const [workIn,  setWorkIn]  = useState(false)

  const openService = useCallback((svc: ServiceCategory) => {
    setSelectedService(svc)
    setView('service')
    requestAnimationFrame(() => requestAnimationFrame(() => setPanelIn(true)))
  }, [])

  const closeService = useCallback(() => {
    setPanelIn(false)
    setTimeout(() => { setView('catalog'); setSelectedService(null) }, 360)
  }, [])

  const openWork = useCallback((work: PortfolioWork) => {
    setSelectedWork(work)
    setActiveImg(0)
    setView('work')
    requestAnimationFrame(() => requestAnimationFrame(() => setWorkIn(true)))
  }, [])

  const closeWork = useCallback(() => {
    setWorkIn(false)
    setTimeout(() => { setView('service'); setSelectedWork(null) }, 300)
  }, [])

  // Keyboard nav
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (view === 'work') closeWork()
        else if (view === 'service') closeService()
      }
      if (view === 'work' && selectedWork) {
        const imgs = selectedWork.images
        if (e.key === 'ArrowRight') setActiveImg(i => Math.min(i + 1, imgs.length - 1))
        if (e.key === 'ArrowLeft')  setActiveImg(i => Math.max(i - 1, 0))
      }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [view, selectedWork, closeWork, closeService])

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = view !== 'catalog' ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [view])

  const sorted = [...SERVICES].filter(s => s.active).sort((a, b) => a.order - b.order)

  return (
    <>
      {/* ── Catalog section ─────────────────────────────── */}
      <section id="services" className="section section-alt">
        <div className="page-wrap">
          <div className="section-header">
            <p className="eyebrow">Serviços</p>
            <h2 className="section-title">O que fazemos</h2>
            <p className="section-sub">
              Quatro áreas de especialização para todas as necessidades do seu imóvel na Madeira.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {sorted.map((svc, i) => (
              <ServiceCard key={svc.id} service={svc} index={i} onOpen={() => openService(svc)} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Service detail panel ─────────────────────────── */}
      {(view === 'service' || view === 'work') && selectedService && (
        <ServicePanel
          service={selectedService}
          panelIn={panelIn}
          onClose={closeService}
          onWorkOpen={openWork}
        />
      )}

      {/* ── Work detail modal ────────────────────────────── */}
      {view === 'work' && selectedWork && (
        <WorkModal
          work={selectedWork}
          serviceName={selectedService?.name ?? ''}
          workIn={workIn}
          activeImg={activeImg}
          setActiveImg={setActiveImg}
          onClose={closeWork}
        />
      )}
    </>
  )
}

/* ─── ServiceCard ────────────────────────────────────────── */
function ServiceCard({
  service,
  index,
  onOpen,
}: {
  service: ServiceCategory
  index: number
  onOpen: () => void
}) {
  const activeWorks = service.works.filter(w => w.active).length

  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-[1.25rem]
                 border border-border bg-surface cursor-pointer
                 transition-all duration-300
                 hover:border-gold-dk hover:-translate-y-1
                 hover:shadow-[0_12px_48px_rgba(201,152,58,0.10),0_2px_8px_rgba(0,0,0,0.4)]"
      style={{ animationDelay: `${index * 90}ms` }}
      onClick={onOpen}
      tabIndex={0}
      role="button"
      aria-label={`Ver detalhes: ${service.name}`}
      onKeyDown={e => e.key === 'Enter' && onOpen()}
    >
      {/* ── Image hero ────────────────────────────────────── */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
        <img
          src={service.imageUrl}
          alt={service.name}
          className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
          loading="lazy"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#060f18]/95 via-[#060f18]/25 to-transparent" />

        {/* Works count pill */}
        <div className="absolute top-3.5 right-3.5">
          <span className="flex items-center gap-1.5 rounded-full border border-gold-dk
                           bg-[rgba(201,152,58,0.15)] px-3 py-1 backdrop-blur-sm">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
              className="size-3 text-gold">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M2.25 15.75l5.16-5.16a2.25 2.25 0 013.18 0l5.16 5.16m-1.5-1.5l1.41-1.41a2.25 2.25 0 013.18 0l2.91 2.91" />
            </svg>
            <span className="text-[0.65rem] font-700 uppercase tracking-wide text-gold">
              {activeWorks} trabalho{activeWorks !== 1 ? 's' : ''}
            </span>
          </span>
        </div>

        {/* Service name on image */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="font-[var(--font-display,_'Cormorant_Garamond',_serif)]
                         text-[1.45rem] font-700 leading-tight text-white
                         transition-colors duration-200 group-hover:text-gold-lt">
            {service.name}
          </h3>
        </div>
      </div>

      {/* ── Card body ─────────────────────────────────────── */}
      <div className="flex flex-1 flex-col gap-4 p-5">
        <p className="text-[0.84rem] leading-relaxed text-muted line-clamp-2">
          {service.description}
        </p>

        {/* Sub-service chips */}
        <div className="flex flex-wrap gap-1.5">
          {service.subServices.map(sub => (
            <span
              key={sub.id}
              className="rounded-full border border-border-hi bg-navy
                         px-2.5 py-0.5 text-[0.67rem] font-600 text-dim"
            >
              {sub.name}
            </span>
          ))}
        </div>

        {/* CTA link */}
        <button
          type="button"
          className="group/cta mt-auto flex items-center gap-2 self-start
                     text-[0.82rem] font-700 text-gold transition-colors
                     hover:text-gold-lt focus-visible:outline focus-visible:outline-2
                     focus-visible:outline-gold focus-visible:outline-offset-2 rounded"
          onClick={e => { e.stopPropagation(); onOpen() }}
        >
          Trabalhos Realizados
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
            className="size-3.5 transition-transform duration-200 group-hover/cta:translate-x-0.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </button>
      </div>
    </article>
  )
}

/* ─── ServicePanel ───────────────────────────────────────── */
function ServicePanel({
  service,
  panelIn,
  onClose,
  onWorkOpen,
}: {
  service: ServiceCategory
  panelIn: boolean
  onClose: () => void
  onWorkOpen: (work: PortfolioWork) => void
}) {
  const activeWorks = service.works.filter(w => w.active)
  const panelRef = useRef<HTMLDivElement>(null)

  // Focus trap on open
  useEffect(() => {
    panelRef.current?.focus()
  }, [])

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-[rgba(4,9,16,0.72)] backdrop-blur-[3px]"
        style={{
          opacity: panelIn ? 1 : 0,
          transition: 'opacity 0.36s ease',
        }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={service.name}
        tabIndex={-1}
        className="fixed right-0 top-0 bottom-0 z-50 flex flex-col
                   bg-navy-alt outline-none"
        style={{
          width: 'min(700px, 100vw)',
          borderLeft: '1px solid var(--border)',
          transform: panelIn ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.36s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '-24px 0 80px rgba(0,0,0,0.5)',
        }}
      >
        {/* ── Sticky header ─────────────────────────────────── */}
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4
                        border-b border-border bg-navy-alt/96 px-6 py-3.5 backdrop-blur-sm shrink-0">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-[0.8rem] font-600 text-muted
                       hover:text-gold transition-colors focus-visible:outline
                       focus-visible:outline-2 focus-visible:outline-gold rounded"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              className="size-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Todos os serviços
          </button>

          <button
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-full
                       border border-border-hi text-muted text-sm
                       hover:border-gold-dk hover:text-gold transition-colors
                       focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
            aria-label="Fechar"
          >✕</button>
        </div>

        {/* ── Scrollable body ───────────────────────────────── */}
        <div className="flex flex-col overflow-y-auto flex-1">

          {/* Service hero image */}
          <div className="relative overflow-hidden shrink-0" style={{ aspectRatio: '21/9' }}>
            <img
              src={service.imageUrl}
              alt={service.name}
              className="size-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-alt/80 via-navy-alt/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 px-7 pb-5">
              <p className="text-[0.65rem] font-700 uppercase tracking-[0.22em] text-gold mb-1.5">
                Serviço
              </p>
              <h2 className="font-[var(--font-display,_'Cormorant_Garamond',_serif)]
                             text-[2.1rem] font-700 leading-tight text-white">
                {service.name}
              </h2>
            </div>
          </div>

          {/* Body content */}
          <div className="flex flex-col gap-7 px-7 py-7">

            {/* Description */}
            <p className="text-[0.9rem] leading-[1.8] text-muted border-l-2 border-gold-dk pl-4">
              {service.description}
            </p>

            {/* Sub-services */}
            <div>
              <p className="text-[0.64rem] font-700 uppercase tracking-[0.22em] text-gold mb-3">
                O que fazemos
              </p>
              <div className="flex flex-wrap gap-2">
                {service.subServices.map(sub => (
                  <span
                    key={sub.id}
                    className="rounded-full border border-border-hi bg-surface
                               px-3 py-1 text-[0.76rem] font-600 text-muted"
                  >
                    {sub.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-border" />

            {/* Works section */}
            <div>
              <div className="flex items-center justify-between gap-4 mb-5">
                <p className="text-[0.64rem] font-700 uppercase tracking-[0.22em] text-gold">
                  Trabalhos Realizados
                </p>
                <span className="text-[0.73rem] text-dim">
                  {activeWorks.length} projecto{activeWorks.length !== 1 ? 's' : ''}
                </span>
              </div>

              {activeWorks.length === 0 ? (
                <div className="flex flex-col items-center gap-3 rounded-[1rem]
                                border border-dashed border-border py-12 text-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"
                    className="size-8 opacity-25">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M2.25 15.75l5.16-5.16a2.25 2.25 0 013.18 0l5.16 5.16m-1.5-1.5l1.41-1.41a2.25 2.25 0 013.18 0l2.91 2.91M2.25 19.5h19.5M3.75 4.5h16.5a1.5 1.5 0 011.5 1.5v12a1.5 1.5 0 01-1.5 1.5H3.75a1.5 1.5 0 01-1.5-1.5V6a1.5 1.5 0 011.5-1.5z" />
                  </svg>
                  <p className="text-[0.84rem] text-muted">
                    Trabalhos em breve nesta categoria.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {activeWorks.map(work => (
                    <WorkCard key={work.id} work={work} onClick={() => onWorkOpen(work)} />
                  ))}
                </div>
              )}
            </div>

            {/* WhatsApp CTA */}
            <div className="rounded-[1rem] border border-border bg-surface p-6 text-center">
              <p className="mb-1 text-[0.95rem] font-700 text-body">
                Interessado neste serviço?
              </p>
              <p className="mb-5 text-[0.82rem] text-muted">
                Orçamento gratuito, sem compromisso. Resposta em 24 h.
              </p>
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noreferrer"
                className="btn-gold"
              >
                <WaIcon />
                Pedir orçamento
              </a>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

/* ─── WorkCard (inside service panel) ───────────────────── */
function WorkCard({ work, onClick }: { work: PortfolioWork; onClick: () => void }) {
  const hasBefore = work.images.some(img => img.isBefore)
  const dateLabel = formatDate(work.date)

  return (
    <button
      type="button"
      onClick={onClick}
      className="group text-left overflow-hidden rounded-[1rem]
                 border border-border bg-navy
                 transition-all duration-250
                 hover:border-gold-dk hover:-translate-y-0.5
                 hover:shadow-[0_6px_24px_rgba(201,152,58,0.10)]
                 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
    >
      {/* Featured image */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '3/2' }}>
        <img
          src={work.featuredImageUrl}
          alt={work.title}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
          loading="lazy"
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-end p-3.5
                        bg-gradient-to-t from-black/65 to-transparent
                        opacity-0 group-hover:opacity-100 transition-opacity duration-250">
          <span className="text-[0.7rem] font-600 text-white/80 flex items-center gap-1">
            Ver projecto
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              className="size-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </span>
        </div>
        {/* Before/after badge */}
        {hasBefore && (
          <span className="absolute top-2.5 left-2.5 rounded-full
                           border border-border bg-surface-hi/90 px-2 py-0.5
                           text-[0.62rem] font-700 text-muted backdrop-blur-sm">
            Antes / Depois
          </span>
        )}
      </div>

      {/* Text */}
      <div className="p-4">
        <h4 className="mb-1 text-[0.88rem] font-700 leading-snug text-body
                       line-clamp-2 group-hover:text-gold transition-colors duration-200">
          {work.title}
        </h4>
        <p className="text-[0.72rem] text-dim capitalize">{dateLabel}</p>
      </div>
    </button>
  )
}

/* ─── WorkModal ──────────────────────────────────────────── */
function WorkModal({
  work,
  serviceName,
  workIn,
  activeImg,
  setActiveImg,
  onClose,
}: {
  work: PortfolioWork
  serviceName: string
  workIn: boolean
  activeImg: number
  setActiveImg: (i: number) => void
  onClose: () => void
}) {
  const images   = work.images
  const current  = images[activeImg] ?? images[0]
  const stripRef = useRef<HTMLDivElement>(null)

  // Scroll active thumb into view
  useEffect(() => {
    const el = stripRef.current?.children[activeImg] as HTMLElement | undefined
    el?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
  }, [activeImg])

  return (
    <div
      className="fixed inset-0 z-[55] flex items-end sm:items-center justify-center"
      style={{ padding: 'clamp(0px, 3vw, 24px)' }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[rgba(4,8,14,0.88)] backdrop-blur-md"
        style={{ opacity: workIn ? 1 : 0, transition: 'opacity 0.28s ease' }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={work.title}
        className="relative z-10 flex flex-col overflow-hidden bg-navy-alt"
        style={{
          width: 'min(860px, 100%)',
          maxHeight: '94vh',
          borderRadius: 'clamp(0.75rem, 2vw, 1.5rem)',
          border: '1px solid var(--border-hi)',
          boxShadow: '0 32px 96px rgba(0,0,0,0.65), 0 2px 8px rgba(0,0,0,0.5)',
          transform: workIn ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.96)',
          opacity: workIn ? 1 : 0,
          transition: 'transform 0.32s cubic-bezier(0.34,1.4,0.64,1), opacity 0.26s ease',
        }}
      >
        {/* ── Modal header ──────────────────────────────────── */}
        <div className="flex items-start gap-3 border-b border-border px-5 py-4 shrink-0">
          <div className="flex-1 min-w-0">
            <p className="text-[0.64rem] font-700 uppercase tracking-[0.2em] text-gold mb-0.5">
              {serviceName}
            </p>
            <h3 className="text-[1rem] font-700 leading-snug text-body">
              {work.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 flex size-8 items-center justify-center rounded-full
                       border border-border-hi text-sm text-muted
                       hover:border-gold-dk hover:text-gold transition-colors
                       focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
            aria-label="Fechar"
          >✕</button>
        </div>

        {/* ── Scrollable content ────────────────────────────── */}
        <div className="flex flex-col overflow-y-auto flex-1">

          {/* Featured image */}
          <div
            className="relative overflow-hidden bg-[#030609] shrink-0"
            style={{ aspectRatio: '16/9' }}
          >
            <img
              key={current?.id}
              src={current?.url}
              alt={current?.caption ?? work.title}
              className="size-full object-contain"
              style={{ animation: 'imgFadeIn 0.3s ease' }}
            />

            {/* Before / Depois badge */}
            {current?.isBefore !== undefined && (
              <span
                className={`absolute top-3 left-3 rounded-full px-3 py-1
                             text-[0.68rem] font-700 uppercase tracking-wide backdrop-blur-sm
                             border ${current.isBefore
                              ? 'border-border bg-surface-hi/85 text-muted'
                              : 'border-gold-dk bg-[rgba(201,152,58,0.2)] text-gold'
                            }`}
              >
                {current.isBefore ? 'Antes' : 'Depois'}
              </span>
            )}

            {/* Prev / Next arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImg(Math.max(activeImg - 1, 0))}
                  disabled={activeImg === 0}
                  className="absolute left-3 top-1/2 -translate-y-1/2 flex size-9 items-center justify-center
                             rounded-full border border-border-hi bg-navy-alt/80 backdrop-blur-sm
                             text-muted hover:text-gold hover:border-gold-dk transition-all
                             disabled:opacity-20 disabled:cursor-not-allowed
                             focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
                  aria-label="Imagem anterior"
                  type="button"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    className="size-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => setActiveImg(Math.min(activeImg + 1, images.length - 1))}
                  disabled={activeImg === images.length - 1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex size-9 items-center justify-center
                             rounded-full border border-border-hi bg-navy-alt/80 backdrop-blur-sm
                             text-muted hover:text-gold hover:border-gold-dk transition-all
                             disabled:opacity-20 disabled:cursor-not-allowed
                             focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
                  aria-label="Próxima imagem"
                  type="button"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    className="size-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Image counter */}
            {images.length > 1 && (
              <span className="absolute bottom-3 right-3 rounded-full bg-navy-alt/80
                               px-2.5 py-1 text-[0.68rem] font-600 text-muted backdrop-blur-sm">
                {activeImg + 1} / {images.length}
              </span>
            )}
          </div>

          {/* Caption + description */}
          <div className="px-6 py-5 flex flex-col gap-3">
            {current?.caption && (
              <p className="text-[0.74rem] italic text-dim">{current.caption}</p>
            )}
            <p className="text-[0.88rem] leading-relaxed text-muted">{work.description}</p>
            <p className="text-[0.73rem] text-dim capitalize">{formatDate(work.date)}</p>
          </div>

          {/* ── Thumbnail strip ───────────────────────────── */}
          {images.length > 1 && (
            <div className="px-6 pb-6">
              <p className="text-[0.62rem] font-700 uppercase tracking-[0.2em] text-dim mb-3">
                Galeria · {images.length} imagens
              </p>
              <div
                ref={stripRef}
                className="flex gap-2 overflow-x-auto pb-1"
                style={{ scrollbarWidth: 'none' }}
                role="list"
                aria-label="Miniaturas"
              >
                {images.map((img, i) => (
                  <ThumbButton
                    key={img.id}
                    img={img}
                    index={i}
                    isActive={i === activeImg}
                    onClick={() => setActiveImg(i)}
                  />
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Keyframe for image crossfade */}
      <style>{`
        @keyframes imgFadeIn {
          from { opacity: 0; transform: scale(1.02); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}

/* ─── ThumbButton ────────────────────────────────────────── */
function ThumbButton({
  img,
  index,
  isActive,
  onClick,
}: {
  img: WorkImage
  index: number
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      role="listitem"
      onClick={onClick}
      aria-label={img.caption ?? `Imagem ${index + 1}`}
      aria-pressed={isActive}
      className="relative shrink-0 overflow-hidden rounded-lg transition-all duration-200
                 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
      style={{
        width: 88,
        height: 62,
        border: isActive
          ? '2px solid var(--gold)'
          : '2px solid var(--border)',
        transform: isActive ? 'scale(1.04)' : 'scale(1)',
        opacity: isActive ? 1 : 0.6,
        boxShadow: isActive ? '0 0 0 2px rgba(201,152,58,0.25)' : 'none',
      }}
    >
      <img src={img.url} alt={img.caption ?? ''} className="size-full object-cover" loading="lazy" />

      {/* Before / Depois label */}
      {img.isBefore !== undefined && (
        <div
          className="absolute bottom-0 left-0 right-0 py-0.5 text-center
                     text-[0.55rem] font-700 uppercase tracking-wide"
          style={{
            background: img.isBefore ? 'rgba(0,0,0,0.75)' : 'rgba(201,152,58,0.75)',
            color: img.isBefore ? 'rgba(255,255,255,0.72)' : '#0d1a27',
          }}
        >
          {img.isBefore ? 'Antes' : 'Depois'}
        </div>
      )}
    </button>
  )
}

/* ─── Helpers ────────────────────────────────────────────── */
function formatDate(date: string) {
  return new Date(`${date}-01`).toLocaleDateString('pt-PT', {
    month: 'long',
    year: 'numeric',
  })
}

function WaIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}
