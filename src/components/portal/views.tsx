'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { PRODUCT_MAP, PRODUCTS } from '@/lib/shop'
import { tr } from '@/lib/portal-i18n'
import { useFmt } from './useFmt'
import {
  CATEGORY_SPEND,
  DAYS,
  DOCS,
  HOURS,
  LISTS,
  METRICS,
  ORDER_FLOW,
  ORDERS,
  QUOTES,
  SITES,
  TEAM,
  WEEK,
  lineWeight,
  siteById,
  type Approval,
  type DocKind,
  type FeedItem,
  type Line,
  type MetricId,
  type Order,
  type Quote,
  type QuoteStatus,
} from '@/lib/portal-demo'
import { netTotal, price, toBase, uoms, TERMS, type SiteId } from '@/lib/portal-b2b'
import { ApprovalsMini, CreditWidget, DocCenter, Guides, LiveOrders, QuickAdd, RecentOrders, Scanner } from './b2b-views'
import Icon from './Icon'
import s from './Dashboard.module.css'

export type ViewId = 'pregled' | 'katalog' | 'brza' | 'ponude' | 'narudzbe' | 'isporuke' | 'gradilista' | 'liste' | 'dokumenti' | 'tim'

/** Ono što svaki ekran dobija od ljuske: navigacija, zum kamere, korpa i živi tok. */
export type Api = {
  go: (v: ViewId) => void
  focus: (key: string) => void
  addLines: (lines: Line[], label: string) => void
  push: (item: FeedItem) => void
  toast: (text: string) => void
  loadRows: (lines: Line[]) => void
  /** u korpu bez otvaranja korpe (brzi unos, katalog, skener) */
  addQuiet: (lines: Line[], label: string) => void
  /** aktivno gradilište iz zaglavlja: adresa isporuke i projektne cijene */
  site: SiteId
  approvals: Approval[]
  decide: (a: Approval, ok: boolean) => void
  catalogQuery: string
}


/* ———————————————————————————— Pregled ———————————————————————————— */

function Spark({ data, on }: { data: number[]; on: boolean }) {
  const d = data.slice(-14)
  const max = Math.max(...d, 1)
  const pts = d.map((v, i) => `${(i / (d.length - 1)) * 64},${22 - (v / max) * 18}`).join(' ')
  return (
    <svg viewBox="0 0 64 24" className={s.spark} aria-hidden data-on={on || undefined}>
      <polyline points={pts} fill="none" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  )
}

function Chart({ metric }: { metric: MetricId }) {
  const { t, L, km0, date: fd } = useFmt()
  const m = METRICS.find((x) => x.id === metric)!
  const [hover, setHover] = useState<number | null>(null)
  const box = useRef<HTMLDivElement>(null)
  const n = m.series.length
  const max = Math.max(...m.series, ...m.prev, 1) * 1.12
  const W = 600
  const H = 180
  const bw = W / n
  const line = m.prev.map((v, i) => `${i * bw + bw / 2},${H - (v / max) * H}`).join(' ')
  const today = new Date(2026, 9, 9)
  const dayLabel = (i: number) => {
    const d = new Date(today.getTime() - (n - 1 - i) * 86_400_000)
    return fd(d, { day: '2-digit', month: '2-digit' })
  }
  const fmt = (v: number) => (m.unit === 'KM' ? km0(v) : `${v} ${L(m.unit)}`)
  const move = (e: React.PointerEvent) => {
    const r = box.current!.getBoundingClientRect()
    const i = Math.floor(((e.clientX - r.left) / r.width) * n)
    setHover(Math.min(n - 1, Math.max(0, i)))
  }
  return (
    <div className={s.chartWrap}>
      <div ref={box} className={s.chart} onPointerMove={move} onPointerLeave={() => setHover(null)} data-tour="chart">
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden>
          {[0.25, 0.5, 0.75].map((g) => (
            <line key={g} x1="0" x2={W} y1={H * g} y2={H * g} className={s.grid} />
          ))}
          {m.series.map((v, i) => (
            <rect
              key={i}
              x={i * bw + bw * 0.18}
              width={bw * 0.64}
              y={0}
              height={H}
              className={s.bar}
              data-hot={i >= n - 7 || undefined}
              data-hover={hover === i || undefined}
              style={{ transform: `scaleY(${v / max})`, transitionDelay: `${i * 12}ms` }}
            />
          ))}
          <polyline points={line} className={s.prevLine} />
        </svg>
        {hover !== null && (
          <>
            <span className={s.vline} style={{ left: `${((hover + 0.5) / n) * 100}%` }} />
            <span className={s.tip} style={{ left: `${((hover + 0.5) / n) * 100}%` }} data-right={hover > n * 0.7 || undefined}>
              <b>{fmt(m.series[hover])}</b>
              <i>{dayLabel(hover)} · {t('prošli period', 'previous period')} {fmt(m.prev[hover])}</i>
            </span>
          </>
        )}
      </div>
      <div className={s.axis}>
        {[0, 7, 14, 21, 29].map((i) => (
          <span key={i}>{dayLabel(i)}</span>
        ))}
      </div>
    </div>
  )
}

