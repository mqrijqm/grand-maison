// Katalog prodavnice. Podaci dolaze iz src/gc (zajednički katalog Grand Company, ne mijenja se ovdje);
// ovaj fajl ih samo prilagođava oblicima koje koriste komponente prodavnice (Product, CATEGORIES, BUNDLES...).

import {
  CATEGORIES as GC_CATEGORIES,
  PRODUCTS as GC_PRODUCTS,
  WALL_SYSTEMS,
  bySku,
  defaultQty,
  plural,
  type CategoryId,
  type Product as GcProduct,
  type WallSystem,
  CATEGORIES_EN,
  PRODUCTS_EN,
  UNIT_EN,
  PACKNAME_EN,
  BRAND_EN,
  WALL_SYSTEMS_EN,
  type Lang,
} from '@/gc/gc'

export type { CategoryId, Lang }
export { plural, defaultQty }

export type UseId = 'pregradni-zid' | 'spusteni-plafon' | 'fasada' | 'potkrovlje' | 'podovi'
export type SortId = 'preporuceno' | 'cijena-rastuce' | 'cijena-opadajuce' | 'naziv'

export type Product = GcProduct & {
  /** Isto što i sku; komponente prodavnice rade sa `id` */
  id: string
  uses: UseId[]
  badge?: string
}

export type Category = (typeof GC_CATEGORIES)[number] & { name: string }

export const CATEGORIES: Category[] = GC_CATEGORIES.map((c) => ({ ...c, name: c.label }))

export const USES: { id: UseId; name: string; hint: string }[] = [
  { id: 'pregradni-zid', name: 'Pregradni zid', hint: 'Ploče, CW i UW profili, vuna, pribor' },
  { id: 'spusteni-plafon', name: 'Spušteni plafon', hint: 'Ploče, CD i UD profili, ovjesi' },
  { id: 'fasada', name: 'Fasada i demit', hint: 'Stiropor, ljepilo, masa za armiranje' },
  { id: 'potkrovlje', name: 'Potkrovlje', hint: 'Vuna u rolni, ploče, CD profili' },
]

const USES_EN: Record<string, { name: string; hint: string }> = {
  'pregradni-zid': { name: 'Partition wall', hint: 'Boards, CW and UW profiles, wool, accessories' },
  'spusteni-plafon': { name: 'Suspended ceiling', hint: 'Boards, CD and UD profiles, hangers' },
  fasada: { name: 'Facade and ETICS', hint: 'Polystyrene, adhesive, reinforcing compound' },
  potkrovlje: { name: 'Attic', hint: 'Roll wool, boards, CD profiles' },
  podovi: { name: 'Floors', hint: '' },
}
export const workName = (id: string, lang: Lang = 'sr') => {
  const u = USES.find((x) => x.id === id)
  if (lang === 'en') return USES_EN[id]?.name ?? u?.name ?? id
  return u?.name ?? (id === 'podovi' ? 'Podovi' : id)
}
export const workHint = (id: string, lang: Lang = 'sr') => (lang === 'en' ? USES_EN[id]?.hint : USES.find((x) => x.id === id)?.hint) ?? ''

// Za koju vrstu radova se artikal koristi. Izvedeno iz namjene artikla (opis u katalogu i sistemi zidova).
const DRY = ['pregradni-zid', 'spusteni-plafon', 'potkrovlje'] as const satisfies UseId[]
const USE_MAP: Record<string, UseId[]> = {
  'GKP-001': [...DRY],
  'GKP-002': [...DRY],
  'GKP-003': [...DRY],
  'GKP-004': ['pregradni-zid'],
  'PRF-050': ['pregradni-zid'],
  'PRF-075': ['pregradni-zid'],
  'PRF-100': ['pregradni-zid'],
  'PRF-UW75': ['pregradni-zid'],
  'PRF-CD60': ['spusteni-plafon', 'potkrovlje'],
  'PRF-UD28': ['spusteni-plafon', 'potkrovlje'],
  'ISO-001': ['pregradni-zid', 'spusteni-plafon'],
  'ISO-002': ['pregradni-zid', 'potkrovlje'],
  'ISO-003': ['potkrovlje'],
  'ISO-004': ['fasada'],
  'ISO-005': ['podovi'],
  'ISO-006': ['fasada'],
  'ISO-007': ['podovi', 'fasada'],
  'CHM-001': [...DRY],
  'CHM-002': [...DRY],
  'CHM-003': ['fasada'],
  'CHM-004': ['fasada'],
  'CHM-005': ['podovi'],
  'CHM-006': ['podovi'],
  'CHM-007': ['pregradni-zid', 'spusteni-plafon'],
  'ACC-001': [...DRY],
  'ACC-002': [...DRY],
  'ACC-003': [...DRY],
  'ACC-004': [...DRY],
  'ACC-005': ['pregradni-zid', 'spusteni-plafon'],
  'ACC-006': ['spusteni-plafon', 'potkrovlje'],
}

