import { ARTICLE_COPY, PROGRAM_ITEMS } from '@/lib/catalog-copy'
import { ARTICLE_COPY_EN, PROGRAM_ITEMS_EN } from '@/lib/catalog-copy-en'
import { CATEGORIES, PRODUCTS, USES, categoryName, pDesc, pName, pSpec, workName, type Product } from '@/lib/shop'
import { UNIT_EN } from '@/gc/gc'

// Jedinstven spisak artikala za katalog po proizvođačima (po uzoru na mtponos.studioblink.ba/asortiman):
// provjereni proizvođači (Tondach, Porotherm, Baumalt) sa artiklima sa njihovih zvaničnih stranica, i grupa
// suhe gradnje i izolacije za koju proizvođač nije javno potvrđen.

export type BrandId = 'tondach' | 'porotherm' | 'baumalt' | 'ostalo'

export type Brand = {
  id: BrandId
  name: string
  /** Logo proizvođača u tamnoplavoj boji (zvanični fajl, samo prebojen); `ostalo` nema logo. */
  logo?: string
  logoRatio?: number
  text: string
  nameEn?: string
  textEn?: string
}

export const BRANDS: Brand[] = [
  {
    id: 'tondach',
    name: 'Tondach',
    logo: '/brands/tondach.svg',
    text: 'Glineni crijep i sistemska oprema za kose krovove iz programa Wienerberger: Continental, Traditon, Twiston, Planoton, Contiton, Veneton i Biber. Grand Company je na Wienerbergerovoj listi prodajnih mjesta; dostupnost modela potvrđuje prodaja.',
    textEn: 'Clay roof tiles and system accessories for pitched roofs from the Wienerberger range: Continental, Traditon, Twiston, Planoton, Contiton, Veneton and Biber. Grand Company is on Wienerberger’s list of points of sale; sales confirms the availability of each model.',
  },
  {
    id: 'porotherm',
    name: 'Porotherm',
    logo: '/brands/porotherm.svg',
    text: 'Opeka Wienerberger za nosive, spoljne i pregradne zidove, od deset do pedeset centimetara. Profi blokovi se zidaju ljepilom Dryfix.extra. Dostupnost modela potvrđuje prodaja.',
    textEn: 'Wienerberger clay blocks for load-bearing, external and partition walls, from ten to fifty centimetres. Profi blocks are laid with Dryfix.extra adhesive. Sales confirms the availability of each model.',
  },
  {
    id: 'baumalt',
    name: 'Baumalt',
    logo: '/brands/baumalt.svg',
    text: 'Mašinski malteri, ljepila za keramiku i dekorativni malteri za fasadu. Grand Company je na Baumaltovoj listi prodajnih lokacija za Banju Luku.',
    textEn: 'Machine-applied plasters, tile adhesives and decorative facade renders. Grand Company is on Baumalt’s list of points of sale for Banja Luka.',
  },
  {
    id: 'ostalo',
    name: 'Suha gradnja i izolacija',
    nameEn: 'Drywall and insulation',
    text: 'Sistem suhe gradnje i kamena vuna (javni listinzi firme). Artikli ispod su primjeri iz tih sistema: proizvođača, model i dostupnost potvrđuje prodaja.',
    textEn: 'Drywall system and stone wool (the company’s public listings). The items below are examples from those systems: sales confirms the manufacturer, model and availability.',
  },
]

export const CATEGORY_NAMES: Record<string, string> = {
  'krovni-sistemi': 'Krovni sistemi',
  'zidni-blokovi': 'Zidni sistemi',
  'malteri-ljepila': 'Građevinska hemija',
  ...Object.fromEntries(CATEGORIES.map((c) => [c.id, c.name])),
}

export const CATEGORY_NAMES_EN: Record<string, string> = {
  'krovni-sistemi': 'Roofing systems',
  'zidni-blokovi': 'Wall systems',
  'malteri-ljepila': 'Construction chemicals',
  ...Object.fromEntries(CATEGORIES.map((c) => [c.id, categoryName(c.id, 'en')])),
}

export type CatalogItem = {
  key: string
  brand: BrandId
  brandName: string
  /** Kratak naziv na kartici (kao šifra/dekor na mtponos) */
  code: string
  name: string
  spec: string
  lead: string
  category: string
  unit: string
  uses: string[]
  image: string
  /** Fotografija objekta/projekta koja se pojavi na hover (prvo stanje je uvijek samo artikl) */
  hover?: string
  /** Stranica artikla (samo za artikle iz kataloga stovarišta) */
  href?: string
  /** Zvanična stranica proizvođača */
  source?: string
  product?: Product
  featured: boolean
  /** English parallel text (additive) */
  en: { brandName: string; code: string; name: string; spec: string; lead: string; uses: string[]; unit: string }
}

