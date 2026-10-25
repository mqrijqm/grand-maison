'use client'

import { useEffect, useState } from 'react'
import Icon from '@/components/portal/Icon'
import { PRODUCT_MAP } from '@/lib/shop'
import { FIRM, STEPS, amount, km as kmSr, site, type Line, type Order } from '@/lib/b2b-demo'
import type { Lang } from '@/lib/i18n'
import { dateLocale, numLocale, pName, tr, uName } from '@/lib/portal-i18n'
import { useFmt } from './useFmt'
import s from '@/components/business/portal/Showcase.module.css'
import x from './extra.module.css'

// Dodaci demo portala na /za-firme (2026-10-11): zalihe po lokaciji i datum dolaska, saldo i otvorene
// stavke, plaćanje odgodom ili avansom, obavještenja sa primjerom mejla i admin pogled za Grand Company
// (odobravanje firmi, cjenovnici po klijentu, narudžbe svih klijenata). Sve je primjer za prezentaciju:
// ništa se ne šalje i ne čuva na serveru; istraživanje nije potvrdilo stvarne limite, rabate ni zalihe.

/** "Danas" u demo podacima portala. */
const TODAY = new Date(2026, 9, 10)
const DAY = 86400000
const fmt = (d: Date, lang: Lang = 'sr') => d.toLocaleDateString(dateLocale(lang), { day: '2-digit', month: '2-digit', year: 'numeric' })
const dmy = (str: string, lang: Lang) => (lang === 'en' ? str.replace(/^(\d+)\.(\d+)\.(\d+)$/, (_, d, m, y) => `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`) : str)
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
export const stockLine = (sku: string, lang: Lang = 'sr') => {
  const st = stockOf(sku)
  if (!st) return ''
  const u = uName(PRODUCT_MAP[sku]?.unit ?? '', lang)
  const n = (v: number) => v.toLocaleString(numLocale(lang), { maximumFractionDigits: 1 })
  if (lang === 'en') return `Yard ${n(st.yard)} · Hall ${n(st.hall)} ${u}${st.incoming ? ` · arriving ${n(st.incoming.qty)} ${u} ${st.incoming.date.replace(/^(\d+)\.10\.$/, '$1 Oct')}` : ''}`
  return `Stovarište ${n(st.yard)} · Hala ${n(st.hall)} ${u}${st.incoming ? ` · stiže ${n(st.incoming.qty)} ${u} ${st.incoming.date}` : ''}`
}

/* ——— Saldo i otvorene stavke ——— */
type Invoice = { no: string; ref: string; days: number; value: number }
const INVOICES: Invoice[] = [
  { no: 'IF-26-00744', ref: 'Kuća C', days: 41, value: 12985 },
  { no: 'IF-26-00862', ref: 'Lamela A', days: 24, value: 17240 },
  { no: 'IF-26-00901', ref: 'Lamela A', days: 12, value: 13110 },
]
/** Plaćene fakture ove godine (za "potrošnja ove godine" i izvoz). */
const PAID_2026 = 186400

/* ——— Cijene po firmi (demo cjenovnici) ——— */
// Ista ploča, različita cijena: firma vidi SVOJU cijenu iz cjenovnika (demo: DEMO GRADNJA je Nivo 2, -15 %).
export const FIRM_TIER = { name: 'Nivo 2', discount: 0.15 }
const OTHER_TIER = { name: 'Nivo 1', discount: 0.1 }
const r2 = (n: number) => Math.round(n * 100) / 100
export const firmPrice = (sku: string) => r2((PRODUCT_MAP[sku]?.price ?? 0) * (1 - FIRM_TIER.discount))
export const otherPrice = (sku: string) => r2((PRODUCT_MAP[sku]?.price ?? 0) * (1 - OTHER_TIER.discount))
export const firmAmount = (lines: Line[]) => Math.round(lines.reduce((t, l) => t + firmPrice(l.sku) * l.qty, 0))
export const kmd = (n: number, lang: Lang = 'sr') => `${n.toLocaleString(numLocale(lang), { minimumFractionDigits: 2, maximumFractionDigits: 2 })} KM`

