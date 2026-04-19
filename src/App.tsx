import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent, KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import './i18n'

import ServicesPortfolio  from './components/ServicesPortfolio'
import ServiceDetailPage  from './pages/ServiceDetailPage'

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
        <span className="lang-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
            <circle cx="12" cy="12" r="9" />
            <path strokeLinecap="round" d="M3.5 12h17" />
            <path strokeLinecap="round" d="M12 3a13.2 13.2 0 0 1 0 18" />
            <path strokeLinecap="round" d="M12 3a13.2 13.2 0 0 0 0 18" />
          </svg>
        </span>
        <span className="lang-code">{current.code.toUpperCase()}</span>
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

/* Icons + SERVICE_ICONS → components/ServicesSection.tsx */

/* ─── Lightbox ───────────────────────────────────────────── */
function Lightbox({ src, onClose }: { src: string; onClose: () => void }) {
  const { t } = useTranslation()
  useEffect(() => {
    const h = (e: globalThis.KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', h)
    return () => document.removeEventListener('keydown', h)
  }, [onClose])
  return (
    <div className="lightbox-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <button className="lightbox-close" onClick={onClose} aria-label={t('ui.close')}>✕</button>
      <img src={src} alt="" className="lightbox-img" onClick={e => e.stopPropagation()} />
    </div>
  )
}

/* ─── Services Section ───────────────────────────────────────
   Catalog + card grid → see src/components/ServicesSection.tsx
   ServiceDetailPage   → see src/pages/ServiceDetailPage.tsx
   (PortfolioPage removed — works accessible via ServicePanel)
   ─────────────────────────────────────────────────────────── */

/* ServicesSection, ServiceCard, ServiceWorksModal → components/ServicesSection.tsx + pages/ */

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
          <button className="drawer-close" onClick={p.onClose} aria-label={t('ui.close')}>✕</button>
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
                        <p className="hint-text">{t('services.workCount', { count: svc.works.length })}</p>
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
                  {p.newWork.imageData && <img src={p.newWork.imageData} alt="" className="image-preview" />}
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
function HeroRotatingHeadline() {
  const { t, i18n } = useTranslation()
  const words = useMemo(() => {
    const raw = t('hero.headlineWords', { returnObjects: true })
    return Array.isArray(raw) ? (raw as string[]) : ['Precisão']
  }, [t, i18n.language])

  const [active, setActive] = useState(0)

  useEffect(() => {
    setActive(0)
  }, [i18n.language])

  useEffect(() => {
    if (words.length <= 1) return
    const id = window.setInterval(() => {
      setActive(p => (p + 1) % words.length)
    }, 2300)
    return () => window.clearInterval(id)
  }, [i18n.language, words.length])

  return (
    <h1 className="hero-title">
      <span className="hero-line hero-rotator-line" aria-live="polite">
        <span key={`${i18n.language}-${active}`} className="hero-rotator-text">
          {words[active % words.length]}
        </span>
      </span>
      <span className="hero-line">{t('hero.titleLine2')}</span>
      <span className="hero-line gold">{t('hero.titleLine3')}</span>
    </h1>
  )
}

function FaqItem({ question, answer, index }: { question: string; answer: string; index?: number }) {
  const [open, setOpen] = useState(false)
  const bodyRef = useRef<HTMLDivElement>(null)
  return (
    <div className={`faq-item ${open ? 'is-open' : ''}`}>
      <button className="faq-trigger" onClick={() => setOpen(p => !p)} aria-expanded={open} type="button">
        {index !== undefined && (
          <span className="faq-item-num" aria-hidden="true">{String(index).padStart(2, '0')}</span>
        )}
        <span className="faq-trigger-text">{question}</span>
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
  const { t } = useTranslation()

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
    <BrowserRouter>
      <AppShell
        lightboxSrc={lightboxSrc}
        setLightboxSrc={setLightboxSrc}
        adminOpen={adminOpen}
        setAdminOpen={setAdminOpen}
        navOpen={navOpen}
        setNavOpen={setNavOpen}
        navLinks={navLinks}
        values={values}
        faqItems={faqItems}
        services={services}
        isAuthenticated={isAuthenticated}
        loginError={loginError}
        imageError={imageError}
        newCategory={newCategory}
        setNewCategory={setNewCategory}
        newWork={newWork}
        setNewWork={setNewWork}
        handleLogin={handleLogin}
        handleLogout={handleLogout}
        addCategory={addCategory}
        addWork={addWork}
        onWorkImageChange={onWorkImageChange}
        deleteService={deleteService}
        deleteWork={deleteWork}
      />
    </BrowserRouter>
  )
}

/* ─── AppShell — renders nav + routes ───────────────────── */
type AppShellProps = {
  lightboxSrc: string | null
  setLightboxSrc: (s: string | null) => void
  adminOpen: boolean
  setAdminOpen: (v: boolean) => void
  navOpen: boolean
  setNavOpen: (fn: (p: boolean) => boolean) => void
  navLinks: readonly string[]
  values: { n: string; title: string; text: string }[]
  faqItems: { q: string; a: string }[]
  services: ServiceItem[]
  isAuthenticated: boolean
  loginError: string
  imageError: string
  newCategory: { name: string; description: string }
  setNewCategory: React.Dispatch<React.SetStateAction<{ name: string; description: string }>>
  newWork: { serviceId: string; title: string; description: string; imageData: string }
  setNewWork: React.Dispatch<React.SetStateAction<{ serviceId: string; title: string; description: string; imageData: string }>>
  handleLogin: (e: FormEvent<HTMLFormElement>) => void
  handleLogout: () => void
  addCategory: (e: FormEvent<HTMLFormElement>) => void
  addWork: (e: FormEvent<HTMLFormElement>) => void
  onWorkImageChange: (e: ChangeEvent<HTMLInputElement>) => void
  deleteService: (id: string) => void
  deleteWork: (serviceId: string, workId: string) => void
}

function AppShell(p: AppShellProps) {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <>
      {p.lightboxSrc && <Lightbox src={p.lightboxSrc} onClose={() => p.setLightboxSrc(null)} />}

      <AdminDrawer
        isOpen={p.adminOpen} onClose={() => p.setAdminOpen(false)}
        isAuthenticated={p.isAuthenticated} services={p.services}
        onLogin={p.handleLogin} onLogout={p.handleLogout}
        loginError={p.loginError} imageError={p.imageError}
        newCategory={p.newCategory} setNewCategory={p.setNewCategory}
        newWork={p.newWork} setNewWork={p.setNewWork}
        onAddCategory={p.addCategory} onAddWork={p.addWork}
        onWorkImageChange={p.onWorkImageChange}
        onDeleteService={p.deleteService} onDeleteWork={p.deleteWork}
      />

      {/* ── Nav ───────────────────────────────────────────── */}
      <header className="site-nav">
        <div className="nav-inner">
          <Link to="/" className="nav-logo-link" aria-label="ProFix Madeira">
            <ProFixLogo />
          </Link>
          <nav className="nav-links" aria-label={t('nav.ariaMain')}>
            {p.navLinks.map(k => (
              <React.Fragment key={k}>
                <a href={isHome ? `#${k}` : `/#${k}`}
                  className="nav-link"
                  onClick={() => p.setNavOpen(v => !v && false)}>
                  {t(`nav.${k}`)}
                </a>
              </React.Fragment>
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
            <button className={`hamburger ${p.navOpen ? 'is-open' : ''}`}
              onClick={() => p.setNavOpen(v => !v)} aria-label={t('nav.menu')} type="button">
              <span /><span /><span />
            </button>
          </div>
        </div>

        <div className={`mobile-menu ${p.navOpen ? 'is-open' : ''}`}>
          {p.navLinks.map(k => (
            <React.Fragment key={k}>
              <a href={isHome ? `#${k}` : `/#${k}`}
                className="mobile-link"
                onClick={() => p.setNavOpen(v => !v && false)}>
                {t(`nav.${k}`)}
              </a>
            </React.Fragment>
          ))}
          <div className="mobile-lang-row">
            {LANG_OPTIONS.map(opt => (
              <button key={opt.code} type="button"
                className={`mobile-lang-btn ${opt.code === i18n.language ? 'is-active' : ''}`}
                onClick={() => { i18n.changeLanguage(opt.code); p.setNavOpen(v => !v && false) }}>
                {opt.flag} {opt.name}
              </button>
            ))}
          </div>
          <a href={WHATSAPP} target="_blank" rel="noreferrer" className="btn-gold mobile-wa"
            onClick={() => p.setNavOpen(v => !v && false)}>
            WhatsApp
          </a>
        </div>
      </header>

      <Routes>
        <Route path="/servicos/:slug" element={<ServiceDetailPage />} />
        <Route path="/" element={<><main>
        {/* ── Hero ─────────────────────────────────────────── */}
        <section id="hero" className="hero-section"
          style={{ backgroundImage: `linear-gradient(135deg, rgba(10,20,30,0.93) 0%, rgba(13,26,39,0.68) 55%, rgba(10,20,30,0.92) 100%), url(${IMG.hero})` }}>
          <div className="hero-texture" style={{ backgroundImage: `url(${IMG.texture})` }} aria-hidden="true" />
          <div className="hero-content page-wrap">
            <p className="eyebrow">{t('hero.kicker')}</p>
            <HeroRotatingHeadline />
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
              <img src={IMG.about} alt={t('about.photoAlt')} className="about-photo" />
              <div className="about-photo-badge">
                <span className="badge-num">+10</span>
                <span className="badge-lbl">{t('about.yearsLine1')}<br />{t('about.yearsLine2')}</span>
              </div>
            </div>
            <div className="about-right">
              <p className="eyebrow">{t('nav.about')}</p>
              <h2 className="section-title">{t('about.title')}</h2>
              <p className="body-text">{t('about.text')}</p>
              <div className="values-grid">
                {p.values.map(v => (
                  <div key={v.n} className="value-card">
                    <span className="value-num" aria-hidden="true">{v.n}</span>
                    <h3 className="value-title">{v.title}</h3>
                    <p className="value-text">{v.text}</p>
                  </div>
                ))}
              </div>
              <span className="nif-badge">{t('about.nif')}</span>
            </div>
          </div>
        </section>

        {/* ── Services catalogue (new) ─────────────────────── */}
        <ServicesPortfolio />

        {/* ── FAQ ──────────────────────────────────────────── */}
        <section id="faq" className="section page-wrap">
          <div className="faq-header">
            <p className="eyebrow">FAQ</p>
            <h2 className="section-title">{t('faq.title')}</h2>
          </div>
          <div className="faq-split">
            <div className="faq-sidebar">
              <p className="faq-sidebar-text">{t('contact.ctaSub')}</p>
              <a href={WHATSAPP} target="_blank" rel="noreferrer" className="btn-gold" style={{ alignSelf: 'flex-start' }}>
                {t('actions.freeQuote')}
              </a>
              <div className="faq-stat-col">
                <div className="faq-stat">
                  <span className="faq-stat-num">+10</span>
                  <span className="faq-stat-lbl">{t('faq.yearsExp')}</span>
                </div>
                <div className="faq-stat">
                  <span className="faq-stat-num">24h</span>
                  <span className="faq-stat-lbl">{t('faq.guaranteedResponse')}</span>
                </div>
              </div>
            </div>
            <div className="faq-accordion">
              {p.faqItems.map((item, i) => <FaqItem key={item.q} question={item.q} answer={item.a} index={i + 1} />)}
            </div>
          </div>
        </section>

        {/* ── Contact ──────────────────────────────────────── */}
        <section id="contact" className="section section-alt">
          <div className="page-wrap contact-new-wrap">
            <div className="contact-top-row">
              <div className="contact-head">
                <p className="eyebrow">{t('nav.contact')}</p>
                <h2 className="section-title">{t('contact.title')}</h2>
              </div>
              <div className="contact-channels-row">
                <a href="tel:+351936284583" className="contact-channel-card">
                  <span className="contact-ch-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .95h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                    </svg>
                  </span>
                  <span className="contact-ch-label">{t('contact.phone')}</span>
                  <span className="contact-ch-value">+351 936 284 583</span>
                </a>
                <a href="mailto:geral@profixmadeira.pt" className="contact-channel-card">
                  <span className="contact-ch-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="16" x="2" y="4" rx="2"/>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7"/>
                    </svg>
                  </span>
                  <span className="contact-ch-label">{t('contact.email')}</span>
                  <span className="contact-ch-value">geral@profixmadeira.pt</span>
                </a>
                <div className="contact-channel-card">
                  <span className="contact-ch-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0116 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  </span>
                  <span className="contact-ch-label">{t('contact.locationLabel')}</span>
                  <span className="contact-ch-value">{t('contact.locationValue')}</span>
                </div>
              </div>
            </div>
            <div className="contact-cta-full">
              <div className="contact-cta-full-left">
                <span className="eyebrow">{t('actions.freeQuote')}</span>
                <p className="contact-cta-headline">{t('contact.cta')}</p>
                <p className="contact-cta-sub">{t('contact.ctaSub')}</p>
              </div>
              <a href={WHATSAPP} target="_blank" rel="noreferrer" className="btn-gold btn-large">
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
          <button className="admin-trigger" onClick={() => p.setAdminOpen(true)} type="button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="admin-icon">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {t('footer.admin')}
          </button>
        </div>
      </footer>
        </>} />
      </Routes>
    </>
  )
}
