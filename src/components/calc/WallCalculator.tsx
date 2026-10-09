'use client'

/* eslint-disable @next/next/no-img-element -- fotografija iz /public, već u WebP */

import { useMemo, useRef, useState } from 'react'
import Cta from '@/components/ui/Cta'
import UseArt from '@/components/landing/UseArt'
import { addToCart, notify, openCart } from '@/lib/cart'
import { drawOnScroll } from '@/lib/draw'
import { gsap, useGSAP } from '@/lib/gsap'
import { MQ } from '@/lib/motion'
import { revealChars } from '@/lib/reveal'
import { WASTE_DEFAULT, calcW111Area, wallThickness, type Cladding } from '@/lib/w111'
import MaterialList from './MaterialList'
import styles from './Calc.module.css'

// /kalkulator prema researchu (tačka 12.5): neutralni kalkulator pregradnog zida, bez vezivanja za
// proizvođača i bez cijena. Korisnik unosi dužinu i visinu → površina → demo normativ daje komponente,
// zaokružene na cijela pakovanja → "Dodaj cijeli projekat u upit". Normative potvrđuje prodaja.

const nf = (n: number, d = 2) => n.toLocaleString('de-DE', { maximumFractionDigits: d })
const parse = (s: string) => {
  const n = parseFloat(s.replace(',', '.'))
  return Number.isFinite(n) && n > 0 ? Math.min(n, 99) : 0
}

const HOW = [
  'Površina zida = dužina × visina.',
  `Na količine se dodaje ${Math.round(WASTE_DEFAULT * 100)} % rezerve za rezanje.`,
  'Svaka stavka se zaokružuje na cijela pakovanja.',
  'Normative i kompatibilnost proizvoda potvrđuje prodaja uz ponudu.',
]

export default function WallCalculator() {
  const root = useRef<HTMLDivElement>(null)
  const [len, setLen] = useState('4')
  const [height, setHeight] = useState('2,6')
  const [cladding, setCladding] = useState<Cladding>('single')
  const [wool, setWool] = useState(true)

  const area = Math.round(parse(len) * parse(height) * 100) / 100
  const lines = useMemo(
    () => (area > 0 ? calcW111Area(area, cladding, 'GKP-001', { wool, tape: false, waste: WASTE_DEFAULT }) : []),
    [area, cladding, wool],
  )

  useGSAP(
    () => {
      const el = root.current!
      gsap.matchMedia().add(MQ, (ctx) => {
        const { reduce } = ctx.conditions as { reduce: boolean }
        revealChars(el.querySelector('[data-head]')!, reduce, 'top 90%')
        const svg = el.querySelector('[data-calc-art] svg')
        if (svg) drawOnScroll(svg, reduce, { trigger: el, start: 'top 80%' })
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

  return (
    <div ref={root} className={`gutter ${styles.page}`}>
      <div className={styles.grid}>
        <div>
          <p className={`label ${styles.kicker}`}>Kalkulator · pregradni zid</p>
          <h1 data-head className={`display invisible ${styles.title}`}>
            Koliko materijala vam treba?
          </h1>
          <p className={styles.lead}>Upišite dužinu i visinu zida. Kalkulator računa površinu i potreban materijal, zaokružen na cijela pakovanja.</p>

          <div className={styles.equation}>
            <label className={styles.dim}>
              <span className={styles.dimLabel}>Dužina</span>
              <span className={styles.dimField}>
                <input className={styles.dimInput} value={len} onChange={(e) => setLen(e.target.value)} inputMode="decimal" aria-label="Dužina zida u metrima" />
                <span className={styles.unit}>m</span>
              </span>
            </label>
            <span className={styles.op} aria-hidden>×</span>
            <label className={styles.dim}>
              <span className={styles.dimLabel}>Visina</span>
              <span className={styles.dimField}>
                <input className={styles.dimInput} value={height} onChange={(e) => setHeight(e.target.value)} inputMode="decimal" aria-label="Visina zida u metrima" />
                <span className={styles.unit}>m</span>
              </span>
            </label>
            <span className={styles.arrow} aria-hidden>→</span>
            <div className={styles.dim}>
              <span className={styles.dimLabel}>Površina</span>
              <output className={styles.area} aria-live="polite">
                {area > 0 ? nf(area) : '—'}
                <span className={styles.unit}>m²</span>
              </output>
            </div>
          </div>

          <div className={styles.options}>
            <fieldset className={styles.option}>
              <legend className="label opacity-60">Obloga</legend>
              <div className={styles.seg}>
                <button type="button" aria-pressed={cladding === 'single'} onClick={() => setCladding('single')}>Jednostruka</button>
                <button type="button" aria-pressed={cladding === 'double'} onClick={() => setCladding('double')}>Dvostruka</button>
              </div>
            </fieldset>
            <fieldset className={styles.option}>
              <legend className="label opacity-60">Kamena vuna</legend>
              <div className={styles.seg}>
                <button type="button" aria-pressed={wool} onClick={() => setWool(true)}>Sa vunom</button>
                <button type="button" aria-pressed={!wool} onClick={() => setWool(false)}>Bez vune</button>
              </div>
            </fieldset>
          </div>

          <section className={styles.result} aria-label="Potreban materijal">
            <div className={styles.resultHead}>
              <p className="label opacity-60">Potreban materijal</p>
              <p className="label opacity-60">Pakovanja</p>
            </div>
            {lines.length ? <MaterialList lines={lines} /> : <p className={styles.note}>Upišite dužinu i visinu zida u metrima.</p>}
            <p className={styles.note}>
              Orijentacioni proračun sa {Math.round(WASTE_DEFAULT * 100)} % rezerve. Količine i kompatibilnost proizvoda potvrđuje prodaja uz ponudu.
            </p>
            <div className={styles.actions}>
              <Cta onClick={addAll} solid>
                Dodaj cijeli projekat u upit
              </Cta>
              <Cta href="/upit-za-izvodjace">Opišite šta gradite</Cta>
            </div>
          </section>
        </div>

        <figure className={`m-0 ${styles.art}`}>
          <div className={styles.artWrap}>
            <div data-calc-art className={styles.artBox}>
              <UseArt use="pregradni-zid" title="Presjek pregradnog zida: ploče, metalni profili i kamena vuna" />
            </div>
            <div className={styles.photo}>
              <img src="/photos/drywall-frame.webp" alt="Metalna potkonstrukcija pregradnog zida prije oblaganja pločama" width={900} height={1125} loading="eager" decoding="async" />
            </div>
          </div>
          <figcaption className={styles.caption}>
            <span>Ploča · profil{wool ? ' · vuna' : ''}</span>
            <span>Debljina ≈ {wallThickness(cladding)} mm</span>
          </figcaption>

          <ol className={styles.how} aria-label="Kako računamo">
            {HOW.map((t, i) => (
              <li key={t} className={styles.howRow}>
                <span className={styles.howNum}>{String(i + 1).padStart(2, '0')}</span>
                <span className={styles.howText}>{t}</span>
              </li>
            ))}
          </ol>
        </figure>
      </div>
    </div>
  )
}
