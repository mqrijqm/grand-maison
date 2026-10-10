import { CATEGORIES, PRODUCT_MAP, PRODUCTS, type Product } from './shop'
import { DOCS, ORDERS, SITES, type Line, type Order } from './portal-demo'

// B2B logika demo portala: neto cijene, jedinice mjere, kreditni okvir, statusi narudžbi i pretraga.
// Uslovi su DEMO, uzeti iz partnerske skale sajta (Nivo 2: 15 %, okvir 30.000 KM, valuta 60 dana).
// Nisu postojeći uslovi Grand Company-ja; stvarni se dogovaraju ugovorom sa prodajom.

type CategoryId = Product['category']

export const TERMS = {
  tier: 'Nivo 2',
  base: 0.15,
  byCategory: { 'suha-gradnja': 0.18 } as Partial<Record<CategoryId, number>>,
  /** dodatno kad količina dostigne punu paletu */
  pallet: 0.02,
  limit: 30000,
  days: 60,
}

/** Projektni dogovor po gradilištu (demo): bolja cijena za jednu kategoriju. */
export const SITE_TERMS: Record<string, { label: string; category: CategoryId; discount: number }> = {
  a: { label: 'Projektni dogovor: suha gradnja', category: 'suha-gradnja', discount: 0.2 },
}

export type SiteId = 'all' | (typeof SITES)[number]['id']

// ——— Jedinice mjere ———
// Paleta u osnovnoj jedinici artikla (demo pakovanja).
const PALLET: Record<string, number> = {
  'GKP-001': 125, 'GKP-002': 125, 'GKP-003': 125, 'GKP-004': 100,
  'ISO-001': 28.8, 'ISO-002': 14.4,
  'CHM-002': 40, 'CHM-003': 48, 'CHM-004': 48,
}
export type Uom = { id: string; label: string; factor: number }
const n2 = (n: number) => n.toLocaleString('de-DE', { maximumFractionDigits: 2 })

/** Jedinice u kojima kupac može naručiti; factor = koliko osnovnih jedinica je jedna ova. */
export function uoms(sku: string): Uom[] {
  const p = PRODUCT_MAP[sku]
  if (!p) return []
  const list: Uom[] = [{ id: p.unit, label: p.unit, factor: 1 }]
  if (p.pack) list.push({ id: p.pack.name, label: `${p.pack.name} (${n2(p.pack.size)} ${p.unit})`, factor: p.pack.size })
  const bag = /Vreća (\d+) kg/.exec(p.spec)
  if (bag) list.push({ id: 'kg', label: `kg (vreća ${bag[1]} kg)`, factor: 1 / Number(bag[1]) })
  if (PALLET[sku]) list.push({ id: 'paleta', label: `paleta (${n2(PALLET[sku])} ${p.unit})`, factor: PALLET[sku] })
  return list
}
export const toBase = (sku: string, qty: number, uom?: string) => {
  const u = uoms(sku).find((x) => x.id === uom)
  return Math.round(qty * (u?.factor ?? 1) * 100) / 100
}

// ——— Cijene ———
export type Price = { unit: number; discount: number; volume: boolean; project: boolean }
export function price(sku: string, qtyBase = 1, site: SiteId = 'all'): Price {
  const p = PRODUCT_MAP[sku]
  if (!p) return { unit: 0, discount: 0, volume: false, project: false }
  let d = TERMS.byCategory[p.category] ?? TERMS.base
  const st = site === 'all' ? undefined : SITE_TERMS[site]
  const project = !!st && st.category === p.category && st.discount > d
  if (project) d = st!.discount
  const volume = !!PALLET[sku] && qtyBase >= PALLET[sku]
  if (volume) d += TERMS.pallet
  return { unit: Math.round(p.price * (1 - d) * 100) / 100, discount: d, volume, project }
}
export const netTotal = (lines: Line[], site: SiteId = 'all') =>
  Math.round(lines.reduce((s, [sku, q]) => s + price(sku, q, site).unit * q, 0) * 100) / 100
export const pct = (d: number) => `${Math.round(d * 100)} %`

// ——— Kreditni okvir ———
export function credit() {
  const invoices = DOCS.filter((d) => d.kind === 'Faktura' && d.state !== 'Plaćena').reduce((s, d) => s + (d.amount ?? 0), 0)
  const orders = ORDERS.filter((o) => o.step < 4).reduce((s, o) => s + netTotal(o.lines, o.site as SiteId), 0)
  const used = invoices + orders
  return { limit: TERMS.limit, invoices, orders, used, free: Math.max(0, TERMS.limit - used), days: TERMS.days }
}

