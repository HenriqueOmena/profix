import React, { useCallback, useEffect, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent, KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import './i18n'

/* ─── Types ──────────────────────────────────────────────── */
type Locale = 'pt' | 'en' | 'de' | 'fr'

type WorkItem = {
  id: string
  title: string
  description: string
  imageData: string
}

type ServiceItem = {
  id: string
  name: string
  description: string
  works: WorkItem[]
}

/* ─── CDN Images ─────────────────────────────────────────── */
const CDN = 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663329997620'
const IMG = {
  hero:       `${CDN}/wLsmmQYLwyBEYZJG.jpg`,
  texture:    `${CDN}/DeCvLWFEBkSqRGsb.jpg`,
  about:      `${CDN}/miQnEEeDSmiFYpgB.jpeg`,   // portrait renovation photo
  repairs:    `${CDN}/oZepugZbFecnMfPJ.jpg`,
  painting:   `${CDN}/zWxKZUbnJcQsUoHq.jpg`,
  renovation: `${CDN}/CHCgVzpzvYOasoJp.jpeg`,
  engineering:`${CDN}/wLsmmQYLwyBEYZJG.jpg`,
  portfolio2: `${CDN}/miQnEEeDSmiFYpgB.jpeg`,
  portfolio3: `${CDN}/jcABrHTXeUqnLBXY.jpeg`,
}

/* ─── Constants ──────────────────────────────────────────── */
const STORAGE_KEY = 'profix-services-v3'
const AUTH_KEY    = 'profix-authenticated'
const WHATSAPP    = 'https://wa.me/351936284583'

const SERVICE_PHOTO: Record<string, string> = {
  repairs:     IMG.repairs,
  painting:    IMG.painting,
  renovation:  IMG.renovation,
  engineering: IMG.engineering,
}

/* ─── Default services (pre-populated) ───────────────────── */
const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: 'repairs',
    name: 'Reparações e Manutenção Técnica',
    description: 'Pequenos serviços elétricos, intervenções de canalização, ajustes e correções funcionais em habitações e espaços comerciais.',
    works: [
      { id: 'r-1', title: 'Manutenção técnica residencial', description: 'Intervenção elétrica e canalização em habitação particular', imageData: IMG.repairs },
    ],
  },
  {
    id: 'painting',
    name: 'Pintura e Acabamentos',
    description: 'Pintura interior e exterior, retoques e correção de imperfeições para melhorar a estética dos espaços.',
    works: [
      { id: 'p-1', title: 'Pintura de apartamento', description: 'Renovação de pintura interior, Funchal', imageData: IMG.painting },
    ],
  },
  {
    id: 'renovation',
    name: 'Reformas e Remodelações',
    description: 'Reformas parciais ou completas de casas e apartamentos, com foco na valorização de imóveis.',
    works: [
      { id: 'rv-1', title: 'Remodelação completa', description: 'Renovação total de apartamento com novos acabamentos', imageData: IMG.renovation },
      { id: 'rv-2', title: 'Reabilitação de espaço', description: 'Projeto de reabilitação integral', imageData: IMG.portfolio2 },
      { id: 'rv-3', title: 'Acabamentos e remates', description: 'Pormenores de qualidade na remodelação', imageData: IMG.portfolio3 },
    ],
  },
  {
    id: 'engineering',
    name: 'Engenharia Civil e Apoio Técnico',
    description: 'Serviços de engenharia civil, elaboração de projetos complementares e avaliação técnica.',
    works: [
      { id: 'e-1', title: 'Apoio técnico em obra', description: 'Acompanhamento de projeto de engenharia civil', imageData: IMG.engineering },
    ],
  },
]

/* ─── Language options ───────────────────────────────────── */
const LANG_OPTIONS: { code: Locale; flag: string; name: string }[] = [
  { code: 'pt', flag: '🇵🇹', name: 'Português' },
  { code: 'en', flag: '🇬🇧', name: 'English' },
  { code: 'de', flag: '🇩🇪', name: 'Deutsch' },
  { code: 'fr', flag: '🇫🇷', name: 'Français' },
]

/* ─── Utilities ──────────────────────────────────────────── */
const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result ?? ''))
    reader.onerror = () => reject(new Error('Failed to read image.'))
    reader.readAsDataURL(file)
  })

