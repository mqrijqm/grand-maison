'use client'

import { useEffect, useState } from 'react'
import Icon from '@/components/portal/Icon'
import { PRODUCT_MAP } from '@/lib/shop'
import { FIRM, STEPS, amount, km, site, type Order } from '@/lib/b2b-demo'
import s from '@/components/business/portal/Showcase.module.css'
import x from './extra.module.css'

// Dodaci demo portala na /za-firme (2026-10-11): zalihe po lokaciji i datum dolaska, saldo i otvorene
// stavke, plaćanje odgodom ili avansom, obavještenja sa primjerom mejla i admin pogled za Grand Company
// (odobravanje firmi, cjenovnici po klijentu, narudžbe svih klijenata). Sve je primjer za prezentaciju:
// ništa se ne šalje i ne čuva na serveru; istraživanje nije potvrdilo stvarne limite, rabate ni zalihe.

/** "Danas" u demo podacima portala. */
const TODAY = new Date(2026, 9, 10)
const DAY = 86400000
const fmt = (d: Date) => d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
const PAY_DAYS = 30

/* ——— Zalihe po lokaciji (demo) ——— */
export type StockLoc = { yard: number; hall: number; incoming: { qty: number; date: string } | null }
export function stockOf(sku: string): StockLoc | null {
  const p = PRODUCT_MAP[sku]
  if (!p) return null
  const h = [...sku].reduce((n, ch) => (n * 31 + ch.charCodeAt(0)) % 9973, 7)
  const indoor = p.category === 'veziva' || p.category === 'oprema' || p.category === 'izolacija'
  const yard = Math.round(p.stock * (indoor ? 0.25 : 0.7))
  const hall = Math.max(0, Math.round(p.stock - yard))
  const day = 12 + (h % 9)
  return { yard, hall, incoming: h % 3 === 0 ? null : { qty: Math.max(1, Math.round(p.stock * (0.3 + (h % 5) / 10))), date: `${day}.10.` } }
}
export const stockLine = (sku: string) => {
  const st = stockOf(sku)
  if (!st) return ''
  const u = PRODUCT_MAP[sku]?.unit ?? ''
  const n = (v: number) => v.toLocaleString('de-DE', { maximumFractionDigits: 1 })
  return `Stovarište ${n(st.yard)} · Hala ${n(st.hall)} ${u}${st.incoming ? ` · stiže ${n(st.incoming.qty)} ${u} ${st.incoming.date}` : ''}`
}

/* ——— Saldo i otvorene stavke ——— */
type Invoice = { no: string; ref: string; days: number; value: number }
const INVOICES: Invoice[] = [
  { no: 'IF-26-00744', ref: 'Kuća C', days: 41, value: 1985 },
  { no: 'IF-26-00862', ref: 'Lamela A', days: 24, value: 7240 },
  { no: 'IF-26-00901', ref: 'Lamela A', days: 12, value: 4110 },
]
export function SaldoCard() {
  const items = INVOICES.map((i) => {
    const issued = new Date(TODAY.getTime() - i.days * DAY)
    const due = new Date(issued.getTime() + PAY_DAYS * DAY)
    return { ...i, issued, due, left: Math.round((due.getTime() - TODAY.getTime()) / DAY) }
  }).sort((a, b) => a.left - b.left)
  const total = items.reduce((t, i) => t + i.value, 0)
  const late = items.filter((i) => i.left < 0).reduce((t, i) => t + i.value, 0)
  return (
    <section className={`${s.card} ${x.saldo}`}>
      <h4>Saldo i otvorene stavke</h4>
      <div className={x.kpis}>
        <div>
          <span>Saldo</span>
          <b>{km(total)}</b>
        </div>
        <div data-warn={late > 0 || undefined}>
          <span>Dospjelo</span>
          <b>{km(late)}</b>
        </div>
        <div>
          <span>Valuta</span>
          <b>{PAY_DAYS} dana</b>
        </div>
      </div>
      <ul className={s.rows}>
        {items.map((i) => (
          <li key={i.no}>
            <span>
              <b>{i.no}</b>
              <i>
                {i.ref} · izdata {fmt(i.issued)} · rok {fmt(i.due)}
              </i>
            </span>
            <b className={x.num}>{km(i.value)}</b>
            <span className={`${s.chip} ${x.dueChip}`} data-k={i.left < 0 ? 'late' : i.left <= 7 ? 'act' : undefined}>
              {i.left < 0 ? `kasni ${-i.left} d` : `još ${i.left} d`}
            </span>
          </li>
        ))}
      </ul>
      <p className={s.fine}>Demo fakture. U produkciji saldo i otvorene stavke dolaze iz knjigovodstva Grand Company-ja.</p>
    </section>
  )
}

