import { useSyncExternalStore } from 'react'
import { DEMO_PARTNERS, PARTNER_TIERS, type FullPartner } from './b2b'

// B2B portal (/portal) — DEMO. Sadržaj prati Blink ponudu (Paket 2: partnerski nalozi, rabatna skala,
// kreditni limit, odgođeno plaćanje, fakture, praćenje narudžbi, ERP zalihe, admin). Research
// (tačka 12.8) traži jasno izmišljenu demo firmu i da se rabat/limit prikazuju kao funkcionalnost,
// ne kao potvrđen Grand Company uslov — zato su imena firmi i gradilišta ovdje izmišljena, a
// brojevi dolaze iz demo podataka (src/gc). Dostava kranom se ne prikazuje (nije potvrđena).

export type PortalPartner = FullPartner & { short: string; level: number }

const NAMES: Record<string, { name: string; short: string; slug: string; level: number; sites: string[] }> = {
  gipsmont: { name: 'DEMO MONT s.p.', short: 'DEMO MONT', slug: 'demo-mont', level: 1, sites: ['Demo gradilište A — stan'] },
  gradnjamont: { name: 'DEMO GRADNJA d.o.o.', short: 'DEMO GRADNJA', slug: 'demo-gradnja', level: 2, sites: ['Demo gradilište B — stambeni objekat', 'Demo gradilište C — poslovni prostor'] },
  lazarevo: { name: 'DEMO INŽENJERING a.d.', short: 'DEMO INŽENJERING', slug: 'demo-inzenjering', level: 3, sites: ['Demo gradilište D — lamela', 'Demo gradilište E — poslovni objekat'] },
}

export const PORTAL_PARTNERS: PortalPartner[] = DEMO_PARTNERS.map((p) => {
  const n = NAMES[p.id]
  return {
    ...p,
    name: n?.name ?? p.name,
    short: n?.short ?? p.name,
    level: n?.level ?? 1,
    email: `${n?.slug ?? 'partner'}@demo.grandcompany`,
    sites: p.sites.map((s, i) => ({ ...s, name: n?.sites[i] ?? `Demo gradilište ${i + 1}`, address: 'Banja Luka (demo adresa)', note: '' })),
  }
})

export { PARTNER_TIERS }

// ——— Prijava (demo): pamti se u browseru ———
const STORAGE = 'grand-portal-v1'
let partnerId: string | null = null
let loaded = false
const listeners = new Set<() => void>()

function load() {
  if (loaded || typeof window === 'undefined') return
  loaded = true
  try {
    const id = window.localStorage.getItem(STORAGE)
    partnerId = PORTAL_PARTNERS.some((p) => p.id === id) ? id : null
  } catch {}
}
function set(id: string | null) {
  partnerId = id
  try {
    if (id) window.localStorage.setItem(STORAGE, id)
    else window.localStorage.removeItem(STORAGE)
  } catch {}
  listeners.forEach((l) => l())
}

export function usePortalPartner(): PortalPartner | null {
  const id = useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    () => {
      load()
      return partnerId
    },
    () => null,
  )
  return PORTAL_PARTNERS.find((p) => p.id === id) ?? null
}

export const DEMO_PASSWORD = 'demo2026'

export function portalLogin(email: string, password: string) {
  const p = PORTAL_PARTNERS.find((x) => x.email === email.trim().toLowerCase())
  if (!p || password !== DEMO_PASSWORD) return false
  set(p.id)
  return true
}
export const portalLoginAs = (id: string) => set(id)
export const portalLogout = () => set(null)

// ——— Pomoćne ———
const DAY = 86_400_000
export const dateFromDaysAgo = (days: number) => new Date(Date.now() - days * DAY)
export const fmtDate = (d: Date) => d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })

export type InvoiceRow = { no: string; issued: Date; due: Date; amount: number; status: 'Plaćena' | 'Otvorena' | 'Kasni' }

export function invoiceRows(p: PortalPartner): InvoiceRow[] {
  return p.invoices.map((i) => {
    const issued = dateFromDaysAgo(i.issuedDaysAgo)
    const due = new Date(issued.getTime() + p.paymentDays * DAY)
    const status = i.paid ? 'Plaćena' : due.getTime() < Date.now() ? 'Kasni' : 'Otvorena'
    return { no: i.no, issued, due, amount: i.amount, status }
  })
}

export function creditOf(p: PortalPartner) {
  const used = Math.round(p.invoices.filter((i) => !i.paid).reduce((s, i) => s + i.amount, 0) * 100) / 100
  return { used, limit: p.creditLimit, available: Math.max(0, p.creditLimit - used), ratio: Math.min(1, used / p.creditLimit) }
}

export const ORDER_STEPS = ['Primljena', 'Potvrđena', 'U pripremi', 'Isporučena'] as const
export const orderStep = (status: string) => Math.max(0, ORDER_STEPS.indexOf(status as (typeof ORDER_STEPS)[number]))

/** Faktura kao tekstualni fajl za preuzimanje (demo dokument). */
export function invoiceFile(p: PortalPartner, row: InvoiceRow) {
  const km = (n: number) => n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' KM'
  return [
    'GRAND COMPANY d.o.o. Banja Luka — DEMO FAKTURA',
    'Dokument je primjer za prezentaciju B2B portala, nije stvarna faktura.',
    '',
    `Broj: ${row.no}`,
    `Kupac: ${p.name}`,
    `Datum izdavanja: ${fmtDate(row.issued)}`,
    `Valuta: ${p.paymentDays} dana — dospijeće ${fmtDate(row.due)}`,
    `Iznos: ${km(row.amount)}`,
    `Status: ${row.status}`,
  ].join('\r\n')
}