/* ─── Logo ───────────────────────────────────────────────── */
function ProFixLogo({ small = false }: { small?: boolean }) {
  return (
    <svg viewBox="0 0 280 96" aria-label="ProFix Madeira"
      style={{ height: small ? '40px' : '52px', width: 'auto' }}
      fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="280" height="96" rx="18" fill="#0d1a27" />
      <rect x="28" y="14" width="224" height="2" rx="1" fill="#c9983a" />
      <text x="140" y="60" textAnchor="middle" fill="#e6edf3"
        fontFamily="'Cormorant Garamond', Georgia, serif"
        fontWeight="700" fontSize="44" letterSpacing="0.5">ProFix</text>
      <text x="140" y="80" textAnchor="middle" fill="#c9983a"
        fontFamily="'Manrope', 'Trebuchet MS', sans-serif"
        fontWeight="800" fontSize="16" letterSpacing="7">MADEIRA</text>
      <rect x="28" y="86" width="224" height="2" rx="1" fill="#c9983a" opacity="0.4" />
    </svg>
  )
}

/* ─── Language Dropdown ──────────────────────────────────── */
function LangDropdown() {
  const { i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const current = LANG_OPTIONS.find(l => l.code === i18n.language) ?? LANG_OPTIONS[0]

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  return (
    <div className="lang-dd" ref={ref}>
      <button className="lang-dd-trigger" onClick={() => setOpen(p => !p)}
        type="button" aria-expanded={open} aria-haspopup="listbox">
        <span className="lang-flag">{current.flag}</span>
        <span className="lang-name">{current.name}</span>
        <svg className={`lang-chevron ${open ? 'is-open' : ''}`} viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <ul className="lang-dd-menu" role="listbox">
          {LANG_OPTIONS.map(opt => (
            <li key={opt.code} role="option" aria-selected={opt.code === i18n.language}>
              <button className={`lang-dd-item ${opt.code === i18n.language ? 'is-active' : ''}`}
                onClick={() => { i18n.changeLanguage(opt.code); setOpen(false) }} type="button">
                <span className="lang-flag">{opt.flag}</span>
                <span>{opt.name}</span>
                {opt.code === i18n.language && (
                  <svg className="lang-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/* ─── Service Icons ──────────────────────────────────────── */
function IconWrench() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="svc-icon">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
    </svg>
  )
}
function IconBrush() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="svc-icon">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
    </svg>
  )
}
function IconHome() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="svc-icon">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  )
}
function IconBuilding() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="svc-icon">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
    </svg>
  )
}
const SERVICE_ICONS: Record<string, React.ReactElement> = {
  repairs:     <IconWrench />,
  painting:    <IconBrush />,
  renovation:  <IconHome />,
  engineering: <IconBuilding />,
}