/* ——— Kreditni limit i dug ——— */
export const LIMIT = 50000
export function creditState(orders: Order[]) {
  const invoices = INVOICES.reduce((t, i) => t + i.value, 0)
  const open = orders.filter((o) => o.step < 4).reduce((t, o) => t + firmAmount(o.lines), 0)
  const used = invoices + open
  return { invoices, open, used, free: Math.max(0, LIMIT - used) }
}
export function CreditCard({ orders, onDocs }: { orders: Order[]; onDocs: () => void }) {
  const { t, km0: km } = useFmt()
  const c = creditState(orders)
  const pctUsed = Math.min(100, (c.used / LIMIT) * 100)
  return (
    <section className={`${s.card} ${x.credit}`}>
      <div className={x.notesHead}>
        <h4>{t('Kreditni limit', 'Credit limit')}</h4>
        <span className={s.chip}>Demo</span>
      </div>
      <p className={x.creditFree}>
        {t('Imate još', 'You still have')} <b>{km(c.free)}</b> {t('limita', 'of credit limit')}
      </p>
      <div className={x.bar} role="img" aria-label={t(`Iskorišteno ${km(c.used)} od ${km(LIMIT)}`, `${km(c.used)} of ${km(LIMIT)} used`)}>
        <i style={{ width: `${(c.invoices / LIMIT) * 100}%` }} />
        <i data-k="open" style={{ width: `${Math.max(0, pctUsed - (c.invoices / LIMIT) * 100)}%` }} />
      </div>
      <dl className={x.legend}>
        <div>
          <dt>
            <i />
            {t('Neplaćene fakture', 'Unpaid invoices')}
          </dt>
          <dd>{km(c.invoices)}</dd>
        </div>
        <div>
          <dt>
            <i data-k="open" />
            {t('Narudžbe u toku', 'Orders in progress')}
          </dt>
          <dd>{km(c.open)}</dd>
        </div>
        <div>
          <dt>{t('Odobreni limit', 'Approved limit')}</dt>
          <dd>{km(LIMIT)}</dd>
        </div>
      </dl>
      <button type="button" className={s.ghost} onClick={onDocs}>
        {t('Fakture i rokovi', 'Invoices and due dates')} <Icon name="arrow" />
      </button>
    </section>
  )
}

/* ——— Ponovi prošlu narudžbu ——— */
export function ReorderCard({ orders, onReorder }: { orders: Order[]; onReorder: (o: Order) => void }) {
  const { t, L } = useFmt()
  const past = orders.filter((o) => o.step >= 4).slice(0, 2)
  return (
    <section className={s.card}>
      <h4>{t('Naručujete isto kao prošli put?', 'Ordering the same as last time?')}</h4>
      <ul className={s.rows}>
        {past.map((o) => (
          <li key={o.no}>
            <span>
              <b>{o.no}</b>
              <i>
                {L(site(o.site).name)} · {t(`${o.lines.length} stavki`, `${o.lines.length} ${o.lines.length === 1 ? 'item' : 'items'}`)} · {L(o.slot)}
              </i>
            </span>
            <button type="button" className={s.primary} onClick={() => onReorder(o)}>
              <Icon name="repeat" /> {t('Ponovi', 'Repeat')}
            </button>
          </li>
        ))}
      </ul>
      <p className={s.fine}>{t('Stavke idu u upit: promijenite količinu i pošaljite. 30 sekundi umjesto poziva.', 'Items go into an inquiry: change the quantity and send it. 30 seconds instead of a phone call.')}</p>
    </section>
  )
}

/* ——— Ko u firmi šta smije ——— */
export type Role = 'vlasnik' | 'sef' | 'majstor' | 'racunovodstvo'
export const ROLES: { id: Role; label: string; who: string }[] = [
  { id: 'vlasnik', label: 'Vlasnik', who: 'Demo vlasnik' },
  { id: 'sef', label: 'Šef gradilišta', who: 'Demo šef · Lamela A' },
  { id: 'majstor', label: 'Majstor', who: 'Demo majstor · Lamela A' },
  { id: 'racunovodstvo', label: 'Računovodstvo', who: 'Demo računovodstvo' },
]
export const RIGHTS: { key: string; label: string; roles: Role[] }[] = [
  { key: 'upit', label: 'Šalje upit za materijal', roles: ['vlasnik', 'sef', 'majstor'] },
  { key: 'cijene', label: 'Vidi cijene firme', roles: ['vlasnik', 'sef', 'racunovodstvo'] },
  { key: 'potvrda', label: 'Potvrđuje ponudu', roles: ['vlasnik', 'sef'] },
  { key: 'status', label: 'Prati narudžbe i isporuke', roles: ['vlasnik', 'sef', 'majstor', 'racunovodstvo'] },
  { key: 'fakture', label: 'Vidi fakture, dug i limit', roles: ['vlasnik', 'racunovodstvo'] },
  { key: 'tim', label: 'Dodaje korisnike i prava', roles: ['vlasnik'] },
]
export const can = (role: Role, key: string) => !!RIGHTS.find((r) => r.key === key)?.roles.includes(role)
export const roleLabel = (role: Role, lang: Lang = 'sr') => tr(ROLES.find((r) => r.id === role)?.label ?? role, lang)

