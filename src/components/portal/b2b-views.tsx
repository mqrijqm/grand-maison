'use client'

import { useMemo, useRef, useState } from 'react'
import { PRODUCT_MAP, money } from '@/lib/shop'
import { DOCS, LISTS, ORDERS, siteById, type Line } from '@/lib/portal-demo'
import { credit, facets, liveStatus, netTotal, pct, price, searchProducts, stockLevel, toBase, uoms, TERMS, type SiteId } from '@/lib/portal-b2b'
import Icon from './Icon'
import type { Api } from './views'
import s from './Dashboard.module.css'

// B2B moduli dashboarda (demo), po strukturi: iznad prevoja kreditni okvir, narudžbe u toku i brzi unos;
// zatim ponavljanje kupovine (nedavne narudžbe, šeme materijala); na dnu dokumenti i odobrenja.
// Katalog je tabelarni (list view) sa tehničkim filterima, neto cijenom i izborom jedinice mjere.

const km = (n: number) => `${Math.round(n).toLocaleString('de-DE')} KM`
const date = (days: number) => new Date(2026, 9, 9 - days).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })
const n2 = (n: number) => n.toLocaleString('de-DE', { maximumFractionDigits: 2 })

/* ——— Iznad prevoja ——— */

export function CreditWidget({ api }: { api: Api }) {
  const c = credit()
  const inv = c.invoices / c.limit
  const ord = c.orders / c.limit
  return (
    <section className={`${s.panel} ${s.creditCard}`} data-focus="credit" data-tour="credit">
      <header className={s.panelHead}>
        <h3>Kreditni okvir</h3>
        <span className={s.tag}>Demo · {TERMS.tier}</span>
      </header>
      <div className={s.creditFree}>
        <span className={s.muted}>Dostupno za novu nabavku</span>
        <b>{km(c.free)}</b>
      </div>
      <div className={s.creditBar} role="img" aria-label={`Iskorišteno ${km(c.used)} od ${km(c.limit)}`}>
        <i data-k="inv" style={{ width: `${inv * 100}%` }} />
        <i data-k="ord" style={{ width: `${ord * 100}%` }} />
      </div>
      <dl className={s.creditLegend}>
        <div>
          <dt>
            <i data-k="inv" />
            Otvorene fakture
          </dt>
          <dd>{km(c.invoices)}</dd>
        </div>
        <div>
          <dt>
            <i data-k="ord" />
            Narudžbe u obradi
          </dt>
          <dd>{km(c.orders)}</dd>
        </div>
        <div>
          <dt>
            <i />
            Odobreni limit
          </dt>
          <dd>{km(c.limit)}</dd>
        </div>
      </dl>
      <div className={s.actionsRow}>
        <button type="button" className={s.btnGhost} onClick={() => api.go('dokumenti')}>
          Fakture
        </button>
        <span className={s.muted}>Valuta {c.days} dana · uslovi po ugovoru</span>
      </div>
    </section>
  )
}

