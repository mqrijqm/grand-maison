import { PRODUCT_MAP } from './shop'

// B2B portal (/portal) — DEMO podaci za jednu izmišljenu firmu (research 12.8: "jasno izmišljena demo
// firma, npr. DEMO GRADNJA d.o.o."). Šifre i cijene su iz demo kataloga sajta; rabat, kreditni okvir i
// individualne cijene se NE prikazuju kao Grand Company uslov, nego kao predložena funkcija.
// Kategorije slijede potvrđeni asortiman (suha gradnja, kamena vuna, građevinska hemija, krovni i zidni
// sistemi, drvo, sanitarna oprema). Bez krana, flote i ERP imena (research nivo C).

export const FIRM = {
  name: 'DEMO GRADNJA d.o.o.',
  short: 'DG',
  user: 'Demo nabavka',
  url: 'portal.grandcompany.ba',
}

export type Line = [sku: string, qty: number]

export const lineTotal = (lines: Line[]) =>
  Math.round(lines.reduce((s, [sku, q]) => s + (PRODUCT_MAP[sku]?.price ?? 0) * q, 0) * 100) / 100
export const lineWeight = (lines: Line[]) => Math.round(lines.reduce((s, [sku, q]) => s + (PRODUCT_MAP[sku]?.weight ?? 0) * q, 0))

// ——— Gradilišta ———
export type Site = { id: string; name: string; short: string; address: string; budget: number; spent: number; phase: string; progress: number; lead: string }
export const SITES: Site[] = [
  { id: 'a', name: 'Demo gradilište A — stambena lamela', short: 'Lamela A', address: 'Banja Luka, demo adresa 1', budget: 48000, spent: 31260, phase: 'Pregradni zidovi, sprat 3', progress: 0.65, lead: 'Demo poslovođa 1' },
  { id: 'b', name: 'Demo gradilište B — poslovni prostor', short: 'Poslovni B', address: 'Banja Luka, demo adresa 2', budget: 22500, spent: 8940, phase: 'Spušteni plafoni', progress: 0.4, lead: 'Demo poslovođa 2' },
  { id: 'c', name: 'Demo gradilište C — porodična kuća', short: 'Kuća C', address: 'Okolina Banje Luke, demo', budget: 16800, spent: 14120, phase: 'Krov i izolacija', progress: 0.84, lead: 'Demo poslovođa 3' },
]
export const siteById = (id: string) => SITES.find((s) => s.id === id)!

// ——— Ponude ———
export type QuoteStatus = 'Spremna' | 'U obradi' | 'Prihvaćena' | 'Istekla'
export type Quote = { no: string; site: string; days: number; valid: number; status: QuoteStatus; lines: Line[]; note: string }
export const QUOTES: Quote[] = [
  { no: 'P-26-0142', site: 'a', days: 1, valid: 14, status: 'Spremna', note: 'Pregradni zidovi, sprat 3 — prema planu iz kalkulatora', lines: [['GKP-001', 420], ['GKP-002', 96], ['PRF-075', 180], ['PRF-UW75', 64], ['ISO-001', 380], ['CHM-001', 24], ['ACC-003', 30]] },
  { no: 'P-26-0139', site: 'b', days: 2, valid: 14, status: 'U obradi', note: 'Spušteni plafon, open space 210 m²', lines: [['GKP-001', 240], ['PRF-CD60', 160], ['PRF-UD28', 48], ['ACC-006', 9], ['CHM-001', 14]] },
  { no: 'P-26-0131', site: 'c', days: 6, valid: 10, status: 'Spremna', note: 'Izolacija potkrovlja', lines: [['ISO-003', 140], ['ISO-002', 60], ['GKP-002', 120], ['PRF-CD60', 70]] },
  { no: 'P-26-0118', site: 'a', days: 19, valid: 14, status: 'Prihvaćena', note: 'Sprat 2 — dopuna', lines: [['GKP-001', 260], ['PRF-075', 90], ['ISO-001', 200]] },
  { no: 'P-26-0102', site: 'c', days: 34, valid: 14, status: 'Istekla', note: 'Fasada — varijanta 1', lines: [['ISO-004', 180], ['CHM-003', 40], ['CHM-004', 60]] },
]