/* ——— Plaćanje: odgoda ili avans ——— */
export type Payment = 'Odgoda' | 'Avans'
export function PaymentSeg({ value, onChange }: { value: Payment; onChange: (p: Payment) => void }) {
  return (
    <div className={x.pay}>
      <span className={s.kicker}>Plaćanje</span>
      <div className={s.seg} role="radiogroup" aria-label="Način plaćanja">
        {(['Odgoda', 'Avans'] as const).map((p) => (
          <button key={p} type="button" role="radio" aria-checked={value === p} onClick={() => onChange(p)}>
            {p === 'Odgoda' ? `Odgoda ${PAY_DAYS} dana` : 'Avans (predračun)'}
          </button>
        ))}
      </div>
      <p className={s.fine}>{value === 'Avans' ? 'Predračun stiže e-poštom; roba se izdaje po uplati.' : 'U okviru dogovorenog kreditnog limita (demo).'}</p>
    </div>
  )
}

/* ——— Obavještenja + primjer mejla ——— */
type Mail = 'narudzba' | 'status' | 'faktura'
type Note = { id: string; title: string; meta: string; mail: Mail | null; view: string }
export function notesFor(orders: Order[], pendingOffers: number): Note[] {
  const out: Note[] = []
  if (pendingOffers) out.push({ id: 'ponude', title: `${pendingOffers} ponuda čeka vašu potvrdu`, meta: 'Ponude', mail: null, view: 'ponude' })
  const active = orders.filter((o) => o.step < 4)
  if (active[0]) out.push({ id: `o-${active[0].no}`, title: `Narudžba ${active[0].no} je potvrđena`, meta: `${site(active[0].site).name} · ${active[0].mode}`, mail: 'narudzba', view: 'narudzbe' })
  active.slice(1, 3).forEach((o) => out.push({ id: `s-${o.no}`, title: `${o.no}: ${STEPS[o.step].toLowerCase()}`, meta: `${site(o.site).name} · ${o.slot}`, mail: 'status', view: 'narudzbe' }))
  out.push({ id: 'f-744', title: 'Faktura IF-26-00744 kasni 11 dana', meta: `${km(1985)} · Kuća C`, mail: 'faktura', view: 'dokumenti' })
  out.push({ id: 'f-862', title: 'Faktura IF-26-00862 dospijeva za 6 dana', meta: `${km(7240)} · Lamela A`, mail: 'faktura', view: 'dokumenti' })
  return out
}
const MAILS: Record<Mail, { tab: string; body: (n: Note) => string[] }> = {
  narudzba: { tab: 'Narudžba potvrđena', body: (n) => [`${n.title} i ulazi u pripremu na stovarištu.`, `Gradilište i način: ${n.meta}.`, 'Status pratite u portalu, u meniju Narudžbe.'] },
  status: { tab: 'Promjena statusa', body: (n) => [`${n.title}.`, `Gradilište i termin: ${n.meta}.`] },
  faktura: { tab: 'Faktura dospijeva', body: (n) => [`${n.title} (${n.meta}).`, 'Fakturu i saldo otvorenih stavki preuzimate u portalu, u meniju Dokumenti. Ako je uplata izvršena, zanemarite ovu poruku.'] },
}
export function NotificationsView({ notes, onOpen }: { notes: Note[]; onOpen: (view: string) => void }) {
  const [read, setRead] = useState<string[]>([])
  const firstMail = notes.find((n) => n.mail) ?? null
  const [mail, setMail] = useState<Note | null>(firstMail)
  const kinds = notes.filter((n) => n.mail).filter((n, i, all) => all.findIndex((k) => k.mail === n.mail) === i)
  return (
    <div className={s.split}>
      <section className={s.card}>
        <div className={x.notesHead}>
          <h4>Obavještenja</h4>
          <button type="button" className={s.ghost} onClick={() => setRead(notes.map((n) => n.id))}>
            Označi sve kao pročitano
          </button>
        </div>
        <ul className={s.rows}>
          {notes.map((n) => (
            <li key={n.id} className={x.note} data-unread={!read.includes(n.id) || undefined}>
              <button
                type="button"
                className={s.rowBtn}
                onClick={() => {
                  setRead((r) => [...new Set([...r, n.id])])
                  onOpen(n.view)
                }}
              >
                <span>
                  <b>{n.title}</b>
                  <i>{n.meta}</i>
                </span>
              </button>
              {n.mail && (
                <button type="button" className={s.ghost} aria-pressed={mail?.id === n.id} onClick={() => setMail(n)}>
                  Mejl
                </button>
              )}
            </li>
          ))}
        </ul>
        <p className={s.fine}>Ista obavještenja stižu e-poštom: potvrda narudžbe, promjena statusa, faktura pred dospijećem.</p>
      </section>
      {mail && mail.mail && (
        <aside className={`${s.card} ${x.mail}`} aria-label="Primjer mejla">
          <div className={s.chips}>
            {kinds.map((k) => (
              <button key={k.id} type="button" role="tab" aria-selected={k.mail === mail.mail} onClick={() => setMail(k)}>
                {MAILS[k.mail!].tab}
              </button>
            ))}
          </div>
          <dl className={x.mailHead}>
            <div>
              <dt>Od</dt>
              <dd>Grand Company Portal</dd>
            </div>
            <div>
              <dt>Za</dt>
              <dd>{FIRM.user}, {FIRM.name}</dd>
            </div>
            <div>
              <dt>Naslov</dt>
              <dd>
                <b>{mail.title}</b>
              </dd>
            </div>
          </dl>
          <div className={x.mailBody}>
            <p>Poštovani,</p>
            {MAILS[mail.mail].body(mail).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <span className={x.mailBtn}>Otvori u portalu</span>
            <p className={s.fine}>Grand Company d.o.o. · Nenada Kostića 151, Banja Luka · 051 388-995. Primjer mejla; demo ne šalje poruke.</p>
          </div>
        </aside>
      )}
    </div>
  )
}

/* ——— Admin: pogled prodaje Grand Company ——— */
type Firm = { id: string; name: string; jib: string; pdv: string; contact: string; sent: string; mine?: boolean }
const REG_KEY = 'grand-b2b-registration-v1'
const PENDING: Firm[] = [
  { id: 'f1', name: 'Demo Instalacije d.o.o.', jib: '4400000000011', pdv: '400000000011', contact: 'Demo vlasnik · 065 000 111', sent: '08.10.2026' },
  { id: 'f2', name: 'Demo Fasade s.p.', jib: '4500000000028', pdv: '', contact: 'Demo majstor · 066 000 222', sent: '07.10.2026' },
]
const TIERS: [string, number][] = [
  ['Gost', 0],
  ['Nivo 1', 10],
  ['Nivo 2', 15],
  ['Nivo 3', 20],
]
type Client = { id: string; name: string; tier: string; limit: number; days: number; avans: boolean }

export function AdminView({ orders, advance }: { orders: Order[]; advance: (o: Order) => void }) {
  const [tab, setTab] = useState<'firme' | 'cjenovnici' | 'narudzbe'>('firme')
  const [pending, setPending] = useState<Firm[]>(PENDING)
  const [decided, setDecided] = useState<Record<string, 'Odobrena' | 'Odbijena'>>({})
  const [clients, setClients] = useState<Client[]>([
    { id: 'c1', name: FIRM.name, tier: 'Nivo 2', limit: 30000, days: 30, avans: false },
    { id: 'c2', name: 'Demo Enterijer d.o.o.', tier: 'Nivo 1', limit: 10000, days: 30, avans: false },
    { id: 'c3', name: 'Demo Krovovi s.p.', tier: 'Gost', limit: 0, days: 0, avans: true },
  ])

  // Zahtjev iz forme "Registracija firme" (prijava u navbaru) stiže ovdje; odluka se vidi i u formi.
  useEffect(() => {
    const t = window.setTimeout(() => {
      try {
        const r = JSON.parse(window.localStorage.getItem(REG_KEY) || 'null')
        if (!r?.name) return
        setPending((p) => [{ id: 'mine', mine: true, name: r.name, jib: r.jib, pdv: r.pdv, contact: `${r.person} · ${r.phone}`, sent: new Date(r.sent).toLocaleDateString('de-DE') }, ...p.filter((f) => f.id !== 'mine')])
        if (r.status) setDecided((d) => ({ ...d, mine: r.status === 'approved' ? 'Odobrena' : 'Odbijena' }))
      } catch {}
    }, 0)
    return () => window.clearTimeout(t)
  }, [])

  const decide = (f: Firm, v: 'Odobrena' | 'Odbijena') => {
    setDecided((d) => ({ ...d, [f.id]: v }))
    if (f.mine) {
      try {
        const r = JSON.parse(window.localStorage.getItem(REG_KEY) || 'null')
        if (r) window.localStorage.setItem(REG_KEY, JSON.stringify({ ...r, status: v === 'Odobrena' ? 'approved' : 'rejected' }))
      } catch {}
    }
    if (v === 'Odobrena') setClients((c) => (c.some((k) => k.name === f.name) ? c : [...c, { id: f.id, name: f.name, tier: 'Nivo 1', limit: 5000, days: 0, avans: true }]))
  }
  const patch = (id: string, p: Partial<Client>) => setClients((c) => c.map((k) => (k.id === id ? { ...k, ...p } : k)))
  const waiting = pending.filter((f) => !decided[f.id]).length
  const all = [
    ...orders.map((o) => ({ o, firm: FIRM.name, own: true })),
    { o: { no: 'GC-26-04418', site: 'a', step: 0, mode: 'Dostava', slot: '', lines: [], days: 0 } as Order, firm: 'Demo Enterijer d.o.o.', own: false },
  ]

  return (
    <section className={`${s.card} ${x.admin}`}>
      <div className={s.chips} role="tablist">
        {(
          [
            ['firme', `Firme na odobrenju (${waiting})`],
            ['cjenovnici', 'Cjenovnici po klijentu'],
            ['narudzbe', 'Narudžbe svih klijenata'],
          ] as const
        ).map(([id, label]) => (
          <button key={id} type="button" role="tab" aria-selected={tab === id} onClick={() => setTab(id)}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'firme' && (
        <>
          <ul className={s.rows}>
            {pending.map((f) => (
              <li key={f.id} className={x.firm}>
                <span>
                  <b>
                    {f.name}
                    {f.mine && <em className={x.fromForm}>iz forme za registraciju</em>}
                  </b>
                  <i>
                    JIB {f.jib} · PDV {f.pdv || '—'} · {f.contact} · {f.sent}
                  </i>
                </span>
                {decided[f.id] ? (
                  <span className={s.chip} data-k={decided[f.id] === 'Odobrena' ? 'act' : undefined}>
                    {decided[f.id]}
                  </span>
                ) : (
                  <span className={x.actions}>
                    <button type="button" className={s.primary} onClick={() => decide(f, 'Odobrena')}>
                      Odobri
                    </button>
                    <button type="button" className={s.ghost} onClick={() => decide(f, 'Odbijena')}>
                      Odbij
                    </button>
                  </span>
                )}
              </li>
            ))}
          </ul>
          <p className={s.fine}>Firma vidi cijene tek kad je prodaja odobri. Nova firma kreće sa nivoom 1 i avansom dok se ne dogovore uslovi.</p>
        </>
      )}

      {tab === 'cjenovnici' && (
        <>
          <ul className={s.rows}>
            {clients.map((c) => (
              <li key={c.id} className={x.client}>
                <span>
                  <b>{c.name}</b>
                  <i>Rabat {TIERS.find((t) => t[0] === c.tier)?.[1] ?? 0} % · limit {km(c.limit)}</i>
                </span>
                <select className={x.select} value={c.tier} onChange={(e) => patch(c.id, { tier: e.target.value })} aria-label={`Cjenovnik: ${c.name}`}>
                  {TIERS.map(([t]) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
                <select className={x.select} value={c.limit} onChange={(e) => patch(c.id, { limit: Number(e.target.value) })} aria-label={`Kreditni limit: ${c.name}`}>
                  {[0, 5000, 10000, 30000, 50000].map((v) => (
                    <option key={v} value={v}>
                      {v ? km(v) : 'bez kredita'}
                    </option>
                  ))}
                </select>
                <select className={x.select} value={c.days} onChange={(e) => patch(c.id, { days: Number(e.target.value) })} aria-label={`Valuta: ${c.name}`}>
                  {[0, 15, 30, 60].map((d) => (
                    <option key={d} value={d}>
                      {d ? `valuta ${d} d` : 'bez odgode'}
                    </option>
                  ))}
                </select>
                <span className={s.seg}>
                  <button type="button" role="radio" aria-checked={!c.avans} onClick={() => patch(c.id, { avans: false })}>
                    Odgoda
                  </button>
                  <button type="button" role="radio" aria-checked={c.avans} onClick={() => patch(c.id, { avans: true })}>
                    Avans
                  </button>
                </span>
              </li>
            ))}
          </ul>
          <p className={s.fine}>Primjer posebnih cjenovnika i uslova po klijentu. Stvarni rabati i limiti Grand Company-ja nisu javni i dogovaraju se ugovorom.</p>
        </>
      )}

      {tab === 'narudzbe' && (
        <>
          <ul className={s.rows}>
            {all.map(({ o, firm, own }) => (
              <li key={o.no}>
                <span>
                  <b>{o.no}</b>
                  <i>
                    {firm} · {own ? `${site(o.site).name} · ${km(amount(o.lines))}` : 'novi upit'}
                  </i>
                </span>
                <span className={s.chip} data-k={o.step >= 4 ? 'done' : 'act'}>
                  {STEPS[o.step]}
                </span>
                {own && (
                  <button type="button" className={s.ghost} disabled={o.step >= 4} onClick={() => advance(o)}>
                    Sljedeći status <Icon name="arrow" />
                  </button>
                )}
              </li>
            ))}
          </ul>
          <p className={s.fine}>Status koji prodaja ovdje pomjeri kupac odmah vidi u Narudžbama i dobija e-poštom.</p>
        </>
      )}
    </section>
  )
}