export function LiveOrders({ api }: { api: Api }) {
  const list = ORDERS.filter((o) => o.step >= 1 && o.step < 4 && (api.site === 'all' || o.site === api.site))
  return (
    <section className={s.panel} data-focus="live-orders" data-tour="live-orders">
      <header className={s.panelHead}>
        <h3>Narudžbe u toku</h3>
        <button type="button" className={s.link} onClick={() => api.go('narudzbe')}>
          Sve →
        </button>
      </header>
      {list.length === 0 && <p className={s.muted}>Nema narudžbi u toku za ovo gradilište.</p>}
      <ul className={s.liveList}>
        {list.map((o) => {
          const st = liveStatus(o)
          return (
            <li key={o.no}>
              <button type="button" onClick={() => api.go('narudzbe')}>
                <span className={s.mono}>{o.no}</span>
                <span className={s.liveText}>
                  <b>{siteById(o.site).short}</b>
                  <i>{o.slot}</i>
                </span>
                <span className={s.status} data-s={st === 'Na putu ka gradilištu' ? 'go' : st === 'Spremno za preuzimanje' ? 'ready' : 'prep'}>
                  <i />
                  {st}
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
  const [sku, setSku] = useState('')
  const [qty, setQty] = useState(1)
  const [uom, setUom] = useState('')
  const qtyRef = useRef<HTMLInputElement>(null)
  const p = PRODUCT_MAP[sku]
  const units = uoms(sku)
  const u = units.find((x) => x.id === uom) ?? units[0]
  const base = p ? toBase(sku, qty, u?.id) : 0
  const pr = p ? price(sku, base, api.site) : null
  const add = () => {
    if (!p || qty <= 0) return
    api.addQuiet([[sku, base]], `${sku} · ${n2(qty)} ${u?.id}`)
    setSku('')
    setQty(1)
    setUom('')
  }
  return (
    <section className={`${s.panel} ${s.qaCard}`} data-focus="quick-add">
      <header className={s.panelHead}>
        <h3>Brzi unos</h3>
        <button type="button" className={s.link} onClick={() => api.go('brza')}>
          Više redova →
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
            placeholder="Šifra, npr. GKP-001"
            spellCheck={false}
            aria-label="Šifra artikla"
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
            <input ref={qtyRef} type="number" min={0} step="any" value={qty} onChange={(e) => setQty(Math.max(0, Number(e.target.value)))} aria-label="Količina" />
          </label>
          <select className={s.uom} value={u?.id ?? ''} onChange={(e) => setUom(e.target.value)} disabled={!p} aria-label="Jedinica mjere">
            {units.length ? units.map((x) => <option key={x.id} value={x.id}>{x.label}</option>) : <option>jed.</option>}
          </select>
        </div>
        <p className={s.qaInfo} aria-live="polite">
          {p ? (
            <>
              <b>{p.name}</b>
              <span>
                {u && u.factor !== 1 ? `= ${n2(base)} ${p.unit} · ` : ''}
                {money(pr!.unit)}/{p.unit} · ukupno {money(pr!.unit * base)}
              </span>
            </>
          ) : (
            <span className={s.muted}>{sku ? 'Šifra nije u asortimanu' : 'Upišite šifru, Enter prelazi na količinu.'}</span>
          )}
        </p>
        <button type="submit" className={s.btnSolid} disabled={!p || qty <= 0} data-tour="qa-add">
          <Icon name="plus" /> U korpu
        </button>
      </form>
    </section>
  )
}

/* ——— Ponavljanje kupovine ——— */

export function RecentOrders({ api }: { api: Api }) {
  const list = ORDERS.filter((o) => o.step === 4 && (api.site === 'all' || o.site === api.site)).slice(0, 5)
  return (
    <section className={s.panel} data-focus="recent">
      <header className={s.panelHead}>
        <h3>Nedavne narudžbe</h3>
        <span className={s.muted}>Isporučene · cijene na današnje uslove</span>
      </header>
      <div className={s.table}>
        <div className={`${s.tr} ${s.th} ${s.trRecent}`}>
          <span>Broj</span>
          <span>Gradilište</span>
          <span>Datum</span>
          <span>Danas</span>
          <span />
        </div>
        {list.map((o) => (
          <div key={o.no} className={`${s.tr} ${s.trRecent}`}>
            <span className={s.mono}>{o.no}</span>
            <span>
              {siteById(o.site).short} · {o.lines.length} stavki
            </span>
            <span className={s.num}>{date(o.days)}</span>
            <span className={s.num}>{km(netTotal(o.lines, o.site as SiteId))}</span>
            <button type="button" className={s.btnGhost} onClick={() => api.addLines(o.lines, `Ponovljena ${o.no}`)} data-tour={o.no === 'GC-26-04402' ? 'reorder-home' : undefined}>
              <Icon name="repeat" /> Ponovi
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}

export function Guides({ api }: { api: Api }) {
  return (
    <section className={s.panel} data-focus="guides">
      <header className={s.panelHead}>
        <h3>Šeme materijala</h3>
        <button type="button" className={s.link} onClick={() => api.go('liste')}>
          Sve liste →
        </button>
      </header>
      <ul className={s.guides}>
        {LISTS.map((l) => (
          <li key={l.id}>
            <span>
              <b>{l.name}</b>
              <i>
                {l.lines.length} stavki · {km(netTotal(l.lines, api.site))}
              </i>
            </span>
            <button type="button" className={s.btnSolid} onClick={() => api.addLines(l.lines, l.name)}>
              U korpu
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

/* ——— Dokumenti i komunikacija ——— */

export function DocCenter({ api }: { api: Api }) {
  const recent = DOCS.filter((d) => d.kind === 'Faktura' || d.kind === 'Otpremnica').slice(0, 4)
  const certs = DOCS.filter((d) => d.kind === 'Tehnički list')
  return (
    <section className={s.panel} data-focus="docs-center">
      <header className={s.panelHead}>
        <h3>Dokumenti</h3>
        <button type="button" className={s.link} onClick={() => api.go('dokumenti')}>
          Svi →
        </button>
      </header>
      <ul className={s.docMini}>
        {recent.map((d) => (
          <li key={d.id}>
            <span>
              <b>{d.title}</b>
              <i>
                {d.kind} · {date(d.days)}
                {d.amount ? ` · ${money(d.amount)}` : ''}
              </i>
            </span>
            {d.state && <span className={s.tag} data-solid={d.state !== 'Plaćena' || undefined}>{d.state}</span>}
          </li>
        ))}
      </ul>
      <div className={s.certs}>
        <span className={s.muted}>Tehnički listovi kupljenih artikala</span>
        {certs.map((d) => (
          <button key={d.id} type="button" className={s.btnGhost} onClick={() => api.go('dokumenti')}>
            <Icon name="down" /> {d.title.replace(' — tehnički list (demo)', '')}
          </button>
        ))}
      </div>
    </section>
  )
}

export function ApprovalsMini({ api }: { api: Api }) {
  return (
    <section className={s.panel} data-focus="approvals-mini">
      <header className={s.panelHead}>
        <h3>Čeka odobrenje</h3>
        <span className={s.count}>{api.approvals.length}</span>
      </header>
      {api.approvals.length === 0 && <p className={s.muted}>Nema zahtjeva na čekanju.</p>}
      {api.approvals.map((a) => (
        <div key={a.id} className={s.approval}>
          <p>
            <b>{a.who}</b> · {siteById(a.site).short}
          </p>
          <p className={s.muted}>
            {a.note} · {km(netTotal(a.lines, a.site as SiteId))}
          </p>
          <div className={s.actionsRow}>
            <button type="button" className={s.btnSolid} onClick={() => api.decide(a, true)}>
              Odobri <Icon name="check" />
            </button>
            <button type="button" className={s.btnGhost} onClick={() => api.decide(a, false)}>
              Odbij
            </button>
          </div>
        </div>
      ))}
    </section>
  )
}

/* ——— Katalog ——— */

type FacetKey = 'category' | 'length' | 'thickness' | 'sheet' | 'brand'
const FACETS: { key: FacetKey; label: string }[] = [
  { key: 'category', label: 'Kategorija' },
  { key: 'length', label: 'Dužina' },
  { key: 'thickness', label: 'Debljina' },
  { key: 'sheet', label: 'Debljina lima' },
  { key: 'brand', label: 'Proizvođač' },
]

export function Catalog({ api }: { api: Api }) {
  const [q, setQ] = useState(api.catalogQuery)
  const [on, setOn] = useState<Partial<Record<FacetKey, string[]>>>({})
  const [open, setOpen] = useState<string | null>(null)
  const [qty, setQty] = useState<Record<string, number>>({})
  const [uom, setUom] = useState<Record<string, string>>({})
  const { hits, understood } = useMemo(() => searchProducts(q), [q])
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
            <h3>Filteri</h3>
            {Object.values(on).some((v) => v?.length) && (
              <button type="button" className={s.link} onClick={() => setOn({})}>
                Očisti
              </button>
            )}
          </summary>
          {FACETS.map(({ key, label }) => {
            const vs = values(key)
            if (vs.length < 2 && !on[key]?.length) return null
            return (
              <fieldset key={key} className={s.facet}>
                <legend>{label}</legend>
                {vs.map((v) => (
                  <label key={v}>
                    <input type="checkbox" checked={!!on[key]?.includes(v)} onChange={() => toggle(key, v)} />
                    <span>{v}</span>
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
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Šifra, naziv ili žargon: rigips, CW 75, kamenka…" aria-label="Pretraga kataloga" data-tour="cat-search" />
          </label>
          <span className={s.muted}>
            {rows.length} artikala · vaše neto cijene{api.site !== 'all' ? ` · ${siteById(api.site).short}` : ''}
          </span>
        </header>
        {(understood.length > 0 || fuzzy) && (
          <p className={s.note}>
            {understood.length > 0 && <>Prepoznato: {understood.join(' · ')}. </>}
            {fuzzy && <>Uključeni su i slični pojmovi (moguća greška u kucanju).</>}
          </p>
        )}
        <div className={s.table} role="table">
          <div className={`${s.tr} ${s.th} ${s.trCat}`} role="row">
            <span>Artikal</span>
            <span>Šifra</span>
            <span>Vaša cijena</span>
            <span>Jedinica</span>
            <span>Zaliha</span>
            <span>Količina</span>
            <span />
          </div>
          {rows.map(({ product: p }) => {
            const units = uoms(p.sku)
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
                    <b>{p.name}</b>
                    <i>{p.spec}</i>
                  </button>
                  <span className={s.mono}>{p.sku}</span>
                  <span className={s.num}>
                    <b>{money(pr.unit)}</b>
                    <i className={s.priceNote}>
                      /{p.unit}
                      {pr.project ? ' · projekt' : pr.volume ? ' · paleta' : ''}
                    </i>
                  </span>
                  <select className={s.uom} value={u.id} onChange={(e) => setUom({ ...uom, [p.sku]: e.target.value })} aria-label={`Jedinica za ${p.sku}`}>
                    {units.map((x) => (
                      <option key={x.id} value={x.id}>
                        {x.label}
                      </option>
                    ))}
                  </select>
                  <span className={s.stock} data-l={lvl}>
                    <i />
                    {n2(p.stock)} {p.unit}
                  </span>
                  <label className={s.qtyCell}>
                    <input type="number" min={0} step="any" value={n} onChange={(e) => setQty({ ...qty, [p.sku]: Math.max(0, Number(e.target.value)) })} aria-label={`Količina ${p.sku}`} />
                  </label>
                  <button type="button" className={s.iconBtnSolid} disabled={n <= 0} aria-label={`Dodaj ${p.sku} u korpu`} onClick={() => api.addQuiet([[p.sku, base]], `${p.sku} · ${n2(n)} ${u.id}`)}>
                    <Icon name="plus" />
                  </button>
                </div>
                {open === p.sku && (
                  <div className={s.acc}>
                    <details open>
                      <summary>Opis</summary>
                      <p>{p.desc}</p>
                    </details>
                    <details>
                      <summary>Tehnička specifikacija</summary>
                      <dl className={s.sum}>
                        <div>
                          <dt>Dimenzije</dt>
                          <dd>{p.spec}</dd>
                        </div>
                        {f.thickness && (
                          <div>
                            <dt>Debljina</dt>
                            <dd>{f.thickness}</dd>
                          </div>
                        )}
                        {f.sheet && (
                          <div>
                            <dt>Lim</dt>
                            <dd>{f.sheet}</dd>
                          </div>
                        )}
                        <div>
                          <dt>Težina</dt>
                          <dd>
                            {n2(p.weight)} kg/{p.unit}
                          </dd>
                        </div>
                        <div>
                          <dt>Proizvođač</dt>
                          <dd>{p.brand}</dd>
                        </div>
                      </dl>
                    </details>
                    <details>
                      <summary>Pakovanje, jedinice i cijena</summary>
                      <ul className={s.lines}>
                        {units.map((x) => (
                          <li key={x.id}>
                            <span>{x.label}</span>
                            <span>
                              = {n2(x.factor)} {p.unit}
                            </span>
                            <b>{money(price(p.sku, x.factor, api.site).unit * x.factor)}</b>
                          </li>
                        ))}
                      </ul>
                      <p className={s.note}>
                        Vaš rabat na ovaj artikal: {pct(price(p.sku, 1, api.site).discount)} (demo, {TERMS.tier}). Puna paleta: dodatnih {pct(TERMS.pallet)}. Narudžba se u skladište šalje u osnovnoj jedinici ({p.unit}).
                      </p>
                    </details>
                    <details>
                      <summary>Dokumenti i sigurnost</summary>
                      <p className={s.muted}>Tehnički list i sigurnosni list artikla (demo), preuzimanje u Dokumentima.</p>
                      <button type="button" className={s.btnGhost} onClick={() => api.go('dokumenti')}>
                        <Icon name="down" /> Tehnički list
                      </button>
                    </details>
                  </div>
                )}
              </div>
            )
          })}
          {rows.length === 0 && <p className={s.muted}>Nema artikala za ovu pretragu. Probajte šifru ili kraći pojam.</p>}
        </div>
      </section>
    </div>
  )
}

/* ——— Skener barkoda (demo) ——— */

// Demo barkodovi: u produkciji dolaze iz kataloga (EAN sa ambalaže).
const BARCODES: { code: string; sku: string; label: string }[] = [
  { code: '3870000100017', sku: 'ACC-001', label: 'Kutija vijaka 3,5 × 25' },
  { code: '3870000100031', sku: 'ACC-003', label: 'Rolna bandaž trake' },
  { code: '3870000200014', sku: 'CHM-001', label: 'Vreća gipsane mase 5 kg' },
  { code: '3870000200021', sku: 'CHM-002', label: 'Vreća mase za fugovanje 25 kg' },
]

export function Scanner({ onScan, onClose }: { onScan: (l: Line, label: string) => void; onClose: () => void }) {
  const [hit, setHit] = useState<string | null>(null)
  return (
    <div className={s.scanner} role="dialog" aria-label="Skener barkoda (demo)">
      <div className={s.scanView} aria-hidden>
        <i />
        <span>{hit ?? 'Usmjerite kameru na barkod ambalaže'}</span>
      </div>
      <p className={s.muted}>Demo: izaberite ambalažu kao da je skenirate. Na telefonu skener koristi kameru.</p>
      <ul className={s.guides}>
        {BARCODES.map((b) => (
          <li key={b.code}>
            <span>
              <b>{b.label}</b>
              <i className={s.mono}>
                {b.code} → {b.sku}
              </i>
            </span>
            <button
              type="button"
              className={s.btnGhost}
              onClick={() => {
                setHit(`${b.code} · ${PRODUCT_MAP[b.sku]?.name}`)
                onScan([b.sku, 1], b.label)
              }}
            >
              Skeniraj
            </button>
          </li>
        ))}
      </ul>
      <button type="button" className={s.btnSolid} onClick={onClose}>
        Gotovo
      </button>
    </div>
  )
}
