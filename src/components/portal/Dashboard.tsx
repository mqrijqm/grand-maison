'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { addToCart, notify, openCart } from '@/lib/cart'
import { PRODUCT_MAP } from '@/lib/shop'
import { APPROVALS, DOCS, FEED_POOL, FEED_START, FIRM, LISTS, ORDERS, QUOTES, SITES, WEEK, siteById, type Approval, type FeedItem, type Line, type MetricId, type QuoteStatus } from '@/lib/portal-demo'
import { SITE_TERMS, TERMS, searchProducts, type SiteId } from '@/lib/portal-b2b'
import { Catalog } from './b2b-views'
import Icon from './Icon'
import { Deliveries, Documents, Lists, Orders, Overview, QuickOrder, Quotes, Sites, Team, type Api, type Row, type ViewId } from './views'
import s from './Dashboard.module.css'

// B2B portal kao jedan živi dashboard (demo). Interakcija po uzoru na Blink-ov Arky:
// klik na karticu "zumira kameru" na ono što ta kartica pokreće, grafikon ima hover očitavanje,
// tok "Uživo" sam dobija nove događaje, a dok niko ne dira, kursor sam provozi kroz portal.
// Čim posjetilac pomjeri miš iznad prozora, vožnja staje i sve je njegovo.

const NAV: { group: string; items: { id: ViewId; label: string; count?: number }[] }[] = [
  {
    group: 'Nabavka',
    items: [
      { id: 'pregled', label: 'Pregled' },
      { id: 'katalog', label: 'Katalog' },
      { id: 'brza', label: 'Brza narudžba' },
      { id: 'ponude', label: 'Ponude', count: QUOTES.filter((q) => q.status === 'Spremna' || q.status === 'U obradi').length },
      { id: 'narudzbe', label: 'Narudžbe', count: ORDERS.filter((o) => o.step < 4).length },
      { id: 'isporuke', label: 'Isporuke', count: WEEK.length },
    ],
  },
  {
    group: 'Projekti',
    items: [
      { id: 'gradilista', label: 'Gradilišta', count: 3 },
      { id: 'liste', label: 'Sačuvane liste', count: LISTS.length },
    ],
  },
  {
    group: 'Nalog',
    items: [
      { id: 'dokumenti', label: 'Dokumenti' },
      { id: 'tim', label: 'Tim i odobrenja', count: APPROVALS.length },
    ],
  },
]

const HEAD: Record<ViewId, [string, string]> = {
  pregled: ['Pregled', 'Vaša nabavka na jednom ekranu: kreditni okvir, narudžbe u toku i brzi unos.'],
  katalog: ['Katalog', 'Artikli sa vašim neto cijenama, zalihama i tehničkim filterima.'],
  brza: ['Brza narudžba', 'Šifra i količina, bez listanja kataloga. Zalijepite i cijelu tabelu.'],
  ponude: ['Ponude', 'Ponude koje je prodaja pripremila po vašim upitima.'],
  narudzbe: ['Narudžbe', 'Status svake narudžbe od prijema do isporuke. Jednim klikom ponovite staru.'],
  isporuke: ['Isporuke i preuzimanja', 'Termini ove sedmice, po gradilištima.'],
  gradilista: ['Gradilišta', 'Nabavka, narudžbe i termini po projektu.'],
  liste: ['Sačuvane liste', 'Liste iz kalkulatora i ranijih narudžbi, spremne za novi upit.'],
  dokumenti: ['Dokumenti', 'Fakture, otpremnice, ponude i tehnički listovi na jednom mjestu.'],
  tim: ['Tim i odobrenja', 'Ko u firmi šta smije, i zahtjevi poslovođa koji čekaju odobrenje.'],
}