// Studijske fotografije artikala (generisane za ovaj sajt, ista pozadina kao --plate).
// Zamjenjuju crteže i stock fotografije iz zajedničkog kataloga.
export const shotOf = (sku: string) => `/shop/${sku}.webp`

// Artikli koji nisu u ponudi kataloga (vijci su povučeni iz ponude), ali ostaju u podacima —
// norme utroška u kalkulatoru i demo narudžbe i dalje ih navode po šifri.
const NOT_IN_OFFER = new Set(['ACC-001'])

const decorate = (p: GcProduct): Product => ({
  ...p,
  image: shotOf(p.sku),
  photo: shotOf(p.sku),
  drawing: false,
  illustrative: false,
  id: p.sku,
  uses: USE_MAP[p.sku] ?? [],
  badge: p.featured ? 'Najčešće birano' : undefined,
})

/** Svi artikli iz podataka, i oni van ponude — korpa, kalkulator i demo narudžbe rade sa njima. */
export const ALL_PRODUCTS: Product[] = GC_PRODUCTS.map(decorate)

/** Katalog: samo artikli koji su u ponudi. */
export const PRODUCTS: Product[] = ALL_PRODUCTS.filter((p) => !NOT_IN_OFFER.has(p.sku))

export const PRODUCT_MAP: Record<string, Product> = Object.fromEntries(ALL_PRODUCTS.map((p) => [p.id, p]))
export const FEATURED = PRODUCTS.filter((p) => p.featured)

export const categoryName = (id: CategoryId, lang: Lang = 'sr') =>
  lang === 'en' ? (CATEGORIES_EN[id]?.label ?? '') : (CATEGORIES.find((c) => c.id === id)?.name ?? '')

// ——— Engleski tekstovi artikala (podaci ostaju srpski, paralelni tekst je u gc/gc-en.ts) ———
type Named = { sku: string; name: string; spec?: string; desc?: string }
export const pName = (p: Named, lang: Lang = 'sr') => (lang === 'en' ? (PRODUCTS_EN[p.sku]?.name ?? p.name) : p.name)
export const pSpec = (p: Named, lang: Lang = 'sr') => (lang === 'en' ? (PRODUCTS_EN[p.sku]?.spec ?? p.spec ?? '') : (p.spec ?? ''))
export const pDesc = (p: Named, lang: Lang = 'sr') => (lang === 'en' ? (PRODUCTS_EN[p.sku]?.desc ?? p.desc ?? '') : (p.desc ?? ''))
export const brandL = (brand: string, lang: Lang = 'sr') => (lang === 'en' ? (BRAND_EN[brand] ?? brand) : brand)
export const unitL = (unit: string, lang: Lang = 'sr') => (lang === 'en' ? (UNIT_EN[unit] ?? unit) : unit)
export const packNameL = (name: string, lang: Lang = 'sr') => (lang === 'en' ? (PACKNAME_EN[name] ?? name) : name)
/** Jezik iz html[lang] — za store i helpere koji nisu komponente (cart.ts obavijesti). */
export const curLang = (): Lang => (typeof document !== 'undefined' && document.documentElement.lang === 'en' ? 'en' : 'sr')

// ——— Kompleti: sistemi zidova, količine po normi W111 za zid 10 m² ———

const round2 = (n: number) => Math.round(n * 100) / 100

export const KIT_WALL = { L: 4, H: 2.5 } as const

export type BomItem = { sku: string; need: string; qty: number; note: string; needEn?: string; noteEn?: string }

const f2 = new Intl.NumberFormat('sr-Latn-BA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const f0 = new Intl.NumberFormat('sr-Latn-BA', { maximumFractionDigits: 0 })
const e2 = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const e0 = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })

// Stavka sa tekstom na oba jezika: `need` je količina u jedinici proračuna, `note` objašnjenje pakovanja.
const bom = (sku: string, need: [number, string], qty: number, note: [string, string], dec = 2): BomItem => {
  const [n, unit] = need
  const sr = dec === 0 ? f0 : f2
  const en = dec === 0 ? e0 : e2
  return { sku, need: `${sr.format(n)} ${unit}`, qty, note: note[0], needEn: `${en.format(n)} ${unit === 'kom' ? 'pcs' : unit}`, noteEn: note[1] }
}