const BRAND_OF: Record<string, BrandId> = { Tondach: 'tondach', Porotherm: 'porotherm', Baumalt: 'baumalt' }

// Hover: Tondach — kuća pokrivena baš tim modelom (referenca sa stranice proizvoda); Porotherm — objekti od
// opeke ili zidanje Profi blokova ljepilom Dryfix; Baumalt — fotografija radova (malterisanje, keramika, fasada).
const PROJECT: Record<string, string> = {
  'tondach-continental-12': '/catalog/tondach-continental-12-projekt.webp',
  'tondach-traditon-9': '/catalog/tondach-traditon-9-projekt.webp',
  'tondach-twiston-9': '/catalog/tondach-twiston-9-projekt.webp',
  'tondach-planoton-10': '/catalog/tondach-planoton-10-projekt.webp',
  'tondach-contiton-9': '/catalog/tondach-contiton-9-projekt.webp',
  'tondach-veneton-13': '/catalog/tondach-veneton-13-projekt.webp',
  'tondach-biber': '/catalog/tondach-biber-projekt.webp',
}
const projectOf = (id: string, brand: string, fallback: string) =>
  PROJECT[id] ??
  (brand === 'Porotherm' ? `/catalog/porotherm-${/profi/.test(id) ? 'dryfix' : 'objekti'}-projekt.webp` : brand === 'Baumalt' ? fallback : undefined)

const programItems: CatalogItem[] = PROGRAM_ITEMS.map((item) => {
  const brand = BRAND_OF[item.brand] ?? 'ostalo'
  return {
    key: item.id,
    brand,
    brandName: item.brand,
    code: item.name.replace(new RegExp(`^${item.brand}\\s+`), ''),
    name: item.name,
    spec: item.spec,
    lead: item.lead,
    category: item.program,
    unit: item.unit,
    uses: item.uses,
    // Zvanična fotografija proizvođača (wienerberger.ba, baumalt.ba), samo kvadratni izrez i ujednačena podloga;
    // izvori u public/catalog/sources.json.
    image: `/catalog/${item.id}.webp`,
    hover: projectOf(item.id, item.brand, item.image),
    source: item.source,
    featured: false,
    en: {
      brandName: item.brand,
      code: (PROGRAM_ITEMS_EN[item.id]?.name ?? item.name).replace(new RegExp(`^${item.brand}\\s+`), ''),
      name: PROGRAM_ITEMS_EN[item.id]?.name ?? item.name,
      spec: PROGRAM_ITEMS_EN[item.id]?.spec ?? item.spec,
      lead: PROGRAM_ITEMS_EN[item.id]?.lead ?? item.lead,
      uses: PROGRAM_ITEMS_EN[item.id]?.uses ?? item.uses,
      unit: UNIT_EN[item.unit] ?? item.unit,
    },
  }
})

const useName = (id: string) => USES.find((u) => u.id === id)?.name ?? (id === 'podovi' ? 'Podovi' : id)

const stockItems: CatalogItem[] = PRODUCTS.map((p) => ({
  key: p.sku,
  brand: 'ostalo',
  brandName: 'Suha gradnja i izolacija',
  code: p.name,
  name: p.name,
  spec: p.spec,
  lead: ARTICLE_COPY[p.sku]?.lead ?? p.desc,
  category: p.category,
  unit: p.unit,
  uses: p.uses.map(useName),
  image: p.image,
  href: `/prodavnica/${p.sku}`,
  product: p,
  featured: !!p.featured,
  en: {
    brandName: 'Drywall and insulation',
    code: pName(p, 'en'),
    name: pName(p, 'en'),
    spec: pSpec(p, 'en'),
    lead: ARTICLE_COPY_EN[p.sku]?.lead ?? pDesc(p, 'en'),
    uses: p.uses.map((u) => workName(u, 'en')),
    unit: UNIT_EN[p.unit] ?? p.unit,
  },
}))

export const CATALOG_ITEMS: CatalogItem[] = [...programItems, ...stockItems]

export const normalize = (value: string) =>
  value.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'dj')

export const inquiryFormHref = (item: CatalogItem) =>
  `/upit-za-izvodjace?naziv=${encodeURIComponent(item.name)}${item.category === 'krovni-sistemi' || item.category === 'zidni-blokovi' ? '&program=zidni-krovni' : ''}`