// ——— Narudžbe ———
export const ORDER_FLOW = ['Primljena', 'Potvrđena', 'U pripremi', 'Spremna', 'Isporučena'] as const
export type OrderStep = (typeof ORDER_FLOW)[number]
export type Order = { no: string; site: string; days: number; step: number; mode: 'Dostava' | 'Preuzimanje'; slot: string; lines: Line[] }
export const ORDERS: Order[] = [
  { no: 'GC-26-04512', site: 'a', days: 0, step: 1, mode: 'Dostava', slot: 'Sutra 08–10h', lines: [['GKP-001', 260], ['PRF-075', 90], ['ISO-001', 200]] },
  { no: 'GC-26-04498', site: 'b', days: 1, step: 2, mode: 'Preuzimanje', slot: 'Danas 13–15h', lines: [['PRF-CD60', 80], ['PRF-UD28', 24], ['ACC-006', 4]] },
  { no: 'GC-26-04477', site: 'c', days: 3, step: 3, mode: 'Dostava', slot: 'Čet 07–09h', lines: [['ISO-003', 140], ['CHM-001', 10]] },
  { no: 'GC-26-04460', site: 'a', days: 5, step: 2, mode: 'Dostava', slot: 'Pet 10–12h', lines: [['GKP-002', 96], ['CHM-002', 8], ['ACC-003', 20]] },
  { no: 'GC-26-04402', site: 'a', days: 12, step: 4, mode: 'Dostava', slot: 'Isporučeno', lines: [['GKP-001', 400], ['PRF-075', 140], ['PRF-UW75', 48], ['ISO-001', 300]] },
  { no: 'GC-26-04371', site: 'c', days: 18, step: 4, mode: 'Preuzimanje', slot: 'Preuzeto', lines: [['ISO-002', 60], ['ACC-003', 6]] },
]

// ——— Isporuke i preuzimanja u ovoj sedmici (dan 0 = ponedjeljak) ———
export type Slot = { day: number; from: number; to: number; order: string; site: string; mode: 'Dostava' | 'Preuzimanje'; what: string }
export const WEEK: Slot[] = [
  { day: 0, from: 7, to: 9, order: 'GC-26-04402', site: 'a', mode: 'Dostava', what: 'Ploče GKB, CW 75, vuna' },
  { day: 1, from: 13, to: 15, order: 'GC-26-04498', site: 'b', mode: 'Preuzimanje', what: 'CD/UD profili, ovjesi' },
  { day: 2, from: 8, to: 10, order: 'GC-26-04512', site: 'a', mode: 'Dostava', what: 'GKB 260 m², CW 75' },
  { day: 3, from: 7, to: 9, order: 'GC-26-04477', site: 'c', mode: 'Dostava', what: 'Staklena vuna 140 m²' },
  { day: 4, from: 10, to: 12, order: 'GC-26-04460', site: 'a', mode: 'Dostava', what: 'GKBI, masa, traka' },
  { day: 4, from: 14, to: 15, order: 'GC-26-04371', site: 'c', mode: 'Preuzimanje', what: 'Vuna 100 mm, vijci' },
  { day: 5, from: 8, to: 10, order: 'GC-26-04460', site: 'b', mode: 'Preuzimanje', what: 'Dopuna — pribor' },
]
export const DAYS = ['Pon', 'Uto', 'Sri', 'Čet', 'Pet', 'Sub'] as const
// Radno vrijeme stovarišta: pon–pet 07–16, sub 07–15 (podnožje sajta).
export const HOURS = { from: 7, to: 16 }

