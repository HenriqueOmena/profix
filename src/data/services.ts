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
        title: 'Casa T3 Reformada — Funchal',
        description: 'Renovação completa de pintura interior de apartamento T3. Inclui preparação de superfícies, massa corrida em todas as divisões, pintura final em duas demãos com tinta premium lavável. Resultado: espaço renovado com acabamento de alta qualidade.',
        featuredImageUrl: `${CDN}/zWxKZUbnJcQsUoHq.jpg`,
        images: [
          { id: 'i3', url: `${CDN}/miQnEEeDSmiFYpgB.jpeg`, caption: 'Estado inicial das paredes', isBefore: true },
          { id: 'i4', url: `${CDN}/zWxKZUbnJcQsUoHq.jpg`, caption: 'Resultado final — sala principal', isBefore: false },
          { id: 'i5', url: `${CDN}/jcABrHTXeUqnLBXY.jpeg`, caption: 'Detalhe de acabamento', isBefore: false },
        ],
        date: '2024-12',
        active: true,
      },
      {
        id: 'p2',
        title: 'Fachada Edifício 4 Pisos — Câmara de Lobos',
        description: 'Pintura exterior de edifício residencial com produto anti-fungos e protecção UV adaptada ao clima da Madeira. Limpeza a pressão prévia, tratamento de fissuras com selante elástico e pintura final em duas demãos.',
        featuredImageUrl: `${CDN}/jcABrHTXeUqnLBXY.jpeg`,
        images: [
          { id: 'i6', url: `${CDN}/oZepugZbFecnMfPJ.jpg`, caption: 'Fachada antes da intervenção', isBefore: true },
          { id: 'i7', url: `${CDN}/jcABrHTXeUqnLBXY.jpeg`, caption: 'Resultado final', isBefore: false },
        ],
        date: '2024-10',
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
        title: 'Remodelação Completa T2 — Funchal',
        description: 'Renovação total de apartamento T2 incluindo cozinha, 2 casas de banho e sala. Novo pavimento em microcimento, azulejos de grande formato, iluminação embutida LED e carpintaria de interiores à medida. Projecto concluído em 6 semanas.',
        featuredImageUrl: `${CDN}/CHCgVzpzvYOasoJp.jpeg`,
        images: [
          { id: 'i8', url: `${CDN}/miQnEEeDSmiFYpgB.jpeg`, caption: 'Cozinha — estado inicial', isBefore: true },
          { id: 'i9', url: `${CDN}/CHCgVzpzvYOasoJp.jpeg`, caption: 'Cozinha renovada', isBefore: false },
          { id: 'i10', url: `${CDN}/jcABrHTXeUqnLBXY.jpeg`, caption: 'Casa de banho renovada', isBefore: false },
          { id: 'i11', url: `${CDN}/oZepugZbFecnMfPJ.jpg`, caption: 'Detalhe pavimento microcimento', isBefore: false },
        ],
        date: '2025-01',
        active: true,
      },
      {
        id: 'rv2',
        title: 'Reabilitação Espaço Comercial — Av. do Mar',
        description: 'Reabilitação integral de loja de 120m² com criação de zona de atendimento, dois escritórios privativos e sala de reuniões. Inclui instalações técnicas, pavimento vinílico e tecto falso com iluminação embutida.',
        featuredImageUrl: `${CDN}/miQnEEeDSmiFYpgB.jpeg`,
        images: [
          { id: 'i12', url: `${CDN}/miQnEEeDSmiFYpgB.jpeg`, caption: 'Espaço em funcionamento', isBefore: false },
          { id: 'i13', url: `${CDN}/wLsmmQYLwyBEYZJG.jpg`, caption: 'Detalhe zona de reuniões', isBefore: false },
        ],
        date: '2024-08',
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
