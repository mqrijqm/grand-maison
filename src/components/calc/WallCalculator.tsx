'use client'

/* eslint-disable @next/next/no-img-element -- male fotografije iz /public/calc, već u WebP */

import { useMemo, useRef, useState } from 'react'
import Cta from '@/components/ui/Cta'
import { addToCart, notify, openCart } from '@/lib/cart'
import { gsap, useGSAP } from '@/lib/gsap'
import { MQ } from '@/lib/motion'
import { revealChars } from '@/lib/reveal'
import { NORMS, PROFILE_MM, WASTE_DEFAULT, calcW111Area, wallThickness, type Cladding } from '@/lib/w111'
import Num from './Num'
import WallDrawing, { studPositions, type Focus } from './WallDrawing'
import styles from './Calc.module.css'

// /kalkulator prema researchu (tačka 12.5): neutralni kalkulator pregradnog zida, bez vezivanja za
// proizvođača i bez cijena. Kompaktna "instrument tabla" na jednom ekranu: unos (dužina, visina, obloga,
// vuna) → izvedene mjere → materijal zaokružen na cijela pakovanja → "Dodaj cijeli projekat u upit".
// Crtež i fotografije se mijenjaju sa unosom. Normative potvrđuje prodaja.

const nf = (n: number, d = 2) => n.toLocaleString('de-DE', { maximumFractionDigits: d })
const parse = (s: string) => {
  const n = parseFloat(s.replace(',', '.'))
  return Number.isFinite(n) && n > 0 ? Math.min(n, 99) : 0
}

const HOW = [
  'Površina = dužina × visina.',
  `+${Math.round(WASTE_DEFAULT * 100)} % rezerve za rezanje.`,
  'Zaokruženo na cijela pakovanja.',
  'Normative potvrđuje prodaja uz ponudu.',
]

type Dim = { key: 'len' | 'height'; label: string; min: number; max: number; step: number }
const DIMS: Dim[] = [
  { key: 'len', label: 'Dužina', min: 0.5, max: 20, step: 0.1 },
  { key: 'height', label: 'Visina', min: 1, max: 6, step: 0.1 },
]

// Fotografije (Pexels, vidi public/stock/credits.json). Svaki "slot" ima više kadrova koji se pretapaju.
const PH = {
  'obloga-1': 'Rezanje gips-kartonske ploče',
  'obloga-2': 'Složene gips-kartonske ploče, slojevi',
  vuna: 'Kamena vuna izbliza',
  'bez-vune': 'Metalni CW profil prije ispune',
  'zid-nizak': 'Pregradni zidovi sa otvorima vrata',
  'zid-visok': 'Visok prostor sa skelom ispod plafona',
  'profili-cw': 'Složeni metalni profili',
  'profili-uw': 'Paketi metalnih profila',
  masa: 'Nanošenje mase za spojeve',
  vijci: 'Samourezni vijci',
} as const
type Ph = keyof typeof PH
const ALL = Object.keys(PH) as Ph[]

const ROW_LABEL: Record<string, string> = {
  board: 'Ploča',
  cw: 'CW profil',
  uw: 'UW profil',
  wool: 'Kamena vuna',
  filler: 'Masa',
  screws: 'Vijci',
}

function Stack({ show, className = '' }: { show: Ph; className?: string }) {
  return (
    <span className={`${styles.stack} ${className}`}>
      {ALL.map((k) => (
        <img key={k} src={`/calc/${k}.webp`} alt={k === show ? PH[k] : ''} aria-hidden={k !== show} data-on={k === show} width={600} height={750} loading="lazy" decoding="async" />
      ))}
    </span>
  )
}