// ——— Sačuvane liste (iz kalkulatora i ranijih narudžbi) ———
export type SavedList = { id: string; name: string; from: string; site: string; lines: Line[] }
export const LISTS: SavedList[] = [
  { id: 'l1', name: 'Pregradni zid 100 mm — tipski stan', from: 'Kalkulator', site: 'a', lines: [['GKP-001', 64], ['PRF-075', 22], ['PRF-UW75', 8], ['ISO-001', 31], ['CHM-001', 3]] },
  { id: 'l2', name: 'Spušteni plafon — kancelarija', from: 'Narudžba GC-26-04498', site: 'b', lines: [['GKP-001', 52], ['PRF-CD60', 34], ['PRF-UD28', 10], ['ACC-006', 2]] },
  { id: 'l3', name: 'Kupatilo — impregnirane ploče', from: 'Ručno', site: 'a', lines: [['GKP-002', 24], ['PRF-075', 9], ['CHM-002', 2], ['ACC-003', 4]] },
  { id: 'l4', name: 'Potkrovlje — izolacija', from: 'Kalkulator', site: 'c', lines: [['ISO-003', 90], ['GKP-001', 70], ['PRF-CD60', 30]] },
]

// ——— Dokumenti (konceptualni modul, demo) ———
export type DocKind = 'Faktura' | 'Otpremnica' | 'Ponuda' | 'Tehnički list'
export type Doc = { id: string; kind: DocKind; title: string; days: number; amount?: number; state?: 'Plaćena' | 'Otvorena' | 'Dospijeva' }
export const DOCS: Doc[] = [
  { id: 'IF-26-00901', kind: 'Faktura', title: 'Faktura IF-26-00901', days: 3, amount: 4109.5, state: 'Otvorena' },
  { id: 'IF-26-00862', kind: 'Faktura', title: 'Faktura IF-26-00862', days: 12, amount: 7240.5, state: 'Dospijeva' },
  { id: 'IF-26-00802', kind: 'Faktura', title: 'Faktura IF-26-00802', days: 26, amount: 6400, state: 'Plaćena' },
  { id: 'OT-26-01877', kind: 'Otpremnica', title: 'Otpremnica uz GC-26-04402', days: 12 },
  { id: 'OT-26-01831', kind: 'Otpremnica', title: 'Otpremnica uz GC-26-04371', days: 18 },
  { id: 'P-26-0142', kind: 'Ponuda', title: 'Ponuda P-26-0142 (PDF)', days: 1, amount: 0 },
  { id: 'TL-GKB', kind: 'Tehnički list', title: 'Gips-kartonska ploča GKB — tehnički list (demo)', days: 40 },
  { id: 'TL-KV', kind: 'Tehnički list', title: 'Kamena vuna — tehnički list (demo)', days: 40 },
]

// ——— Tim i odobrenja ———
export const TEAM = [
  { initials: 'DN', name: 'Demo nabavka', role: 'Administrator naloga', rights: 'Sve: ponude, narudžbe, dokumenti, tim' },
  { initials: 'P1', name: 'Demo poslovođa 1', role: 'Poslovođa · Lamela A', rights: 'Zahtjev za materijal do 2.000 KM bez odobrenja' },
  { initials: 'P2', name: 'Demo poslovođa 2', role: 'Poslovođa · Poslovni B', rights: 'Zahtjev za materijal, uvid u isporuke' },
  { initials: 'RA', name: 'Demo računovodstvo', role: 'Računovodstvo', rights: 'Fakture i otpremnice, bez naručivanja' },
]
export type Approval = { id: string; who: string; site: string; lines: Line[]; note: string }
export const APPROVALS: Approval[] = [
  { id: 'z1', who: 'Demo poslovođa 1', site: 'a', note: 'Fali profila za zid u hodniku', lines: [['PRF-075', 40], ['PRF-UW75', 12]] },
  { id: 'z2', who: 'Demo poslovođa 2', site: 'b', note: 'Dopuna ploča za plafon', lines: [['GKP-001', 120], ['CHM-001', 6]] },
]

// ——— Nabavka po kategoriji, tekući mjesec (KM) ———
export const CATEGORY_SPEND: { label: string; value: number }[] = [
  { label: 'Suha gradnja', value: 9840 },
  { label: 'Kamena vuna i izolacija', value: 4620 },
  { label: 'Građevinska hemija', value: 1810 },
  { label: 'Krovni i zidni sistemi', value: 1240 },
  { label: 'Drvni program', value: 610 },
  { label: 'Sanitarna oprema', value: 300 },
]

