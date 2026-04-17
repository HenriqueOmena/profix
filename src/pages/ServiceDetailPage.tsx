import { Link, useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { getCategoryBySlug, getPortfolioPreview } from '../data/mock'

const WHATSAPP = 'https://wa.me/351936284583'

function IconArrowLeft() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" style={{ width: 15, height: 15 }}>
      <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
  )
}
function IconCheck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round"
      style={{ width: 14, height: 14, flexShrink: 0, color: 'var(--gold)' }}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
function IconWA() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="wa-icon">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

function Lightbox({ src, onClose }: { src: string; onClose: () => void }) {
  return (
    <div className="lightbox-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <button className="lightbox-close" onClick={onClose} aria-label="Fechar">✕</button>
      <img src={src} alt="" className="lightbox-img" onClick={e => e.stopPropagation()} />
    </div>
  )
}

export default function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [lightbox, setLightbox] = useState<string | null>(null)

  const category = slug ? getCategoryBySlug(slug) : undefined
  const preview  = category ? getPortfolioPreview(category.id, 6) : []

  if (!category) {
    return (
      <div className="svc-detail-not-found">
        <p className="body-text">{t('serviceDetail.notFound')}</p>
        <Link to="/" className="btn-ghost">
          <IconArrowLeft /> {t('serviceDetail.backHome')}
        </Link>
      </div>
    )
  }

  return (
    <>
      {lightbox && <Lightbox src={lightbox} onClose={() => setLightbox(null)} />}

      <div className="svc-detail-page">

        {/* ── Breadcrumb ──────────────────────────────────── */}
        <div className="svc-detail-breadcrumb">
          <div className="page-wrap svc-detail-breadcrumb-inner">
            <button className="svc-detail-back" onClick={() => navigate(-1)} type="button">
              <IconArrowLeft />
              <span>{t('nav.services')}</span>
            </button>
            <span className="svc-detail-sep" aria-hidden="true">/</span>
            <span className="svc-detail-crumb-current">{category.name}</span>
          </div>
        </div>

        {/* ── Hero ────────────────────────────────────────── */}
        <div className="page-wrap svc-detail-hero">
          <div className="svc-detail-hero-left">
            <div className="svc-detail-kicker">
              <span className="eyebrow">{t('services.panelKind')}</span>
            </div>
            <h1 className="svc-detail-title">{category.name}</h1>
            <p className="svc-detail-desc">{category.fullDescription}</p>
            <div className="svc-detail-ctas">
              <a href={WHATSAPP} target="_blank" rel="noreferrer" className="btn-gold btn-large">
                <IconWA />
                {t('actions.requestQuote')}
              </a>
              <Link
                to={`/trabalhos?categoria=${category.id}`}
                className="btn-ghost"
              >
                {t('serviceDetail.viewWorksCategory')}
              </Link>
            </div>
          </div>

          <div className="svc-detail-highlights-card">
            <p className="works-label">{t('serviceDetail.includesTitle')}</p>
            <ul className="svc-detail-highlights-list">
              {category.highlights.map((h, i) => (
                <li key={i} className="svc-detail-highlight-item">
                  <IconCheck />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Portfolio preview ────────────────────────────── */}
        {preview.length > 0 && (
          <div className="page-wrap svc-detail-gallery-section">
            <div className="svc-detail-gallery-head">
              <p className="works-label">{t('serviceDetail.recentWorks')}</p>
              <Link
                to={`/trabalhos?categoria=${category.id}`}
                className="svc-detail-view-all"
              >
                {t('serviceDetail.viewAllShort')} →
              </Link>
            </div>
            <div className="gallery-grid">
              {preview.map(item => (
                <button
                  key={item.id}
                  className="gallery-item"
                  onClick={() => setLightbox(item.imageUrl)}
                  type="button"
                  aria-label={item.title}
                >
                  <img src={item.imageUrl} alt={item.title} className="gallery-img" loading="lazy" />
                  <div className="gallery-overlay">
                    <p className="gallery-item-title">{item.title}</p>
                    <p className="gallery-item-desc">{item.description}</p>
                  </div>
                </button>
              ))}
            </div>
            <div className="svc-detail-gallery-cta">
              <Link
                to={`/trabalhos?categoria=${category.id}`}
                className="btn-ghost"
              >
                {t('serviceDetail.viewAllCategory')}
              </Link>
            </div>
          </div>
        )}

        {/* ── Bottom CTA band ─────────────────────────────── */}
        <div className="page-wrap svc-detail-cta-section">
          <div className="contact-cta-full">
            <div className="contact-cta-full-left">
              <span className="eyebrow">{t('services.ctaInterested')}</span>
              <p className="contact-cta-headline">{t('services.ctaSub')}</p>
            </div>
            <a href={WHATSAPP} target="_blank" rel="noreferrer" className="btn-gold btn-large">
              <IconWA />
              {t('actions.contactWhatsapp')}
            </a>
          </div>
        </div>

      </div>
    </>
  )
}