type W111Input = {
  L: number
  H: number
  cladding: 'single' | 'double'
  plateSku: string
  cwSku: string
  woolSku?: string
  fillerSku: string
  soundTape?: boolean
}

// Port funkcije calcW111 iz js/core.js (HTML sajt): ista norma utroška po m² zida.
export function calcW111({ L, H, cladding, plateSku, cwSku, woolSku, fillerSku, soundTape }: W111Input) {
  const P = L * H
  const items: BomItem[] = []

  const plateM2 = P * (cladding === 'double' ? 4.1 : 2.05)
  const boards = Math.ceil(plateM2 / 2.5)
  items.push(bom(plateSku, [plateM2, 'm²'], boards * 2.5, [`${boards} ploča po 2,5 m²`, `${boards} boards of 2.5 m²`]))

  const cwM = (L / 0.6) * H * 1.05
  const cwPieces = Math.ceil(cwM / 3)
  items.push(bom(cwSku, [cwM, 'm'], cwPieces, [`${cwPieces} komada po 3 m`, `${cwPieces} pcs of 3 m`]))

  const uwM = L * 2 * 1.05
  const uwPieces = Math.ceil(uwM / 4)
  items.push(bom('PRF-UW75', [uwM, 'm'], uwPieces, [`${uwPieces} komada po 4 m`, `${uwPieces} pcs of 4 m`]))

  if (woolSku) {
    const woolM2 = P * 1.05
    const panels = Math.ceil(woolM2 / 0.6)
    items.push(bom(woolSku, [woolM2, 'm²'], round2(panels * 0.6), [`${panels} ploča po 0,6 m²`, `${panels} slabs of 0.6 m²`]))
  }

  // 0,5 kg/m² Uniflott za standardni W111 (Knauf tabela) — ista norma kao u lib/w111.ts.
  const fillerKg = P * 0.5
  const bagSize = fillerSku === 'CHM-001' ? 5 : 25
  const bags = Math.ceil(fillerKg / bagSize)
  items.push(bom(fillerSku, [fillerKg, 'kg'], bags, [`${bags} vreća po ${bagSize} kg`, `${bags} bags of ${bagSize} kg`]))

  const screws = Math.ceil(P * 25)
  const boxes = Math.ceil(screws / 1000)
  items.push(bom('ACC-001', [screws, 'kom'], boxes, [`${boxes} kutija po 1000 komada`, `${boxes} boxes of 1,000 pcs`], 0))

  // Bandaž traka nije dio sistema uz Uniflott — ide po potrebi, na rezanim i poprečnim spojevima.
  const tapeM = L * 1.5
  const rolls = Math.ceil(tapeM / 25)
  items.push(bom('ACC-003', [tapeM, 'm'], rolls, [`${rolls} rola po 25 m, po potrebi`, `${rolls} rolls of 25 m, as needed`]))

  if (soundTape) {
    const stRolls = Math.ceil(uwM / 30)
    items.push(bom('ACC-005', [uwM, 'm'], stRolls, [`${stRolls} rola po 30 m`, `${stRolls} rolls of 30 m`]))
  }

  return { P, items }
}

// ——— D112 spušteni plafon (orijentaciono) ———
// Približne vrijednosti standardne Knauf D112 norme po m² plafona (zaokruženo naviše, konzervativno):
//   ploča 1,05 m²/m² (5% otpada), CD 60/27 ≈ 4,5 m/m² (nosivi + montažni red), UD 28/27 = obim prostorije
//   + 5%, direktni ovjes ≈ 1,3 kom/m², vijci TN 25 ≈ 17 kom/m², masa za spojeve ≈ 0,35 kg/m²,
//   traka za spojeve ≈ 1,3 m/m². Nije zamjena za projekat — UI to prikazuje kao "orijentaciono".
type D112Input = { L: number; W: number; plateSku: string }