// Vožnja kursora: [selektor (data-tour), radnja]. Prazan selektor = pauza.
type Step = { t: string; act?: 'click' | 'hover' | 'type'; text?: string; wait?: number }
const TOUR: Step[] = [
  { t: 'credit', act: 'hover', wait: 1500 },
  { t: 'live-orders', act: 'hover', wait: 1300 },
  { t: 'qa-sku', act: 'type', text: 'GKP-001', wait: 900 },
  { t: 'qa-add', act: 'hover', wait: 900 },
  { t: 'nav-katalog', act: 'click', wait: 700 },
  { t: 'cat-search', act: 'type', text: 'rigips', wait: 1600 },
  { t: 'nav-brza', act: 'click', wait: 700 },
  { t: 'qo-add', act: 'click', wait: 500 },
  { t: 'qo-sku-last', act: 'type', text: 'ISO-001', wait: 900 },
  { t: 'qo-send', act: 'hover', wait: 900 },
  { t: 'nav-ponude', act: 'click', wait: 700 },
  { t: 'quote', act: 'click', wait: 900 },
  { t: 'nav-narudzbe', act: 'click', wait: 700 },
  { t: 'order', act: 'click', wait: 1000 },
  { t: 'reorder', act: 'hover', wait: 800 },
  { t: 'nav-tim', act: 'click', wait: 900 },
  { t: 'nav-pregled', act: 'click', wait: 1800 },
]

const TIMES = ['sad', '2 min', '6 min', '14 min', '31 min', '1 h', '2 h']

type Props = {
  variant?: 'full' | 'preview' | 'compact'
  /** false: bez automatske vožnje kursora (npr. kad dashboard vodi objašnjenje sa strane) */
  tour?: boolean
  /** Spolja zadat ekran i element na koji kamera zumira (objašnjenje na /za-firme). */
  show?: { view: ViewId; focus?: string } | null
}