export function RoleSwitch({ role, onChange }: { role: Role; onChange: (r: Role) => void }) {
  const { t, L } = useFmt()
  return (
    <label className={x.roleSwitch}>
      <span>{t('Prijavljeni kao', 'Signed in as')}</span>
      <select value={role} onChange={(e) => onChange(e.target.value as Role)} aria-label={t('Uloga korisnika (demo)', 'User role (demo)')}>
        {ROLES.map((r) => (
          <option key={r.id} value={r.id}>
            {L(r.label)}
          </option>
        ))}
      </select>
    </label>
  )
}

export function TeamView({ role, onRole }: { role: Role; onRole: (r: Role) => void }) {
  const { t, L } = useFmt()
  return (
    <section className={`${s.card} ${x.team}`}>
      <div className={x.notesHead}>
        <h4>{t('Ko u firmi šta smije', 'Who can do what in the company')}</h4>
        <span className={s.chip}>Demo</span>
      </div>
      <div className={x.matrix} role="table" aria-label={t('Prava po ulogama', 'Permissions by role')}>
        <div role="row" className={x.mRow}>
          <span role="columnheader" />
          {ROLES.map((r) => (
            <button key={r.id} type="button" aria-pressed={role === r.id} onClick={() => onRole(r.id)} title={`${t('Prebaci na', 'Switch to')}: ${L(r.label)}`}>
              {L(r.label)}
            </button>
          ))}
        </div>
        {RIGHTS.map((right) => (
          <div key={right.key} role="row" className={x.mRow}>
            <span role="rowheader">{L(right.label)}</span>
            {ROLES.map((r) => (
              <span key={r.id} role="cell" data-on={right.roles.includes(r.id) || undefined} data-me={role === r.id || undefined}>
                {right.roles.includes(r.id) ? <Icon name="check" /> : '—'}
              </span>
            ))}
          </div>
        ))}
      </div>
      <p className={s.fine}>{t('Kliknite ulogu iznad kolone ili je promijenite lijevo u meniju: portal odmah pokazuje samo ono što ta uloga smije (npr. majstor šalje upit, ali ne vidi cijene i ne potvrđuje ponudu).', 'Click a role above a column or change it in the menu on the left: the portal immediately shows only what that role is allowed to do (e.g. a tradesperson sends an inquiry but cannot see prices or confirm a quote).')}</p>
    </section>
  )
}