export function calcD112({ L, W, plateSku }: D112Input) {
  const P = L * W
  const items: BomItem[] = []

  const plateM2 = P * 1.05
  const boards = Math.ceil(plateM2 / 2.5)
  items.push(bom(plateSku, [plateM2, 'm²'], boards * 2.5, [`${boards} ploča po 2,5 m²`, `${boards} boards of 2.5 m²`]))

  const cdM = P * 4.5
  const cdPieces = Math.ceil(cdM / 4)
  items.push(bom('PRF-CD60', [cdM, 'm'], cdPieces, [`${cdPieces} komada po 4 m`, `${cdPieces} pcs of 4 m`]))

  const udM = 2 * (L + W) * 1.05
  const udPieces = Math.ceil(udM / 3)
  items.push(bom('PRF-UD28', [udM, 'm'], udPieces, [`${udPieces} komada po 3 m`, `${udPieces} pcs of 3 m`]))

  const hangers = Math.ceil(P * 1.3)
  const hangerPacks = Math.ceil(hangers / 100)
  items.push(bom('ACC-006', [hangers, 'kom'], hangerPacks, [`${hangerPacks} pakovanja po 100 komada`, `${hangerPacks} packs of 100 pcs`], 0))

  const screws = Math.ceil(P * 17)
  const boxes = Math.ceil(screws / 1000)
  items.push(bom('ACC-001', [screws, 'kom'], boxes, [`${boxes} kutija po 1000 komada`, `${boxes} boxes of 1,000 pcs`], 0))

  const fillerKg = P * 0.35
  const bags = Math.ceil(fillerKg / 5)
  items.push(bom('CHM-001', [fillerKg, 'kg'], bags, [`${bags} vreća po 5 kg`, `${bags} bags of 5 kg`]))

  const tapeM = P * 1.3
  const rolls = Math.ceil(tapeM / 25)
  items.push(bom('ACC-003', [tapeM, 'm'], rolls, [`${rolls} rola po 25 m`, `${rolls} rolls of 25 m`]))

  return { P, items }
}

// ——— DEMIT kontaktna fasada (orijentaciono) ———
// Samo artikli iz kataloga: stiropor (EPS 70 ili grafitni Neopor), Ceresit CT 83 za lijepljenje ploča
// i CT 85 za armirni sloj. Približni utrošci (konzervativno): EPS 1,05 m²/m², CT 83 ≈ 4,5 kg/m²,
// CT 85 ≈ 4 kg/m². Mrežica, tiplovi i završni malter nisu u katalogu — UI to napominje.
type DemitInput = { A: number; epsSku: string }

export function calcDemit({ A, epsSku }: DemitInput) {
  const items: BomItem[] = []
  const epsM2 = Math.ceil(A * 1.05 * 2) / 2
  items.push(bom(epsSku, [epsM2, 'm²'], epsM2, [`${f2.format(epsM2)} m² ploča`, `${e2.format(epsM2)} m² of boards`]))

  const glueKg = A * 4.5
  const glueBags = Math.ceil(glueKg / 25)
  items.push(bom('CHM-003', [glueKg, 'kg'], glueBags, [`${glueBags} vreća po 25 kg`, `${glueBags} bags of 25 kg`]))

  const meshKg = A * 4
  const meshBags = Math.ceil(meshKg / 25)
  items.push(bom('CHM-004', [meshKg, 'kg'], meshBags, [`${meshBags} vreća po 25 kg`, `${meshBags} bags of 25 kg`]))

  return { P: A, items }
}

export type Bundle = {
  id: string
  code: string
  name: string
  area: string
  note: string
  build: string
  nameEn?: string
  areaEn?: string
  noteEn?: string
  buildEn?: string
  rw: number | null
  profile: string
  thickness: number
  /** Firma nije odobrila popust na komplete */
  off: number
  /** Stavke sa količinama; prazno kad norma W111 ne važi za sistem (plafon, dvostruka potkonstrukcija) */
  items: BomItem[]
  skus: string[]
}

// Norma W111 važi za zid na jednom redu CW profila: W111 (jednostruka) i W112 (dvostruka obloga).
function bundleOf(s: WallSystem): Bundle {
  const find = (prefix: string) => s.skus.find((k) => k.startsWith(prefix))
  const plateSku = find('GKP-')
  const cwSku = s.skus.find((k) => /^PRF-0\d\d$|^PRF-1\d\d$/.test(k))
  const fillerSku = find('CHM-')
  const fits = (s.code === 'W111' || s.code === 'W112') && plateSku && cwSku && fillerSku
  const items = fits
    ? calcW111({
        ...KIT_WALL,
        cladding: s.code === 'W112' ? 'double' : 'single',
        plateSku,
        cwSku,
        woolSku: find('ISO-'),
        fillerSku,
      }).items
    : []
  return {
    id: s.code,
    code: s.code,
    name: s.name,
    area: 'za 10 m² zida',
    note: s.use,
    build: s.build,
    nameEn: WALL_SYSTEMS_EN[s.code]?.name,
    areaEn: 'for 10 m² of wall',
    noteEn: WALL_SYSTEMS_EN[s.code]?.use,
    buildEn: WALL_SYSTEMS_EN[s.code]?.build,
    rw: s.rw,
    profile: s.profile,
    thickness: s.thickness,
    off: 0,
    items,
    skus: s.skus,
  }
}

