'use client'

import { useMemo, useRef, useState } from 'react'
import { PRODUCT_MAP, PRODUCTS, money } from '@/lib/shop'
import {
  APPROVALS,
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
  lineTotal,
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
import Icon from './Icon'
import s from './Dashboard.module.css'

export type ViewId = 'pregled' | 'brza' | 'ponude' | 'narudzbe' | 'isporuke' | 'gradilista' | 'liste' | 'dokumenti' | 'tim'

/** Ono što svaki ekran dobija od ljuske: navigacija, zum kamere, korpa i živi tok. */
export type Api = {
  go: (v: ViewId) => void
  focus: (key: string) => void
  addLines: (lines: Line[], label: string) => void
  push: (item: FeedItem) => void
  toast: (text: string) => void
  loadRows: (lines: Line[]) => void
}

const km0 = (n: number) => `${Math.round(n).toLocaleString('de-DE')} KM`
const kg = (n: number) => (n >= 1000 ? `${(n / 1000).toLocaleString('de-DE', { maximumFractionDigits: 1 })} t` : `${n} kg`)
const name = (sku: string) => PRODUCT_MAP[sku]?.name ?? sku
const unit = (sku: string) => PRODUCT_MAP[sku]?.unit ?? ''

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
    return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })
  }
  const fmt = (v: number) => (m.unit === 'KM' ? km0(v) : `${v} ${m.unit}`)
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
              <i>{dayLabel(hover)} · prošli period {fmt(m.prev[hover])}</i>
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
  const m = METRICS.find((x) => x.id === metric)!
  const nextSlots = WEEK.filter((w) => w.day >= 2).slice(0, 4)
  const catMax = Math.max(...CATEGORY_SPEND.map((c) => c.value))
  return (
    <>
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
              {k.label}
            </span>
            <span className={s.kpiValue}>{k.value}</span>
            <span className={s.kpiDelta} data-down={k.delta < 0 || undefined}>
              {k.delta === 0 ? '— 0,0 %' : `${k.delta > 0 ? '▲' : '▼'} ${Math.abs(k.delta).toLocaleString('de-DE', { minimumFractionDigits: 1 })} %`}
            </span>
            <Spark data={k.series} on={k.id === metric} />
          </button>
        ))}
      </div>

      <div className={s.row2}>
        <section className={s.panel} data-focus="chart">
          <header className={s.panelHead}>
            <h3>{m.label}</h3>
            <div className={s.legend}>
              <span>
                <i className={s.lgHot} />
                Zadnjih 7 dana
              </span>
              <span>
                <i className={s.lgBar} />
                Ovaj period
              </span>
              <span>
                <i className={s.lgPrev} />
                Prošli period
              </span>
            </div>
          </header>
          <Chart metric={metric} />
        </section>

        <section className={s.panel} data-focus="feed">
          <header className={s.panelHead}>
            <h3>Uživo</h3>
            <span className={s.live}>
              <i />
              Uživo
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
                    <b>{f.title}</b>
                    <i>{f.meta}</i>
                  </span>
                  <time>{f.t}</time>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className={s.row3}>
        <section className={s.panel} data-focus="slots">
          <header className={s.panelHead}>
            <h3>Naredne isporuke i preuzimanja</h3>
            <button type="button" className={s.link} onClick={() => api.go('isporuke')}>
              Kalendar →
            </button>
          </header>
          <ul className={s.slots}>
            {nextSlots.map((w, i) => (
              <li key={i}>
                <span className={s.slotDay}>
                  {DAYS[w.day]}
                  <b>
                    {String(w.from).padStart(2, '0')}–{String(w.to).padStart(2, '0')}h
                  </b>
                </span>
                <span className={s.slotText}>
                  <b>{siteById(w.site).short}</b>
                  <i>{w.what}</i>
                </span>
                <span className={s.tag} data-solid={w.mode === 'Dostava' || undefined}>
                  {w.mode}
                </span>
              </li>
            ))}
          </ul>
        </section>
        <section className={s.panel} data-focus="cats">
          <header className={s.panelHead}>
            <h3>Nabavka po kategoriji</h3>
            <span className={s.muted}>Ovaj mjesec</span>
          </header>
          <ul className={s.cats}>
            {CATEGORY_SPEND.map((c) => (
              <li key={c.label}>
                <span>{c.label}</span>
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

export type Row = { id: number; sku: string; qty: number }

const FREQUENT = ['GKP-001', 'GKP-002', 'PRF-075', 'PRF-UW75', 'PRF-CD60', 'ISO-001', 'CHM-001', 'ACC-003']

export function QuickOrder({ api, rows, setRows }: { api: Api; rows: Row[]; setRows: (r: Row[]) => void }) {
  const [paste, setPaste] = useState(false)
  const [text, setText] = useState('GKP-001;120\nPRF-075;40\nISO-001;60')
  const nextId = useRef(100)
  const valid = rows.filter((r) => PRODUCT_MAP[r.sku] && r.qty > 0)
  const lines: Line[] = valid.map((r) => [r.sku, r.qty])
  const patch = (id: number, p: Partial<Row>) => setRows(rows.map((r) => (r.id === id ? { ...r, ...p } : r)))
  const add = () => setRows([...rows, { id: nextId.current++, sku: '', qty: 1 }])
  const importText = () => {
    const parsed = text
      .split(/\r?\n/)
      .map((l) => l.split(/[;,\t ]+/).filter(Boolean))
      .filter((p) => p.length >= 1)
      .map((p) => ({ id: nextId.current++, sku: p[0].toUpperCase(), qty: Number((p[1] ?? '1').replace(',', '.')) || 1 }))
    setRows([...rows.filter((r) => r.sku), ...parsed])
    setPaste(false)
    api.toast(`Uvezeno ${parsed.length} redova`)
  }
  return (
    <div className={s.qo}>
      <section className={s.panel} data-focus="qo-table">
        <header className={s.panelHead}>
          <h3>Šifra · proizvod · količina</h3>
          <div className={s.headBtns}>
            <button type="button" className={s.btnGhost} onClick={() => setPaste(!paste)}>
              <Icon name="upload" /> CSV / Excel
            </button>
            <button type="button" className={s.btnGhost} onClick={add} data-tour="qo-add">
              <Icon name="plus" /> Red
            </button>
          </div>
        </header>
        {paste && (
          <div className={s.paste}>
            <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} aria-label="Zalijepite redove: šifra;količina" />
            <div>
              <p className={s.muted}>Zalijepite kolone iz Excela ili CSV: šifra; količina — jedan artikal po redu.</p>
              <button type="button" className={s.btn} onClick={importText}>
                Uvezi redove
              </button>
            </div>
          </div>
        )}
        <div className={s.table} role="table">
          <div className={`${s.tr} ${s.th}`} role="row">
            <span>Šifra</span>
            <span>Proizvod</span>
            <span>Količina</span>
            <span>Demo cijena</span>
            <span>Ukupno</span>
            <span />
          </div>
          {rows.map((r) => {
            const p = PRODUCT_MAP[r.sku]
            const state = !r.sku ? 'empty' : p ? 'ok' : 'bad'
            return (
              <div key={r.id} className={s.tr} role="row" data-state={state}>
                <span className={s.skuCell}>
                  <input
                    value={r.sku}
                    list="gc-skus"
                    placeholder="npr. GKP-001"
                    spellCheck={false}
                    onChange={(e) => patch(r.id, { sku: e.target.value.toUpperCase().trim() })}
                    aria-label="Šifra artikla"
                    data-tour="qo-sku"
                  />
                  <i className={s.valid}>{state === 'ok' ? <Icon name="check" /> : state === 'bad' ? <Icon name="x" /> : null}</i>
                </span>
                <span className={s.prodCell}>{p ? p.name : state === 'bad' ? 'Nepoznata šifra' : '—'}</span>
                <span className={s.qtyCell}>
                  <input type="number" min={0} value={r.qty} onChange={(e) => patch(r.id, { qty: Math.max(0, Number(e.target.value)) })} aria-label="Količina" />
                  <i>{p?.unit}</i>
                </span>
                <span className={s.num}>{p ? money(p.price) : '—'}</span>
                <span className={s.num}>{p ? money(p.price * r.qty) : '—'}</span>
                <button type="button" className={s.iconBtn} onClick={() => setRows(rows.filter((x) => x.id !== r.id))} aria-label="Ukloni red">
                  <Icon name="x" />
                </button>
              </div>
            )
          })}
        </div>
        <div className={s.freq}>
          <span className={s.muted}>Često naručujete</span>
          <div>
            {FREQUENT.map((sku) => (
              <button key={sku} type="button" onClick={() => setRows([...rows.filter((r) => r.sku), { id: nextId.current++, sku, qty: PRODUCT_MAP[sku]?.pack?.size ?? 1 }])}>
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
              {p.name}
            </option>
          ))}
        </datalist>
      </section>
      <aside className={s.panel} data-focus="qo-sum">
        <header className={s.panelHead}>
          <h3>Sažetak</h3>
        </header>
        <dl className={s.sum}>
          <div>
            <dt>Ispravnih stavki</dt>
            <dd>
              {valid.length} / {rows.length}
            </dd>
          </div>
          <div>
            <dt>Demo iznos</dt>
            <dd>{money(lineTotal(lines))}</dd>
          </div>
          <div>
            <dt>Ukupna težina</dt>
            <dd>{kg(lineWeight(lines))}</dd>
          </div>
        </dl>
        <button type="button" className={s.btnSolid} disabled={!valid.length} onClick={() => api.addLines(lines, 'Brza narudžba')} data-tour="qo-send">
          Dodaj sve u upit <Icon name="arrow" />
        </button>
        <p className={s.note}>Cijene i šifre su demo iz kataloga. U produkciji šifre dolaze iz kataloga Grand Company-ja, a konačnu ponudu šalje prodaja.</p>
        <div className={s.miniLists}>
          <span className={s.muted}>Učitaj sačuvanu listu</span>
          {LISTS.slice(0, 3).map((l) => (
            <button key={l.id} type="button" onClick={() => api.loadRows(l.lines)}>
              {l.name}
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
  const [sel, setSel] = useState('P-26-0142')
  const [filter, setFilter] = useState<'Sve' | QuoteStatus>('Sve')
  const list = QUOTES.map((q) => ({ ...q, status: status[q.no] ?? q.status })).filter((q) => filter === 'Sve' || q.status === filter)
  const q = QUOTES.find((x) => x.no === sel)!
  const st = status[q.no] ?? q.status
  return (
    <div className={s.split}>
      <section className={s.panel}>
        <header className={s.panelHead}>
          <h3>Ponude od prodaje</h3>
          <Seg value={filter} options={['Sve', 'Spremna', 'U obradi', 'Prihvaćena']} onChange={(v) => setFilter(v as typeof filter)} />
        </header>
        <div className={s.table}>
          <div className={`${s.tr} ${s.th} ${s.trQuote}`}>
            <span>Broj</span>
            <span>Gradilište</span>
            <span>Stavki</span>
            <span>Demo iznos</span>
            <span>Status</span>
          </div>
          {list.map((x) => (
            <button key={x.no} type="button" className={`${s.tr} ${s.trQuote} ${s.trBtn}`} data-on={x.no === sel || undefined} onClick={() => setSel(x.no)} data-tour={x.no === 'P-26-0131' ? 'quote' : undefined}>
              <span className={s.mono}>{x.no}</span>
              <span>{siteById(x.site).short}</span>
              <span className={s.num}>{x.lines.length}</span>
              <span className={s.num}>{km0(lineTotal(x.lines))}</span>
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
        api.toast(`Ponuda ${q.no} prihvaćena — prodaja potvrđuje narudžbu`)
      }} />
    </div>
  )
}

function QuoteDetail({ q, st, api, accept }: { q: Quote; st: QuoteStatus; api: Api; accept: () => void }) {
  return (
    <aside className={s.panel} data-focus="quote-detail">
      <header className={s.panelHead}>
        <h3 className={s.mono}>{q.no}</h3>
        <StatusTag value={st} />
      </header>
      <p className={s.detailLead}>{q.note}</p>
      <p className={s.muted}>
        {siteById(q.site).name} · poslata prije {q.days} {q.days === 1 ? 'dan' : 'dana'} · važi {q.valid} dana
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
          <dt>Demo iznos</dt>
          <dd>{money(lineTotal(q.lines))}</dd>
        </div>
        <div>
          <dt>Težina</dt>
          <dd>{kg(lineWeight(q.lines))}</dd>
        </div>
      </dl>
      <div className={s.actionsRow}>
        <button type="button" className={s.btnSolid} disabled={st !== 'Spremna'} onClick={accept} data-tour="quote-accept">
          {st === 'Prihvaćena' ? 'Prihvaćeno' : 'Prihvati ponudu'} <Icon name="check" />
        </button>
        <button type="button" className={s.btnGhost} onClick={() => api.loadRows(q.lines)}>
          Izmijeni stavke
        </button>
      </div>
    </aside>
  )
}

/* ———————————————————————————— Narudžbe ———————————————————————————— */

export function Orders({ api }: { api: Api }) {
  const [filter, setFilter] = useState('Aktivne')
  const [sel, setSel] = useState('GC-26-04512')
  const list = ORDERS.filter((o) => (filter === 'Sve' ? true : filter === 'Aktivne' ? o.step < 4 : o.step === 4))
  const o = ORDERS.find((x) => x.no === sel)!
  return (
    <>
    <div className={s.split}>
      <section className={s.panel}>
        <header className={s.panelHead}>
          <h3>Narudžbe</h3>
          <Seg value={filter} options={['Aktivne', 'Završene', 'Sve']} onChange={setFilter} tour="orders-seg" />
        </header>
        <div className={s.table}>
          <div className={`${s.tr} ${s.th} ${s.trOrder}`}>
            <span>Broj</span>
            <span>Gradilište</span>
            <span>Status</span>
            <span>Termin</span>
          </div>
          {list.map((x) => (
            <button key={x.no} type="button" className={`${s.tr} ${s.trOrder} ${s.trBtn}`} data-on={x.no === sel || undefined} onClick={() => setSel(x.no)} data-tour={x.no === 'GC-26-04477' ? 'order' : undefined}>
              <span className={s.mono}>{x.no}</span>
              <span>{siteById(x.site).short}</span>
              <span className={s.steps} aria-label={ORDER_FLOW[x.step]}>
                {ORDER_FLOW.map((_, i) => (
                  <i key={i} data-done={i <= x.step || undefined} />
                ))}
                <em>{ORDER_FLOW[x.step]}</em>
              </span>
              <span className={s.muted}>
                {x.mode} · {x.slot}
              </span>
            </button>
          ))}
        </div>
      </section>
      <OrderDetail o={o} api={api} />
    </div>
    <section className={`${s.panel} ${s.strip}`}>
      {[
        ['Narudžbi ovaj mjesec', '12'],
        ['Isporučeno', '8'],
        ['Preuzeto na stovarištu', '3'],
        ['Ponovljene jednim klikom', '4'],
        ['Ukupna težina', kg(ORDERS.reduce((sum, x) => sum + lineWeight(x.lines), 0))],
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
  return (
    <aside className={s.panel} data-focus="order-detail">
      <header className={s.panelHead}>
        <h3 className={s.mono}>{o.no}</h3>
        <span className={s.tag} data-solid={o.step < 4 || undefined}>
          {ORDER_FLOW[o.step]}
        </span>
      </header>
      <ol className={s.track}>
        {ORDER_FLOW.map((step, i) => (
          <li key={step} data-done={i <= o.step || undefined} data-now={i === o.step || undefined}>
            <i />
            <span>{step}</span>
          </li>
        ))}
      </ol>
      <p className={s.muted}>
        {siteById(o.site).name} · {o.mode === 'Preuzimanje' ? 'preuzimanje na stovarištu, Nenada Kostića 151' : 'dostava na adresu gradilišta'} · {o.slot}
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
          Ponovi narudžbu <Icon name="repeat" />
        </button>
        <button type="button" className={s.btnGhost} onClick={() => api.go('dokumenti')}>
          Otpremnica
        </button>
      </div>
    </aside>
  )
}

/* ———————————————————————————— Isporuke ———————————————————————————— */

export function Deliveries({ api }: { api: Api }) {
  const [sel, setSel] = useState(2)
  const span = HOURS.to - HOURS.from
  const slot = WEEK[sel]
  return (
    <div className={s.split}>
      <section className={s.panel}>
        <header className={s.panelHead}>
          <h3>Ova sedmica</h3>
          <div className={s.legend}>
            <span>
              <i className={s.lgHot} />
              Dostava
            </span>
            <span>
              <i className={s.lgOutline} />
              Preuzimanje
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
                {d}
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
                      <b>{siteById(w.site).short}</b>
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
            {DAYS[slot.day]} · {slot.from}–{slot.to}h
          </h3>
          <span className={s.tag} data-solid={slot.mode === 'Dostava' || undefined}>
            {slot.mode}
          </span>
        </header>
        <p className={s.detailLead}>{slot.what}</p>
        <dl className={s.sum}>
          <div>
            <dt>Narudžba</dt>
            <dd className={s.mono}>{slot.order}</dd>
          </div>
          <div>
            <dt>Gradilište</dt>
            <dd>{siteById(slot.site).short}</dd>
          </div>
          <div>
            <dt>Mjesto</dt>
            <dd>{slot.mode === 'Preuzimanje' ? 'Stovarište, Nenada Kostića 151' : siteById(slot.site).address}</dd>
          </div>
        </dl>
        <p className={s.note}>Stovarište radi pon–pet 07–16 i sub 07–15. Termin dostave potvrđuje prodaja; vrsta vozila i istovar se dogovaraju uz narudžbu.</p>
        <button type="button" className={s.btnGhost} onClick={() => api.go('narudzbe')}>
          Otvori narudžbu <Icon name="arrow" />
        </button>
      </aside>
    </div>
  )
}

/* ———————————————————————————— Gradilišta ———————————————————————————— */

export function Sites({ api }: { api: Api }) {
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
                <b>{site.short}</b>
                <i>{site.address}</i>
              </span>
            </button>
            <div className={s.siteBudget}>
              <div className={s.siteNums}>
                <span>
                  <b>{km0(site.spent)}</b> nabavljeno
                </span>
                <span className={s.muted}>plan {km0(site.budget)}</span>
              </div>
              <span className={s.meter} data-warn={ratio > 0.8 || undefined}>
                <i style={{ transform: `scaleX(${ratio})` }} />
              </span>
            </div>
            <dl className={s.siteFacts}>
              <div>
                <dt>Faza</dt>
                <dd>{site.phase}</dd>
              </div>
              <div>
                <dt>Radovi</dt>
                <dd>{Math.round(site.progress * 100)} %</dd>
              </div>
              <div>
                <dt>Otvorene ponude</dt>
                <dd>{open}</dd>
              </div>
              <div>
                <dt>Aktivne narudžbe</dt>
                <dd>{active.length}</dd>
              </div>
              <div>
                <dt>Sljedeći termin</dt>
                <dd>{next ? `${DAYS[next.day]} ${next.from}–${next.to}h · ${next.mode}` : '—'}</dd>
              </div>
              <div>
                <dt>Kontakt</dt>
                <dd>{site.lead}</dd>
              </div>
            </dl>
            <div className={s.actionsRow}>
              <button type="button" className={s.btnGhost} onClick={() => api.go('brza')}>
                Naruči za gradilište
              </button>
              <button type="button" className={s.link} onClick={() => api.go('isporuke')}>
                Isporuke →
              </button>
            </div>
          </section>
        )
      })}
    </div>
    <section className={s.panel} data-focus="sites-compare">
      <header className={s.panelHead}>
        <h3>Plan i nabavka po gradilištu</h3>
        <div className={s.legend}>
          <span>
            <i className={s.lgHot} />
            Nabavljeno
          </span>
          <span>
            <i className={s.lgOutline} />
            Plan
          </span>
        </div>
      </header>
      <ul className={s.compare}>
        {SITES.map((x) => (
          <li key={x.id}>
            <span>{x.short}</span>
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
  return (
    <div className={s.listsGrid}>
      {LISTS.map((l) => (
        <section key={l.id} className={s.panel} data-focus={`list-${l.id}`}>
          <header className={s.panelHead}>
            <h3>{l.name}</h3>
            <span className={s.tag}>{l.from}</span>
          </header>
          <p className={s.muted}>
            {siteById(l.site).short} · {l.lines.length} stavki · {kg(lineWeight(l.lines))}
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
              Dodaj u upit <Icon name="arrow" />
            </button>
            <button type="button" className={s.btnGhost} onClick={() => api.loadRows(l.lines)}>
              U brzu narudžbu
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
  const [kind, setKind] = useState<'Sve' | DocKind>('Sve')
  const [q, setQ] = useState('')
  const list = useMemo(() => DOCS.filter((d) => (kind === 'Sve' || d.kind === kind) && d.title.toLowerCase().includes(q.toLowerCase())), [kind, q])
  return (
    <section className={s.panel}>
      <header className={s.panelHead}>
        <Seg value={kind} options={['Sve', 'Faktura', 'Otpremnica', 'Ponuda', 'Tehnički list']} onChange={(v) => setKind(v as typeof kind)} />
        <label className={s.search}>
          <Icon name="search" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Traži dokument" aria-label="Traži dokument" />
        </label>
      </header>
      <div className={s.table}>
        <div className={`${s.tr} ${s.th} ${s.trDoc}`}>
          <span>Vrsta</span>
          <span>Dokument</span>
          <span>Datum</span>
          <span>Iznos</span>
          <span>Status</span>
          <span />
        </div>
        {list.map((d) => {
          const date = new Date(2026, 9, 9 - d.days).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
          return (
            <div key={d.id} className={`${s.tr} ${s.trDoc}`}>
              <span className={s.muted}>{d.kind}</span>
              <span>{d.title}</span>
              <span className={s.num}>{date}</span>
              <span className={s.num}>{d.amount ? money(d.amount) : '—'}</span>
              <span>{d.state ? <span className={s.tag} data-solid={d.state !== 'Plaćena' || undefined}>{d.state}</span> : null}</span>
              <button
                type="button"
                className={s.iconBtn}
                aria-label={`Preuzmi ${d.title}`}
                onClick={() => download(`${d.id}-demo.txt`, `GRAND COMPANY — DEMO DOKUMENT\r\nPrimjer za prezentaciju B2B portala, nije stvarni dokument.\r\n\r\n${d.title}\r\nDatum: ${date}${d.amount ? `\r\nIznos: ${money(d.amount)}` : ''}`)}
              >
                <Icon name="down" />
              </button>
            </div>
          )
        })}
      </div>
      <p className={s.note}>Dokumenti su konceptualni modul: u produkciji ih portal preuzima iz postojećeg ERP/knjigovodstvenog sistema Grand Company-ja.</p>
    </section>
  )
}

/* ———————————————————————————— Tim i odobrenja ———————————————————————————— */

export function Team({ api }: { api: Api }) {
  const [queue, setQueue] = useState<Approval[]>(APPROVALS)
  const decide = (a: Approval, ok: boolean) => {
    setQueue(queue.filter((x) => x.id !== a.id))
    api.push({ kind: 'tim', title: `${ok ? 'Odobren' : 'Odbijen'} zahtjev — ${a.who}`, meta: `${siteById(a.site).short} · ${a.lines.length} stavke` })
    if (ok) api.addLines(a.lines, `Zahtjev: ${a.who}`)
    else api.toast('Zahtjev je odbijen')
  }
  return (
    <div className={s.split}>
      <section className={s.panel} data-focus="team">
        <header className={s.panelHead}>
          <h3>Korisnici naloga</h3>
          <button type="button" className={s.btnGhost} onClick={() => api.toast('Pozivnica poslata (demo)')}>
            <Icon name="plus" /> Pozovi
          </button>
        </header>
        <ul className={s.team}>
          {TEAM.map((t) => (
            <li key={t.initials}>
              <span className={s.avatar}>{t.initials}</span>
              <span>
                <b>{t.name}</b>
                <i>{t.role}</i>
              </span>
              <em>{t.rights}</em>
            </li>
          ))}
        </ul>
        <div className={s.proposed}>
          <span className={s.tag}>Predložena funkcija</span>
          <p>
            <b>Uslovi saradnje na nalogu.</b> Individualne cijene, rabat i odgođeno plaćanje mogu se prikazati na nalogu firme kada ih prodaja ugovori. U demu nisu aktivni i nisu postojeći uslovi Grand Company-ja.
          </p>
        </div>
      </section>
      <aside className={s.panel} data-focus="approvals">
        <header className={s.panelHead}>
          <h3>Čeka odobrenje</h3>
          <span className={s.count}>{queue.length}</span>
        </header>
        {queue.length === 0 && <p className={s.muted}>Nema zahtjeva na čekanju.</p>}
        {queue.map((a) => (
          <div key={a.id} className={s.approval}>
            <p>
              <b>{a.who}</b> · {siteById(a.site).short}
            </p>
            <p className={s.muted}>{a.note}</p>
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
                Odobri <Icon name="check" />
              </button>
              <button type="button" className={s.btnGhost} onClick={() => decide(a, false)}>
                Odbij
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
  return (
    <div className={s.seg} role="tablist" data-tour={tour}>
      {options.map((o) => (
        <button key={o} type="button" role="tab" aria-selected={o === value} onClick={() => onChange(o)}>
          {o}
        </button>
      ))}
    </div>
  )
}

function StatusTag({ value }: { value: QuoteStatus }) {
  return (
    <span className={s.tag} data-solid={value === 'Spremna' || undefined} data-dim={value === 'Istekla' || undefined}>
      {value}
    </span>
  )
}