export function Overview({ api, metric, setMetric, feed }: { api: Api; metric: MetricId; setMetric: (m: MetricId) => void; feed: (FeedItem & { t: string; id: number })[] }) {
  const { t, lang, L, km0 } = useFmt()
  const m = METRICS.find((x) => x.id === metric)!
  const catMax = Math.max(...CATEGORY_SPEND.map((c) => c.value))
  return (
    <>
      {/* Iznad prevoja: novac, narudžbe u toku, brzi unos */}
      <div className={s.hero3}>
        <CreditWidget api={api} />
        <LiveOrders api={api} />
        <QuickAdd api={api} />
      </div>

      {/* Ponavljanje kupovine */}
      <div className={s.row2}>
        <RecentOrders api={api} />
        <Guides api={api} />
      </div>

      {/* Dokumenti i komunikacija */}
      <div className={s.row3c}>
        <DocCenter api={api} />
        <ApprovalsMini api={api} />
        <section className={s.panel} data-focus="feed">
          <header className={s.panelHead}>
            <h3>{t('Uživo', 'Live')}</h3>
            <span className={s.live}>
              <i />
              {t('Uživo', 'Live')}
            </span>
          </header>
          <ul className={s.feed}>
            {feed.map((f, i) => (
              <li key={f.id} data-new={i === 0 || undefined}>
                <button type="button" data-tour={i === 1 ? 'feed' : undefined} onClick={() => api.go(f.kind === 'ponuda' ? 'ponude' : f.kind === 'tim' ? 'tim' : f.kind === 'dokument' ? 'dokumenti' : f.kind === 'isporuka' ? 'isporuke' : 'narudzbe')}>
                  <span className={s.feedIcon}>
                    <Icon name={f.kind === 'ponuda' ? 'ponude' : f.kind === 'narudzba' ? 'narudzbe' : f.kind === 'isporuka' ? 'isporuke' : f.kind === 'dokument' ? 'dokumenti' : 'tim'} />
                  </span>
                  <span className={s.feedText}>
                    <b>{L(f.title)}</b>
                    <i>{L(f.meta)}</i>
                  </span>
                  <time>{L(f.t)}</time>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Analitika nabavke */}
      <div className={s.kpis}>
        {METRICS.map((k) => (
          <button
            key={k.id}
            type="button"
            className={s.kpi}
            data-on={k.id === metric || undefined}
            data-tour={`kpi-${k.id}`}
            data-focus={`kpi-${k.id}`}
            onClick={() => {
              setMetric(k.id)
              api.focus('chart')
            }}
          >
            <span className={s.kpiLabel}>
              <i />
              {L(k.label)}
            </span>
            <span className={s.kpiValue}>{L(k.value)}</span>
            <span className={s.kpiDelta} data-down={k.delta < 0 || undefined}>
              {k.delta === 0 ? `— ${(0).toLocaleString(lang === 'en' ? 'en-US' : 'de-DE', { minimumFractionDigits: 1 })} %` : `${k.delta > 0 ? '▲' : '▼'} ${Math.abs(k.delta).toLocaleString(lang === 'en' ? 'en-US' : 'de-DE', { minimumFractionDigits: 1 })} %`}
            </span>
            <Spark data={k.series} on={k.id === metric} />
          </button>
        ))}
      </div>
      <div className={s.row2}>
        <section className={s.panel} data-focus="chart">
          <header className={s.panelHead}>
            <h3>{L(m.label)}</h3>
            <div className={s.legend}>
              <span>
                <i className={s.lgHot} />
                {t('Zadnjih 7 dana', 'Last 7 days')}
              </span>
              <span>
                <i className={s.lgBar} />
                {t('Ovaj period', 'This period')}
              </span>
              <span>
                <i className={s.lgPrev} />
                {t('Prošli period', 'Previous period')}
              </span>
            </div>
          </header>
          <Chart metric={metric} />
        </section>
        <section className={s.panel} data-focus="cats">
          <header className={s.panelHead}>
            <h3>{t('Nabavka po kategoriji', 'Procurement by category')}</h3>
            <span className={s.muted}>{t('Ovaj mjesec', 'This month')}</span>
          </header>
          <ul className={s.cats}>
            {CATEGORY_SPEND.map((c) => (
              <li key={c.label}>
                <span>{L(c.label)}</span>
                <span className={s.catBar}>
                  <i style={{ transform: `scaleX(${c.value / catMax})` }} />
                </span>
                <b>{km0(c.value)}</b>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  )
}

/* ———————————————————————————— Brza narudžba ———————————————————————————— */

export type Row = { id: number; sku: string; qty: number; uom?: string }

const FREQUENT = ['GKP-001', 'GKP-002', 'PRF-075', 'PRF-UW75', 'PRF-CD60', 'ISO-001', 'CHM-001', 'ACC-003']

// Parsira CSV / Excel kolone: šifra;količina (razdvojeno ; , tab ili razmakom); zaglavlje bez brojeva se preskače.
function parseLines(text: string, next: () => number): Row[] {
  return text
    .split(/\r?\n/)
    .map((l) => l.split(/[;,\t ]+/).filter(Boolean))
    .filter((p) => p.length >= 1 && /\d/.test(p.join('')))
    .map((p) => ({ id: next(), sku: p[0].toUpperCase().replace(/"/g, ''), qty: Number((p[1] ?? '1').replace(',', '.')) || 1 }))
}

export function QuickOrder({ api, rows, setRows }: { api: Api; rows: Row[]; setRows: (r: Row[]) => void }) {
  const { t, lang, L, money, kg, name, unit } = useFmt()
  const [paste, setPaste] = useState(false)
  const [scan, setScan] = useState(false)
  const [drop, setDrop] = useState(false)
  const [text, setText] = useState('GKP-001;120\nPRF-075;40\nISO-001;60')
  // Redovi žive u ljusci i preživljavaju prelazak između ekrana, pa brojač kreće iza najvećeg postojećeg id-a.
  const nextId = useRef(Math.max(100, ...rows.map((r) => r.id)) + 1)
  const focusRow = useRef<number | null>(null)
  const table = useRef<HTMLDivElement>(null)
  const next = () => nextId.current++
  const base = (r: Row) => toBase(r.sku, r.qty, r.uom)
  const valid = rows.filter((r) => PRODUCT_MAP[r.sku] && r.qty > 0)
  const bad = rows.filter((r) => r.sku && !PRODUCT_MAP[r.sku]).length
  const lines: Line[] = valid.map((r) => [r.sku, base(r)])
  const patch = (id: number, p: Partial<Row>) => setRows(rows.map((r) => (r.id === id ? { ...r, ...p } : r)))
  const add = () => {
    const id = next()
    focusRow.current = id
    setRows([...rows, { id, sku: '', qty: 1 }])
  }
  // Enter u količini: novi prazan red i kursor odmah u njegovu šifru.
  useEffect(() => {
    if (focusRow.current === null) return
    table.current?.querySelector<HTMLInputElement>(`[data-row="${focusRow.current}"] input`)?.focus()
    focusRow.current = null
  }, [rows])
  const importRows = (parsed: Row[], from: string) => {
    setRows([...rows.filter((r) => r.sku), ...parsed])
    const unknown = parsed.filter((r) => !PRODUCT_MAP[r.sku]).length
    api.toast(t(`${from}: ${parsed.length} redova${unknown ? `, ${unknown} nije u asortimanu` : ''}`, `${tr(from, 'en')}: ${parsed.length} ${parsed.length === 1 ? 'row' : 'rows'}${unknown ? `, ${unknown} not in the range` : ''}`))
  }
  const onDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setDrop(false)
    const f = e.dataTransfer.files[0]
    if (f) importRows(parseLines(await f.text(), next), f.name)
  }
  return (
    <div className={s.qo}>
      <section
        className={s.panel}
        data-focus="qo-table"
        data-drop={drop || undefined}
        onDragOver={(e) => {
          e.preventDefault()
          setDrop(true)
        }}
        onDragLeave={() => setDrop(false)}
        onDrop={onDrop}
      >
        <header className={s.panelHead}>
          <h3>{t('Šifra · proizvod · količina', 'Code · product · quantity')}</h3>
          <div className={s.headBtns}>
            <button type="button" className={s.btnGhost} onClick={() => setScan(true)}>
              <Icon name="scan" /> {t('Skeniraj', 'Scan')}
            </button>
            <button type="button" className={s.btnGhost} onClick={() => setPaste(!paste)}>
              <Icon name="upload" /> CSV / Excel
            </button>
            <button type="button" className={s.btnGhost} onClick={add} data-tour="qo-add">
              <Icon name="plus" /> {t('Red', 'Row')}
            </button>
          </div>
        </header>
        {scan && (
          <Scanner
            onScan={([sku, q], label) => {
              setRows([...rows.filter((r) => r.sku), { id: next(), sku, qty: q }])
              api.toast(`${t('Skenirano', 'Scanned')}: ${label}`)
            }}
            onClose={() => setScan(false)}
          />
        )}
        {paste && (
          <div className={s.paste}>
            <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} aria-label={t('Zalijepite redove: šifra;količina', 'Paste rows: code;quantity')} />
            <div>
              <p className={s.muted}>{t('Zalijepite kolone iz Excela ili CSV predmjera: šifra; količina, jedan artikal po redu. CSV fajl možete i prevući u tabelu.', 'Paste columns from Excel or a CSV bill of quantities: code; quantity, one item per row. You can also drag a CSV file onto the table.')}</p>
              <button
                type="button"
                className={s.btn}
                onClick={() => {
                  importRows(parseLines(text, next), t('Uvezeno', 'Imported'))
                  setPaste(false)
                }}
              >
                {t('Uvezi redove', 'Import rows')}
              </button>
            </div>
          </div>
        )}
        <p className={s.keys}>
          <kbd>Tab</kbd> {t('sa šifre na količinu', 'from code to quantity')} · <kbd>Enter</kbd> {t('novi red', 'new row')} · {t('prevucite CSV iz predmjera u tabelu', 'drag a CSV from your bill of quantities onto the table')}
        </p>
        <div ref={table} className={s.table} role="table">
          <div className={`${s.tr} ${s.th} ${s.trQo}`} role="row">
            <span>{t('Šifra', 'Code')}</span>
            <span>{t('Proizvod', 'Product')}</span>
            <span>{t('Količina', 'Quantity')}</span>
            <span>{t('Jedinica', 'Unit')}</span>
            <span>{t('Vaša cijena', 'Your price')}</span>
            <span>{t('Ukupno', 'Total')}</span>
            <span />
          </div>
          {rows.map((r) => {
            const p = PRODUCT_MAP[r.sku]
            const state = !r.sku ? 'empty' : p ? 'ok' : 'bad'
            const units = uoms(r.sku, lang)
            const b = base(r)
            const pr = p ? price(r.sku, b, api.site) : null
            return (
              <div key={r.id} className={`${s.tr} ${s.trQo}`} role="row" data-state={state} data-row={r.id}>
                <span className={s.skuCell}>
                  <input
                    value={r.sku}
                    list="gc-skus"
                    placeholder={t('npr. GKP-001', 'e.g. GKP-001')}
                    spellCheck={false}
                    onChange={(e) => patch(r.id, { sku: e.target.value.toUpperCase().trim(), uom: undefined })}
                    onKeyDown={(e) => {
                      if (e.key !== 'Enter') return
                      e.preventDefault()
                      e.currentTarget.closest('[data-row]')?.querySelector<HTMLInputElement>('input[type="number"]')?.focus()
                    }}
                    aria-label={t('Šifra artikla', 'Item code')}
                    data-tour="qo-sku"
                  />
                  <i className={s.valid}>{state === 'ok' ? <Icon name="check" /> : state === 'bad' ? <Icon name="x" /> : null}</i>
                </span>
                <span className={s.prodCell}>{p ? name(p.sku) : state === 'bad' ? t('Nije u asortimanu', 'Not in the range') : '—'}</span>
                <span className={s.qtyCell}>
                  <input
                    type="number"
                    min={0}
                    step="any"
                    value={r.qty}
                    onChange={(e) => patch(r.id, { qty: Math.max(0, Number(e.target.value)) })}
                    onKeyDown={(e) => {
                      if (e.key !== 'Enter') return
                      e.preventDefault()
                      add()
                    }}
                    aria-label={t('Količina', 'Quantity')}
                  />
                </span>
                <select className={s.uom} value={r.uom ?? units[0]?.id ?? ''} disabled={!p} onChange={(e) => patch(r.id, { uom: e.target.value })} aria-label={t('Jedinica mjere', 'Unit of measure')}>
                  {units.length ? (
                    units.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.label}
                      </option>
                    ))
                  ) : (
                    <option>—</option>
                  )}
                </select>
                <span className={s.num}>{pr ? `${money(pr.unit)}/${unit(p!.sku)}` : '—'}</span>
                <span className={s.num}>{pr ? money(pr.unit * b) : '—'}</span>
                <button type="button" className={s.iconBtn} onClick={() => setRows(rows.filter((x) => x.id !== r.id))} aria-label={t('Ukloni red', 'Remove row')}>
                  <Icon name="x" />
                </button>
              </div>
            )
          })}
        </div>
        {drop && <div className={s.dropHint}>{t('Pustite CSV: šifre i količine ulaze u tabelu', 'Drop the CSV: codes and quantities go into the table')}</div>}
        <div className={s.freq}>
          <span className={s.muted}>{t('Često naručujete', 'You often order')}</span>
          <div>
            {FREQUENT.map((sku) => (
              <button key={sku} type="button" onClick={() => setRows([...rows.filter((r) => r.sku), { id: next(), sku, qty: 1, uom: PRODUCT_MAP[sku]?.pack?.name }])}>
                <b className={s.mono}>{sku}</b>
                <i>{name(sku)}</i>
                <Icon name="plus" />
              </button>
            ))}
          </div>
        </div>
        <datalist id="gc-skus">
          {PRODUCTS.map((p) => (
            <option key={p.id} value={p.id}>
              {name(p.id)}
            </option>
          ))}
        </datalist>
      </section>
      <aside className={s.panel} data-focus="qo-sum">
        <header className={s.panelHead}>
          <h3>{t('Sažetak', 'Summary')}</h3>
        </header>
        <dl className={s.sum}>
          <div>
            <dt>{t('Ispravnih stavki', 'Valid items')}</dt>
            <dd>
              {valid.length} / {rows.length}
            </dd>
          </div>
          {bad > 0 && (
            <div data-bad>
              <dt>{t('Nije u asortimanu', 'Not in the range')}</dt>
              <dd>{bad}</dd>
            </div>
          )}
          <div>
            <dt>{t('Vaš iznos (neto)', 'Your amount (net)')}</dt>
            <dd>{money(netTotal(lines, api.site))}</dd>
          </div>
          <div>
            <dt>{t('Ukupna težina', 'Total weight')}</dt>
            <dd>{kg(lineWeight(lines))}</dd>
          </div>
        </dl>
        <button type="button" className={s.btnSolid} disabled={!valid.length} onClick={() => api.addLines(lines, 'Brza narudžba')} data-tour="qo-send">
          {t('Dodaj sve u upit', 'Add all to inquiry')} <Icon name="arrow" />
        </button>
        <p className={s.note}>{t(`Cijene su demo neto cijene (${TERMS.tier}, uslovi po ugovoru). Količina ide u skladište u osnovnoj jedinici artikla; konačnu ponudu šalje prodaja.`, `Prices are demo net prices (${tr(TERMS.tier, lang)}, terms per contract). Quantity goes to the warehouse in the item's base unit; the final quote is sent by sales.`)}</p>
        <div className={s.miniLists}>
          <span className={s.muted}>{t('Učitaj šemu materijala', 'Load a material scheme')}</span>
          {LISTS.slice(0, 3).map((l) => (
            <button key={l.id} type="button" onClick={() => api.loadRows(l.lines)}>
              {L(l.name)}
              <Icon name="arrow" />
            </button>
          ))}
        </div>
      </aside>
    </div>
  )
}

/* ———————————————————————————— Ponude ———————————————————————————— */

export function Quotes({ api, status, setStatus }: { api: Api; status: Record<string, QuoteStatus>; setStatus: (no: string, st: QuoteStatus) => void }) {
  const { t, L, km0 } = useFmt()
  const [sel, setSel] = useState('P-26-0142')
  const [filter, setFilter] = useState<'Sve' | QuoteStatus>('Sve')
  const list = QUOTES.map((q) => ({ ...q, status: status[q.no] ?? q.status })).filter((q) => filter === 'Sve' || q.status === filter)
  const q = QUOTES.find((x) => x.no === sel)!
  const st = status[q.no] ?? q.status
  return (
    <div className={s.split}>
      <section className={s.panel}>
        <header className={s.panelHead}>
          <h3>{t('Ponude od prodaje', 'Quotes from sales')}</h3>
          <Seg value={filter} options={['Sve', 'Spremna', 'U obradi', 'Prihvaćena']} onChange={(v) => setFilter(v as typeof filter)} />
        </header>
        <div className={s.table}>
          <div className={`${s.tr} ${s.th} ${s.trQuote}`}>
            <span>{t('Broj', 'No.')}</span>
            <span>{t('Gradilište', 'Site')}</span>
            <span>{t('Stavki', 'Items')}</span>
            <span>{t('Vaš iznos', 'Your amount')}</span>
            <span>Status</span>
          </div>
          {list.map((x) => (
            <button key={x.no} type="button" className={`${s.tr} ${s.trQuote} ${s.trBtn}`} data-on={x.no === sel || undefined} onClick={() => setSel(x.no)} data-tour={x.no === 'P-26-0131' ? 'quote' : undefined}>
              <span className={s.mono}>{x.no}</span>
              <span>{L(siteById(x.site).short)}</span>
              <span className={s.num}>{x.lines.length}</span>
              <span className={s.num}>{km0(netTotal(x.lines, x.site as SiteId))}</span>
              <span>
                <StatusTag value={x.status} />
              </span>
            </button>
          ))}
        </div>
      </section>
      <QuoteDetail q={q} st={st} api={api} accept={() => {
        setStatus(q.no, 'Prihvaćena')
        api.push({ kind: 'narudzba', title: `Ponuda ${q.no} prihvaćena`, meta: `${siteById(q.site).short} · narudžba kreirana (demo)` })
        api.toast(t(`Ponuda ${q.no} prihvaćena — prodaja potvrđuje narudžbu`, `Quote ${q.no} accepted — sales will confirm the order`))
      }} />
    </div>
  )
}

function QuoteDetail({ q, st, api, accept }: { q: Quote; st: QuoteStatus; api: Api; accept: () => void }) {
  const { t, L, money, kg, name, unit } = useFmt()
  return (
    <aside className={s.panel} data-focus="quote-detail">
      <header className={s.panelHead}>
        <h3 className={s.mono}>{q.no}</h3>
        <StatusTag value={st} />
      </header>
      <p className={s.detailLead}>{L(q.note)}</p>
      <p className={s.muted}>
        {L(siteById(q.site).name)} · {t(`poslata prije ${q.days} ${q.days === 1 ? 'dan' : 'dana'}`, `sent ${q.days} ${q.days === 1 ? 'day' : 'days'} ago`)} · {t(`važi ${q.valid} dana`, `valid for ${q.valid} days`)}
      </p>
      <ul className={s.lines}>
        {q.lines.map(([sku, n]) => (
          <li key={sku}>
            <span className={s.mono}>{sku}</span>
            <span>{name(sku)}</span>
            <b>
              {n} {unit(sku)}
            </b>
          </li>
        ))}
      </ul>
      <dl className={s.sum}>
        <div>
          <dt>{t('Vaš iznos (neto)', 'Your amount (net)')}</dt>
          <dd>{money(netTotal(q.lines, q.site as SiteId))}</dd>
        </div>
        <div>
          <dt>{t('Težina', 'Weight')}</dt>
          <dd>{kg(lineWeight(q.lines))}</dd>
        </div>
      </dl>
      <div className={s.actionsRow}>
        <button type="button" className={s.btnSolid} disabled={st !== 'Spremna'} onClick={accept} data-tour="quote-accept">
          {st === 'Prihvaćena' ? t('Prihvaćeno', 'Accepted') : t('Prihvati ponudu', 'Accept quote')} <Icon name="check" />
        </button>
        <button type="button" className={s.btnGhost} onClick={() => api.loadRows(q.lines)}>
          {t('Izmijeni stavke', 'Edit items')}
        </button>
      </div>
    </aside>
  )
}

/* ———————————————————————————— Narudžbe ———————————————————————————— */

export function Orders({ api }: { api: Api }) {
  const { t, L, kg } = useFmt()
  const [filter, setFilter] = useState('Aktivne')
  const [sel, setSel] = useState('GC-26-04512')
  const list = ORDERS.filter((o) => (filter === 'Sve' ? true : filter === 'Aktivne' ? o.step < 4 : o.step === 4))
  const o = ORDERS.find((x) => x.no === sel)!
  return (
    <>
    <div className={s.split}>
      <section className={s.panel}>
        <header className={s.panelHead}>
          <h3>{t('Narudžbe', 'Orders')}</h3>
          <Seg value={filter} options={['Aktivne', 'Završene', 'Sve']} onChange={setFilter} tour="orders-seg" />
        </header>
        <div className={s.table}>
          <div className={`${s.tr} ${s.th} ${s.trOrder}`}>
            <span>{t('Broj', 'No.')}</span>
            <span>{t('Gradilište', 'Site')}</span>
            <span>Status</span>
            <span>{t('Termin', 'Time slot')}</span>
          </div>
          {list.map((x) => (
            <button key={x.no} type="button" className={`${s.tr} ${s.trOrder} ${s.trBtn}`} data-on={x.no === sel || undefined} onClick={() => setSel(x.no)} data-tour={x.no === 'GC-26-04477' ? 'order' : undefined}>
              <span className={s.mono}>{x.no}</span>
              <span>{L(siteById(x.site).short)}</span>
              <span className={s.steps} aria-label={L(ORDER_FLOW[x.step])}>
                {ORDER_FLOW.map((_, i) => (
                  <i key={i} data-done={i <= x.step || undefined} />
                ))}
                <em>{L(ORDER_FLOW[x.step])}</em>
              </span>
              <span className={s.muted}>
                {L(x.mode)} · {L(x.slot)}
              </span>
            </button>
          ))}
        </div>
      </section>
      <OrderDetail o={o} api={api} />
    </div>
    <section className={`${s.panel} ${s.strip}`}>
      {[
        [t('Narudžbi ovaj mjesec', 'Orders this month'), '12'],
        [t('Isporučeno', 'Delivered'), '8'],
        [t('Preuzeto na stovarištu', 'Picked up at the warehouse'), '3'],
        [t('Ponovljene jednim klikom', 'Repeated in one click'), '4'],
        [t('Ukupna težina', 'Total weight'), kg(ORDERS.reduce((sum, x) => sum + lineWeight(x.lines), 0))],
      ].map(([l, v]) => (
        <div key={l}>
          <span className={s.muted}>{l}</span>
          <b>{v}</b>
        </div>
      ))}
    </section>
    </>
  )
}

function OrderDetail({ o, api }: { o: Order; api: Api }) {
  const { t, L, name, unit } = useFmt()
  return (
    <aside className={s.panel} data-focus="order-detail">
      <header className={s.panelHead}>
        <h3 className={s.mono}>{o.no}</h3>
        <span className={s.tag} data-solid={o.step < 4 || undefined}>
          {L(ORDER_FLOW[o.step])}
        </span>
      </header>
      <ol className={s.track}>
        {ORDER_FLOW.map((step, i) => (
          <li key={step} data-done={i <= o.step || undefined} data-now={i === o.step || undefined}>
            <i />
            <span>{L(step)}</span>
          </li>
        ))}
      </ol>
      <p className={s.muted}>
        {L(siteById(o.site).name)} · {o.mode === 'Preuzimanje' ? t('preuzimanje na stovarištu, Nenada Kostića 151', 'pickup at the warehouse, Nenada Kostića 151') : t('dostava na adresu gradilišta', 'delivery to the site address')} · {L(o.slot)}
      </p>
      <ul className={s.lines}>
        {o.lines.map(([sku, n]) => (
          <li key={sku}>
            <span className={s.mono}>{sku}</span>
            <span>{name(sku)}</span>
            <b>
              {n} {unit(sku)}
            </b>
          </li>
        ))}
      </ul>
      <div className={s.actionsRow}>
        <button type="button" className={s.btnSolid} onClick={() => api.addLines(o.lines, `Ponovljena ${o.no}`)} data-tour="reorder">
          {t('Ponovi narudžbu', 'Repeat order')} <Icon name="repeat" />
        </button>
        <button type="button" className={s.btnGhost} onClick={() => api.go('dokumenti')}>
          {t('Otpremnica', 'Delivery note')}
        </button>
      </div>
    </aside>
  )
}

/* ———————————————————————————— Isporuke ———————————————————————————— */

export function Deliveries({ api }: { api: Api }) {
  const { t, L } = useFmt()
  const [sel, setSel] = useState(2)
  const span = HOURS.to - HOURS.from
  const slot = WEEK[sel]
  return (
    <div className={s.split}>
      <section className={s.panel}>
        <header className={s.panelHead}>
          <h3>{t('Ova sedmica', 'This week')}</h3>
          <div className={s.legend}>
            <span>
              <i className={s.lgHot} />
              {t('Dostava', 'Delivery')}
            </span>
            <span>
              <i className={s.lgOutline} />
              {t('Preuzimanje', 'Pickup')}
            </span>
          </div>
        </header>
        <div className={s.week}>
          <div className={s.hours}>
            {Array.from({ length: span + 1 }, (_, i) => (
              <span key={i} style={{ top: `${(i / span) * 100}%` }}>
                {String(HOURS.from + i).padStart(2, '0')}
              </span>
            ))}
          </div>
          {DAYS.map((d, di) => (
            <div key={d} className={s.dayCol} data-focus={`day-${di}`}>
              <button type="button" className={s.dayHead} onClick={() => api.focus(`day-${di}`)} data-tour={di === 3 ? 'day' : undefined}>
                {L(d)}
              </button>
              <div className={s.dayBody} data-sat={di === 5 || undefined}>
                {WEEK.map((w, wi) =>
                  w.day === di ? (
                    <button
                      key={wi}
                      type="button"
                      className={s.block}
                      data-mode={w.mode}
                      data-on={wi === sel || undefined}
                      style={{ top: `${((w.from - HOURS.from) / span) * 100}%`, height: `${((w.to - w.from) / span) * 100}%` }}
                      onClick={() => setSel(wi)}
                    >
                      <b>{L(siteById(w.site).short)}</b>
                      <i>
                        {w.from}–{w.to}h
                      </i>
                    </button>
                  ) : null,
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
      <aside className={s.panel} data-focus="slot-detail">
        <header className={s.panelHead}>
          <h3>
            {L(DAYS[slot.day])} · {slot.from}–{slot.to}h
          </h3>
          <span className={s.tag} data-solid={slot.mode === 'Dostava' || undefined}>
            {L(slot.mode)}
          </span>
        </header>
        <p className={s.detailLead}>{L(slot.what)}</p>
        <dl className={s.sum}>
          <div>
            <dt>{t('Narudžba', 'Order')}</dt>
            <dd className={s.mono}>{slot.order}</dd>
          </div>
          <div>
            <dt>{t('Gradilište', 'Site')}</dt>
            <dd>{L(siteById(slot.site).short)}</dd>
          </div>
          <div>
            <dt>{t('Mjesto', 'Location')}</dt>
            <dd>{slot.mode === 'Preuzimanje' ? t('Stovarište, Nenada Kostića 151', 'Warehouse, Nenada Kostića 151') : L(siteById(slot.site).address)}</dd>
          </div>
        </dl>
        <p className={s.note}>{t('Stovarište radi pon–pet 07–16 i sub 07–15. Termin dostave potvrđuje prodaja; vrsta vozila i istovar se dogovaraju uz narudžbu.', 'The warehouse is open Mon–Fri 07–16 and Sat 07–15. Delivery slots are confirmed by sales; vehicle type and unloading are agreed with the order.')}</p>
        <button type="button" className={s.btnGhost} onClick={() => api.go('narudzbe')}>
          {t('Otvori narudžbu', 'Open order')} <Icon name="arrow" />
        </button>
      </aside>
    </div>
  )
}

/* ———————————————————————————— Gradilišta ———————————————————————————— */

export function Sites({ api }: { api: Api }) {
  const { t, L, km0 } = useFmt()
  const max = Math.max(...SITES.map((x) => x.budget))
  return (
    <>
    <div className={s.sites}>
      {SITES.map((site) => {
        const open = QUOTES.filter((q) => q.site === site.id && (q.status === 'Spremna' || q.status === 'U obradi')).length
        const active = ORDERS.filter((o) => o.site === site.id && o.step < 4)
        const next = WEEK.find((w) => w.site === site.id && w.day >= 2)
        const ratio = site.spent / site.budget
        return (
          <section key={site.id} className={`${s.panel} ${s.site}`} data-focus={`site-${site.id}`}>
            <button type="button" className={s.siteHead} onClick={() => api.focus(`site-${site.id}`)} data-tour={site.id === 'a' ? 'site' : undefined}>
              <span className={s.siteLetter}>{site.id.toUpperCase()}</span>
              <span>
                <b>{L(site.short)}</b>
                <i>{L(site.address)}</i>
              </span>
            </button>
            <div className={s.siteBudget}>
              <div className={s.siteNums}>
                <span>
                  <b>{km0(site.spent)}</b> {t('nabavljeno', 'procured')}
                </span>
                <span className={s.muted}>{t('plan', 'plan')} {km0(site.budget)}</span>
              </div>
              <span className={s.meter} data-warn={ratio > 0.8 || undefined}>
                <i style={{ transform: `scaleX(${ratio})` }} />
              </span>
            </div>
            <dl className={s.siteFacts}>
              <div>
                <dt>{t('Faza', 'Phase')}</dt>
                <dd>{L(site.phase)}</dd>
              </div>
              <div>
                <dt>{t('Radovi', 'Works')}</dt>
                <dd>{Math.round(site.progress * 100)} %</dd>
              </div>
              <div>
                <dt>{t('Otvorene ponude', 'Open quotes')}</dt>
                <dd>{open}</dd>
              </div>
              <div>
                <dt>{t('Aktivne narudžbe', 'Active orders')}</dt>
                <dd>{active.length}</dd>
              </div>
              <div>
                <dt>{t('Sljedeći termin', 'Next time slot')}</dt>
                <dd>{next ? `${L(DAYS[next.day])} ${next.from}–${next.to}h · ${L(next.mode)}` : '—'}</dd>
              </div>
              <div>
                <dt>{t('Kontakt', 'Contact')}</dt>
                <dd>{L(site.lead)}</dd>
              </div>
            </dl>
            <div className={s.actionsRow}>
              <button type="button" className={s.btnGhost} onClick={() => api.go('brza')}>
                {t('Naruči za gradilište', 'Order for this site')}
              </button>
              <button type="button" className={s.link} onClick={() => api.go('isporuke')}>
                {t('Isporuke →', 'Deliveries →')}
              </button>
            </div>
          </section>
        )
      })}
    </div>
    <section className={s.panel} data-focus="sites-compare">
      <header className={s.panelHead}>
        <h3>{t('Plan i nabavka po gradilištu', 'Plan and procurement by site')}</h3>
        <div className={s.legend}>
          <span>
            <i className={s.lgHot} />
            {t('Nabavljeno', 'Procured')}
          </span>
          <span>
            <i className={s.lgOutline} />
            {t('Plan', 'Plan')}
          </span>
        </div>
      </header>
      <ul className={s.compare}>
        {SITES.map((x) => (
          <li key={x.id}>
            <span>{L(x.short)}</span>
            <span className={s.compareBar} style={{ width: `${(x.budget / max) * 100}%` }}>
              <i style={{ transform: `scaleX(${x.spent / x.budget})` }} />
            </span>
            <b>{Math.round((x.spent / x.budget) * 100)} %</b>
          </li>
        ))}
      </ul>
    </section>
    </>
  )
}

/* ———————————————————————————— Sačuvane liste ———————————————————————————— */

export function Lists({ api }: { api: Api }) {
  const { t, L, kg, name, unit } = useFmt()
  return (
    <div className={s.listsGrid}>
      {LISTS.map((l) => (
        <section key={l.id} className={s.panel} data-focus={`list-${l.id}`}>
          <header className={s.panelHead}>
            <h3>{L(l.name)}</h3>
            <span className={s.tag}>{L(l.from)}</span>
          </header>
          <p className={s.muted}>
            {L(siteById(l.site).short)} · {t(`${l.lines.length} stavki`, `${l.lines.length} ${l.lines.length === 1 ? 'item' : 'items'}`)} · {kg(lineWeight(l.lines))}
          </p>
          <ul className={s.lines}>
            {l.lines.map(([sku, n]) => (
              <li key={sku}>
                <span className={s.mono}>{sku}</span>
                <span>{name(sku)}</span>
                <b>
                  {n} {unit(sku)}
                </b>
              </li>
            ))}
          </ul>
          <div className={s.actionsRow}>
            <button type="button" className={s.btnSolid} onClick={() => api.addLines(l.lines, l.name)} data-tour={l.id === 'l1' ? 'list-add' : undefined}>
              {t('Dodaj u upit', 'Add to inquiry')} <Icon name="arrow" />
            </button>
            <button type="button" className={s.btnGhost} onClick={() => api.loadRows(l.lines)}>
              {t('U brzu narudžbu', 'To quick order')}
            </button>
          </div>
        </section>
      ))}
    </div>
  )
}

/* ———————————————————————————— Dokumenti ———————————————————————————— */

function download(file: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }))
  const a = document.createElement('a')
  a.href = url
  a.download = file
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function Documents() {
  const { t, lang, L, money, date: fd } = useFmt()
  const [kind, setKind] = useState<'Sve' | DocKind>('Sve')
  const [q, setQ] = useState('')
  const list = useMemo(() => DOCS.filter((d) => (kind === 'Sve' || d.kind === kind) && (d.title.toLowerCase().includes(q.toLowerCase()) || tr(d.title, lang).toLowerCase().includes(q.toLowerCase()))), [kind, q, lang])
  return (
    <section className={s.panel}>
      <header className={s.panelHead}>
        <Seg value={kind} options={['Sve', 'Faktura', 'Otpremnica', 'Ponuda', 'Tehnički list']} onChange={(v) => setKind(v as typeof kind)} />
        <label className={s.search}>
          <Icon name="search" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('Traži dokument', 'Search documents')} aria-label={t('Traži dokument', 'Search documents')} />
        </label>
      </header>
      <div className={s.table}>
        <div className={`${s.tr} ${s.th} ${s.trDoc}`}>
          <span>{t('Vrsta', 'Type')}</span>
          <span>{t('Dokument', 'Document')}</span>
          <span>{t('Datum', 'Date')}</span>
          <span>{t('Iznos', 'Amount')}</span>
          <span>Status</span>
          <span />
        </div>
        {list.map((d) => {
          const date = fd(new Date(2026, 9, 9 - d.days), { day: '2-digit', month: '2-digit', year: 'numeric' })
          return (
            <div key={d.id} className={`${s.tr} ${s.trDoc}`}>
              <span className={s.muted}>{L(d.kind)}</span>
              <span>{L(d.title)}</span>
              <span className={s.num}>{date}</span>
              <span className={s.num}>{d.amount ? money(d.amount) : '—'}</span>
              <span>{d.state ? <span className={s.tag} data-solid={d.state !== 'Plaćena' || undefined}>{L(d.state)}</span> : null}</span>
              <button
                type="button"
                className={s.iconBtn}
                aria-label={`${t('Preuzmi', 'Download')} ${L(d.title)}`}
                onClick={() => download(`${d.id}-demo.txt`, lang === 'en' ? `GRAND COMPANY — DEMO DOCUMENT\r\nA sample for presenting the B2B portal, not a real document.\r\n\r\n${L(d.title)}\r\nDate: ${date}${d.amount ? `\r\nAmount: ${money(d.amount)}` : ''}` : `GRAND COMPANY — DEMO DOKUMENT\r\nPrimjer za prezentaciju B2B portala, nije stvarni dokument.\r\n\r\n${d.title}\r\nDatum: ${date}${d.amount ? `\r\nIznos: ${money(d.amount)}` : ''}`)}
              >
                <Icon name="down" />
              </button>
            </div>
          )
        })}
      </div>
      <p className={s.note}>{t('Dokumenti su konceptualni modul: u produkciji ih portal preuzima iz postojećeg ERP/knjigovodstvenog sistema Grand Company-ja.', 'Documents are a conceptual module: in production the portal pulls them from the existing Grand Company ERP / accounting system.')}</p>
    </section>
  )
}

/* ———————————————————————————— Tim i odobrenja ———————————————————————————— */

export function Team({ api }: { api: Api }) {
  const { t, lang, L, km0, name, unit } = useFmt()
  const queue = api.approvals
  const decide = api.decide
  return (
    <div className={s.split}>
      <section className={s.panel} data-focus="team">
        <header className={s.panelHead}>
          <h3>{t('Korisnici naloga', 'Account users')}</h3>
          <button type="button" className={s.btnGhost} onClick={() => api.toast(t('Pozivnica poslata (demo)', 'Invitation sent (demo)'))}>
            <Icon name="plus" /> {t('Pozovi', 'Invite')}
          </button>
        </header>
        <ul className={s.team}>
          {TEAM.map((m) => (
            <li key={m.initials}>
              <span className={s.avatar}>{m.initials}</span>
              <span>
                <b>{L(m.name)}</b>
                <i>{L(m.role)}</i>
              </span>
              <em>{L(m.rights)}</em>
            </li>
          ))}
        </ul>
        <div className={s.proposed}>
          <span className={s.tag}>{t('Predložena funkcija', 'Proposed feature')}</span>
          <p>
            <b>{t('Uslovi saradnje na nalogu.', 'Terms of cooperation on the account.')}</b> {t(`Neto cijene, rabat (${TERMS.tier}), projektne cijene po gradilištu i kreditni okvir u demu su primjer iz partnerske skale. Stvarni uslovi Grand Company-ja se dogovaraju ugovorom sa prodajom.`, `Net prices, discount (${tr(TERMS.tier, lang)}), project prices per site and the credit line are an example from the partner scale in this demo. Actual Grand Company terms are agreed by contract with sales.`)}
          </p>
        </div>
      </section>
      <aside className={s.panel} data-focus="approvals">
        <header className={s.panelHead}>
          <h3>{t('Čeka odobrenje', 'Awaiting approval')}</h3>
          <span className={s.count}>{queue.length}</span>
        </header>
        {queue.length === 0 && <p className={s.muted}>{t('Nema zahtjeva na čekanju.', 'No pending requests.')}</p>}
        {queue.map((a) => (
          <div key={a.id} className={s.approval}>
            <p>
              <b>{L(a.who)}</b> · {L(siteById(a.site).short)}
            </p>
            <p className={s.muted}>
              {L(a.note)} · {km0(netTotal(a.lines, a.site as SiteId))}
            </p>
            <ul className={s.lines}>
              {a.lines.map(([sku, n]) => (
                <li key={sku}>
                  <span className={s.mono}>{sku}</span>
                  <span>{name(sku)}</span>
                  <b>
                    {n} {unit(sku)}
                  </b>
                </li>
              ))}
            </ul>
            <div className={s.actionsRow}>
              <button type="button" className={s.btnSolid} onClick={() => decide(a, true)} data-tour={a.id === 'z1' ? 'approve' : undefined}>
                {t('Odobri', 'Approve')} <Icon name="check" />
              </button>
              <button type="button" className={s.btnGhost} onClick={() => decide(a, false)}>
                {t('Odbij', 'Reject')}
              </button>
            </div>
          </div>
        ))}
      </aside>
    </div>
  )
}

/* ———————————————————————————— Sitno ———————————————————————————— */

function Seg({ value, options, onChange, tour }: { value: string; options: string[]; onChange: (v: string) => void; tour?: string }) {
  const { L } = useFmt()
  return (
    <div className={s.seg} role="tablist" data-tour={tour}>
      {options.map((o) => (
        <button key={o} type="button" role="tab" aria-selected={o === value} onClick={() => onChange(o)}>
          {L(o)}
        </button>
      ))}
    </div>
  )
}

function StatusTag({ value }: { value: QuoteStatus }) {
  const { L } = useFmt()
  return (
    <span className={s.tag} data-solid={value === 'Spremna' || undefined} data-dim={value === 'Istekla' || undefined}>
      {L(value)}
    </span>
  )
}
