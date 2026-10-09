'use client'

/* eslint-disable @next/next/no-img-element -- male fotografije iz /public/calc, već u WebP */

import { useMemo, useRef, useState } from 'react'
import Cta from '@/components/ui/Cta'
import { addToCart, notify, openCart } from '@/lib/cart'
import { plural } from '@/lib/shop'
import { gsap, useGSAP } from '@/lib/gsap'
import { MQ } from '@/lib/motion'
import { revealChars } from '@/lib/reveal'
import { WASTE_DEFAULT, calcW111Area } from '@/lib/w111'
import Num from './Num'
import styles from './Calc.module.css'

// Kalkulator pregradnog zida (research 12.5), napravljen za kupca, ne za inženjera:
// 1) upišite dužinu i visinu, 2) dva izbora običnim riječima, 3) vidite šta da kupite i dodate u upit.
// Normativi su isti kao ranije (lib/w111, orijentaciono, +5 % rezerve); prodaja potvrđuje količine.

const nf = (n: number, d = 2) => n.toLocaleString('de-DE', { maximumFractionDigits: d })
const clampDim = (n: number, min: number) => Math.min(30, Math.max(min, Math.round(n * 10) / 10))

type Dim = { key: 'len' | 'height'; label: string; min: number }
const DIMS: Dim[] = [
  { key: 'len', label: 'Dužina zida', min: 0.5 },
  { key: 'height', label: 'Visina zida', min: 1 },
]

// Šta se kupuje, rečeno kao u prodavnici: [jedan, dva-četiri, pet+], kratko objašnjenje i fotografija.
const ITEMS: Record<string, { names: [string, string, string]; hint: string; img: string }> = {
  board: { names: ['gips-kartonska ploča', 'gips-kartonske ploče', 'gips-kartonskih ploča'], hint: '1,25 × 2 m, debljina 12,5 mm', img: 'obloga-1' },
  cw: { names: ['metalni stub CW 75', 'metalna stuba CW 75', 'metalnih stubova CW 75'], hint: 'dužina 3 m, svakih 62,5 cm', img: 'profili-cw' },
  uw: { names: ['vodilica UW 75', 'vodilice UW 75', 'vodilica UW 75'], hint: 'za pod i plafon, dužina 4 m', img: 'profili-uw' },
  wool: { names: ['ploča kamene vune', 'ploče kamene vune', 'ploča kamene vune'], hint: 'ide u zid, debljina 50 mm', img: 'vuna' },
  filler: { names: ['vreća mase za spojeve', 'vreće mase za spojeve', 'vreća mase za spojeve'], hint: 'vreća 5 kg', img: 'masa' },
  screws: { names: ['kutija vijaka', 'kutije vijaka', 'kutija vijaka'], hint: '1.000 komada u kutiji', img: 'vijci' },
}

