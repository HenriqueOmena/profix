import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

/* ─── Types ──────────────────────────────────────────────── */

export type WorkImage = {
  id: string
  url: string
  caption?: string
  isBefore?: boolean  // true = "Antes", false = "Depois", undefined = neutro
}

export type PortfolioWork = {
  id: string
  title: string
  description: string
  featuredImageUrl: string
  images: WorkImage[]
  date: string    // "YYYY-MM"
  active: boolean
}

export type SubService = {
  id: string
  name: string
}

export type ServiceCategory = {
  id: string
  slug: string
  name: string
  description: string
  imageUrl: string
  subServices: SubService[]
  works: PortfolioWork[]
  order: number
  active: boolean
}

/* ─── CDN ────────────────────────────────────────────────── */
const CDN = 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663329997620'
const LOCAL = '/portfolio'

/* ─── Mock data ──────────────────────────────────────────── */
export const SERVICES: ServiceCategory[] = [
  {
    id: 'repairs',
    slug: 'reparacoes-manutencao',
    name: 'Reparações e Manutenção Técnica',
    description: 'Pequenos serviços elétricos, intervenções de canalização, ajustes e correções funcionais em habitações e espaços comerciais.',
    imageUrl: `${CDN}/oZepugZbFecnMfPJ.jpg`,
    subServices: [
      { id: 's1', name: 'Instalações elétricas' },
      { id: 's2', name: 'Canalização e fugas' },
      { id: 's3', name: 'Reparação de infiltrações' },
      { id: 's4', name: 'Vedações e isolamentos' },
    ],
    works: [
      {
        id: 'r1',
        title: 'Manutenção Técnica Residencial — Funchal',
        description: 'Intervenção completa em instalações eléctricas e canalização de habitação particular. Substituição de quadro eléctrico, resolução de avaria em tubagem de águas quentes e impermeabilização de casa de banho.',
        featuredImageUrl: `${CDN}/oZepugZbFecnMfPJ.jpg`,
        images: [
          { id: 'i1', url: `${CDN}/oZepugZbFecnMfPJ.jpg`, caption: 'Instalação eléctrica concluída', isBefore: false },
          { id: 'i2', url: `${CDN}/jcABrHTXeUqnLBXY.jpeg`, caption: 'Detalhe da tubagem renovada', isBefore: false },
        ],
        date: '2024-11',
        active: true,
      },
    ],
    order: 1,
    active: true,
  },
  {
    id: 'painting',
    slug: 'pintura-acabamentos',
    name: 'Pintura e Acabamentos',
    description: 'Pintura interior e exterior, retoques e correção de imperfeições para melhorar a estética dos espaços.',
    imageUrl: `${CDN}/zWxKZUbnJcQsUoHq.jpg`,
    subServices: [
      { id: 's5', name: 'Pintura interior' },
      { id: 's6', name: 'Pintura exterior' },
      { id: 's7', name: 'Estuque e massa corrida' },
      { id: 's8', name: 'Revestimentos decorativos' },
    ],
    works: [
      {
        id: 'p1',
        title: 'Pintura Interior Apartamento — Funchal',
        description: 'Pintura integral de apartamento com preparação de superfícies, massa corrida em todas as divisões e pintura final em duas demãos com tinta premium lavável. Parede de destaque em verde sage na sala, restantes divisões em cinza claro. Resultado: espaço moderno e luminoso.',
        featuredImageUrl: `${LOCAL}/sala-depois.jpeg`,
        images: [
          { id: 'p1-1', url: `${LOCAL}/sala-antes.jpeg`, caption: 'Sala — paredes antigas com marcas', isBefore: true },
          { id: 'p1-2', url: `${LOCAL}/sala-depois.jpeg`, caption: 'Sala — parede verde sage finalizada', isBefore: false },
          { id: 'p1-3', url: `${LOCAL}/quarto-pintura.jpeg`, caption: 'Quarto — pintura cinza claro' },
          { id: 'p1-4', url: `${LOCAL}/varanda-depois.jpeg`, caption: 'Quarto com varanda — acabamento final' },
          { id: 'p1-5', url: `${LOCAL}/quarto-detalhe.jpeg`, caption: 'Detalhe — molduras e rodapés' },
        ],
        date: '2026-04',
        active: true,
      },
      // --- Simulação de volume (duplicatas para testar layout com 8+ trabalhos) ---
      {
        id: 'p2',
        title: 'Pintura Exterior Vivenda — Câmara de Lobos',
        description: 'Pintura exterior completa de vivenda unifamiliar. Preparação de superfícies, remoção de antigas camadas e aplicação de tinta de fachada resistente à humidade. Acabamento em branco puro com cantaria em cinza escuro.',
        featuredImageUrl: `${LOCAL}/sala-depois.jpeg`,
        images: [
          { id: 'p2-1', url: `${LOCAL}/sala-antes.jpeg`, caption: 'Fachada antes da intervenção', isBefore: true },
          { id: 'p2-2', url: `${LOCAL}/sala-depois.jpeg`, caption: 'Fachada após pintura exterior', isBefore: false },
        ],
        date: '2026-03',
        active: true,
      },
      {
        id: 'p3',
        title: 'Estuque e Massa Corrida — Escritório Funchal',
        description: 'Regularização e massa corrida em escritório de 120m². Tetos e paredes lixados, nivelados e pintados em branco fosco com acabamento premium.',
        featuredImageUrl: `${LOCAL}/quarto-pintura.jpeg`,
        images: [
          { id: 'p3-1', url: `${LOCAL}/quarto-pintura.jpeg`, caption: 'Escritório — acabamento final' },
        ],
        date: '2026-02',
        active: true,
      },
      {
        id: 'p4',
        title: 'Revestimento Decorativo — Sala de Estar',
        description: 'Aplicação de revestimento texturado em parede de destaque da sala. Técnica de espatulado venetiano em tom terracota. Complementado com pintura das restantes paredes em branco quente.',
        featuredImageUrl: `${LOCAL}/varanda-depois.jpeg`,
        images: [
          { id: 'p4-1', url: `${LOCAL}/varanda-depois.jpeg`, caption: 'Parede de destaque — venetiano terracota' },
        ],
        date: '2026-01',
        active: true,
      },
      {
        id: 'p5',
        title: 'Pintura Completa Apartamento T3 — Santa Cruz',
        description: 'Repintura integral de apartamento T3. Preparação, massa corrida em zonas danificadas e duas demãos de tinta premium. Paleta neutra com apontamentos em verde musgo.',
        featuredImageUrl: `${LOCAL}/quarto-detalhe.jpeg`,
        images: [
          { id: 'p5-1', url: `${LOCAL}/sala-antes.jpeg`, caption: 'Estado inicial', isBefore: true },
          { id: 'p5-2', url: `${LOCAL}/quarto-detalhe.jpeg`, caption: 'Resultado final', isBefore: false },
        ],
        date: '2025-12',
        active: true,
      },
      {
        id: 'p6',
        title: 'Tetos e Molduras — Moradia Tradicional',
        description: 'Restauro de tetos com molduras tradicionais em moradia centenária. Consolidação de estuque existente, reposição de molduras e pintura a cal em acabamento mate.',
        featuredImageUrl: `${LOCAL}/sala-depois.jpeg`,
        images: [
          { id: 'p6-1', url: `${LOCAL}/sala-depois.jpeg`, caption: 'Teto restaurado com molduras' },
        ],
        date: '2025-11',
        active: true,
      },
    ],
    order: 2,
    active: true,
  },
  {
    id: 'renovation',
    slug: 'reformas-remodelacoes',
    name: 'Reformas e Remodelações',
    description: 'Reformas parciais ou completas de casas e apartamentos, com foco na valorização de imóveis.',
    imageUrl: `${CDN}/CHCgVzpzvYOasoJp.jpeg`,
    subServices: [
      { id: 's9', name: 'Remodelação de cozinhas' },
      { id: 's10', name: 'Casas de banho' },
      { id: 's11', name: 'Renovação integral' },
      { id: 's12', name: 'Pavimentos e revestimentos' },
    ],
    works: [
      {
        id: 'rv1',
        title: 'Remodelação Integral Apartamento — Funchal',
        description: 'Renovação completa de apartamento incluindo cozinha, casa de banho, sala e quartos. Instalação de pavimento flutuante, pintura integral com cores personalizadas, substituição de porta de entrada com fechadura digital, e renovação de armários embutidos. Projecto concluído em 5 semanas.',
        featuredImageUrl: `${LOCAL}/cozinha-depois.jpeg`,
        images: [
          { id: 'rv1-1', url: `${LOCAL}/cozinha-antes.jpeg`, caption: 'Cozinha e roupeiro — estado inicial', isBefore: true },
          { id: 'rv1-2', url: `${LOCAL}/cozinha-depois.jpeg`, caption: 'Cozinha e roupeiro — renovados', isBefore: false },
          { id: 'rv1-3', url: `${LOCAL}/entrada-antes.jpeg`, caption: 'Entrada — porta antiga', isBefore: true },
          { id: 'rv1-4', url: `${LOCAL}/entrada-depois.jpeg`, caption: 'Entrada — porta nova com fechadura digital', isBefore: false },
          { id: 'rv1-5', url: `${LOCAL}/wc-antes.jpeg`, caption: 'Casa de banho — estado original' },
          { id: 'rv1-6', url: `${LOCAL}/quarto-detalhe.jpeg`, caption: 'Quarto — molduras e acabamentos' },
          { id: 'rv1-7', url: `${LOCAL}/varanda-depois.jpeg`, caption: 'Quarto com varanda — resultado final' },
        ],
        date: '2026-04',
        active: true,
      },
    ],
    order: 3,
    active: true,
  },
  {
    id: 'engineering',
    slug: 'engenharia-civil',
    name: 'Engenharia Civil e Apoio Técnico',
    description: 'Serviços de engenharia civil, elaboração de projetos complementares e avaliação técnica.',
    imageUrl: `${CDN}/wLsmmQYLwyBEYZJG.jpg`,
    subServices: [
      { id: 's13', name: 'Projectos de arquitectura' },
      { id: 's14', name: 'Licenciamento camarário' },
      { id: 's15', name: 'Vistorias e relatórios' },
      { id: 's16', name: 'Direcção de obras' },
    ],
    works: [
      {
        id: 'e1',
        title: 'Apoio Técnico em Obra — Machico',
        description: 'Direcção e fiscalização de obra de construção nova de moradia unifamiliar de 280m². Acompanhamento semanal, relatórios fotográficos de progresso, gestão de subempreiteiros e controlo de qualidade de materiais.',
        featuredImageUrl: `${CDN}/wLsmmQYLwyBEYZJG.jpg`,
        images: [
          { id: 'i14', url: `${CDN}/wLsmmQYLwyBEYZJG.jpg`, caption: 'Obra em fase de estrutura', isBefore: false },
          { id: 'i15', url: `${CDN}/oZepugZbFecnMfPJ.jpg`, caption: 'Detalhe de armação estrutural', isBefore: false },
        ],
        date: '2024-11',
        active: true,
      },
    ],
    order: 4,
    active: true,
  },
]

/* ─── Localization hook ───────────────────────────────────── */
export function useLocalizedServices(): ServiceCategory[] {
  const { i18n } = useTranslation()
  return useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const loc = (key: string, fallback: string): string =>
      (i18n.t as any)(key, { defaultValue: fallback })
    return SERVICES.map(svc => ({
      ...svc,
      name: loc(`serviceData.${svc.id}.name`, svc.name),
      description: loc(`serviceData.${svc.id}.description`, svc.description),
      subServices: svc.subServices.map(sub => ({
        ...sub,
        name: loc(`serviceData.${svc.id}.subs.${sub.id}`, sub.name),
      })),
      works: svc.works.map(work => ({
        ...work,
        title: loc(`serviceData.${svc.id}.works.${work.id}.title`, work.title),
        description: loc(`serviceData.${svc.id}.works.${work.id}.description`, work.description),
        images: work.images.map(img => ({
          ...img,
          caption: img.caption !== undefined
            ? loc(`serviceData.${svc.id}.works.${work.id}.captions.${img.id}`, img.caption)
            : undefined,
        })),
      })),
    }))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language])
}
