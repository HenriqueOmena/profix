import type { ServiceCategory, PortfolioItem } from '../types'

const CDN = 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663329997620'

/* ─── Service Categories ─────────────────────────────────── */
export const MOCK_CATEGORIES: ServiceCategory[] = [
  {
    id: 'repairs',
    slug: 'reparacoes-manutencao',
    name: 'Reparações e Manutenção Técnica',
    shortDescription: 'Intervenções rápidas em elétrica, canalização e ajustes funcionais.',
    fullDescription:
      'Realizamos pequenas e médias intervenções técnicas em habitações e espaços comerciais na Região Autónoma da Madeira. ' +
      'A nossa equipa actua em instalações eléctricas, canalização, substituição de revestimentos, reparação de infiltrações e correcções estruturais menores. ' +
      'Todos os trabalhos são executados com materiais certificados e garantia de qualidade.',
    highlights: [
      'Instalações eléctricas e quadros de distribuição',
      'Canalização e reparação de fugas',
      'Substituição de revestimentos e pavimentos',
      'Reparação de infiltrações e humidades',
      'Vedações, calafetagem e isolamentos',
      'Resposta em 24 horas para urgências',
    ],
    iconKey: 'repairs',
    order: 1,
    active: true,
  },
  {
    id: 'painting',
    slug: 'pintura-acabamentos',
    name: 'Pintura e Acabamentos',
    shortDescription: 'Pintura interior e exterior com acabamentos de alta qualidade.',
    fullDescription:
      'Serviços completos de pintura para habitações, edifícios e espaços comerciais. ' +
      'Trabalhamos com tintas de qualidade superior adaptadas ao clima húmido da Madeira, ' +
      'garantindo durabilidade e estética. Inclui preparação de superfícies, correcção de imperfeições e acabamentos finos.',
    highlights: [
      'Pintura interior e exterior',
      'Preparação e primário de superfícies',
      'Estuque e massa corrida',
      'Revestimentos decorativos e texturas',
      'Protecção de madeiras e gradeamentos',
      'Orçamento por m² sem surpresas',
    ],
    iconKey: 'painting',
    order: 2,
    active: true,
  },
  {
    id: 'renovation',
    slug: 'reformas-remodelacoes',
    name: 'Reformas e Remodelações',
    shortDescription: 'Reformas parciais ou completas que valorizam o seu imóvel.',
    fullDescription:
      'Projecto e execução de reformas residenciais e comerciais — desde a cozinha ou casa de banho ' +
      'até à renovação integral de apartamentos e moradias. Coordenamos todos os ofícios (pedreiro, electricista, ' +
      'canalizador, carpinteiro) com um único ponto de contacto, prazo definido e orçamento fechado.',
    highlights: [
      'Remodelação de cozinhas e casas de banho',
      'Renovação integral de apartamentos e moradias',
      'Pavimentos: cerâmica, soalho e microcimento',
      'Carpintaria de interiores e roupeiros',
      'Gestão de subempreiteiros e materiais',
      'Orçamento fixo sem derrapagens',
    ],
    iconKey: 'renovation',
    order: 3,
    active: true,
  },
  {
    id: 'engineering',
    slug: 'engenharia-civil',
    name: 'Engenharia Civil e Apoio Técnico',
    shortDescription: 'Projectos, vistorias e acompanhamento técnico por engenheiros qualificados.',
    fullDescription:
      'Serviços de engenharia civil prestados por técnicos certificados: elaboração de projectos de arquitectura, ' +
      'requerimentos junto à Câmara Municipal do Funchal, vistorias de patologias estruturais e acompanhamento de obra. ' +
      'Apoio técnico a particulares, condomínios e promotores imobiliários.',
    highlights: [
      'Projectos de arquitectura e engenharia',
      'Licenciamento e aprovação camarária',
      'Vistorias e relatórios de patologias',
      'Direcção e fiscalização de obras',
      'Medições e orçamentação técnica',
      'Apoio a condomínios e administrações',
    ],
    iconKey: 'engineering',
    order: 4,
    active: true,
  },
]