export default function Dashboard({ variant = 'full', tour = true, show = null }: Props) {
  const [view, setView] = useState<ViewId>('pregled')
  const [metric, setMetric] = useState<MetricId>('nabavka')
  const [zoom, setZoom] = useState<string | null>(null)
  const [cam, setCam] = useState<{ x: number; y: number; k: number }>({ x: 0, y: 0, k: 1 })
  const [feed, setFeed] = useState(() => FEED_START.map((f, i) => ({ ...f, id: i })))
  const [quoteStatus, setQuoteStatus] = useState<Record<string, QuoteStatus>>({})
  const [rows, setRows] = useState<Row[]>([
    { id: 1, sku: 'GKP-001', qty: 120 },
    { id: 2, sku: 'PRF-075', qty: 40 },
    { id: 3, sku: 'PRF-UW75', qty: 14 },
  ])
  const [toast, setToast] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [touring, setTouring] = useState(false)
  const [site, setSite] = useState<SiteId>('all')
  const [approvals, setApprovals] = useState<Approval[]>(APPROVALS)
  const [catalogQuery, setCatalogQuery] = useState('')

  const win = useRef<HTMLDivElement>(null)
  const port = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLDivElement>(null)
  const cursor = useRef<HTMLSpanElement>(null)
  const feedN = useRef(0)
  const toastT = useRef<ReturnType<typeof setTimeout>>(undefined)
  const userTook = useRef(false)
  const touringRef = useRef(false)

  const showToast = useCallback((text: string) => {
    setToast(text)
    clearTimeout(toastT.current)
    toastT.current = setTimeout(() => setToast(null), 2600)
  }, [])

  const push = useCallback((item: FeedItem) => {
    setFeed((f) => [{ ...item, t: 'sad', id: 1000 + feedN.current++ }, ...f.map((x, i) => ({ ...x, t: TIMES[Math.min(TIMES.length - 1, i + 1)] }))].slice(0, 5))
  }, [])

  // ——— Kamera: zum na element sa data-focus="key" unutar platna ———
  const unfocus = useCallback(() => {
    canvas.current?.querySelectorAll('[data-active]').forEach((n) => n.removeAttribute('data-active'))
    setZoom(null)
    setCam({ x: 0, y: 0, k: 1 })
  }, [])
  const focus = useCallback(
    (key: string) => {
      const vp = port.current
      const cv = canvas.current
      const el = cv?.querySelector<HTMLElement>(`[data-focus="${key}"]`)
      if (!vp || !cv || !el || window.matchMedia('(max-width: 899px)').matches) return
      // Mjerimo u koordinatama platna bez trenutnog zuma.
      const k0 = cam.k
      const c = cv.getBoundingClientRect()
      const r = el.getBoundingClientRect()
      const x = (r.left - c.left) / k0
      const y = (r.top - c.top) / k0
      const w = r.width / k0
      const h = r.height / k0
      const W = vp.clientWidth
      const H = vp.clientHeight
      const k = Math.min(1.4, (W * 0.86) / w, (H * 0.86) / h)
      if (k < 1.08) {
        // Dovoljno veliko za čitanje: bez zuma, samo skrol do njega i plavi okvir.
        vp.scrollTo({ top: Math.max(0, y - 8), behavior: 'smooth' })
        cv.querySelectorAll('[data-mark]').forEach((n) => n.removeAttribute('data-mark'))
        el.setAttribute('data-mark', '')
        return
      }
      cv.querySelectorAll('[data-active]').forEach((n) => n.removeAttribute('data-active'))
      el.setAttribute('data-active', '')
      setZoom(key)
      setCam({ x: W / 2 - (x + w / 2) * k, y: vp.scrollTop + H / 2 - (y + h / 2) * k, k })
    },
    [cam.k],
  )

  const focusRef = useRef(focus)
  useEffect(() => {
    focusRef.current = focus
  }, [focus])

  const go = useCallback(
    (v: ViewId) => {
      unfocus()
      setView(v)
      port.current?.scrollTo({ top: 0 })
    },
    [unfocus],
  )

  const addLines = useCallback(
    (lines: Line[], label: string) => {
      lines.forEach(([sku, q]) => PRODUCT_MAP[sku] && addToCart(sku, q))
      notify(`${label}: ${lines.length} stavki dodato u upit`, { label: 'Korpa', open: 'cart' })
      showToast(`${lines.length} stavki dodato u upit`)
      if (!touringRef.current) openCart()
    },
    [showToast],
  )

  // U korpu bez otvaranja korpe: kupac ostaje na ekranu na kome radi.
  const addQuiet = useCallback(
    (lines: Line[], label: string) => {
      lines.forEach(([sku, q]) => PRODUCT_MAP[sku] && addToCart(sku, q))
      showToast(`U korpi: ${label}`)
    },
    [showToast],
  )

  const decide = useCallback(
    (a: Approval, ok: boolean) => {
      setApprovals((q) => q.filter((x) => x.id !== a.id))
      push({ kind: 'tim', title: `${ok ? 'Odobren' : 'Odbijen'} zahtjev — ${a.who}`, meta: `${siteById(a.site).short} · ${a.lines.length} stavke` })
      if (ok) addLines(a.lines, `Zahtjev: ${a.who}`)
      else showToast('Zahtjev je odbijen')
    },
    [push, addLines, showToast],
  )

  const api: Api = useMemo(
    () => ({
      go,
      focus,
      addLines,
      addQuiet,
      push,
      toast: showToast,
      loadRows: (lines) => {
        setRows(lines.map(([sku, qty], i) => ({ id: 500 + i + Math.round(Math.random() * 1e6), sku, qty })))
        go('brza')
      },
      site,
      approvals,
      decide,
      catalogQuery,
    }),
    [go, focus, addLines, addQuiet, push, showToast, site, approvals, decide, catalogQuery],
  )

  // ——— Živi tok: novi događaj svakih ~4 s dok je prozor vidljiv ———
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let visible = false
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(win.current!)
    let i = 0
    const id = setInterval(() => {
      if (!visible || document.hidden) return
      push(FEED_POOL[i++ % FEED_POOL.length])
    }, 4200)
    return () => {
      clearInterval(id)
      io.disconnect()
    }
  }, [push])

  // ——— Esc vraća kameru ———
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && unfocus()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [unfocus])

  // ——— Blagi 3D nagib prema mišu ———
  useEffect(() => {
    const el = win.current!
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      el.style.setProperty('--ry', `${(((e.clientX - r.left) / r.width - 0.5) * 2.2).toFixed(2)}deg`)
      el.style.setProperty('--rx', `${(-((e.clientY - r.top) / r.height - 0.5) * 1.6).toFixed(2)}deg`)
    }
    const leave = () => {
      el.style.setProperty('--rx', '0deg')
      el.style.setProperty('--ry', '0deg')
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  }, [])

  // ——— Vožnja kursora ———
  useEffect(() => {
    const el = win.current!
    if (!tour || window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.matchMedia('(max-width: 899px)').matches) return
    let alive = true
    let visible = false
    let started = false
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))
    const target = (t: string) => {
      if (t === 'zoomout') return el.querySelector<HTMLElement>('[data-zoomout]')
      if (t.startsWith('nav-')) return el.querySelector<HTMLElement>(`[data-nav="${t.slice(4)}"]`)
      if (t === 'qo-sku-last') {
        const all = el.querySelectorAll<HTMLElement>('[data-tour="qo-sku"]')
        return all[all.length - 1] ?? null
      }
      return el.querySelector<HTMLElement>(`[data-tour="${t}"]`)
    }
    const moveTo = async (node: HTMLElement) => {
      const c = cursor.current!
      const w = el.getBoundingClientRect()
      const r = node.getBoundingClientRect()
      c.style.transform = `translate(${r.left - w.left + Math.min(r.width * 0.5, 60)}px, ${r.top - w.top + r.height * 0.55}px)`
      await wait(650)
    }
    const typeInto = async (input: HTMLInputElement, text: string) => {
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!
      for (let i = 1; i <= text.length && alive && !userTook.current; i++) {
        setter.call(input, text.slice(0, i))
        input.dispatchEvent(new Event('input', { bubbles: true }))
        await wait(90)
      }
    }
    const run = async () => {
      await wait(1400)
      touringRef.current = true
      setTouring(true)
      while (alive && !userTook.current) {
        for (const step of TOUR) {
          if (!alive || userTook.current) break
          while (alive && !visible && !userTook.current) await wait(400)
          const node = target(step.t)
          if (!node) continue
          await moveTo(node)
          if (!alive || userTook.current) break
          if (step.act === 'click') {
            cursor.current!.dataset.press = '1'
            node.click()
            await wait(160)
            delete cursor.current!.dataset.press
          } else if (step.act === 'hover' && step.t === 'chart') {
            const r = node.getBoundingClientRect()
            for (let i = 0; i <= 10 && alive && !userTook.current; i++) {
              const x = r.left + r.width * (0.35 + i * 0.06)
              node.dispatchEvent(new PointerEvent('pointermove', { clientX: x, clientY: r.top + r.height / 2, bubbles: true }))
              cursor.current!.style.transform = `translate(${x - el.getBoundingClientRect().left}px, ${r.top - el.getBoundingClientRect().top + r.height / 2}px)`
              await wait(110)
            }
            node.dispatchEvent(new PointerEvent('pointerleave', { bubbles: false }))
          } else if (step.act === 'type' && node instanceof HTMLInputElement) {
            await typeInto(node, step.text ?? '')
          }
          await wait(step.wait ?? 800)
        }
      }
      touringRef.current = false
      setTouring(false)
    }
    const io = new IntersectionObserver(([e]) => {
      visible = e.intersectionRatio > 0.35
      if (visible && !started) {
        started = true
        run()
      }
    }, { threshold: [0, 0.35, 0.6] })
    io.observe(el)
    // Pravi korisnik preuzima: pomjeren miš iznad prozora, klik, točkić ili tastatura.
    const take = (e: Event) => {
      if (!e.isTrusted || userTook.current) return
      userTook.current = true
      touringRef.current = false
      setTouring(false)
    }
    el.addEventListener('pointermove', take)
    el.addEventListener('pointerdown', take)
    el.addEventListener('wheel', take, { passive: true })
    el.addEventListener('keydown', take)
    return () => {
      alive = false
      io.disconnect()
      el.removeEventListener('pointermove', take)
      el.removeEventListener('pointerdown', take)
      el.removeEventListener('wheel', take)
      el.removeEventListener('keydown', take)
    }
  }, [tour])

  // ——— Spolja zadat ekran: prebaci pogled, pa (kad se iscrta) zumiraj na traženi element ———
  const showKey = show ? `${show.view}|${show.focus ?? ''}` : ''
  useEffect(() => {
    if (!show) return
    const a = window.setTimeout(() => go(show.view), 0)
    const b = show.focus ? window.setTimeout(() => focusRef.current(show.focus!), 650) : 0
    return () => {
      window.clearTimeout(a)
      window.clearTimeout(b)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reaguje samo na promjenu ključa
  }, [showKey])

  // ——— Pretraga u bočnoj traci: artikli, ponude i narudžbe ———
  const openCatalog = useCallback(
    (q: string) => {
      setCatalogQuery(q)
      go('katalog')
    },
    [go],
  )
  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (q.length < 2) return []
    const prods = searchProducts(query)
      .hits.slice(0, 4)
      .map(({ product: p, fuzzy }) => ({ key: p.id, label: p.name, meta: fuzzy ? `${p.id} · slično` : p.id, run: () => openCatalog(p.id) }))
    const docs = DOCS.filter((x) => x.id.toLowerCase().includes(q) || x.title.toLowerCase().includes(q)).map((x) => ({ key: x.id, label: x.title, meta: x.kind, run: () => go('dokumenti') }))
    const quotes = QUOTES.filter((x) => x.no.toLowerCase().includes(q)).map((x) => ({ key: x.no, label: `Ponuda ${x.no}`, meta: x.status, run: () => go('ponude') }))
    const orders = ORDERS.filter((x) => x.no.toLowerCase().includes(q)).map((x) => ({ key: x.no, label: `Narudžba ${x.no}`, meta: 'Narudžba', run: () => go('narudzbe') }))
    return [...prods, ...quotes, ...orders, ...docs].slice(0, 7)
  }, [query, go, openCatalog])

  const [title, sub] = HEAD[view]

  return (
    <div ref={win} className={s.window} data-variant={variant} data-touring={touring || undefined}>
      <div className={s.chrome}>
        <span className={s.dots} aria-hidden>
          <i />
          <i />
          <i />
        </span>
        <span className={s.url}>
          {FIRM.url}/{view}
        </span>
        <span className={s.demoTag}>Demo</span>
      </div>

      <div className={s.body}>
        <aside className={s.side}>
          <div className={s.brand}>
            <svg viewBox="0 0 20 20" aria-hidden>
              <path d="M2 2h16v16H2z M2 10h8 M10 10v8" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            Grand Company <em>Portal</em>
          </div>
          <div className={s.account}>
            <span className={s.avatar}>{FIRM.short}</span>
            <span>
              <b>{FIRM.name}</b>
              <i>{FIRM.user}</i>
            </span>
            <span className={s.tag}>Demo</span>
          </div>
          <nav className={s.nav} aria-label="Portal">
            {NAV.map((g) => (
              <div key={g.group} className={s.navGroup}>
                <span className={s.navLabel}>{g.group}</span>
                {g.items.map((it) => (
                  <button key={it.id} type="button" data-nav={it.id} aria-current={view === it.id || undefined} onClick={() => go(it.id)}>
                    <Icon name={it.id} />
                    <span>{it.label}</span>
                    {it.count !== undefined && <em>{it.count}</em>}
                  </button>
                ))}
              </div>
            ))}
          </nav>
          <div className={s.sideFoot}>
            <span className={s.muted}>Prodaja</span>
            <a href="tel:+38751388995">051 388-995</a>
          </div>
        </aside>

        <div className={s.main}>
          <header className={s.mainHead}>
            <div>
              <h2>{title}</h2>
              <p>{sub}</p>
            </div>
            <div className={s.headBtns}>
              {zoom && (
                <button type="button" className={s.btnGhost} data-zoomout onClick={unfocus}>
                  <Icon name="back" /> Nazad
                </button>
              )}
              <button type="button" className={s.btnSolid} onClick={() => go('brza')}>
                <Icon name="plus" /> Brza narudžba
              </button>
            </div>
          </header>
          {/* Kontekst: aktivno gradilište (adresa isporuke i cijene) i pretraga po šifri i tehničkim terminima */}
          <div className={s.ctx}>
            <label className={s.sitePick}>
              <Icon name="gradilista" />
              <span className={s.srOnly}>Aktivno gradilište</span>
              <select
                value={site}
                onChange={(e) => {
                  const v = e.target.value as SiteId
                  setSite(v)
                  showToast(v === 'all' ? 'Sva gradilišta · osnovne cijene firme' : `${siteById(v).short} · adresa isporuke i cijene za gradilište`)
                }}
                aria-label="Aktivno gradilište"
              >
                <option value="all">Sva gradilišta</option>
                {SITES.map((x) => (
                  <option key={x.id} value={x.id}>
                    {x.short}
                  </option>
                ))}
              </select>
            </label>
            <span className={s.ctxInfo}>
              <i>Isporuka</i>
              {site === 'all' ? 'po gradilištu narudžbe' : siteById(site).address}
            </span>
            <span className={s.tag} data-solid={(site !== 'all' && !!SITE_TERMS[site]) || undefined}>
              {site !== 'all' && SITE_TERMS[site] ? SITE_TERMS[site].label : `Cijene: ${TERMS.tier} · demo`}
            </span>
            <div className={s.ctxSearch}>
              <label className={`${s.search} ${s.searchLight}`}>
                <Icon name="search" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && query.trim().length > 1) {
                      openCatalog(query.trim())
                      setQuery('')
                    }
                  }}
                  placeholder="Šifra, artikal, ponuda, faktura…"
                  aria-label="Pretraga portala"
                />
              </label>
              {results.length > 0 && (
                <ul className={s.results}>
                  {results.map((r) => (
                    <li key={r.key}>
                      <button
                        type="button"
                        onClick={() => {
                          r.run()
                          setQuery('')
                        }}
                      >
                        <b>{r.label}</b>
                        <i>{r.meta}</i>
                      </button>
                    </li>
                  ))}
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        openCatalog(query.trim())
                        setQuery('')
                      }}
                    >
                      <b>Svi rezultati u katalogu →</b>
                      <i>Enter</i>
                    </button>
                  </li>
                </ul>
              )}
            </div>
          </div>

          <div ref={port} className={s.port} data-zoomed={zoom || undefined}>
            <div
              ref={canvas}
              key={view}
              className={s.canvas}
              data-view={view}
              data-zoom={zoom || undefined}
              style={{ transform: `translate(${cam.x}px, ${cam.y}px) scale(${cam.k})` }}
              onClickCapture={(e) => {
                // Dok je kamera zumirana, klik van fokusa je vraća nazad.
                if (zoom && !(e.target as HTMLElement).closest(`[data-focus="${zoom}"]`)) {
                  e.stopPropagation()
                  unfocus()
                }
              }}
            >
              {view === 'pregled' && <Overview api={api} metric={metric} setMetric={setMetric} feed={feed} />}
              {view === 'katalog' && <Catalog key={catalogQuery} api={api} />}
              {view === 'brza' && <QuickOrder api={api} rows={rows} setRows={setRows} />}
              {view === 'ponude' && <Quotes api={api} status={quoteStatus} setStatus={(no, st) => setQuoteStatus((m) => ({ ...m, [no]: st }))} />}
              {view === 'narudzbe' && <Orders api={api} />}
              {view === 'isporuke' && <Deliveries api={api} />}
              {view === 'gradilista' && <Sites api={api} />}
              {view === 'liste' && <Lists api={api} />}
              {view === 'dokumenti' && <Documents />}
              {view === 'tim' && <Team api={api} />}
            </div>
          </div>
        </div>
      </div>

      <span ref={cursor} className={s.ghost} aria-hidden>
        <svg viewBox="0 0 20 20">
          <path d="M3 2l13 7.2-5.8 1.3L7.4 16z" />
        </svg>
      </span>
      {/* Telefon: velike tipke za brzu kupovinu i poziv prodaji */}
      <div className={s.mobileBar}>
        <button type="button" className={s.btnSolid} onClick={() => go('brza')}>
          <Icon name="brza" /> Brza narudžba
        </button>
        <a className={s.btnGhost} href="tel:+38751388995">
          <Icon name="phone" /> Pozovi prodaju
        </a>
      </div>
      {touring && <span className={s.tourHint}>Demo vožnja · pomjerite miš da preuzmete</span>}
      <div className={s.toast} data-on={toast ? true : undefined} role="status" aria-live="polite">
        <Icon name="check" />
        {toast}
      </div>
    </div>
  )
}