/** `embedded`: ista tabla kao sekcija početne (h2, sidro #kalkulator, ulaz na skrol). */
export default function WallCalculator({ embedded = false }: { embedded?: boolean }) {
  const root = useRef<HTMLDivElement>(null)
  const [vals, setVals] = useState({ len: '4', height: '2,6' })
  const [good, setGood] = useState({ len: 4, height: 2.6 }) // zadnja ispravna vrijednost, za crtež dok se kuca
  const [cladding, setCladding] = useState<Cladding>('single')
  const [wool, setWool] = useState(true)
  const [focus, setFocus] = useState<Focus>(null)

  const L = parse(vals.len)
  const H = parse(vals.height)
  const area = Math.round(L * H * 100) / 100
  const lines = useMemo(
    () => (area > 0 ? calcW111Area(area, cladding, 'GKP-001', { wool, tape: false, waste: WASTE_DEFAULT }) : []),
    [area, cladding, wool],
  )

  const set = (key: Dim['key'], v: string) => {
    setVals((s) => ({ ...s, [key]: v }))
    const n = parse(v)
    if (n > 0) setGood((s) => ({ ...s, [key]: n }))
  }
  const nudge = (d: Dim, dir: 1 | -1) => {
    const cur = parse(vals[d.key]) || good[d.key]
    const n = Math.min(99, Math.max(d.min, Math.round((cur + dir * d.step) * 100) / 100))
    set(d.key, nf(n))
  }

  useGSAP(
    () => {
      const el = root.current!
      gsap.matchMedia().add(MQ, (ctx) => {
        const { reduce } = ctx.conditions as { reduce: boolean }
        revealChars(el.querySelector('[data-head]')!, reduce, 'top 95%')
        if (reduce) return
        gsap.from(el.querySelectorAll('[data-cell]'), {
          autoAlpha: 0,
          y: 10,
          duration: 0.6,
          ease: 'power3.out',
          stagger: 0.025,
          delay: embedded ? 0 : 0.15,
          scrollTrigger: embedded ? { trigger: el, start: 'top 75%' } : undefined,
        })
      })
    },
    { scope: root },
  )

  const addAll = () => {
    if (!lines.length) return
    lines.forEach((l) => addToCart(l.sku, l.cartQty))
    notify(`Zid ${nf(area)} m²: materijal dodat u upit`, { label: 'Korpa', open: 'cart' })
    openCart()
  }

  // Izvedene mjere (iz istih normativa i geometrije W111: CW na 625 mm)
  const studs = L > 0 ? studPositions(L).length : 0
  const profM = lines.filter((l) => l.key === 'cw' || l.key === 'uw').reduce((a, l) => a + l.need, 0)
  const rows = NORMS.filter((n) => n.optional !== 'tape').map((n) => ({ norm: n, line: lines.find((l) => l.key === n.key) }))

  const tall = good.height > 3
  const boardPh: Ph = cladding === 'double' ? 'obloga-2' : 'obloga-1'
  const detail: Record<string, Ph> = { board: boardPh, cw: 'profili-cw', uw: 'profili-uw', wool: wool ? 'vuna' : 'bez-vune', filler: 'masa', screws: 'vijci' }
  const detailKey = focus ?? 'cw'

  const Root = embedded ? 'section' : 'div'
  const Heading = embedded ? 'h2' : 'h1'

  const thumbs: { k: string; title: string; value: string; ph: Ph; hot: boolean }[] = [
    { k: 'obloga', title: 'Obloga', value: cladding === 'double' ? '2 × 12,5 mm' : '1 × 12,5 mm', ph: boardPh, hot: focus === 'board' || focus === 'screws' },
    { k: 'ispuna', title: 'Ispuna', value: wool ? 'Kamena vuna' : 'Prazna šupljina', ph: wool ? 'vuna' : 'bez-vune', hot: focus === 'wool' },
    { k: 'visina', title: 'Visina', value: tall ? 'Visok zid > 3 m' : 'Do 3 m', ph: tall ? 'zid-visok' : 'zid-nizak', hot: false },
    { k: 'detalj', title: 'Detalj', value: ROW_LABEL[detailKey], ph: detail[detailKey], hot: !!focus },
  ]

  return (
    <Root ref={root} id={embedded ? 'kalkulator' : undefined} aria-labelledby={embedded ? 'calc-title' : undefined} className={styles.page}>
      <div className={styles.panel}>
        {/* ——— Zaglavlje ——— */}
        <header className={`${styles.cell} ${styles.top}`}>
          <p className={`label ${styles.kicker}`}>Kalkulator · pregradni zid</p>
          <Heading id="calc-title" data-head className={`display invisible ${styles.title}`}>
            Koliko materijala vam treba?
          </Heading>
          <p className={`label ${styles.spec}`}>
            <span>W111</span>
            <span>CW {PROFILE_MM} · 625 mm</span>
            <span>+{Math.round(WASTE_DEFAULT * 100)} % rezerve</span>
          </p>
        </header>

        {/* ——— Unos ——— */}
        <section className={styles.controls} aria-label="Unos">
          {DIMS.map((d) => {
            const v = parse(vals[d.key])
            return (
              <div key={d.key} data-cell className={`${styles.cell} ${styles.input}`}>
                <label className={styles.cellHead} htmlFor={`calc-${d.key}`}>
                  <span className="label">{d.label}</span>
                  <span className="label opacity-50">m</span>
                </label>
                <div className={styles.inputRow}>
                  <button type="button" className={styles.step} onClick={() => nudge(d, -1)} aria-label={`${d.label} manje`}>
                    −
                  </button>
                  <input
                    id={`calc-${d.key}`}
                    className={styles.dimInput}
                    value={vals[d.key]}
                    onChange={(e) => set(d.key, e.target.value)}
                    inputMode="decimal"
                    aria-label={`${d.label} zida u metrima`}
                  />
                  <button type="button" className={styles.step} onClick={() => nudge(d, 1)} aria-label={`${d.label} više`}>
                    +
                  </button>
                </div>
                <input
                  type="range"
                  className={styles.range}
                  min={d.min}
                  max={d.max}
                  step={0.05}
                  value={Math.min(d.max, Math.max(d.min, v || good[d.key]))}
                  onChange={(e) => set(d.key, nf(Number(e.target.value)))}
                  aria-label={`${d.label} klizač`}
                  style={{ '--p': `${((Math.min(d.max, Math.max(d.min, v || good[d.key])) - d.min) / (d.max - d.min)) * 100}%` } as React.CSSProperties}
                />
                <span className={styles.rangeScale} aria-hidden>
                  <span>{nf(d.min)}</span>
                  <span>{nf(d.max)}</span>
                </span>
              </div>
            )
          })}

          <fieldset data-cell className={`${styles.cell} ${styles.option}`}>
            <legend className={`label ${styles.legend}`}>Obloga</legend>
            <div className={styles.seg}>
              <button type="button" aria-pressed={cladding === 'single'} onClick={() => setCladding('single')}>
                Jednostruka
              </button>
              <button type="button" aria-pressed={cladding === 'double'} onClick={() => setCladding('double')}>
                Dvostruka
              </button>
            </div>
          </fieldset>
          <fieldset data-cell className={`${styles.cell} ${styles.option}`}>
            <legend className={`label ${styles.legend}`}>Kamena vuna</legend>
            <div className={styles.seg}>
              <button type="button" aria-pressed={wool} onClick={() => setWool(true)}>
                Sa vunom
              </button>
              <button type="button" aria-pressed={!wool} onClick={() => setWool(false)}>
                Bez vune
              </button>
            </div>
          </fieldset>

          <div data-cell className={`${styles.cell} ${styles.actions}`}>
            <ol className={styles.how} aria-label="Kako računamo">
              {HOW.map((t, i) => (
                <li key={t}>
                  <span className={styles.howNum}>{String(i + 1).padStart(2, '0')}</span>
                  {t}
                </li>
              ))}
            </ol>
            <Cta onClick={addAll} solid>
              Dodaj cijeli projekat u upit
            </Cta>
            <Cta href="/upit-za-izvodjace">Opišite šta gradite</Cta>
          </div>
        </section>

        {/* ——— Očitavanje ——— */}
        <section className={styles.readout} aria-label="Rezultat">
          <div className={styles.derived}>
            <div data-cell className={`${styles.cell} ${styles.metric} ${styles.metricMain}`}>
              <span className="label">Površina</span>
              <output aria-live="polite" className={styles.metricVal}>
                {area > 0 ? <Num value={area} decimals={2} /> : '—'}
                <span className={styles.metricUnit}>m²</span>
              </output>
            </div>
            <div data-cell className={`${styles.cell} ${styles.metric}`}>
              <span className="label">Debljina</span>
              <span className={styles.metricVal}>
                <Num value={wallThickness(cladding)} />
                <span className={styles.metricUnit}>mm</span>
              </span>
            </div>
            <div data-cell className={`${styles.cell} ${styles.metric}`} onMouseEnter={() => setFocus('cw')} onMouseLeave={() => setFocus(null)}>
              <span className="label">CW stupova</span>
              <span className={styles.metricVal}>
                <Num value={studs} />
                <span className={styles.metricUnit}>kom</span>
              </span>
            </div>
            <div data-cell className={`${styles.cell} ${styles.metric}`}>
              <span className="label">Profili</span>
              <span className={styles.metricVal}>
                <Num value={profM} decimals={1} />
                <span className={styles.metricUnit}>m</span>
              </span>
            </div>
          </div>

          <div className={`${styles.cell} ${styles.tableHead}`}>
            <span className="label">Kol.</span>
            <span className="label">Materijal</span>
            <span className={`label ${styles.hideSm}`}>Potrebno / kupljeno</span>
          </div>
          <ul className={styles.table} onMouseLeave={() => setFocus(null)}>
            {rows.map(({ norm, line }) => {
              const packs = line?.packs ?? 0
              const cap = packs * norm.pack
              const fill = line && cap ? line.need / cap : 0
              const active = focus === norm.key
              return (
                <li
                  key={norm.key}
                  data-cell
                  data-off={!line || undefined}
                  data-active={active || undefined}
                  className={`${styles.cell} ${styles.mRow}`}
                  tabIndex={0}
                  onMouseEnter={() => setFocus(norm.key as Focus)}
                  onFocus={() => setFocus(norm.key as Focus)}
                  onBlur={() => setFocus(null)}
                >
                  <span className={styles.mQty}>
                    <Num value={packs} />
                  </span>
                  <span className={styles.mName}>
                    <span className={styles.mLabel}>{norm.label}</span>
                    <span className={styles.mPack}>{line ? norm.packName : 'isključeno'}</span>
                  </span>
                  <span className={styles.mBar}>
                    <span className={styles.mBarText}>
                      {line ? `${nf(line.need, 1)} / ${nf(cap, 1)} ${norm.unit}` : '—'}
                    </span>
                    <span className={styles.mTrack} aria-hidden>
                      <span className={styles.mFill} style={{ transform: `scaleX(${fill})` }} />
                    </span>
                  </span>
                </li>
              )
            })}
          </ul>

          <div className={`${styles.cell} ${styles.foot}`}>
            <p className={styles.note}>
              Orijentacioni proračun sa {Math.round(WASTE_DEFAULT * 100)} % rezerve. Količine i kompatibilnost proizvoda potvrđuje prodaja uz ponudu.
            </p>
          </div>
        </section>

        {/* ——— Crtež i fotografije ——— */}
        <figure className={`m-0 ${styles.visual}`}>
          <div data-cell className={styles.blue}>
            <span className={`label ${styles.blueTag}`}>Pogled · u razmjeri</span>
            <span className={`label ${styles.blueTagR}`}>
              {nf(good.len)} × {nf(good.height)} m
            </span>
            <WallDrawing L={good.len} H={good.height} double={cladding === 'double'} wool={wool} focus={focus} />
          </div>
          <div className={styles.thumbs}>
            {thumbs.map((t) => (
              <div key={t.k} data-cell data-hot={t.hot || undefined} className={styles.thumb}>
                <Stack show={t.ph} />
                <span className={styles.thumbCap}>
                  <span className="label opacity-60">{t.title}</span>
                  <span className={styles.thumbVal}>{t.value}</span>
                </span>
              </div>
            ))}
          </div>
          <figcaption className="sr-only">
            Crtež zida {nf(good.len)} × {nf(good.height)} m sa {studs} CW stupova, {cladding === 'double' ? 'dvostrukom' : 'jednostrukom'} oblogom {wool ? 'i kamenom vunom' : 'bez vune'}.
          </figcaption>
        </figure>
      </div>
    </Root>
  )
}