/** `embedded`: ista tabla kao sekcija početne (h2, sidro #kalkulator, ulaz na skrol). */
export default function WallCalculator({ embedded = false }: { embedded?: boolean }) {
  const root = useRef<HTMLElement>(null)
  const [dims, setDims] = useState({ len: 4, height: 2.6 })
  const [text, setText] = useState({ len: '4', height: '2,6' })
  const [wool, setWool] = useState(true)
  const [double, setDouble] = useState(false)

  const area = Math.round(dims.len * dims.height * 100) / 100
  const lines = useMemo(() => calcW111Area(area, double ? 'double' : 'single', 'GKP-001', { wool, tape: false, waste: WASTE_DEFAULT }), [area, double, wool])

  const setDim = (key: Dim['key'], n: number) => {
    const d = DIMS.find((x) => x.key === key)!
    const v = clampDim(n, d.min)
    setDims((s) => ({ ...s, [key]: v }))
    setText((s) => ({ ...s, [key]: nf(v, 1) }))
  }
  const typeDim = (key: Dim['key'], s: string) => {
    setText((t) => ({ ...t, [key]: s }))
    const n = parseFloat(s.replace(',', '.'))
    if (Number.isFinite(n) && n > 0) setDims((d) => ({ ...d, [key]: Math.min(30, n) }))
  }

  useGSAP(
    () => {
      const el = root.current!
      gsap.matchMedia().add(MQ, (ctx) => {
        const { reduce } = ctx.conditions as { reduce: boolean }
        revealChars(el.querySelector('[data-head]')!, reduce, embedded ? 'top 80%' : 'top 95%')
      })
    },
    { scope: root },
  )

  const addAll = () => {
    lines.forEach((l) => addToCart(l.sku, l.cartQty))
    notify(`Zid ${nf(area)} m²: materijal dodat u upit`, { label: 'Korpa', open: 'cart' })
    openCart()
  }

  const Heading = embedded ? 'h2' : 'h1'
  // Crtež: zid u razmjeri, upisan u plavi okvir (najveća strana zauzima ~84 %).
  const ratio = dims.len / dims.height
  const wPct = ratio >= 1.6 ? 84 : (84 * ratio) / 1.6
  const hPct = ratio >= 1.6 ? (84 * 1.6) / ratio : 84

  return (
    <section ref={root} id={embedded ? 'kalkulator' : undefined} aria-labelledby="calc-title" className={styles.page}>
      <div className={styles.card}>
        <header className={styles.head}>
          <p className={`label ${styles.kicker}`}>Kalkulator · pregradni zid</p>
          <Heading id="calc-title" data-head className={`display invisible ${styles.title}`}>
            Koliko materijala vam treba?
          </Heading>
          <p className={styles.sub}>Upišite dužinu i visinu zida. Mi izračunamo šta da kupite.</p>
        </header>

        <div className={styles.body}>
          {/* ——— 1. Vaš zid ——— */}
          <div className={styles.input}>
            <p className={styles.step}>
              <b>1</b> Vaš zid
            </p>
            <div className={styles.dims}>
              {DIMS.map((d) => (
                <div key={d.key} className={styles.dim}>
                  <label htmlFor={`calc-${d.key}`} className={styles.dimLabel}>
                    {d.label}
                  </label>
                  <div className={styles.stepper}>
                    <button type="button" onClick={() => setDim(d.key, dims[d.key] - 0.1)} aria-label={`${d.label}: manje`}>
                      −
                    </button>
                    <span className={styles.field}>
                      <input
                        id={`calc-${d.key}`}
                        value={text[d.key]}
                        onChange={(e) => typeDim(d.key, e.target.value)}
                        onBlur={() => setDim(d.key, dims[d.key])}
                        inputMode="decimal"
                      />
                      <i>m</i>
                    </span>
                    <button type="button" onClick={() => setDim(d.key, dims[d.key] + 0.1)} aria-label={`${d.label}: više`}>
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.toggles}>
              <label className={styles.toggle}>
                <input type="checkbox" checked={wool} onChange={(e) => setWool(e.target.checked)} />
                <span className={styles.switch} aria-hidden />
                <span>
                  <b>Kamena vuna u zidu</b>
                  <i>Bolja zvučna izolacija</i>
                </span>
              </label>
              <label className={styles.toggle}>
                <input type="checkbox" checked={double} onChange={(e) => setDouble(e.target.checked)} />
                <span className={styles.switch} aria-hidden />
                <span>
                  <b>Dvije ploče sa svake strane</b>
                  <i>Jači i tiši zid</i>
                </span>
              </label>
            </div>

            <figure className={styles.blue}>
              <div className={styles.wallBox}>
                <div
                  className={styles.wall}
                  data-wool={wool || undefined}
                  data-double={double || undefined}
                  style={{ width: `${wPct}%`, height: `${hPct}%`, '--stud': `${(0.625 / dims.len) * 100}%` } as React.CSSProperties}
                >
                  <span className={styles.wallW}>{nf(dims.len, 1)} m</span>
                  <span className={styles.wallH}>{nf(dims.height, 1)} m</span>
                </div>
              </div>
              <figcaption className={styles.area}>
                <span className="label">Površina zida</span>
                <b>
                  <Num value={area} decimals={2} /> m²
                </b>
              </figcaption>
            </figure>
          </div>

          {/* ——— 2. Šta da kupite ——— */}
          <div className={styles.result}>
            <p className={styles.step}>
              <b>2</b> Trebate kupiti
            </p>
            <ul className={styles.list} aria-live="polite">
              {lines.map((l) => {
                const it = ITEMS[l.key]
                const img = l.key === 'board' && double ? 'obloga-2' : it.img
                return (
                  <li key={l.key} className={styles.item}>
                    <img src={`/calc/${img}.webp`} alt="" width={600} height={750} loading="lazy" decoding="async" />
                    <span className={styles.qty}>
                      <Num value={l.packs} />
                    </span>
                    <span className={styles.what}>
                      <b>{plural(l.packs, ...it.names)}</b>
                      <i>{it.hint}</i>
                    </span>
                  </li>
                )
              })}
            </ul>
            <div className={styles.cta}>
              <Cta onClick={addAll} solid>
                Dodaj sve u upit
              </Cta>
              <p className={styles.note}>Okvirna količina, sa {Math.round(WASTE_DEFAULT * 100)} % viška za rezanje. Tačnu količinu i cijenu potvrđuje prodaja.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