/* ——— Izvoz u Excel (CSV) ——— */
export function exportCsv(orders: Order[], lang: Lang = 'sr') {
  const L = (v: string) => tr(v, lang)
  const rows = [
    lang === 'en' ? ['Type', 'Number', 'Site / reference', 'Date', 'Amount (KM)', 'Status'] : ['Vrsta', 'Broj', 'Gradilište / referenca', 'Datum', 'Iznos (KM)', 'Status'],
    ...INVOICES.map((i) => [L('Faktura'), i.no, L(i.ref), fmt(new Date(TODAY.getTime() - i.days * DAY), lang), String(i.value), L('Otvorena')]),
    ...orders.map((o) => [L('Narudžba'), o.no, L(site(o.site).name), fmt(new Date(TODAY.getTime() - o.days * DAY), lang), String(firmAmount(o.lines)), L(STEPS[o.step])]),
    ...orders.flatMap((o) => o.lines.map((l) => [lang === 'en' ? 'Line item' : 'Stavka', o.no, `${pName(l.sku, PRODUCT_MAP[l.sku]?.name ?? l.sku, lang)} (${l.sku})`, '', String(Math.round(firmPrice(l.sku) * l.qty)), `${l.qty} ${uName(PRODUCT_MAP[l.sku]?.unit ?? '', lang)}`])),
  ]
  const csv = '\ufeff' + rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(';')).join('\r\n')
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
  const a = document.createElement('a')
  a.href = url
  a.download = lang === 'en' ? 'grand-company-procurement-2026-demo.csv' : 'grand-company-nabavka-2026-demo.csv'
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
export function SaldoCard({ orders = [] }: { orders?: Order[] }) {
  const { t, lang, L, km0: km } = useFmt()
  const items = INVOICES.map((i) => {
    const issued = new Date(TODAY.getTime() - i.days * DAY)
    const due = new Date(issued.getTime() + PAY_DAYS * DAY)
    return { ...i, issued, due, left: Math.round((due.getTime() - TODAY.getTime()) / DAY) }
  }).sort((a, b) => a.left - b.left)
  const total = items.reduce((t, i) => t + i.value, 0)
  const late = items.filter((i) => i.left < 0).reduce((t, i) => t + i.value, 0)
  const c = creditState(orders)
  return (
    <section className={`${s.card} ${x.saldo}`}>
      <div className={x.notesHead}>
        <h4>{t('Saldo i otvorene stavke', 'Balance and open items')}</h4>
        <button type="button" className={s.ghost} onClick={() => exportCsv(orders, lang)}>
          <Icon name="down" /> {t('Izvezi u Excel', 'Export to Excel')}
        </button>
      </div>
      <div className={x.kpis}>
        <div>
          <span>{t('Saldo', 'Balance')}</span>
          <b>{km(total)}</b>
        </div>
        <div data-warn={late > 0 || undefined}>
          <span>{t('Dospjelo', 'Overdue')}</span>
          <b>{km(late)}</b>
        </div>
        <div>
          <span>{t('Ostalo limita', 'Limit left')}</span>
          <b>{km(c.free)}</b>
        </div>
        <div>
          <span>{t('Potrošnja 2026.', 'Spend 2026')}</span>
          <b>{km(PAID_2026 + total)}</b>
        </div>
      </div>
      <ul className={s.rows}>
        {items.map((i) => (
          <li key={i.no}>
            <span>
              <b>{i.no}</b>
              <i>
                {L(i.ref)} · {t('izdata', 'issued')} {fmt(i.issued, lang)} · {t('rok', 'due')} {fmt(i.due, lang)}
              </i>
            </span>
            <b className={x.num}>{km(i.value)}</b>
            <span className={`${s.chip} ${x.dueChip}`} data-k={i.left < 0 ? 'late' : i.left <= 7 ? 'act' : undefined}>
              {i.left < 0 ? t(`kasni ${-i.left} d`, `${-i.left} d overdue`) : t(`još ${i.left} d`, `${i.left} d left`)}
            </span>
          </li>
        ))}
      </ul>
      <p className={s.fine}>{t('Demo fakture. U produkciji saldo i otvorene stavke dolaze iz knjigovodstva Grand Company-ja.', 'Demo invoices. In production the balance and open items come from Grand Company\'s accounting.')}</p>
    </section>
  )
}

