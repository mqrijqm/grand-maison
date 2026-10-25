'use client'

import { useMemo, useRef, useState } from 'react'
import { PRODUCT_MAP } from '@/lib/shop'
import { decDot, pDesc, pSpec, tr, uName } from '@/lib/portal-i18n'
import { useFmt } from './useFmt'
import { DOCS, LISTS, ORDERS, siteById, type Line } from '@/lib/portal-demo'
import { credit, facets, liveStatus, netTotal, pct, price, searchProducts, stockLevel, toBase, uoms, TERMS, type SiteId } from '@/lib/portal-b2b'
import Icon from './Icon'
import type { Api } from './views'
import s from './Dashboard.module.css'

// B2B moduli dashboarda (demo), po strukturi: iznad prevoja kreditni okvir, narudžbe u toku i brzi unos;
// zatim ponavljanje kupovine (nedavne narudžbe, šeme materijala); na dnu dokumenti i odobrenja.
// Katalog je tabelarni (list view) sa tehničkim filterima, neto cijenom i izborom jedinice mjere.

const dateOf = (days: number) => new Date(2026, 9, 9 - days)

/* ——— Iznad prevoja ——— */

export function CreditWidget({ api }: { api: Api }) {
  const { t, lang, km0: km } = useFmt()
  const c = credit()
  const inv = c.invoices / c.limit
  const ord = c.orders / c.limit
  return (
    <section className={`${s.panel} ${s.creditCard}`} data-focus="credit" data-tour="credit">
      <header className={s.panelHead}>
        <h3>{t('Kreditni okvir', 'Credit line')}</h3>
        <span className={s.tag}>Demo · {tr(TERMS.tier, lang)}</span>
      </header>
      <div className={s.creditFree}>
        <span className={s.muted}>{t('Dostupno za novu nabavku', 'Available for new purchases')}</span>
        <b>{km(c.free)}</b>
      </div>
      <div className={s.creditBar} role="img" aria-label={t(`Iskorišteno ${km(c.used)} od ${km(c.limit)}`, `${km(c.used)} of ${km(c.limit)} used`)}>
        <i data-k="inv" style={{ width: `${inv * 100}%` }} />
        <i data-k="ord" style={{ width: `${ord * 100}%` }} />
      </div>
      <dl className={s.creditLegend}>
        <div>
          <dt>
            <i data-k="inv" />
            {t('Otvorene fakture', 'Open invoices')}
          </dt>
          <dd>{km(c.invoices)}</dd>
        </div>
        <div>
          <dt>
            <i data-k="ord" />
            {t('Narudžbe u obradi', 'Orders being processed')}
          </dt>
          <dd>{km(c.orders)}</dd>
        </div>
        <div>
          <dt>
            <i />
            {t('Odobreni limit', 'Approved limit')}
          </dt>
          <dd>{km(c.limit)}</dd>
        </div>
      </dl>
      <div className={s.actionsRow}>
        <button type="button" className={s.btnGhost} onClick={() => api.go('dokumenti')}>
          {t('Fakture', 'Invoices')}
        </button>
        <span className={s.muted}>{t(`Valuta ${c.days} dana · uslovi po ugovoru`, `Payment terms ${c.days} days · terms per contract`)}</span>
      </div>
    </section>
  )
}