/* ─── Lightbox ───────────────────────────────────────────── */
function Lightbox({ src, onClose }: { src: string; onClose: () => void }) {
  useEffect(() => {
    const h = (e: globalThis.KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', h)
    return () => document.removeEventListener('keydown', h)
  }, [onClose])
  return (
    <div className="lightbox-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <button className="lightbox-close" onClick={onClose} aria-label="Fechar">✕</button>
      <img src={src} alt="" className="lightbox-img" onClick={e => e.stopPropagation()} />
    </div>
  )
}

/* ─── Services Tabs Component ────────────────────────────── */
function ServicesSection({
  services,
  onImageClick,
}: {
  services: ServiceItem[]
  onImageClick: (src: string) => void
}) {
  const { t } = useTranslation()
  const [activeId, setActiveId] = useState(services[0]?.id ?? '')
  const active = services.find(s => s.id === activeId) ?? services[0]

  // Keep activeId in sync if services change (e.g. deleted)
  useEffect(() => {
    if (!services.find(s => s.id === activeId) && services.length > 0) {
      setActiveId(services[0].id)
    }
  }, [services, activeId])

  if (!active) return null

  return (
    <section id="services" className="section section-alt">
      <div className="page-wrap">
        <div className="section-header">
          <p className="eyebrow">{t('nav.services')}</p>
          <h2 className="section-title">{t('services.title')}</h2>
          <p className="section-sub">{t('services.subtitle')}</p>
        </div>

        {/* Tab bar */}
        <div className="svc-tab-bar" role="tablist" aria-label="Serviços">
          {services.map(svc => (
            <button
              key={svc.id}
              role="tab"
              aria-selected={svc.id === activeId}
              aria-controls="svc-panel"
              className={`svc-tab ${svc.id === activeId ? 'is-active' : ''}`}
              onClick={() => setActiveId(svc.id)}
              type="button"
            >
              <span className="svc-tab-icon-wrap">
                {SERVICE_ICONS[svc.id] ?? <IconBuilding />}
              </span>
              <span className="svc-tab-label">{svc.name}</span>
            </button>
          ))}
        </div>

        {/* Panel */}
        <div id="svc-panel" className="svc-panel" key={activeId} role="tabpanel">
          {/* Left: photo + info */}
          <div className="svc-panel-left">
            <div className="svc-panel-photo-wrap">
              <img
                src={SERVICE_PHOTO[active.id] ?? IMG.engineering}
                alt={active.name}
                className="svc-panel-photo"
              />
              <div className="svc-panel-photo-badge">
                <span className="svc-tab-icon-wrap svc-tab-icon-lg">
                  {SERVICE_ICONS[active.id] ?? <IconBuilding />}
                </span>
              </div>
            </div>
            <div className="svc-panel-info">
              <h3 className="svc-panel-name">{active.name}</h3>
              <p className="svc-panel-desc">{active.description}</p>
            </div>
          </div>

          {/* Right: gallery */}
          <div className="svc-panel-right">
            <p className="works-label">{t('portfolio.title')}</p>
            {active.works.length === 0 ? (
              <div className="gallery-empty">
                <p>{t('portfolio.empty')}</p>
              </div>
            ) : (
              <div className="gallery-grid">
                {active.works.map(work => (
                  <button
                    key={work.id}
                    className="gallery-item"
                    onClick={() => onImageClick(work.imageData)}
                    type="button"
                    aria-label={work.title}
                  >
                    <img src={work.imageData} alt={work.title} className="gallery-img" />
                    <div className="gallery-overlay">
                      <p className="gallery-item-title">{work.title}</p>
                      <p className="gallery-item-desc">{work.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Admin Drawer ───────────────────────────────────────── */
type AdminProps = {
  isOpen: boolean; onClose: () => void; isAuthenticated: boolean
  services: ServiceItem[]; onLogin: (e: FormEvent<HTMLFormElement>) => void
  onLogout: () => void; loginError: string; imageError: string
  newCategory: { name: string; description: string }
  setNewCategory: React.Dispatch<React.SetStateAction<{ name: string; description: string }>>
  newWork: { serviceId: string; title: string; description: string; imageData: string }
  setNewWork: React.Dispatch<React.SetStateAction<{ serviceId: string; title: string; description: string; imageData: string }>>
  onAddCategory: (e: FormEvent<HTMLFormElement>) => void
  onAddWork: (e: FormEvent<HTMLFormElement>) => void
  onWorkImageChange: (e: ChangeEvent<HTMLInputElement>) => void
  onDeleteService: (id: string) => void
  onDeleteWork: (serviceId: string, workId: string) => void
}

function AdminDrawer(p: AdminProps) {
  const { t } = useTranslation()
  const [tab, setTab] = useState<'categories' | 'works'>('categories')
  const fileRef = useRef<HTMLInputElement>(null)
  const onKey = useCallback((e: KeyboardEvent<HTMLElement>) => { if (e.key === 'Escape') p.onClose() }, [p])

  return (
    <>
      <div className={`drawer-backdrop ${p.isOpen ? 'is-open' : ''}`} onClick={p.onClose} aria-hidden="true" />
      <aside className={`admin-drawer ${p.isOpen ? 'is-open' : ''}`} role="dialog" aria-modal="true" onKeyDown={onKey}>
        <div className="drawer-header">
          <h2 className="drawer-title">{t('admin.title')}</h2>
          <button className="drawer-close" onClick={p.onClose} aria-label="Fechar">✕</button>
        </div>

        {!p.isAuthenticated ? (
          <div className="drawer-body">
            <form className="admin-form" onSubmit={p.onLogin} autoComplete="on">
              <label className="field-label">{t('admin.username')}</label>
              <input className="field-input" name="username" autoComplete="username" placeholder="admin" />
              <label className="field-label">{t('admin.password')}</label>
              <input className="field-input" name="password" type="password" autoComplete="current-password" placeholder="••••••••" />
              {p.loginError && <p className="field-error">{p.loginError}</p>}
              <button className="btn-gold w-full" type="submit">{t('admin.login')}</button>
              <p className="hint-text">{t('admin.demoHint')}</p>
            </form>
          </div>
        ) : (
          <div className="drawer-body">
            <div className="drawer-tabs">
              <button className={`drawer-tab ${tab === 'categories' ? 'is-active' : ''}`} onClick={() => setTab('categories')} type="button">{t('admin.manageServices')}</button>
              <button className={`drawer-tab ${tab === 'works' ? 'is-active' : ''}`} onClick={() => setTab('works')} type="button">{t('admin.manageWorks')}</button>
            </div>

            {tab === 'categories' && (
              <div className="admin-tab-content">
                <form className="admin-form" onSubmit={p.onAddCategory}>
                  <h3 className="admin-form-title">{t('admin.newCategory')}</h3>
                  <label className="field-label">{t('admin.categoryName')}</label>
                  <input className="field-input" value={p.newCategory.name}
                    onChange={e => p.setNewCategory(c => ({ ...c, name: e.target.value }))}
                    placeholder={t('admin.categoryName')} />
                  <label className="field-label">{t('admin.categoryDescription')}</label>
                  <textarea className="field-input field-textarea" value={p.newCategory.description}
                    onChange={e => p.setNewCategory(c => ({ ...c, description: e.target.value }))}
                    placeholder={t('admin.categoryDescription')} />
                  <button className="btn-outline w-full" type="submit">{t('admin.addCategory')}</button>
                </form>
                <div className="service-list-admin">
                  {p.services.length === 0 && <p className="hint-text">{t('admin.noServices')}</p>}
                  {p.services.map(svc => (
                    <div key={svc.id} className="service-admin-row">
                      <div>
                        <p className="service-admin-name">{svc.name}</p>
                        <p className="hint-text">{svc.works.length} trabalhos</p>
                      </div>
                      <button className="btn-danger-sm" type="button"
                        onClick={() => { if (window.confirm(t('admin.confirmDelete'))) p.onDeleteService(svc.id) }}>
                        {t('admin.deleteService')}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === 'works' && (
              <div className="admin-tab-content">
                <form className="admin-form"
                  onSubmit={e => { p.onAddWork(e); if (fileRef.current) fileRef.current.value = '' }}>
                  <h3 className="admin-form-title">{t('admin.newWork')}</h3>
                  <label className="field-label">{t('admin.selectCategory')}</label>
                  <select className="field-input" value={p.newWork.serviceId}
                    onChange={e => p.setNewWork(w => ({ ...w, serviceId: e.target.value }))}>
                    {p.services.map(svc => <option key={svc.id} value={svc.id}>{svc.name}</option>)}
                  </select>
                  <label className="field-label">{t('admin.workTitle')}</label>
                  <input className="field-input" value={p.newWork.title}
                    onChange={e => p.setNewWork(w => ({ ...w, title: e.target.value }))}
                    placeholder={t('admin.workTitle')} />
                  <label className="field-label">{t('admin.workDescription')}</label>
                  <textarea className="field-input field-textarea" value={p.newWork.description}
                    onChange={e => p.setNewWork(w => ({ ...w, description: e.target.value }))}
                    placeholder={t('admin.workDescription')} />
                  <label className="field-label">{t('admin.chooseImage')}</label>
                  <input ref={fileRef} className="field-file" type="file" accept="image/*" onChange={p.onWorkImageChange} />
                  {p.newWork.imageData && <img src={p.newWork.imageData} alt="preview" className="image-preview" />}
                  {p.imageError && <p className="field-error">{p.imageError}</p>}
                  <button className="btn-outline w-full" type="submit">{t('admin.addWork')}</button>
                </form>
                {p.services.flatMap(svc =>
                  svc.works.length > 0 ? (
                    <div key={svc.id} className="works-list-admin">
                      <p className="works-list-svc-name">{svc.name}</p>
                      {svc.works.map(work => (
                        <div key={work.id} className="work-admin-row">
                          <img src={work.imageData} alt={work.title} className="work-thumb-admin" />
                          <div className="work-admin-info">
                            <p className="work-admin-title">{work.title}</p>
                            <p className="hint-text">{work.description}</p>
                          </div>
                          <button className="btn-danger-sm" type="button"
                            onClick={() => { if (window.confirm(t('admin.confirmDelete'))) p.onDeleteWork(svc.id, work.id) }}>✕</button>
                        </div>
                      ))}
                    </div>
                  ) : [],
                )}
              </div>
            )}

            <div className="drawer-footer">
              <button className="logout-btn" onClick={p.onLogout} type="button">{t('admin.logout')}</button>
            </div>
          </div>
        )}
      </aside>
    </>
  )
}

/* ─── FAQ Item ───────────────────────────────────────────── */
function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)
  const bodyRef = useRef<HTMLDivElement>(null)
  return (
    <div className={`faq-item ${open ? 'is-open' : ''}`}>
      <button className="faq-trigger" onClick={() => setOpen(p => !p)} aria-expanded={open} type="button">
        <span>{question}</span>
        <svg className="faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div ref={bodyRef} className="faq-body"
        style={{ maxHeight: open ? `${bodyRef.current?.scrollHeight ?? 400}px` : '0' }}>
        <p className="faq-answer">{answer}</p>
      </div>
    </div>
  )
}

/* ─── Main App ───────────────────────────────────────────── */
export default function App() {
  const { t, i18n } = useTranslation()

  const [services, setServices] = useState<ServiceItem[]>(DEFAULT_SERVICES)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminOpen, setAdminOpen] = useState(false)
  const [navOpen, setNavOpen] = useState(false)
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)
  const [loginError, setLoginError] = useState('')
  const [imageError, setImageError] = useState('')
  const [newCategory, setNewCategory] = useState({ name: '', description: '' })
  const [newWork, setNewWork] = useState({ serviceId: DEFAULT_SERVICES[0].id, title: '', description: '', imageData: '' })

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    const auth  = localStorage.getItem(AUTH_KEY)
    if (saved) { try { setServices(JSON.parse(saved)) } catch { /* ignore */ } }
    if (auth === 'true') setIsAuthenticated(true)
  }, [])

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(services)) }, [services])
  useEffect(() => { document.body.style.overflow = adminOpen || lightboxSrc ? 'hidden' : '' }, [adminOpen, lightboxSrc])

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    if (fd.get('username') === 'admin' && fd.get('password') === 'profix123') {
      setIsAuthenticated(true); setLoginError(''); localStorage.setItem(AUTH_KEY, 'true')
    } else { setLoginError(t('admin.invalidCredentials')) }
  }
  const handleLogout = () => { setIsAuthenticated(false); localStorage.removeItem(AUTH_KEY) }
  const addCategory = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!newCategory.name.trim() || !newCategory.description.trim()) return
    setServices(p => [...p, { id: crypto.randomUUID(), name: newCategory.name.trim(), description: newCategory.description.trim(), works: [] }])
    setNewCategory({ name: '', description: '' })
  }
  const deleteService = (id: string) => setServices(p => p.filter(s => s.id !== id))
  const onWorkImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { setImageError(t('admin.imageTypeError')); return }
    const data = await fileToDataUrl(file)
    setNewWork(w => ({ ...w, imageData: data })); setImageError('')
  }
  const addWork = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!newWork.title.trim() || !newWork.description.trim() || !newWork.imageData) return
    setServices(p => p.map(svc =>
      svc.id === newWork.serviceId
        ? { ...svc, works: [...svc.works, { id: crypto.randomUUID(), title: newWork.title.trim(), description: newWork.description.trim(), imageData: newWork.imageData }] }
        : svc
    ))
    setNewWork(w => ({ ...w, title: '', description: '', imageData: '' }))
  }
  const deleteWork = (serviceId: string, workId: string) =>
    setServices(p => p.map(svc => svc.id === serviceId ? { ...svc, works: svc.works.filter(w => w.id !== workId) } : svc))

  const faqItems = [
    { q: t('faq.q1'), a: t('faq.a1') }, { q: t('faq.q2'), a: t('faq.a2') },
    { q: t('faq.q3'), a: t('faq.a3') }, { q: t('faq.q4'), a: t('faq.a4') },
    { q: t('faq.q5'), a: t('faq.a5') }, { q: t('faq.q6'), a: t('faq.a6') },
  ]

  const values = [
    { n: '01', title: t('values.rigorTitle'), text: t('values.rigorText') },
    { n: '02', title: t('values.prazosTitle'), text: t('values.prazosText') },
    { n: '03', title: t('values.detalheTitle'), text: t('values.detalheText') },
    { n: '04', title: t('values.comunicacaoTitle'), text: t('values.comunicacaoText') },
  ]

  const navLinks = ['about', 'services', 'faq', 'contact'] as const

  return (
    <>
      {lightboxSrc && <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />}

      <AdminDrawer
        isOpen={adminOpen} onClose={() => setAdminOpen(false)}
        isAuthenticated={isAuthenticated} services={services}
        onLogin={handleLogin} onLogout={handleLogout}
        loginError={loginError} imageError={imageError}
        newCategory={newCategory} setNewCategory={setNewCategory}
        newWork={newWork} setNewWork={setNewWork}
        onAddCategory={addCategory} onAddWork={addWork}
        onWorkImageChange={onWorkImageChange}
        onDeleteService={deleteService} onDeleteWork={deleteWork}
      />

      {/* ── Nav ───────────────────────────────────────────── */}
      <header className="site-nav">
        <div className="nav-inner">
          <a href="#hero" className="nav-logo-link" aria-label="ProFix Madeira">
            <ProFixLogo />
          </a>
          <nav className="nav-links" aria-label="Main">
            {navLinks.map(k => (
              <a key={k} href={`#${k}`} className="nav-link" onClick={() => setNavOpen(false)}>{t(`nav.${k}`)}</a>
            ))}
          </nav>
          <div className="nav-right">
            <LangDropdown />
            <a href={WHATSAPP} target="_blank" rel="noreferrer" className="btn-gold nav-wa-btn">
              <svg viewBox="0 0 24 24" fill="currentColor" className="wa-icon">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </a>
            <button className={`hamburger ${navOpen ? 'is-open' : ''}`}
              onClick={() => setNavOpen(p => !p)} aria-label="Menu" type="button">
              <span /><span /><span />
            </button>
          </div>
        </div>

        <div className={`mobile-menu ${navOpen ? 'is-open' : ''}`}>
          {navLinks.map(k => (
            <a key={k} href={`#${k}`} className="mobile-link" onClick={() => setNavOpen(false)}>{t(`nav.${k}`)}</a>
          ))}
          <div className="mobile-lang-row">
            {LANG_OPTIONS.map(opt => (
              <button key={opt.code} type="button"
                className={`mobile-lang-btn ${opt.code === i18n.language ? 'is-active' : ''}`}
                onClick={() => { i18n.changeLanguage(opt.code); setNavOpen(false) }}>
                {opt.flag} {opt.name}
              </button>
            ))}
          </div>
          <a href={WHATSAPP} target="_blank" rel="noreferrer" className="btn-gold mobile-wa" onClick={() => setNavOpen(false)}>
            WhatsApp
          </a>
        </div>
      </header>

      <main>
        {/* ── Hero ─────────────────────────────────────────── */}
        <section id="hero" className="hero-section"
          style={{ backgroundImage: `linear-gradient(135deg, rgba(10,20,30,0.93) 0%, rgba(13,26,39,0.68) 55%, rgba(10,20,30,0.92) 100%), url(${IMG.hero})` }}>
          <div className="hero-texture" style={{ backgroundImage: `url(${IMG.texture})` }} aria-hidden="true" />
          <div className="hero-content page-wrap">
            <p className="eyebrow">{t('hero.kicker')}</p>
            <h1 className="hero-title">
              {t('hero.title').split('\n').map((line, i, arr) => (
                <span key={i} className={i === arr.length - 1 ? 'hero-line gold' : 'hero-line'}>{line}</span>
              ))}
            </h1>
            <p className="hero-sub">{t('hero.subtitle')}</p>
            <a className="btn-gold btn-large hero-cta-btn" href={WHATSAPP} target="_blank" rel="noreferrer">
              <svg viewBox="0 0 24 24" fill="currentColor" className="wa-icon">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {t('actions.requestQuote')}
            </a>
          </div>
          <div className="hero-gold-bar" aria-hidden="true" />
        </section>

        {/* ── About ────────────────────────────────────────── */}
        <section id="about" className="section page-wrap">
          <div className="about-grid">
            <div className="about-photo-wrap">
              <img src={IMG.about} alt="Trabalho ProFix Madeira" className="about-photo" />
              <div className="about-photo-badge">
                <span className="badge-num">+10</span>
                <span className="badge-lbl">anos<br />experiência</span>
              </div>
            </div>
            <div className="about-right">
              <p className="eyebrow">{t('nav.about')}</p>
              <h2 className="section-title">{t('about.title')}</h2>
              <p className="body-text">{t('about.text')}</p>
              <span className="nif-badge">{t('about.nif')}</span>
              <div className="values-grid">
                {values.map(v => (
                  <div key={v.n} className="value-card">
                    <span className="value-num" aria-hidden="true">{v.n}</span>
                    <h3 className="value-title">{v.title}</h3>
                    <p className="value-text">{v.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Services (tabs + gallery) ─────────────────────── */}
        <ServicesSection services={services} onImageClick={setLightboxSrc} />

        {/* ── FAQ ──────────────────────────────────────────── */}
        <section id="faq" className="section page-wrap">
          <div className="faq-layout">
            <div className="faq-left">
              <p className="eyebrow">FAQ</p>
              <h2 className="section-title">{t('faq.title')}</h2>
              <p className="body-text" style={{ fontSize: '.95rem', marginTop: '.25rem' }}>{t('contact.ctaSub')}</p>
              <a href={WHATSAPP} target="_blank" rel="noreferrer" className="btn-gold" style={{ marginTop: '1rem', alignSelf: 'flex-start' }}>
                {t('actions.freeQuote')}
              </a>
            </div>
            <div className="faq-list">
              {faqItems.map(item => <FaqItem key={item.q} question={item.q} answer={item.a} />)}
            </div>
          </div>
        </section>

        {/* ── Contact ──────────────────────────────────────── */}
        <section id="contact" className="section section-alt">
          <div className="page-wrap contact-layout">
            <div className="contact-info">
              <p className="eyebrow">{t('nav.contact')}</p>
              <h2 className="section-title">{t('contact.title')}</h2>
              <div className="contact-items">
                <div className="contact-item">
                  <span className="contact-lbl">{t('contact.phone')}</span>
                  <a href="tel:+351936284583" className="contact-val">+351 936 284 583</a>
                </div>
                <div className="contact-item">
                  <span className="contact-lbl">{t('contact.email')}</span>
                  <a href="mailto:geral@profixmadeira.pt" className="contact-val">geral@profixmadeira.pt</a>
                </div>
                <div className="contact-item">
                  <span className="contact-lbl">{t('contact.locationLabel')}</span>
                  <span className="contact-val">{t('contact.locationValue')}</span>
                </div>
              </div>
            </div>
            <div className="contact-cta-card">
              <p className="cta-title">{t('contact.cta')}</p>
              <p className="cta-sub">{t('contact.ctaSub')}</p>
              <a href={WHATSAPP} target="_blank" rel="noreferrer" className="btn-gold btn-large wa-btn-full">
                <svg viewBox="0 0 24 24" fill="currentColor" className="wa-icon">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                {t('actions.contactWhatsapp')}
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="site-footer">
        <div className="page-wrap footer-inner">
          <ProFixLogo small />
          <div className="footer-text">
            <p>{t('footer.rights')}</p>
            <p className="footer-nif">{t('footer.nif')}</p>
          </div>
          <button className="admin-trigger" onClick={() => setAdminOpen(true)} type="button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="admin-icon">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {t('footer.admin')}
          </button>
        </div>
      </footer>
    </>
  )
}
