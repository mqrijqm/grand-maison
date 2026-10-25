import { PRODUCT_MAP, PRODUCTS } from './shop'
import type { Lang } from './i18n'

// Demo podaci za interaktivni prikaz predloženog B2B portala na /za-firme.
// Izmišljena firma i gradilišta. Artikli su iz kataloga sajta (naziv, šifra, jedinica, pakovanje).
// Namjerno NEMA: individualnih ugovornih cijena, živih zaliha, kreditnih limita ni veze sa ERP-om.
// Iznosi u primjerima ponuda su orijentacioni (katalog sajta) i označeni kao primjer.

export const FIRM = { name: 'DEMO GRADNJA d.o.o.', short: 'DG', user: 'Demo nabavka' }

export type Site = { id: string; name: string; address: string; lead: string; phase: string }
export const SITES: Site[] = [
  { id: 'a', name: 'Lamela A, stambeni objekat', address: 'Banja Luka, demo adresa 1', lead: 'Demo poslovođa 1', phase: 'Pregradni zidovi, sprat 3' },
  { id: 'b', name: 'Poslovni prostor B', address: 'Banja Luka, demo adresa 2', lead: 'Demo poslovođa 2', phase: 'Spušteni plafoni' },
  { id: 'c', name: 'Porodična kuća C', address: 'Banja Luka, demo', lead: 'Demo poslovođa 3', phase: 'Krov i izolacija' },
]
export const site = (id: string) => SITES.find((s) => s.id === id) ?? SITES[0]

export type Line = { sku: string; qty: number }
export const name = (sku: string) => PRODUCT_MAP[sku]?.name ?? sku
export const unit = (sku: string) => PRODUCT_MAP[sku]?.unit ?? ''
/** Orijentacioni iznos iz kataloga sajta, samo za primjer ponude. */
export const amount = (lines: Line[]) => Math.round(lines.reduce((s, l) => s + (PRODUCT_MAP[l.sku]?.price ?? 0) * l.qty, 0))
export const km = (n: number) => `${n.toLocaleString('de-DE')} KM`

// Grupe materijala za izbor (suha gradnja, izolacija, veziva, pribor).
export const GROUPS = [
  { id: 'suha-gradnja', label: 'Suha gradnja' },
  { id: 'izolacija', label: 'Izolacija' },
  { id: 'veziva', label: 'Mase i ljepila' },
  { id: 'oprema', label: 'Pribor' },
] as const
export const MATERIALS = PRODUCTS.map((p) => ({ sku: p.id, name: p.name, unit: p.unit, spec: p.spec, group: p.category, pack: p.pack }))

export type OfferStatus = 'Čeka potvrdu' | 'Potvrđena' | 'Kod prodaje'
export type Offer = { no: string; site: string; title: string; lines: Line[]; status: OfferStatus; validDays: number; days: number; demo?: boolean; titleEn?: string }
export const OFFERS: Offer[] = [
  {
    no: 'P-26-0142',
    site: 'a',
    title: 'Pregradni zidovi, sprat 3',
    status: 'Čeka potvrdu',
    validDays: 14,
    days: 1,
    lines: [
      { sku: 'GKP-001', qty: 420 },
      { sku: 'PRF-075', qty: 180 },
      { sku: 'PRF-UW75', qty: 64 },
      { sku: 'ISO-001', qty: 380 },
      { sku: 'CHM-001', qty: 24 },
    ],
  },
  {
    no: 'P-26-0131',
    site: 'c',
    title: 'Izolacija potkrovlja',
    status: 'Potvrđena',
    validDays: 10,
    days: 6,
    lines: [
      { sku: 'ISO-002', qty: 140 },
      { sku: 'GKP-002', qty: 120 },
      { sku: 'PRF-CD60', qty: 70 },
    ],
  },
]