/* ─── Portfolio Items ────────────────────────────────────── */
export const MOCK_PORTFOLIO: PortfolioItem[] = [
  {
    id: 'p-rep-1',
    categoryId: 'repairs',
    title: 'Manutenção técnica residencial',
    description: 'Intervenção eléctrica e canalização em habitação particular no Funchal',
    imageUrl: `${CDN}/oZepugZbFecnMfPJ.jpg`,
    date: '2024-11-10',
    featured: true,
    active: true,
  },
  {
    id: 'p-rep-2',
    categoryId: 'repairs',
    title: 'Reparação de infiltrações',
    description: 'Correcção de infiltrações em cobertura plana, Santa Cruz',
    imageUrl: `${CDN}/jcABrHTXeUqnLBXY.jpeg`,
    date: '2024-09-22',
    featured: false,
    active: true,
  },
  {
    id: 'p-pin-1',
    categoryId: 'painting',
    title: 'Pintura de apartamento T3',
    description: 'Renovação de pintura interior com estuque e massa corrida, Funchal',
    imageUrl: `${CDN}/zWxKZUbnJcQsUoHq.jpg`,
    date: '2024-12-05',
    featured: true,
    active: true,
  },
  {
    id: 'p-pin-2',
    categoryId: 'painting',
    title: 'Fachada exterior — Câmara de Lobos',
    description: 'Pintura exterior com produto anti-fungos, edifício de 4 pisos',
    imageUrl: `${CDN}/miQnEEeDSmiFYpgB.jpeg`,
    date: '2024-10-18',
    featured: false,
    active: true,
  },
  {
    id: 'p-ren-1',
    categoryId: 'renovation',
    title: 'Remodelação completa T2',
    description: 'Renovação total de apartamento — cozinha, casas de banho e pavimentos, Funchal',
    imageUrl: `${CDN}/CHCgVzpzvYOasoJp.jpeg`,
    date: '2025-01-20',
    featured: true,
    active: true,
  },
  {
    id: 'p-ren-2',
    categoryId: 'renovation',
    title: 'Reabilitação de espaço comercial',
    description: 'Projecto de reabilitação integral de loja, Avenida do Mar',
    imageUrl: `${CDN}/miQnEEeDSmiFYpgB.jpeg`,
    date: '2024-08-14',
    featured: false,
    active: true,
  },
  {
    id: 'p-ren-3',
    categoryId: 'renovation',
    title: 'Cozinha em microcimento',
    description: 'Revestimento em microcimento com bancada inox e iluminação embutida',
    imageUrl: `${CDN}/jcABrHTXeUqnLBXY.jpeg`,
    date: '2024-07-30',
    featured: true,
    active: true,
  },
  {
    id: 'p-eng-1',
    categoryId: 'engineering',
    title: 'Apoio técnico em obra',
    description: 'Direcção e fiscalização de projecto de engenharia civil, Machico',
    imageUrl: `${CDN}/wLsmmQYLwyBEYZJG.jpg`,
    date: '2024-11-28',
    featured: true,
    active: true,
  },
  {
    id: 'p-eng-2',
    categoryId: 'engineering',
    title: 'Vistoria estrutural',
    description: 'Relatório de patologias e proposta de intervenção, edifício anos 80, Funchal',
    imageUrl: `${CDN}/oZepugZbFecnMfPJ.jpg`,
    date: '2024-06-12',
    featured: false,
    active: true,
  },
]

/* ─── Helpers ────────────────────────────────────────────── */
export function getCategoryBySlug(slug: string): ServiceCategory | undefined {
  return MOCK_CATEGORIES.find(c => c.slug === slug && c.active)
}

export function getPortfolioByCategory(categoryId: string | null): PortfolioItem[] {
  return MOCK_PORTFOLIO.filter(
    p => p.active && (categoryId === null || p.categoryId === categoryId),
  )
}

export function getPortfolioPreview(categoryId: string, limit = 3): PortfolioItem[] {
  return MOCK_PORTFOLIO.filter(p => p.active && p.categoryId === categoryId).slice(0, limit)
}