export function LiveOrders({ api }: { api: Api }) {
  const { t, L } = useFmt()
  const list = ORDERS.filter((o) => o.step >= 1 && o.step < 4 && (api.site === 'all' || o.site === api.site))
  return (
    <section className={s.panel} data-focus="live-orders" data-tour="live-orders">
      <header className={s.panelHead}>
        <h3>{t('Narudžbe u toku', 'Orders in progress')}</h3>
        <button type="button" className={s.link} onClick={() => api.go('narudzbe')}>
          {t('Sve →', 'All →')}
        </button>
      </header>
      {list.length === 0 && <p className={s.muted}>{t('Nema narudžbi u toku za ovo gradilište.', 'No orders in progress for this site.')}</p>}
      <ul className={s.liveList}>
        {list.map((o) => {
          const st = liveStatus(o)
          return (
            <li key={o.no}>
              <button type="button" onClick={() => api.go('narudzbe')}>
                <span className={s.mono}>{o.no}</span>
                <span className={s.liveText}>
                  <b>{L(siteById(o.site).short)}</b>
                  <i>{L(o.slot)}</i>
                </span>
                <span className={s.status} data-s={st === 'Na putu ka gradilištu' ? 'go' : st === 'Spremno za preuzimanje' ? 'ready' : 'prep'}>
                  <i />
                  {L(st)}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export function QuickAdd({ api }: { api: Api }) {
  const { t, lang, money, n2, name } = useFmt()
  const [sku, setSku] = useState('')
  const [qty, setQty] = useState(1)
  const [uom, setUom] = useState('')
  const qtyRef = useRef<HTMLInputElement>(null)
  const p = PRODUCT_MAP[sku]
  const units = uoms(sku, lang)
  const u = units.find((x) => x.id === uom) ?? units[0]
  const base = p ? toBase(sku, qty, u?.id) : 0
  const pr = p ? price(sku, base, api.site) : null
  const add = () => {
    if (!p || qty <= 0) return
    api.addQuiet([[sku, base]], `${sku} · ${n2(qty)} ${uName(u?.id ?? '', lang)}`)
    setSku('')
    setQty(1)
    setUom('')
  }
  return (
    <section className={`${s.panel} ${s.qaCard}`} data-focus="quick-add">
      <header className={s.panelHead}>
        <h3>{t('Brzi unos', 'Quick add')}</h3>
        <button type="button" className={s.link} onClick={() => api.go('brza')}>
          {t('Više redova →', 'More rows →')}
        </button>
      </header>
      <form
        className={s.qaForm}
        onSubmit={(e) => {
          e.preventDefault()
          add()
        }}
      >
        <label className={s.skuCell}>
          <input
            value={sku}
            list="gc-skus"
            placeholder={t('Šifra, npr. GKP-001', 'Code, e.g. GKP-001')}
            spellCheck={false}
            aria-label={t('Šifra artikla', 'Item code')}
            data-tour="qa-sku"
            onChange={(e) => {
              setSku(e.target.value.toUpperCase().trim())
              setUom('')
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && p) {
                e.preventDefault()
                qtyRef.current?.focus()
                qtyRef.current?.select()
              }
            }}
          />
          <i className={s.valid}>{p ? <Icon name="check" /> : sku ? <Icon name="x" /> : null}</i>
        </label>
        <div className={s.qaRow}>
          <label className={s.qtyCell}>
            <input ref={qtyRef} type="number" min={0} step="any" value={qty} onChange={(e) => setQty(Math.max(0, Number(e.target.value)))} aria-label={t('Količina', 'Quantity')} />
          </label>
          <select className={s.uom} value={u?.id ?? ''} onChange={(e) => setUom(e.target.value)} disabled={!p} aria-label={t('Jedinica mjere', 'Unit of measure')}>
            {units.length ? units.map((x) => <option key={x.id} value={x.id}>{x.label}</option>) : <option>{t('jed.', 'unit')}</option>}
          </select>
        </div>
        <p className={s.qaInfo} aria-live="polite">
          {p ? (
            <>
              <b>{name(p.sku)}</b>
              <span>
                {u && u.factor !== 1 ? `= ${n2(base)} ${uName(p.unit, lang)} · ` : ''}
                {money(pr!.unit)}/{uName(p.unit, lang)} · {t('ukupno', 'total')} {money(pr!.unit * base)}
              </span>
            </>
          ) : (
            <span className={s.muted}>{sku ? t('Šifra nije u asortimanu', 'Code not in the range') : t('Upišite šifru, Enter prelazi na količinu.', 'Type a code, Enter moves to quantity.')}</span>
          )}
        </p>
        <button type="submit" className={s.btnSolid} disabled={!p || qty <= 0} data-tour="qa-add">
          <Icon name="plus" /> {t('U korpu', 'Add to cart')}
        </button>
      </form>
    </section>
  )
}

/* ——— Ponavljanje kupovine ——— */

export function RecentOrders({ api }: { api: Api }) {
  const { t, L, km0: km, date: fd } = useFmt()
  const date = (days: number) => fd(dateOf(days), { day: '2-digit', month: '2-digit' })
  const list = ORDERS.filter((o) => o.step === 4 && (api.site === 'all' || o.site === api.site)).slice(0, 5)
  return (
    <section className={s.panel} data-focus="recent">
      <header className={s.panelHead}>
        <h3>{t('Nedavne narudžbe', 'Recent orders')}</h3>
        <span className={s.muted}>{t('Isporučene · cijene na današnje uslove', 'Delivered · prices at today\'s terms')}</span>
      </header>
      <div className={s.table}>
        <div className={`${s.tr} ${s.th} ${s.trRecent}`}>
          <span>{t('Broj', 'No.')}</span>
          <span>{t('Gradilište', 'Site')}</span>
          <span>{t('Datum', 'Date')}</span>
          <span>{t('Danas', 'Today')}</span>
          <span />
        </div>
        {list.map((o) => (
          <div key={o.no} className={`${s.tr} ${s.trRecent}`}>
            <span className={s.mono}>{o.no}</span>
            <span>
              {L(siteById(o.site).short)} · {t(`${o.lines.length} stavki`, `${o.lines.length} ${o.lines.length === 1 ? 'item' : 'items'}`)}
            </span>
            <span className={s.num}>{date(o.days)}</span>
            <span className={s.num}>{km(netTotal(o.lines, o.site as SiteId))}</span>
            <button type="button" className={s.btnGhost} onClick={() => api.addLines(o.lines, `Ponovljena ${o.no}`)} data-tour={o.no === 'GC-26-04402' ? 'reorder-home' : undefined}>
              <Icon name="repeat" /> {t('Ponovi', 'Repeat')}
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}

export function Guides({ api }: { api: Api }) {
  const { t, L, km0: km } = useFmt()
  return (
    <section className={s.panel} data-focus="guides">
      <header className={s.panelHead}>
        <h3>{t('Šeme materijala', 'Material schemes')}</h3>
        <button type="button" className={s.link} onClick={() => api.go('liste')}>
          {t('Sve liste →', 'All lists →')}
        </button>
      </header>
      <ul className={s.guides}>
        {LISTS.map((l) => (
          <li key={l.id}>
            <span>
              <b>{L(l.name)}</b>
              <i>
                {t(`${l.lines.length} stavki`, `${l.lines.length} ${l.lines.length === 1 ? 'item' : 'items'}`)} · {km(netTotal(l.lines, api.site))}
              </i>
            </span>
            <button type="button" className={s.btnSolid} onClick={() => api.addLines(l.lines, l.name)}>
              {t('U korpu', 'Add to cart')}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

/* ——— Dokumenti i komunikacija ——— */

export function DocCenter({ api }: { api: Api }) {
  const { t, L, money, date: fd } = useFmt()
  const date = (days: number) => fd(dateOf(days), { day: '2-digit', month: '2-digit' })
  const recent = DOCS.filter((d) => d.kind === 'Faktura' || d.kind === 'Otpremnica').slice(0, 4)
  const certs = DOCS.filter((d) => d.kind === 'Tehnički list')
  return (
    <section className={s.panel} data-focus="docs-center">
      <header className={s.panelHead}>
        <h3>{t('Dokumenti', 'Documents')}</h3>
        <button type="button" className={s.link} onClick={() => api.go('dokumenti')}>
          {t('Svi →', 'All →')}
        </button>
      </header>
      <ul className={s.docMini}>
        {recent.map((d) => (
          <li key={d.id}>
            <span>
              <b>{L(d.title)}</b>
              <i>
                {L(d.kind)} · {date(d.days)}
                {d.amount ? ` · ${money(d.amount)}` : ''}
              </i>
            </span>
            {d.state && <span className={s.tag} data-solid={d.state !== 'Plaćena' || undefined}>{L(d.state)}</span>}
          </li>
        ))}
      </ul>
      <div className={s.certs}>
        <span className={s.muted}>{t('Tehnički listovi kupljenih artikala', 'Data sheets of purchased items')}</span>
        {certs.map((d) => (
          <button key={d.id} type="button" className={s.btnGhost} onClick={() => api.go('dokumenti')}>
            <Icon name="down" /> {L(d.title.replace(' — tehnički list (demo)', ''))}
          </button>
        ))}
      </div>
    </section>
  )
}

export function ApprovalsMini({ api }: { api: Api }) {
  const { t, L, km0: km } = useFmt()
  return (
    <section className={s.panel} data-focus="approvals-mini">
      <header className={s.panelHead}>
        <h3>{t('Čeka odobrenje', 'Awaiting approval')}</h3>
        <span className={s.count}>{api.approvals.length}</span>
      </header>
      {api.approvals.length === 0 && <p className={s.muted}>{t('Nema zahtjeva na čekanju.', 'No pending requests.')}</p>}
      {api.approvals.map((a) => (
        <div key={a.id} className={s.approval}>
          <p>
            <b>{L(a.who)}</b> · {L(siteById(a.site).short)}
          </p>
          <p className={s.muted}>
            {L(a.note)} · {km(netTotal(a.lines, a.site as SiteId))}
          </p>
          <div className={s.actionsRow}>
            <button type="button" className={s.btnSolid} onClick={() => api.decide(a, true)}>
              {t('Odobri', 'Approve')} <Icon name="check" />
            </button>
            <button type="button" className={s.btnGhost} onClick={() => api.decide(a, false)}>
              {t('Odbij', 'Reject')}
            </button>
          </div>
        </div>
      ))}
    </section>
  )
}

/* ——— Katalog ——— */

type FacetKey = 'category' | 'length' | 'thickness' | 'sheet' | 'brand'
const FACETS: { key: FacetKey; label: string; en: string }[] = [
  { key: 'category', label: 'Kategorija', en: 'Category' },
  { key: 'length', label: 'Dužina', en: 'Length' },
  { key: 'thickness', label: 'Debljina', en: 'Thickness' },
  { key: 'sheet', label: 'Debljina lima', en: 'Sheet thickness' },
  { key: 'brand', label: 'Proizvođač', en: 'Manufacturer' },
]

export function Catalog({ api }: { api: Api }) {
  const { t, lang, L, money, n2, name } = useFmt()
  const [q, setQ] = useState(api.catalogQuery)
  const [on, setOn] = useState<Partial<Record<FacetKey, string[]>>>({})
  const [open, setOpen] = useState<string | null>(null)
  const [qty, setQty] = useState<Record<string, number>>({})
  const [uom, setUom] = useState<Record<string, string>>({})
  const { hits, understood } = useMemo(() => searchProducts(q, lang), [q, lang])
  const rows = hits.filter(({ product }) => {
    const f = facets(product)
    return FACETS.every(({ key }) => !on[key]?.length || on[key]!.includes(f[key] ?? ''))
  })
  const values = (key: FacetKey) => [...new Set(hits.map(({ product }) => facets(product)[key]).filter(Boolean) as string[])].sort()
  const toggle = (key: FacetKey, v: string) => setOn((m) => ({ ...m, [key]: m[key]?.includes(v) ? m[key]!.filter((x) => x !== v) : [...(m[key] ?? []), v] }))
  const fuzzy = rows.some((r) => r.fuzzy)

  return (
    <div className={s.catalog}>
      <aside className={`${s.panel} ${s.facets}`} data-focus="catalog-facets">
        <details open>
          <summary>
            <h3>{t('Filteri', 'Filters')}</h3>
            {Object.values(on).some((v) => v?.length) && (
              <button type="button" className={s.link} onClick={() => setOn({})}>
                {t('Očisti', 'Clear')}
              </button>
            )}
          </summary>
          {FACETS.map(({ key, label, en }) => {
            const vs = values(key)
            if (vs.length < 2 && !on[key]?.length) return null
            return (
              <fieldset key={key} className={s.facet}>
                <legend>{lang === 'en' ? en : label}</legend>
                {vs.map((v) => (
                  <label key={v}>
                    <input type="checkbox" checked={!!on[key]?.includes(v)} onChange={() => toggle(key, v)} />
                    <span>{decDot(L(v), lang)}</span>
                  </label>
                ))}
              </fieldset>
            )
          })}
        </details>
      </aside>

      <section className={s.panel} data-focus="catalog-table">
        <header className={s.panelHead}>
          <label className={`${s.search} ${s.searchLight}`}>
            <Icon name="search" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('Šifra, naziv ili žargon: rigips, CW 75, kamenka…', 'Code, name or trade slang: plasterboard, CW 75, rockwool…')} aria-label={t('Pretraga kataloga', 'Catalogue search')} data-tour="cat-search" />
          </label>
          <span className={s.muted}>
            {t(`${rows.length} artikala`, `${rows.length} ${rows.length === 1 ? 'item' : 'items'}`)} · {t('vaše neto cijene', 'your net prices')}{api.site !== 'all' ? ` · ${L(siteById(api.site).short)}` : ''}
          </span>
        </header>
        {(understood.length > 0 || fuzzy) && (
          <p className={s.note}>
            {understood.length > 0 && <>{t('Prepoznato', 'Recognised')}: {understood.join(' · ')}. </>}
            {fuzzy && <>{t('Uključeni su i slični pojmovi (moguća greška u kucanju).', 'Similar terms are included too (possible typo).')}</>}
          </p>
        )}
        <div className={s.table} role="table">
          <div className={`${s.tr} ${s.th} ${s.trCat}`} role="row">
            <span>{t('Artikal', 'Item')}</span>
            <span>{t('Šifra', 'Code')}</span>
            <span>{t('Vaša cijena', 'Your price')}</span>
            <span>{t('Jedinica', 'Unit')}</span>
            <span>{t('Zaliha', 'Stock')}</span>
            <span>{t('Količina', 'Quantity')}</span>
            <span />
          </div>
          {rows.map(({ product: p }) => {
            const units = uoms(p.sku, lang)
            const u = units.find((x) => x.id === uom[p.sku]) ?? units[0]
            const n = qty[p.sku] ?? 1
            const base = toBase(p.sku, n, u.id)
            const pr = price(p.sku, base, api.site)
            const lvl = stockLevel(p)
            const f = facets(p)
            return (
              <div key={p.sku} className={s.catItem} data-open={open === p.sku || undefined}>
                <div className={`${s.tr} ${s.trCat}`} role="row">
                  <button type="button" className={s.catName} onClick={() => setOpen(open === p.sku ? null : p.sku)} aria-expanded={open === p.sku}>
                    <b>{name(p.sku)}</b>
                    <i>{decDot(pSpec(p.sku, p.spec, lang), lang)}</i>
                  </button>
                  <span className={s.mono}>{p.sku}</span>
                  <span className={s.num}>
                    <b>{money(pr.unit)}</b>
                    <i className={s.priceNote}>
                      /{uName(p.unit, lang)}
                      {pr.project ? t(' · projekt', ' · project') : pr.volume ? t(' · paleta', ' · pallet') : ''}
                    </i>
                  </span>
                  <select className={s.uom} value={u.id} onChange={(e) => setUom({ ...uom, [p.sku]: e.target.value })} aria-label={`${t('Jedinica za', 'Unit for')} ${p.sku}`}>
                    {units.map((x) => (
                      <option key={x.id} value={x.id}>
                        {x.label}
                      </option>
                    ))}
                  </select>
                  <span className={s.stock} data-l={lvl}>
                    <i />
                    {n2(p.stock)} {uName(p.unit, lang)}
                  </span>
                  <label className={s.qtyCell}>
                    <input type="number" min={0} step="any" value={n} onChange={(e) => setQty({ ...qty, [p.sku]: Math.max(0, Number(e.target.value)) })} aria-label={`${t('Količina', 'Quantity')} ${p.sku}`} />
                  </label>
                  <button type="button" className={s.iconBtnSolid} disabled={n <= 0} aria-label={t(`Dodaj ${p.sku} u korpu`, `Add ${p.sku} to cart`)} onClick={() => api.addQuiet([[p.sku, base]], `${p.sku} · ${n2(n)} ${uName(u.id, lang)}`)}>
                    <Icon name="plus" />
                  </button>
                </div>
                {open === p.sku && (
                  <div className={s.acc}>
                    <details open>
                      <summary>{t('Opis', 'Description')}</summary>
                      <p>{pDesc(p.sku, p.desc, lang)}</p>
                    </details>
                    <details>
                      <summary>{t('Tehnička specifikacija', 'Technical specification')}</summary>
                      <dl className={s.sum}>
                        <div>
                          <dt>{t('Dimenzije', 'Dimensions')}</dt>
                          <dd>{decDot(pSpec(p.sku, p.spec, lang), lang)}</dd>
                        </div>
                        {f.thickness && (
                          <div>
                            <dt>{t('Debljina', 'Thickness')}</dt>
                            <dd>{decDot(f.thickness, lang)}</dd>
                          </div>
                        )}
                        {f.sheet && (
                          <div>
                            <dt>{t('Lim', 'Sheet')}</dt>
                            <dd>{decDot(f.sheet, lang)}</dd>
                          </div>
                        )}
                        <div>
                          <dt>{t('Težina', 'Weight')}</dt>
                          <dd>
                            {n2(p.weight)} kg/{uName(p.unit, lang)}
                          </dd>
                        </div>
                        <div>
                          <dt>{t('Proizvođač', 'Manufacturer')}</dt>
                          <dd>{L(p.brand)}</dd>
                        </div>
                      </dl>
                    </details>
                    <details>
                      <summary>{t('Pakovanje, jedinice i cijena', 'Packaging, units and price')}</summary>
                      <ul className={s.lines}>
                        {units.map((x) => (
                          <li key={x.id}>
                            <span>{x.label}</span>
                            <span>
                              = {n2(x.factor)} {uName(p.unit, lang)}
                            </span>
                            <b>{money(price(p.sku, x.factor, api.site).unit * x.factor)}</b>
                          </li>
                        ))}
                      </ul>
                      <p className={s.note}>
                        {t(`Vaš rabat na ovaj artikal: ${pct(price(p.sku, 1, api.site).discount)} (demo, ${TERMS.tier}). Puna paleta: dodatnih ${pct(TERMS.pallet)}. Narudžba se u skladište šalje u osnovnoj jedinici (${p.unit}).`, `Your discount on this item: ${pct(price(p.sku, 1, api.site).discount)} (demo, ${tr(TERMS.tier, lang)}). Full pallet: an extra ${pct(TERMS.pallet)}. The order goes to the warehouse in the base unit (${uName(p.unit, lang)}).`)}
                      </p>
                    </details>
                    <details>
                      <summary>{t('Dokumenti i sigurnost', 'Documents and safety')}</summary>
                      <p className={s.muted}>{t('Tehnički list i sigurnosni list artikla (demo), preuzimanje u Dokumentima.', 'Data sheet and safety data sheet for the item (demo), available to download in Documents.')}</p>
                      <button type="button" className={s.btnGhost} onClick={() => api.go('dokumenti')}>
                        <Icon name="down" /> {t('Tehnički list', 'Data sheet')}
                      </button>
                    </details>
                  </div>
                )}
              </div>
            )
          })}
          {rows.length === 0 && <p className={s.muted}>{t('Nema artikala za ovu pretragu. Probajte šifru ili kraći pojam.', 'No items match this search. Try a code or a shorter term.')}</p>}
        </div>
      </section>
    </div>
  )
}

/* ——— Skener barkoda (demo) ——— */

// Demo barkodovi: u produkciji dolaze iz kataloga (EAN sa ambalaže).
const BARCODES: { code: string; sku: string; label: string; en: string }[] = [
  { code: '3870000100017', sku: 'ACC-001', label: 'Kutija vijaka 3,5 × 25', en: 'Box of screws 3.5 × 25' },
  { code: '3870000100031', sku: 'ACC-003', label: 'Rolna bandaž trake', en: 'Roll of jointing tape' },
  { code: '3870000200014', sku: 'CHM-001', label: 'Vreća gipsane mase 5 kg', en: 'Bag of gypsum compound 5 kg' },
  { code: '3870000200021', sku: 'CHM-002', label: 'Vreća mase za fugovanje 25 kg', en: 'Bag of joint filler 25 kg' },
]

export function Scanner({ onScan, onClose }: { onScan: (l: Line, label: string) => void; onClose: () => void }) {
  const { t, lang, name } = useFmt()
  const [hit, setHit] = useState<string | null>(null)
  return (
    <div className={s.scanner} role="dialog" aria-label={t('Skener barkoda (demo)', 'Barcode scanner (demo)')}>
      <div className={s.scanView} aria-hidden>
        <i />
        <span>{hit ?? t('Usmjerite kameru na barkod ambalaže', 'Point the camera at the barcode on the packaging')}</span>
      </div>
      <p className={s.muted}>{t('Demo: izaberite ambalažu kao da je skenirate. Na telefonu skener koristi kameru.', 'Demo: pick a package as if you were scanning it. On a phone the scanner uses the camera.')}</p>
      <ul className={s.guides}>
        {BARCODES.map((b) => (
          <li key={b.code}>
            <span>
              <b>{lang === 'en' ? b.en : b.label}</b>
              <i className={s.mono}>
                {b.code} → {b.sku}
              </i>
            </span>
            <button
              type="button"
              className={s.btnGhost}
              onClick={() => {
                setHit(`${b.code} · ${name(b.sku)}`)
                onScan([b.sku, 1], lang === 'en' ? b.en : b.label)
              }}
            >
              {t('Skeniraj', 'Scan')}
            </button>
          </li>
        ))}
      </ul>
      <button type="button" className={s.btnSolid} onClick={onClose}>
        {t('Gotovo', 'Done')}
      </button>
    </div>
  )
}