export const BUNDLES: Bundle[] = WALL_SYSTEMS.map(bundleOf)
export const BUNDLE_MAP: Record<string, Bundle> = Object.fromEntries(BUNDLES.map((b) => [b.id, b]))

export function bundleTotals(b: Bundle) {
  const sum = round2(b.items.reduce((s, it) => s + (bySku(it.sku)?.price ?? 0) * it.qty, 0))
  const price = round2(sum * (1 - b.off))
  return { sum, price, save: round2(sum - price) }
}

// ——— Korpa: proizvod je u korpi pod svojim id-jem (količina u jedinici artikla), komplet pod "komplet:<id>" ———

export type Line = { key: string; name: string; spec: string; unit: string; price: number; step: number; image?: string; drawing?: boolean; nameEn?: string; specEn?: string; unitEn?: string }

export function resolveLine(key: string): Line | null {
  if (key.startsWith('komplet:')) {
    const b = BUNDLE_MAP[key.slice(8)]
    if (!b || !b.items.length) return null
    return {
      key,
      name: `Komplet ${b.code}: ${b.name}`,
      spec: b.area,
      unit: 'komplet',
      price: bundleTotals(b).price,
      step: 1,
      nameEn: `Kit ${b.code}: ${b.nameEn ?? b.name}`,
      specEn: b.areaEn,
      unitEn: 'kit',
    }
  }
  const p = PRODUCT_MAP[key]
  return p
    ? { key, name: p.name, spec: p.spec, unit: p.unit, price: p.price, step: defaultQty(p), image: p.image, drawing: p.drawing, nameEn: pName(p, 'en'), specEn: pSpec(p, 'en'), unitEn: unitL(p.unit, 'en') }
    : null
}

// ——— Filteri ———

export const PRICE_BANDS = [
  { id: 'do-5', label: 'Do 5 KM', labelEn: 'Up to 5 KM', test: (p: number) => p < 5 },
  { id: '5-10', label: '5 – 10 KM', labelEn: '5 – 10 KM', test: (p: number) => p >= 5 && p < 10 },
  { id: '10-20', label: '10 – 20 KM', labelEn: '10 – 20 KM', test: (p: number) => p >= 10 && p < 20 },
  { id: 'preko-20', label: 'Preko 20 KM', labelEn: 'Over 20 KM', test: (p: number) => p >= 20 },
]

export const SORTS: { id: SortId; label: string; labelEn: string }[] = [
  { id: 'preporuceno', label: 'Preporučeno', labelEn: 'Recommended' },
  { id: 'cijena-rastuce', label: 'Cijena: rastuće', labelEn: 'Price: low to high' },
  { id: 'cijena-opadajuce', label: 'Cijena: opadajuće', labelEn: 'Price: high to low' },
  { id: 'naziv', label: 'Naziv A – Š', labelEn: 'Name A – Z' },
]

export type Filters = {
  query: string
  category: CategoryId | 'sve'
  use: UseId | 'sve'
  price: string
  sort: SortId
  onlySaved: boolean
}

export const DEFAULT_FILTERS: Filters = {
  query: '',
  category: 'sve',
  use: 'sve',
  price: 'sve',
  sort: 'preporuceno',
  onlySaved: false,
}

// Pretraga ne pravi razliku između č/c, š/s, ž/z, ć/c i đ/dj.
const fold = (s: string) =>
  s
    .toLowerCase()
    .replace(/đ/g, 'dj')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')

