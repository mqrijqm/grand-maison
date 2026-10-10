import { PRODUCT_MAP, PRODUCTS } from './shop'

// Demo podaci za interaktivni prikaz predloženog B2B portala na /za-firme.
// Izmišljena firma i gradilišta. Artikli su iz kataloga sajta (naziv, šifra, jedinica, pakovanje).
// Namjerno NEMA: individualnih ugovornih cijena, živih zaliha, kreditnih limita ni veze sa ERP-om.
// Iznosi u primjerima ponuda su orijentacioni (katalog sajta) i označeni kao primjer.

export const FIRM = { name: 'DEMO GRADNJA d.o.o.', short: 'DG', user: 'Demo nabavka' }

export type Site = { id: string; name: string; address: string; lead: string; phase: string }
export const SITES: Site[] = [
  { id: 'a', name: 'Lamela A, stambeni objekat', address: 'Banja Luka, demo adresa 1', lead: 'Demo poslovođa 1', phase: 'Pregradni zidovi, sprat 3' },
  { id: 'b', name: 'Poslovni prostor B', address: 'Banja Luka, demo adresa 2', lead: 'Demo poslovođa 2', phase: 'Spušteni plafoni' },
  { id: 'c', name: 'Porodična kuća C', address: 'Okolina Banje Luke, demo', lead: 'Demo poslovođa 3', phase: 'Krov i izolacija' },
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
export type Offer = { no: string; site: string; title: string; lines: Line[]; status: OfferStatus; validDays: number; days: number; demo?: boolean }
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
      { sku: 'ISO-003', qty: 140 },
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