// ——— Serije za grafikon (30 dana) — deterministične, isti crtež na serveru i u browseru ———
function series(n: number, base: number, amp: number, seed: number) {
  let s = seed
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280)
  return Array.from({ length: n }, (_, i) => Math.max(0, Math.round(base + amp * (Math.sin(i / 3.1 + seed) * 0.5 + rnd() - 0.4) + i * (amp / n) * 1.4)))
}
export type MetricId = 'nabavka' | 'ponude' | 'narudzbe' | 'isporuke' | 'racuni' | 'gradilista'
export type Metric = { id: MetricId; label: string; value: string; delta: number; unit: string; series: number[]; prev: number[] }
export const METRICS: Metric[] = [
  { id: 'nabavka', label: 'Nabavka · ovaj mjesec', value: '18.420 KM', delta: 12.4, unit: 'KM', series: series(30, 520, 420, 3), prev: series(30, 470, 300, 9) },
  { id: 'ponude', label: 'Otvorene ponude', value: '3', delta: 8.1, unit: 'ponude', series: series(30, 2, 3, 5), prev: series(30, 2, 2, 11) },
  { id: 'narudzbe', label: 'Aktivne narudžbe', value: '4', delta: 6.1, unit: 'narudžbe', series: series(30, 3, 3, 7), prev: series(30, 2, 3, 13) },
  { id: 'isporuke', label: 'Isporuke ove sedmice', value: '7', delta: 14.2, unit: 'isporuke', series: series(30, 2, 3, 2), prev: series(30, 2, 2, 17) },
  { id: 'racuni', label: 'Otvoreni računi', value: '11.350 KM', delta: -2.3, unit: 'KM', series: series(30, 380, 260, 4), prev: series(30, 420, 240, 19) },
  { id: 'gradilista', label: 'Aktivna gradilišta', value: '3', delta: 0, unit: 'gradilišta', series: series(30, 2, 1, 6), prev: series(30, 2, 1, 23) },
]

// ——— Živi tok: pool događaja koji se ciklično dodaju ———
export type FeedKind = 'ponuda' | 'narudzba' | 'isporuka' | 'dokument' | 'tim'
export type FeedItem = { kind: FeedKind; title: string; meta: string }
export const FEED_START: (FeedItem & { t: string })[] = [
  { kind: 'ponuda', title: 'Ponuda P-26-0142 je spremna', meta: 'Lamela A · 8 stavki · prodaja', t: 'sad' },
  { kind: 'isporuka', title: 'GC-26-04498 spremna za preuzimanje', meta: 'Stovarište · danas 13–15h', t: '4 min' },
  { kind: 'tim', title: 'Demo poslovođa 1 traži odobrenje', meta: 'CW 75 × 40, UW 75 × 12', t: '12 min' },
  { kind: 'dokument', title: 'Otpremnica OT-26-01877 dodata', meta: 'Uz narudžbu GC-26-04402', t: '1 h' },
]
export const FEED_POOL: FeedItem[] = [
  { kind: 'narudzba', title: 'GC-26-04512 je potvrđena', meta: 'Lamela A · dostava sutra 08–10h' },
  { kind: 'ponuda', title: 'Prodaja je odgovorila na upit', meta: 'Poslovni B · plafon 210 m²' },
  { kind: 'isporuka', title: 'Isporuka GC-26-04477 zakazana', meta: 'Kuća C · četvrtak 07–09h' },
  { kind: 'dokument', title: 'Faktura IF-26-00901 izdata', meta: 'Valuta po dogovoru' },
  { kind: 'tim', title: 'Demo poslovođa 2 dodao listu', meta: 'Spušteni plafon — kancelarija' },
  { kind: 'narudzba', title: 'GC-26-04460 u pripremi', meta: 'Lamela A · 3 stavke' },
  { kind: 'ponuda', title: 'Ponuda P-26-0131 ističe za 4 dana', meta: 'Kuća C · izolacija potkrovlja' },
]