export function filterProducts(f: Filters, saved: string[]): Product[] {
  const words = fold(f.query).split(/\s+/).filter(Boolean)
  const band = PRICE_BANDS.find((b) => b.id === f.price)

  const list = PRODUCTS.filter((p) => {
    if (f.category !== 'sve' && p.category !== f.category) return false
    if (f.use !== 'sve' && !p.uses.includes(f.use)) return false
    if (band && !band.test(p.price)) return false
    if (f.onlySaved && !saved.includes(p.id)) return false
    if (words.length) {
      const hay = fold(`${p.name} ${p.brand} ${p.sku} ${p.spec} ${p.desc} ${categoryName(p.category)} ${pName(p, 'en')} ${pSpec(p, 'en')} ${pDesc(p, 'en')} ${categoryName(p.category, 'en')}`)
      if (!words.every((w) => hay.includes(w))) return false
    }
    return true
  })

  if (f.sort === 'cijena-rastuce') list.sort((a, b) => a.price - b.price)
  if (f.sort === 'cijena-opadajuce') list.sort((a, b) => b.price - a.price)
  if (f.sort === 'naziv') list.sort((a, b) => a.name.localeCompare(b.name, 'bs'))
  return list
}

// ——— Formatiranje ———

export const PRICE_NOTE_EN =
  'Prices, codes and stock levels are indicative demo data — we confirm the exact quote, price and availability on enquiry.'
export const PRICE_NOTE_SHORT_EN = 'Price is indicative — quote on enquiry.'

/** Napomena uz cijene i šifre: demo podaci nisu stvarna ponuda firme. */
export const PRICE_NOTE =
  'Cijene, šifre i stanje artikala su orijentacioni demo podaci — tačnu ponudu, cijenu i dostupnost potvrđujemo po upitu.'

/** Kraća verzija uz pojedinačne cijene. */
export const PRICE_NOTE_SHORT = 'Cijena je orijentaciona — ponuda po upitu.'

export const money = (n: number) =>
  `${n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} KM`

/** Količina u jedinici artikla: 25 m², 3 kom, 10,8 m² */
export const qtyLabel = (n: number, unit: string) =>
  `${n.toLocaleString('de-DE', { maximumFractionDigits: 2 })} ${unit}`

/**
 * Masa po jedinici artikla. `weight` je uvijek kg po jedinici prodaje (kg/m² za robu koja se
 * prodaje po m², kg/kom ili kg/pakovanje za ostalo) — vidi lib/logistics.ts. Kod robe po m²
 * dodajemo i masu pakovanja, da se vidi koliko teži jedna ploča ili rolna.
 */
export const massLabel = (p: { weight: number; unit: string; pack?: { size: number; name: string } }) => {
  const f = (n: number) => n.toLocaleString('de-DE', { maximumFractionDigits: 2 })
  const per = `${f(p.weight)} kg/${p.unit}`
  return p.pack && p.unit === 'm²' ? `${per} · 1 ${p.pack.name} ≈ ${f(p.weight * p.pack.size)} kg` : per
}

export const artikala = (n: number, lang: Lang = 'sr') =>
  lang === 'en' ? `${n} ${n === 1 ? 'item' : 'items'}` : `${n} ${plural(n, 'artikal', 'artikla', 'artikala')}`

const fmtL = (lang: Lang) => (lang === 'en' ? 'en-US' : 'de-DE')
export const moneyL = (n: number, lang: Lang = 'sr') =>
  `${n.toLocaleString(fmtL(lang), { minimumFractionDigits: 2, maximumFractionDigits: 2 })} KM`
export const qtyLabelL = (n: number, unit: string, lang: Lang = 'sr') =>
  `${n.toLocaleString(fmtL(lang), { maximumFractionDigits: 2 })} ${unitL(unit, lang)}`
export const massLabelL = (p: { weight: number; unit: string; pack?: { size: number; name: string } }, lang: Lang = 'sr') => {
  const f = (n: number) => n.toLocaleString(fmtL(lang), { maximumFractionDigits: 2 })
  const per = `${f(p.weight)} kg/${unitL(p.unit, lang)}`
  const pk = p.pack ? packNameL(p.pack.name, lang) : ''
  return p.pack && p.unit === 'm²' ? `${per} · 1 ${pk} ≈ ${f(p.weight * p.pack.size)} kg` : per
}

// Stavke lijepljive trake; id je ujedno i id sekcije na stranici.
export const NAV = [
  { id: 'novo', label: 'Najčešće', labelEn: 'Most popular' },
  { id: 'prodavnica', label: 'Katalog', labelEn: 'Catalogue' },
  { id: 'kompleti', label: 'Kompleti', labelEn: 'Kits' },
  { id: 'namjena', label: 'Radovi', labelEn: 'Applications' },
  { id: 'cijene', label: 'Partneri', labelEn: 'Partners' },
  { id: 'pitanja', label: 'Pitanja', labelEn: 'FAQ' },
  { id: 'ponuda', label: 'Upit', labelEn: 'Enquiry' },
]
