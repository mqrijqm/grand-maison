'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { addToCart, notify, openCart } from '@/lib/cart'
import { PRODUCTS, PRODUCT_MAP, money } from '@/lib/shop'
import {
  ORDER_STEPS,
  PORTAL_PARTNERS,
  creditOf,
  dateFromDaysAgo,
  fmtDate,
  invoiceFile,
  invoiceRows,
  orderStep,
  portalLogout,
  type PortalPartner,
} from '@/lib/portal'
import styles from './Portal.module.css'

// Nalog partnera (demo): pregled, naručivanje po ugovorenoj cijeni, narudžbe sa statusom i
// "ponovi", fakture sa preuzimanjem, dokumenti (upload/download) i admin pregled partnera.

const TABS = ['Pregled', 'Naručivanje', 'Narudžbe', 'Fakture', 'Dokumenti', 'Admin'] as const
type Tab = (typeof TABS)[number]

const discounted = (price: number, d: number) => Math.round(price * (1 - d) * 100) / 100
const orderTotal = (items: [string, number][], d: number) =>
  Math.round(items.reduce((s, [sku, q]) => s + discounted(PRODUCT_MAP[sku]?.price ?? 0, d) * q, 0) * 100) / 100

function download(name: string, text: string, type = 'text/plain') {
  const url = URL.createObjectURL(new Blob([text], { type: `${type};charset=utf-8` }))
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

const sizeLabel = (b: number) => (b > 1e6 ? `${(b / 1e6).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1e3))} KB`)

export default function PortalDashboard({ partner }: { partner: PortalPartner }) {
  const [tab, setTab] = useState<Tab>('Pregled')
  const credit = creditOf(partner)
  const invoices = invoiceRows(partner)
  const open = invoices.filter((i) => i.status !== 'Plaćena')
  const openSum = Math.round(open.reduce((s, i) => s + i.amount, 0) * 100) / 100
  const pct = Math.round(partner.discount * 100)
  const lastOrder = partner.orders[partner.orders.length - 1]

  const reorder = (items: [string, number][]) => {
    items.forEach(([sku, q]) => PRODUCT_MAP[sku] && addToCart(sku, q))
    notify('Narudžba je ponovo dodata u korpu', { label: 'Korpa', open: 'cart' })
    openCart()
  }

  return (
    <div className={styles.page}>
      <div className={styles.bar}>
        <div className={`gutter ${styles.barInner}`}>
          <div>
            <span className={styles.demo} style={{ color: 'var(--accent)', borderColor: 'rgb(169 196 228 / .5)' }}>
              Demo nalog
            </span>
            <h1 className={`mt-4 ${styles.barName}`}>{partner.name}</h1>
            <p className={`mt-3 ${styles.barMeta}`}>
              <span>Nivo {partner.level}</span>
              <span>Rabat {pct} %</span>
              <span>Valuta {partner.paymentDays} dana</span>
              <span>{partner.email}</span>
            </p>
          </div>
          <div className={styles.barActions}>
            <button type="button" className={styles.ghost} onClick={openCart}>
              Korpa
            </button>
            <button type="button" className={styles.ghost} onClick={portalLogout}>
              Odjava
            </button>
          </div>
        </div>
      </div>

      <div className={`gutter ${styles.tabs}`} role="tablist" aria-label="Portal">
        {TABS.map((t) => (
          <button key={t} type="button" role="tab" aria-selected={tab === t} className={styles.tab} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </div>

      <div className={`gutter ${styles.panel}`} role="tabpanel" aria-label={tab}>
        {tab === 'Pregled' && (
          <>
            <div className={styles.metrics}>
              <Metric label="Ugovoreni rabat" value={`${pct} %`} hint={`Nivo ${partner.level} · cijene u katalogu portala su već umanjene`} />
              <div className={styles.metric}>
                <span className={styles.metricLabel}>Kreditni limit</span>
                <span className={styles.metricValue}>{money(credit.available)}</span>
                <div className={styles.meter} aria-hidden>
                  <span style={{ width: `${Math.round(credit.ratio * 100)}%` }} />
                </div>
                <span className={styles.metricHint}>Raspoloživo od {money(credit.limit)} · iskorišteno {money(credit.used)}</span>
              </div>
              <Metric label="Odgođeno plaćanje" value={`${partner.paymentDays} dana`} hint="Valuta od datuma fakture" />
              <Metric label="Otvorene fakture" value={money(openSum)} hint={`${open.length} ${open.length === 1 ? 'faktura' : 'fakture'} za plaćanje`} />
            </div>

            <div className={styles.overview}>
              {lastOrder && (
                <div className={styles.card}>
                  <p className={styles.cardTitle}>Posljednja narudžba</p>
                  <p className={styles.rowMain}>{lastOrder.no}</p>
                  <p className={styles.rowSub}>
                    {fmtDate(dateFromDaysAgo(lastOrder.daysAgo))} · {partner.sites.find((s) => s.id === lastOrder.siteId)?.name}
                  </p>
                  <Steps status={lastOrder.status} />
                  <div className="mt-6 flex flex-wrap gap-4">
                    <button type="button" className={styles.link} onClick={() => setTab('Narudžbe')}>
                      Sve narudžbe
                    </button>
                    <button type="button" className={styles.link} onClick={() => reorder(lastOrder.items)}>
                      Ponovi narudžbu
                    </button>
                  </div>
                </div>
              )}
              <div className={styles.card}>
                <p className={styles.cardTitle}>Zalihe i cijene</p>
                <p className={styles.small}>Stanje i cijene dolaze iz ERP-a Grand Company (u demu: primjer podataka). Naručujete samo ono što je na stanju, u okviru kreditnog limita.</p>
                <button type="button" className={`mt-5 ${styles.link}`} onClick={() => setTab('Naručivanje')}>
                  Otvorite katalog sa vašim cijenama
                </button>
              </div>
            </div>
          </>
        )}

        {tab === 'Naručivanje' && <Ordering partner={partner} available={credit.available} />}

        {tab === 'Narudžbe' && (
          <>
            <div className={styles.panelHead}>
              <h2 className={styles.panelTitle}>Narudžbe</h2>
              <p className={styles.small}>Status isporuke prati se do gradilišta.</p>
            </div>
            <ul className={styles.rows}>
              {[...partner.orders].reverse().map((o) => (
                <li key={o.no} className={`${styles.row} ${styles.ord}`}>
                  <span>
                    <span className={`block ${styles.rowMain}`}>{o.no}</span>
                    <span className={styles.rowSub}>{fmtDate(dateFromDaysAgo(o.daysAgo))}</span>
                  </span>
                  <span>
                    <span className="block">{partner.sites.find((s) => s.id === o.siteId)?.name}</span>
                    <span className={styles.rowSub}>
                      {o.items.length} stavki · dostava
                    </span>
                  </span>
                  <Steps status={o.status} />
                  <span className={`${styles.num} ${styles.rowMain}`}>{money(orderTotal(o.items, partner.discount))}</span>
                  <button type="button" className={styles.link} onClick={() => reorder(o.items)}>
                    Ponovi
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}

        {tab === 'Fakture' && (
          <>
            <div className={styles.panelHead}>
              <h2 className={styles.panelTitle}>Fakture</h2>
              <button
                type="button"
                className={styles.link}
                onClick={() =>
                  download(
                    `fakture-${partner.id}.csv`,
                    ['Broj;Izdata;Dospijeće;Iznos KM;Status', ...invoices.map((r) => [r.no, fmtDate(r.issued), fmtDate(r.due), r.amount.toFixed(2).replace('.', ','), r.status].join(';'))].join('\r\n'),
                    'text/csv',
                  )
                }
              >
                Izvoz u Excel (CSV)
              </button>
            </div>
            <ul className={styles.rows}>
              {invoices.map((r) => (
                <li key={r.no} className={`${styles.row} ${styles.inv}`}>
                  <span className={styles.rowMain}>{r.no}</span>
                  <span>
                    <span className={styles.rowSub}>Izdata </span>
                    {fmtDate(r.issued)}
                  </span>
                  <span>
                    <span className={styles.rowSub}>Dospijeće </span>
                    {fmtDate(r.due)}
                  </span>
                  <span className={`${styles.num} ${styles.rowMain}`}>{money(r.amount)}</span>
                  <span className={`${styles.status} ${r.status === 'Plaćena' ? styles.sPaid : r.status === 'Kasni' ? styles.sLate : styles.sOpen}`}>{r.status}</span>
                  <button type="button" className={styles.link} onClick={() => download(`${r.no}.txt`, invoiceFile(partner, r))}>
                    Preuzmi
                  </button>
                </li>
              ))}
            </ul>
            <div className={styles.sum}>
              <span>Za plaćanje</span>
              <strong>{money(openSum)}</strong>
            </div>
          </>
        )}

        {tab === 'Dokumenti' && <Documents />}

        {tab === 'Admin' && (
          <>
            <div className={styles.panelHead}>
              <h2 className={styles.panelTitle}>Admin · partneri</h2>
              <p className={styles.small}>Pogled prodaje: pravila po partneru, limiti i otvorene stavke.</p>
            </div>
            <ul className={styles.rows}>
              {PORTAL_PARTNERS.map((p) => {
                const c = creditOf(p)
                return (
                  <li key={p.id} className={`${styles.row} ${styles.adm}`}>
                    <span>
                      <span className={`block ${styles.rowMain}`}>{p.name}</span>
                      <span className={styles.rowSub}>{p.email}</span>
                    </span>
                    <span>Nivo {p.level}</span>
                    <span>{Math.round(p.discount * 100)} %</span>
                    <span>
                      <span className="block">{money(c.used)} / {money(c.limit)}</span>
                      <span className={styles.meter} style={{ display: 'block', marginTop: 6 }}>
                        <span style={{ width: `${Math.round(c.ratio * 100)}%` }} />
                      </span>
                    </span>
                    <span>{p.paymentDays} dana</span>
                    <span className={styles.rowSub}>{p.orders.length} narudžbi</span>
                  </li>
                )
              })}
            </ul>
            <p className={styles.note}>U produkciji: izmjena nivoa, limita i statusa narudžbi, sinhronizovano sa ERP-om.</p>
          </>
        )}

        <p className={`mt-16 ${styles.note}`}>
          Demo portal: firme, gradilišta, cijene, rabati, limiti i fakture su izmišljeni primjeri za prezentaciju. <Link href="/za-firme" className="underline underline-offset-4">Za firme</Link>
        </p>
      </div>
    </div>
  )
}

function Metric({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className={styles.metric}>
      <span className={styles.metricLabel}>{label}</span>
      <span className={styles.metricValue}>{value}</span>
      <span className={styles.metricHint}>{hint}</span>
    </div>
  )
}

function Steps({ status }: { status: string }) {
  const at = orderStep(status)
  return (
    <ol className={styles.steps} aria-label={`Status: ${status}`}>
      {ORDER_STEPS.map((s, i) => (
        <li key={s} className={`${styles.stepItem} ${i <= at ? styles.done : ''}`}>
          {s}
        </li>
      ))}
    </ol>
  )
}

function Ordering({ partner, available }: { partner: PortalPartner; available: number }) {
  const [qty, setQty] = useState<Record<string, string>>({})
  const [q, setQ] = useState('')
  const list = useMemo(() => PRODUCTS.filter((p) => !q || `${p.sku} ${p.name}`.toLowerCase().includes(q.toLowerCase())), [q])
  const total = Object.entries(qty).reduce((s, [sku, v]) => s + discounted(PRODUCT_MAP[sku]?.price ?? 0, partner.discount) * (parseFloat(v.replace(',', '.')) || 0), 0)

  const add = (sku: string) => {
    const n = parseFloat((qty[sku] || '').replace(',', '.'))
    if (!(n > 0)) return
    addToCart(sku, n)
    setQty((s) => ({ ...s, [sku]: '' }))
  }

  return (
    <>
      <div className={styles.panelHead}>
        <h2 className={styles.panelTitle}>Katalog sa vašim cijenama</h2>
        <input className={styles.input} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Pretraga po šifri ili nazivu" aria-label="Pretraga artikala" />
      </div>
      <ul className={styles.rows}>
        {list.map((p) => (
          <li key={p.sku} className={`${styles.row} ${styles.priceRow}`}>
            <span className={styles.rowMain}>{p.sku}</span>
            <span>
              <span className="block">{p.name}</span>
              <span className={styles.stock}>{p.stock > 0 ? `Na stanju: ${p.stock} ${p.unit}` : 'Po upitu'}</span>
            </span>
            <span className={`${styles.num} ${styles.strike}`}>{money(p.price)}</span>
            <span className={`${styles.num} ${styles.rowMain}`}>
              {money(discounted(p.price, partner.discount))}
              <span className={styles.rowSub}> /{p.unit}</span>
            </span>
            <span className={styles.qtyBox}>
              <input className={styles.qty} inputMode="decimal" value={qty[p.sku] ?? ''} onChange={(e) => setQty((s) => ({ ...s, [p.sku]: e.target.value }))} placeholder="0" aria-label={`Količina: ${p.name}`} />
            </span>
            <button type="button" className={styles.add} onClick={() => add(p.sku)}>
              Dodaj
            </button>
          </li>
        ))}
      </ul>
      <div className={styles.sum}>
        <span>
          Upisano: {money(Math.round(total * 100) / 100)} · raspoloživ limit {money(available)}
        </span>
        <button type="button" className={styles.link} onClick={openCart}>
          Korpa i narudžba
        </button>
      </div>
      {total > available && <p className={styles.error}>Iznos prelazi raspoloživi kreditni limit; prodaja će predložiti predračun za razliku.</p>}
    </>
  )
}

function Documents() {
  const [files, setFiles] = useState<{ name: string; size: number; url: string; when: Date }[]>([])
  const [over, setOver] = useState(false)
  const input = useRef<HTMLInputElement>(null)
  const urls = useRef<string[]>([])
  useEffect(() => () => urls.current.forEach((u) => URL.revokeObjectURL(u)), [])

  const addFiles = (list: FileList | null) => {
    if (!list) return
    const next = Array.from(list)
      .filter((f) => /\.(pdf|xlsx?|csv|jpe?g|png|webp|dwg)$/i.test(f.name) && f.size <= 10e6)
      .map((f) => {
        const url = URL.createObjectURL(f)
        urls.current.push(url)
        return { name: f.name, size: f.size, url, when: new Date() }
      })
    setFiles((s) => [...next, ...s])
  }

  return (
    <>
      <div className={styles.panelHead}>
        <h2 className={styles.panelTitle}>Dokumenti</h2>
        <p className={styles.small}>Planovi, predmjeri, narudžbenice i ugovori na jednom mjestu.</p>
      </div>
      <div
        className={`${styles.drop} ${over ? styles.over : ''}`}
        role="button"
        tabIndex={0}
        onClick={() => input.current?.click()}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && input.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setOver(true) }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => { e.preventDefault(); setOver(false); addFiles(e.dataTransfer.files) }}
      >
        <strong>Prevucite fajlove ovdje</strong>
        <span>ili kliknite za izbor · PDF, Excel, CSV, DWG, slike · do 10 MB po fajlu</span>
        <input ref={input} type="file" multiple hidden accept=".pdf,.xls,.xlsx,.csv,.jpg,.jpeg,.png,.webp,.dwg" onChange={(e) => { addFiles(e.target.files); e.target.value = '' }} />
      </div>
      {files.length > 0 && (
        <ul className={`mt-6 ${styles.rows}`}>
          {files.map((f) => (
            <li key={f.url} className={`${styles.row} ${styles.priceRow}`} style={{ gridTemplateColumns: 'minmax(0,1fr) auto auto' }}>
              <span className={styles.rowMain} style={{ overflowWrap: 'anywhere' }}>{f.name}</span>
              <span className={styles.rowSub}>{sizeLabel(f.size)}</span>
              <a className={styles.link} href={f.url} download={f.name}>
                Preuzmi
              </a>
            </li>
          ))}
        </ul>
      )}
      <p className={styles.note}>Demo: fajlovi ostaju samo u ovom pregledniku dok je stranica otvorena. U produkciji se čuvaju uz nalog i vide ih prodaja i partner.</p>
    </>
  )
}