export const STEPS = ['Primljena', 'Potvrđena', 'U pripremi', 'Spremna', 'Isporučena'] as const
export type Order = { no: string; site: string; step: number; mode: 'Dostava' | 'Preuzimanje'; slot: string; lines: Line[]; days: number; from?: string }
export const ORDERS: Order[] = [
  { no: 'GC-26-04512', site: 'a', step: 2, mode: 'Dostava', slot: 'Sutra, 08–10h', days: 0, from: 'P-26-0118', lines: [{ sku: 'GKP-001', qty: 260 }, { sku: 'PRF-075', qty: 90 }, { sku: 'ISO-001', qty: 200 }] },
  { no: 'GC-26-04498', site: 'b', step: 3, mode: 'Preuzimanje', slot: 'Danas, 13–15h', days: 1, lines: [{ sku: 'PRF-CD60', qty: 80 }, { sku: 'PRF-UD28', qty: 24 }, { sku: 'ACC-006', qty: 4 }] },
  { no: 'GC-26-04402', site: 'a', step: 4, mode: 'Dostava', slot: 'Isporučeno 27.09.', days: 12, lines: [{ sku: 'GKP-001', qty: 400 }, { sku: 'PRF-075', qty: 140 }, { sku: 'PRF-UW75', qty: 48 }, { sku: 'ISO-001', qty: 300 }] },
  { no: 'GC-26-04371', site: 'c', step: 4, mode: 'Preuzimanje', slot: 'Preuzeto 21.09.', days: 18, lines: [{ sku: 'ISO-002', qty: 60 }, { sku: 'ACC-003', qty: 6 }] },
]

export const LISTS: { id: string; name: string; lines: Line[] }[] = [
  { id: 'l1', name: 'Pregradni zid 100 mm, tipski stan', lines: [{ sku: 'GKP-001', qty: 64 }, { sku: 'PRF-075', qty: 22 }, { sku: 'PRF-UW75', qty: 8 }, { sku: 'ISO-001', qty: 31 }, { sku: 'CHM-001', qty: 3 }] },
  { id: 'l2', name: 'Spušteni plafon, kancelarija', lines: [{ sku: 'GKP-001', qty: 52 }, { sku: 'PRF-CD60', qty: 34 }, { sku: 'PRF-UD28', qty: 10 }, { sku: 'ACC-006', qty: 2 }] },
  { id: 'l3', name: 'Kupatilo, impregnirane ploče', lines: [{ sku: 'GKP-002', qty: 24 }, { sku: 'PRF-075', qty: 9 }, { sku: 'CHM-002', qty: 2 }, { sku: 'ACC-003', qty: 4 }] },
]

export type Doc = { id: string; kind: 'Ponuda' | 'Otpremnica' | 'Faktura' | 'Tehnički list'; title: string; ref: string; days: number }
export const DOCS: Doc[] = [
  { id: 'd1', kind: 'Ponuda', title: 'Ponuda P-26-0142', ref: 'Lamela A', days: 1 },
  { id: 'd2', kind: 'Otpremnica', title: 'Otpremnica uz GC-26-04402', ref: 'Lamela A', days: 12 },
  { id: 'd3', kind: 'Faktura', title: 'Faktura uz GC-26-04402', ref: 'Lamela A', days: 12 },
  { id: 'd4', kind: 'Otpremnica', title: 'Otpremnica uz GC-26-04371', ref: 'Kuća C', days: 18 },
  { id: 'd5', kind: 'Tehnički list', title: 'Gips-kartonska ploča GKB', ref: 'GKP-001', days: 40 },
]

export const USERS = [
  { initials: 'DN', name: 'Demo nabavka', role: 'Nabavka · šalje upite i potvrđuje ponude' },
  { initials: 'P1', name: 'Demo poslovođa 1', role: 'Poslovođa · Lamela A' },
  { initials: 'RA', name: 'Demo računovodstvo', role: 'Uvid u dokumente' },
]

export const dateAgo = (days: number) => new Date(2026, 9, 10 - days).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })

/** Okvirna težina upita u kg (iz kataloga), za planiranje dostave. */
export const weight = (lines: Line[]) => Math.round(lines.reduce((s, l) => s + (PRODUCT_MAP[l.sku]?.weight ?? 0) * l.qty, 0))
/** Količina u pakovanjima, npr. "48 ploča" za 120 m² ploča od 2,5 m². */
export const packs = (l: Line) => {
  const p = PRODUCT_MAP[l.sku]?.pack
  if (!p) return ''
  const n = Math.ceil(l.qty / p.size - 1e-9)
  return `${n} ${p.name === 'ploča' ? (n % 10 === 1 && n % 100 !== 11 ? 'ploča' : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? 'ploče' : 'ploča') : p.name === 'rolna' ? (n === 1 ? 'rolna' : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? 'rolne' : 'rolni') : p.name}`
}
/** Termini dostave koje kupac predlaže; potvrđuje ih prodaja (demo). */
export const SLOTS = ['Sutra, 07–09h', 'Sutra, 10–12h', 'Prekosutra, 07–09h', 'Prekosutra, 12–14h']

// ——— English (additive): the Serbian values above stay as they are and double as lookup keys. ———

const SITES_EN: Record<string, { name: string; address: string; lead: string; phase: string; short: string }> = {
  a: { name: 'Lamela A, residential building', address: 'Banja Luka, demo address 1', lead: 'Demo site supervisor 1', phase: 'Partition walls, floor 3', short: 'Lamela A' },
  b: { name: 'Office space B', address: 'Banja Luka, demo address 2', lead: 'Demo site supervisor 2', phase: 'Suspended ceilings', short: 'Office B' },
  c: { name: 'Family house C', address: 'Banja Luka, demo', lead: 'Demo site supervisor 3', phase: 'Roof and insulation', short: 'House C' },
}
/** Site with texts in the chosen language. */
export const siteL = (id: string, lang: Lang): Site => {
  const s = site(id)
  const e = lang === 'en' ? SITES_EN[s.id] : undefined
  return e ? { id: s.id, name: e.name, address: e.address, lead: e.lead, phase: e.phase } : s
}

const NAME_EN: Record<string, string> = {
  'GKP-001': 'Plasterboard GKB 12.5 mm',
  'GKP-002': 'Moisture-resistant plasterboard GKBI 12.5 mm',
  'GKP-003': 'Fire-resistant plasterboard GKF 12.5 mm',
  'GKP-004': 'High-strength plasterboard 12.5 mm',
  'PRF-075': 'Galvanized wall stud CW 75',
  'PRF-UW75': 'Galvanized guide track UW 75',
  'PRF-CD60': 'Galvanized ceiling profile CD 60/27',
  'PRF-UD28': 'Galvanized perimeter profile UD 28/27',
  'ISO-001': 'Stone wool board 50 mm',
  'ISO-002': 'Stone wool board 100 mm',
  'CHM-001': 'Gypsum jointing compound',
  'CHM-002': 'Gypsum filling compound',
  'ACC-001': 'Self-drilling screws 3.5 × 25 mm',
  'ACC-003': 'Fibreglass jointing tape',
  'ACC-006': 'Direct hanger for CD profile 120 mm',
}
export const nameL = (sku: string, lang: Lang) => (lang === 'en' && NAME_EN[sku]) || name(sku)
const UNIT_EN: Record<string, string> = { kom: 'pcs', kut: 'box', pak: 'pack' }
export const unitText = (u: string, lang: Lang) => (lang === 'en' ? UNIT_EN[u] ?? u : u)
export const unitL = (sku: string, lang: Lang) => unitText(unit(sku), lang)
/** Currency in the chosen language: "1.234 KM" (sr) / "1,234 KM" (en). */
export const kmL = (n: number, lang: Lang) => `${n.toLocaleString(lang === 'en' ? 'en-US' : 'de-DE')} KM`
export const dateAgoL = (days: number, lang: Lang) =>
  lang === 'en' ? new Date(2026, 9, 10 - days).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : dateAgo(days)