/* ——— Plaćanje: odgoda ili avans ——— */
export type Payment = 'Odgoda' | 'Avans'
export function PaymentSeg({ value, onChange }: { value: Payment; onChange: (p: Payment) => void }) {
  const { t } = useFmt()
  return (
    <div className={x.pay}>
      <span className={s.kicker}>{t('Plaćanje', 'Payment')}</span>
      <div className={s.seg} role="radiogroup" aria-label={t('Način plaćanja', 'Payment method')}>
        {(['Odgoda', 'Avans'] as const).map((p) => (
          <button key={p} type="button" role="radio" aria-checked={value === p} onClick={() => onChange(p)}>
            {p === 'Odgoda' ? t(`Odgoda ${PAY_DAYS} dana`, `Deferred ${PAY_DAYS} days`) : t('Avans (predračun)', 'Advance (pro forma invoice)')}
          </button>
        ))}
      </div>
      <p className={s.fine}>{value === 'Avans' ? t('Predračun stiže e-poštom; roba se izdaje po uplati.', 'The pro forma invoice arrives by email; goods are released on payment.') : t('U okviru dogovorenog kreditnog limita (demo).', 'Within the agreed credit limit (demo).')}</p>
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
  out.push({ id: 'f-744', title: 'Faktura IF-26-00744 kasni 11 dana', meta: `${kmSr(1985)} · Kuća C`, mail: 'faktura', view: 'dokumenti' })
  out.push({ id: 'f-862', title: 'Faktura IF-26-00862 dospijeva za 6 dana', meta: `${kmSr(7240)} · Lamela A`, mail: 'faktura', view: 'dokumenti' })
  return out
}
const MAILS_EN: Record<Mail, (n: Note) => string[]> = {
  narudzba: (n) => [`${tr(n.title, 'en')} and goes into preparation at the warehouse.`, `Site and method: ${tr(n.meta, 'en')}.`, 'Track the status in the portal, under Orders.'],
  status: (n) => [`${tr(n.title, 'en')}.`, `Site and time slot: ${tr(n.meta, 'en')}.`],
  faktura: (n) => [`${tr(n.title, 'en')} (${tr(n.meta, 'en')}).`, 'Download the invoice and the balance of open items in the portal, under Documents. If the payment has already been made, please disregard this message.'],
}
const MAILS: Record<Mail, { tab: string; body: (n: Note) => string[] }> = {
  narudzba: { tab: 'Narudžba potvrđena', body: (n) => [`${n.title} i ulazi u pripremu na stovarištu.`, `Gradilište i način: ${n.meta}.`, 'Status pratite u portalu, u meniju Narudžbe.'] },
  status: { tab: 'Promjena statusa', body: (n) => [`${n.title}.`, `Gradilište i termin: ${n.meta}.`] },
  faktura: { tab: 'Faktura dospijeva', body: (n) => [`${n.title} (${n.meta}).`, 'Fakturu i saldo otvorenih stavki preuzimate u portalu, u meniju Dokumenti. Ako je uplata izvršena, zanemarite ovu poruku.'] },
}
export function NotificationsView({ notes, onOpen }: { notes: Note[]; onOpen: (view: string) => void }) {
  const { t, lang, L } = useFmt()
  const [read, setRead] = useState<string[]>([])
  const firstMail = notes.find((n) => n.mail) ?? null
  const [mail, setMail] = useState<Note | null>(firstMail)
  const kinds = notes.filter((n) => n.mail).filter((n, i, all) => all.findIndex((k) => k.mail === n.mail) === i)
  return (
    <div className={s.split}>
      <section className={s.card}>
        <div className={x.notesHead}>
          <h4>{t('Obavještenja', 'Notifications')}</h4>
          <button type="button" className={s.ghost} onClick={() => setRead(notes.map((n) => n.id))}>
            {t('Označi sve kao pročitano', 'Mark all as read')}
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
                  <b>{L(n.title)}</b>
                  <i>{L(n.meta)}</i>
                </span>
              </button>
              {n.mail && (
                <button type="button" className={s.ghost} aria-pressed={mail?.id === n.id} onClick={() => setMail(n)}>
                  {t('Mejl', 'Email')}
                </button>
              )}
            </li>
          ))}
        </ul>
        <p className={s.fine}>{t('Ista obavještenja stižu e-poštom: potvrda narudžbe, promjena statusa, faktura pred dospijećem.', 'The same notifications arrive by email: order confirmation, status changes, an invoice nearing its due date.')}</p>
      </section>
      {mail && mail.mail && (
        <aside className={`${s.card} ${x.mail}`} aria-label={t('Primjer mejla', 'Sample email')}>
          <div className={s.chips}>
            {kinds.map((k) => (
              <button key={k.id} type="button" role="tab" aria-selected={k.mail === mail.mail} onClick={() => setMail(k)}>
                {L(MAILS[k.mail!].tab)}
              </button>
            ))}
          </div>
          <dl className={x.mailHead}>
            <div>
              <dt>{t('Od', 'From')}</dt>
              <dd>Grand Company Portal</dd>
            </div>
            <div>
              <dt>{t('Za', 'To')}</dt>
              <dd>{L(FIRM.user)}, {FIRM.name}</dd>
            </div>
            <div>
              <dt>{t('Naslov', 'Subject')}</dt>
              <dd>
                <b>{L(mail.title)}</b>
              </dd>
            </div>
          </dl>
          <div className={x.mailBody}>
            <p>{t('Poštovani,', 'Dear customer,')}</p>
            {(lang === 'en' ? MAILS_EN[mail.mail](mail) : MAILS[mail.mail].body(mail)).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <span className={x.mailBtn}>{t('Otvori u portalu', 'Open in portal')}</span>
            <p className={s.fine}>{t('Grand Company d.o.o. · Nenada Kostića 151, Banja Luka · 051 388-995. Primjer mejla; demo ne šalje poruke.', 'Grand Company d.o.o. · Nenada Kostića 151, Banja Luka · 051 388-995. Sample email; the demo does not send messages.')}</p>
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

/** Obavještenje prodavcu u Grand Company-ju: kanal (SMS, mejl, portal) i šta treba uraditi. */
export type SalesEvent = { id: string; t: string; title: string; meta: string; channels: string[]; urgent?: boolean }
export const SALES_START: SalesEvent[] = [
  { id: 's1', t: '09:12', title: 'Novi upit: DEMO GRADNJA d.o.o.', meta: 'Lamela A · 5 stavki · odgovor do 12:00', channels: ['SMS', 'Mejl'], urgent: true },
  { id: 's2', t: '08:40', title: 'Ponuda P-26-0142 ističe za 2 dana', meta: 'DEMO GRADNJA · podsjetnik prodavcu', channels: ['Mejl', 'Portal'] },
  { id: 's3', t: 'juče', title: 'Firma traži odobrenje naloga', meta: 'Demo Instalacije d.o.o. · JIB 4400000000011', channels: ['Portal'] },
  { id: 's4', t: 'juče', title: 'Limit skoro iskorišten', meta: 'DEMO GRADNJA · ostalo manje od 5 % limita · provjeriti prije isporuke', channels: ['Mejl'] },
]

export function AdminView({ orders, advance, events = SALES_START }: { orders: Order[]; advance: (o: Order) => void; events?: SalesEvent[] }) {
  const { t, lang, L, km0: km } = useFmt()
  const [tab, setTab] = useState<'prodaja' | 'firme' | 'cjenovnici' | 'narudzbe'>('prodaja')
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
            ['prodaja', t(`Obavještenja prodaji (${events.length})`, `Sales notifications (${events.length})`)],
            ['firme', t(`Firme na odobrenju (${waiting})`, `Companies awaiting approval (${waiting})`)],
            ['cjenovnici', t('Cjenovnici po klijentu', 'Price lists per client')],
            ['narudzbe', t('Narudžbe svih klijenata', 'Orders of all clients')],
          ] as const
        ).map(([id, label]) => (
          <button key={id} type="button" role="tab" aria-selected={tab === id} onClick={() => setTab(id)}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'prodaja' && (
        <>
          <ul className={s.rows}>
            {events.map((e) => (
              <li key={e.id} className={x.salesRow} data-urgent={e.urgent || undefined}>
                <time className={s.time}>{L(e.t)}</time>
                <span>
                  <b>{L(e.title)}</b>
                  <i>{L(e.meta)}</i>
                </span>
                <span className={x.channels}>
                  {e.channels.map((c) => (
                    <em key={c}>{L(c)}</em>
                  ))}
                </span>
              </li>
            ))}
          </ul>
          <p className={s.fine}>{t('Kad firma pošalje upit, prodavac odmah dobija SMS i mejl; prije isteka ponude dobija podsjetnik. Upit se ne gubi u sandučetu. Pošaljite upit u Materijalima i pojaviće se ovdje (simulacija).', 'When a company sends an inquiry, the sales rep instantly gets an SMS and an email, and a reminder before a quote expires. No inquiry gets lost in an inbox. Send an inquiry under Materials and it will appear here (simulation).')}</p>
        </>
      )}

      {tab === 'firme' && (
        <>
          <ul className={s.rows}>
            {pending.map((f) => (
              <li key={f.id} className={x.firm}>
                <span>
                  <b>
                    {f.name}
                    {f.mine && <em className={x.fromForm}>{t('iz forme za registraciju', 'from the registration form')}</em>}
                  </b>
                  <i>
                    {lang === 'en' ? 'Tax ID (JIB)' : 'JIB'} {f.jib} · {lang === 'en' ? 'VAT ID' : 'PDV'} {f.pdv || '—'} · {L(f.contact)} · {dmy(f.sent, lang)}
                  </i>
                </span>
                {decided[f.id] ? (
                  <span className={s.chip} data-k={decided[f.id] === 'Odobrena' ? 'act' : undefined}>
                    {L(decided[f.id])}
                  </span>
                ) : (
                  <span className={x.actions}>
                    <button type="button" className={s.primary} onClick={() => decide(f, 'Odobrena')}>
                      {t('Odobri', 'Approve')}
                    </button>
                    <button type="button" className={s.ghost} onClick={() => decide(f, 'Odbijena')}>
                      {t('Odbij', 'Reject')}
                    </button>
                  </span>
                )}
              </li>
            ))}
          </ul>
          <p className={s.fine}>{t('Firma vidi cijene tek kad je prodaja odobri. Nova firma kreće sa nivoom 1 i avansom dok se ne dogovore uslovi.', 'A company sees prices only once sales approves it. A new company starts on tier 1 with advance payment until terms are agreed.')}</p>
        </>
      )}

      {tab === 'cjenovnici' && (
        <>
          <ul className={s.rows}>
            {clients.map((c) => (
              <li key={c.id} className={x.client}>
                <span>
                  <b>{c.name}</b>
                  <i>{t('Rabat', 'Discount')} {TIERS.find((tt) => tt[0] === c.tier)?.[1] ?? 0} % · {t('limit', 'limit')} {km(c.limit)}</i>
                </span>
                <select className={x.select} value={c.tier} onChange={(e) => patch(c.id, { tier: e.target.value })} aria-label={`${t('Cjenovnik', 'Price list')}: ${c.name}`}>
                  {TIERS.map(([tn]) => (
                    <option key={tn} value={tn}>
                      {L(tn)}
                    </option>
                  ))}
                </select>
                <select className={x.select} value={c.limit} onChange={(e) => patch(c.id, { limit: Number(e.target.value) })} aria-label={`${t('Kreditni limit', 'Credit limit')}: ${c.name}`}>
                  {[0, 5000, 10000, 30000, 50000].map((v) => (
                    <option key={v} value={v}>
                      {v ? km(v) : t('bez kredita', 'no credit')}
                    </option>
                  ))}
                </select>
                <select className={x.select} value={c.days} onChange={(e) => patch(c.id, { days: Number(e.target.value) })} aria-label={`${t('Valuta', 'Payment terms')}: ${c.name}`}>
                  {[0, 15, 30, 60].map((d) => (
                    <option key={d} value={d}>
                      {d ? t(`valuta ${d} d`, `terms ${d} d`) : t('bez odgode', 'no deferral')}
                    </option>
                  ))}
                </select>
                <span className={s.seg}>
                  <button type="button" role="radio" aria-checked={!c.avans} onClick={() => patch(c.id, { avans: false })}>
                    {t('Odgoda', 'Deferred')}
                  </button>
                  <button type="button" role="radio" aria-checked={c.avans} onClick={() => patch(c.id, { avans: true })}>
                    {t('Avans', 'Advance')}
                  </button>
                </span>
              </li>
            ))}
          </ul>
          <p className={s.fine}>{t('Primjer posebnih cjenovnika i uslova po klijentu. Stvarni rabati i limiti Grand Company-ja nisu javni i dogovaraju se ugovorom.', 'An example of special price lists and terms per client. Actual Grand Company discounts and limits are not public and are agreed by contract.')}</p>
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
                    {firm} · {own ? `${L(site(o.site).name)} · ${km(amount(o.lines))}` : t('novi upit', 'new inquiry')}
                  </i>
                </span>
                <span className={s.chip} data-k={o.step >= 4 ? 'done' : 'act'}>
                  {L(STEPS[o.step])}
                </span>
                {own && (
                  <button type="button" className={s.ghost} disabled={o.step >= 4} onClick={() => advance(o)}>
                    {t('Sljedeći status', 'Next status')} <Icon name="arrow" />
                  </button>
                )}
              </li>
            ))}
          </ul>
          <p className={s.fine}>{t('Status koji prodaja ovdje pomjeri kupac odmah vidi u Narudžbama i dobija e-poštom.', 'A status that sales moves here is instantly visible to the customer under Orders and is also sent by email.')}</p>
        </>
      )}
    </section>
  )
}
