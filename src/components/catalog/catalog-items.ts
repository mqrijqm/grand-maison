import { ARTICLE_COPY, PROGRAM_ITEMS } from '@/lib/catalog-copy'
import { CATEGORIES, PRODUCTS, USES, type Product } from '@/lib/shop'

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
}

export const BRANDS: Brand[] = [
  {
    id: 'tondach',
    name: 'Tondach',
    logo: '/brands/tondach.svg',
    text: 'Glineni crijep i sistemska oprema za kose krovove iz programa Wienerberger: Continental, Traditon, Twiston, Planoton, Contiton, Veneton i Biber.',
  },
  {
    id: 'porotherm',
    name: 'Porotherm',
    logo: '/brands/porotherm.svg',
    text: 'Opeka Wienerberger za nosive, spoljne i pregradne zidove, od deset do pedeset centimetara. Profi blokovi se zidaju ljepilom Dryfix.extra.',
  },
  {
    id: 'baumalt',
    name: 'Baumalt',
    logo: '/brands/baumalt.svg',
    text: 'Mašinski malteri, ljepila za keramiku i dekorativni malteri za fasadu. Grand Company je na Baumaltovoj listi prodajnih lokacija za Banju Luku.',
  },
  {
    id: 'ostalo',
    name: 'Suha gradnja i izolacija',
    text: 'Gips-kartonske ploče, pocinčani profili, kamena vuna, gipsane mase i pribor za montažu. Proizvođača i dostupnost potvrđuje prodaja.',
  },
]

export const CATEGORY_NAMES: Record<string, string> = {
  'krovni-sistemi': 'Krovni sistemi',
  'zidni-blokovi': 'Zidni blokovi',
  'malteri-ljepila': 'Malteri i ljepila',
  ...Object.fromEntries(CATEGORIES.map((c) => [c.id, c.name])),
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
  /** Stranica artikla (samo za artikle iz kataloga stovarišta) */
  href?: string
  /** Zvanična stranica proizvođača */
  source?: string
  product?: Product
  featured: boolean
}

const BRAND_OF: Record<string, BrandId> = { Tondach: 'tondach', Porotherm: 'porotherm', Baumalt: 'baumalt' }

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
    source: item.source,
    featured: false,
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
}))

export const CATALOG_ITEMS: CatalogItem[] = [...programItems, ...stockItems]

export const normalize = (value: string) =>
  value.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'dj')

export const inquiryFormHref = (item: CatalogItem) =>
  `/upit-za-izvodjace?naziv=${encodeURIComponent(item.name)}${item.category === 'krovni-sistemi' || item.category === 'zidni-blokovi' ? '&program=zidni-krovni' : ''}`