// ——— Statusi narudžbi kako ih vidi gradilište ———
export function liveStatus(o: Order) {
  if (o.step === 3) return o.mode === 'Preuzimanje' ? 'Spremno za preuzimanje' : 'Na putu ka gradilištu'
  if (o.step === 4) return o.mode === 'Preuzimanje' ? 'Preuzeto' : 'Isporučeno'
  return ['Primljena', 'Potvrđena', 'U pripremi'][o.step]
}

// ——— Pretraga: šifre, tehnički termini, tipfeleri i majstorski žargon ———
const fold = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'dj')
const SYNONYMS: Record<string, string[]> = {
  rigips: ['gips-kartonska'], knauf: ['gips-kartonska'], regips: ['gips-kartonska'], gipsana: ['gips'], karton: ['gips-kartonska'],
  zelena: ['gkbi'], vlagootporna: ['gkbi'], kupatilo: ['gkbi'], crvena: ['gkf'], vatrootporna: ['gkf'], protivpozarna: ['gkf'],
  stub: ['cw'], stubni: ['cw'], vertikalni: ['cw'], vodilica: ['uw'], sina: ['uw'], plafonski: ['cd'], obodni: ['ud'], ivicni: ['ud'],
  kamenka: ['kamena'], salonit: ['kamena'], vata: ['vuna'], stiropor: ['eps'], stiro: ['eps'], stirodur: ['eps'], grafitni: ['grafitni'],
  sraf: ['vijci'], srafovi: ['vijci'], vijak: ['vijci'], samorezi: ['samourezni'],
  glet: ['masa'], gletmasa: ['masa'], ispuna: ['masa'], fugomasa: ['fugovanje'], fuga: ['fugovanje'],
  lijepak: ['ljepilo'], ljepak: ['ljepilo'], mrezica: ['armiranje'], armatura: ['armiranje'],
  bandaz: ['bandaz'], traka: ['traka'], ovjes: ['ovjes'], visilica: ['ovjes'], hanger: ['ovjes'],
}
function lev(a: string, b: string) {
  if (Math.abs(a.length - b.length) > 2) return 3
  const d = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    let prev = d[0]
    d[0] = i
    for (let j = 1; j <= b.length; j++) {
      const t = d[j]
      d[j] = Math.min(d[j] + 1, d[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1))
      prev = t
    }
  }
  return d[b.length]
}
const HAY = PRODUCTS.map((p) => {
  const text = fold(`${p.sku} ${p.name} ${p.spec} ${p.brand} ${CATEGORIES.find((c) => c.id === p.category)?.label ?? ''}`)
  return { p, text, words: text.split(/[^a-z0-9,.-]+/).filter((w) => w.length > 1) }
})

export type Hit = { product: Product; fuzzy: boolean }
/** Svaka riječ upita mora pogoditi: tačno, preko sinonima ili sa 1–2 slova greške. */
export function searchProducts(query: string): { hits: Hit[]; understood: string[] } {
  const tokens = fold(query).split(/\s+/).filter((t) => t.length > 1)
  if (!tokens.length) return { hits: PRODUCTS.map((product) => ({ product, fuzzy: false })), understood: [] }
  const understood: string[] = []
  tokens.forEach((t) => SYNONYMS[t] && understood.push(`${t} → ${SYNONYMS[t].join(', ')}`))
  const hits: Hit[] = []
  for (const h of HAY) {
    let fuzzy = false
    const ok = tokens.every((t) => {
      if (h.text.includes(t)) return true
      if (SYNONYMS[t]?.some((s) => h.text.includes(s))) return true
      if (t.length >= 4 && h.words.some((w) => lev(t, w.slice(0, t.length + 1)) <= (t.length > 6 ? 2 : 1))) return (fuzzy = true)
      return false
    })
    if (ok) hits.push({ product: h.p, fuzzy })
  }
  hits.sort((a, b) => Number(a.fuzzy) - Number(b.fuzzy))
  return { hits, understood }
}

// ——— Tehnički filteri (faceted search) iz specifikacije ———
export type Facets = { category: string; length?: string; thickness?: string; sheet?: string; brand: string }
export function facets(p: Product): Facets {
  const length = /^(\d{4}) ×/.exec(p.spec)
  const thick = /Debljina (\d+) mm/.exec(p.spec) ?? /× (\d+,\d) mm/.exec(p.spec)
  const sheet = /lim (\d,\d) mm/.exec(p.spec)
  return {
    category: CATEGORIES.find((c) => c.id === p.category)?.label ?? p.category,
    length: length ? `${Number(length[1]) / 1000} m` : undefined,
    thickness: thick ? `${thick[1]} mm` : undefined,
    sheet: sheet ? `${sheet[1]} mm` : undefined,
    brand: p.brand,
  }
}

/** Jedno stovarište (Nenada Kostića 151, Banja Luka); zalihe su demo. */
export const stockLevel = (p: Product) => (p.stock > 1000 ? 'ok' : p.stock > 500 ? 'low' : 'few')