/** Pack count, e.g. "48 boards" / "48 ploča". */
export const packsL = (l: Line, lang: Lang) => {
  if (lang !== 'en') return packs(l)
  const p = PRODUCT_MAP[l.sku]?.pack
  if (!p) return ''
  const n = Math.ceil(l.qty / p.size - 1e-9)
  const w = p.name === 'ploča' ? 'board' : p.name === 'rolna' ? 'roll' : p.name
  return `${n} ${w}${n === 1 ? '' : 's'}`
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
/** Delivery slot / status text ("Sutra, 07–09h", "Isporučeno 27.09.", ...) in English. */
export const slotL = (s: string, lang: Lang) => {
  if (lang !== 'en') return s
  return s
    .replace('(prijedlog, potvrđuje prodaja)', '(proposal, to be confirmed by sales)')
    .replace('Termin preuzimanja dogovara prodaja', 'Collection time arranged by sales')
    .replace('Završeno danas', 'Completed today')
    .replace(/(Isporučeno|Preuzeto) (\d\d)\.(\d\d)\./, (_, w, d, m) => `${w === 'Isporučeno' ? 'Delivered' : 'Collected'} ${MONTHS[+m - 1]} ${+d}`)
    .replace('Prekosutra, ', 'Day after tomorrow, ')
    .replace('Sutra, ', 'Tomorrow, ')
    .replace('Danas, ', 'Today, ')
    .replace(/(\d\d)–(\d\d)h/g, '$1:00–$2:00')
}
export const modeL = (m: Order['mode'], lang: Lang) => (lang === 'en' ? (m === 'Dostava' ? 'Delivery' : 'Collection') : m)
export const offerStatusL = (s: OfferStatus, lang: Lang): string =>
  lang === 'en' ? { 'Čeka potvrdu': 'Awaiting confirmation', 'Potvrđena': 'Confirmed', 'Kod prodaje': 'With sales' }[s] : s
export const stepL = (s: string, lang: Lang) =>
  lang === 'en' ? (({ Primljena: 'Received', 'Potvrđena': 'Confirmed', 'U pripremi': 'In preparation', Spremna: 'Ready', 'Isporučena': 'Delivered' }) as Record<string, string>)[s] ?? s : s
export const groupL = (id: string, label: string, lang: Lang) =>
  lang === 'en' ? (({ 'suha-gradnja': 'Drywall', izolacija: 'Insulation', veziva: 'Compounds and adhesives', oprema: 'Accessories' }) as Record<string, string>)[id] ?? label : label

const OFFER_TITLE_EN: Record<string, string> = { 'P-26-0142': 'Partition walls, floor 3', 'P-26-0131': 'Attic insulation' }
export const offerTitleL = (o: Offer, lang: Lang) => (lang === 'en' ? o.titleEn ?? OFFER_TITLE_EN[o.no] ?? o.title : o.title)
const LIST_EN: Record<string, string> = { l1: 'Partition wall 100 mm, standard apartment', l2: 'Suspended ceiling, office', l3: 'Bathroom, moisture-resistant boards' }
export const listNameL = (l: { id: string; name: string }, lang: Lang) => (lang === 'en' ? LIST_EN[l.id] ?? l.name : l.name)
const DOC_EN: Record<string, { kind: string; title: string; ref: string }> = {
  d1: { kind: 'Offer', title: 'Offer P-26-0142', ref: 'Lamela A' },
  d2: { kind: 'Delivery note', title: 'Delivery note for GC-26-04402', ref: 'Lamela A' },
  d3: { kind: 'Invoice', title: 'Invoice for GC-26-04402', ref: 'Lamela A' },
  d4: { kind: 'Delivery note', title: 'Delivery note for GC-26-04371', ref: 'House C' },
  d5: { kind: 'Data sheet', title: 'Plasterboard GKB', ref: 'GKP-001' },
}
export const docL = (d: Doc, lang: Lang) => (lang === 'en' && DOC_EN[d.id]) || { kind: d.kind as string, title: d.title, ref: d.ref }
const USER_EN: Record<string, { name: string; role: string }> = {
  DN: { name: 'Demo procurement', role: 'Procurement · sends inquiries and confirms offers' },
  P1: { name: 'Demo site supervisor 1', role: 'Site supervisor · Lamela A' },
  RA: { name: 'Demo accounting', role: 'Document access' },
}
export const userL = (u: (typeof USERS)[number], lang: Lang) => (lang === 'en' && USER_EN[u.initials]) || { name: u.name, role: u.role }
export const firmUserL = (lang: Lang) => (lang === 'en' ? 'Demo procurement' : FIRM.user)
