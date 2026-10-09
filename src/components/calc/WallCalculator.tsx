'use client'

/* eslint-disable @next/next/no-img-element -- fotografije artikala iz /public/shop, već u WebP */

import { useMemo, useRef, useState } from 'react'
import Cta from '@/components/ui/Cta'
import { addToCart, notify, openCart } from '@/lib/cart'
import { PRODUCT_MAP, plural, shotOf } from '@/lib/shop'
import { gsap, useGSAP } from '@/lib/gsap'
import { MQ } from '@/lib/motion'
import { revealChars } from '@/lib/reveal'
import { NORMS, WASTE_DEFAULT, calcW111Area } from '@/lib/w111'
import Num from './Num'
import styles from './Calc.module.css'

// Kalkulator pregradnog zida (research 12.5), za kupca: lijevo mjere zida, desno lista artikala
// koje sam bira — uključi/isključi, izabere vrstu ploče i vune, i po želji promijeni količinu.
// Preporučene količine računa lib/w111 (orijentaciono, +5 % rezerve); prodaja ih potvrđuje.

const nf = (n: number, d = 2) => n.toLocaleString('de-DE', { maximumFractionDigits: d })
const clampDim = (n: number, min: number) => Math.min(30, Math.max(min, Math.round(n * 10) / 10))

type Dim = { key: 'len' | 'height'; label: string; min: number }
const DIMS: Dim[] = [
  { key: 'len', label: 'Dužina zida', min: 0.5 },
  { key: 'height', label: 'Visina zida', min: 1 },
]

type Variant = { sku: string; label: string }
type Row = {
  key: string
  units: [string, string, string]
  hint: string
  variants?: Variant[]
  /** uključeno na početku */
  on: boolean
}

// Redovi u redoslijedu ugradnje. Vrste su artikli iz kataloga sajta (demo šifre).
const ROWS: Row[] = [
  { key: 'cw', units: ['stub', 'stuba', 'stubova'], hint: 'Dužina 3 m, ide svakih 62,5 cm', on: true },
  { key: 'uw', units: ['vodilica', 'vodilice', 'vodilica'], hint: 'Za pod i plafon, dužina 4 m', on: true },
  {
    key: 'board',
    units: ['ploča', 'ploče', 'ploča'],
    hint: '1,25 × 2 m, debljina 12,5 mm',
    on: true,
    variants: [
      { sku: 'GKP-001', label: 'Obična (GKB)' },
      { sku: 'GKP-002', label: 'Za kupatilo (GKBI)' },
      { sku: 'GKP-003', label: 'Vatrootporna (GKF)' },
      { sku: 'GKP-004', label: 'Tvrda' },
    ],
  },
  {
    key: 'wool',
    units: ['ploča', 'ploče', 'ploča'],
    hint: 'Ide u zid, za zvučnu izolaciju',
    on: true,
    variants: [
      { sku: 'ISO-001', label: 'Kamena vuna 50 mm' },
      { sku: 'ISO-002', label: 'Kamena vuna 100 mm' },
    ],
  },
  { key: 'filler', units: ['vreća', 'vreće', 'vreća'], hint: 'Vreća 5 kg', on: true },
  { key: 'screws', units: ['kutija', 'kutije', 'kutija'], hint: '1.000 komada u kutiji', on: true },
  { key: 'tape', units: ['rolna', 'rolne', 'rolni'], hint: 'Rolna 25 m, po potrebi', on: false },
]

const NORM = Object.fromEntries(NORMS.map((n) => [n.key, n]))

/** `embedded`: ista tabla kao sekcija početne (h2, sidro #kalkulator, ulaz na skrol). */
export default function WallCalculator({ embedded = false }: { embedded?: boolean }) {
  const root = useRef<HTMLElement>(null)
  const [dims, setDims] = useState({ len: 4, height: 2.6 })
  const [text, setText] = useState({ len: '4', height: '2,6' })
  const [double, setDouble] = useState(false)
  const [on, setOn] = useState<Record<string, boolean>>(() => Object.fromEntries(ROWS.map((r) => [r.key, r.on])))
  const [variant, setVariant] = useState<Record<string, string>>({ board: 'GKP-001', wool: 'ISO-001' })
  // Ručno promijenjene količine; brišu se kad se promijeni zid, jer preporuka više ne važi.
  const [over, setOver] = useState<Record<string, number>>({})

  const area = Math.round(dims.len * dims.height * 100) / 100
  const rec = useMemo(() => {
    const lines = calcW111Area(area, double ? 'double' : 'single', variant.board, { wool: true, tape: true, waste: WASTE_DEFAULT })
    return Object.fromEntries(lines.map((l) => [l.key, l]))
  }, [area, double, variant.board])

  const qtyOf = (key: string) => over[key] ?? rec[key]?.packs ?? 0
  const skuOf = (key: string) => variant[key] ?? rec[key]?.sku ?? NORM[key].sku
  const chosen = ROWS.filter((r) => on[r.key] && qtyOf(r.key) > 0)

  const setDim = (key: Dim['key'], n: number) => {
    const d = DIMS.find((x) => x.key === key)!
    const v = clampDim(n, d.min)
    setDims((s) => ({ ...s, [key]: v }))
    setText((s) => ({ ...s, [key]: nf(v, 1) }))
    setOver({})
  }
  const typeDim = (key: Dim['key'], s: string) => {
    setText((t) => ({ ...t, [key]: s }))
    const n = parseFloat(s.replace(',', '.'))
    if (Number.isFinite(n) && n > 0) {
      setDims((d) => ({ ...d, [key]: Math.min(30, n) }))
      setOver({})
    }
  }
  const setQty = (key: string, n: number) => setOver((o) => ({ ...o, [key]: Math.max(0, Math.min(9999, Math.round(n))) }))

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
    if (!chosen.length) return
    chosen.forEach((r) => {
      const packs = qtyOf(r.key)
      // Ploče i vuna se u katalogu prodaju po m² (cijela pakovanja), ostalo po komadu / kutiji / vreći.
      const byArea = r.key === 'board' || r.key === 'wool'
      addToCart(skuOf(r.key), byArea ? Math.round(packs * NORM[r.key].pack * 100) / 100 : packs)
    })
    notify(`Zid ${nf(area)} m²: ${chosen.length} ${plural(chosen.length, 'artikal', 'artikla', 'artikala')} dodato u upit`, { label: 'Korpa', open: 'cart' })
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
          <p className={styles.sub}>Upišite mjere zida, pa izaberite materijal. Količine računamo mi, a vi ih možete promijeniti.</p>
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
                      <input id={`calc-${d.key}`} value={text[d.key]} onChange={(e) => typeDim(d.key, e.target.value)} onBlur={() => setDim(d.key, dims[d.key])} inputMode="decimal" />
                      <i>m</i>
                    </span>
                    <button type="button" onClick={() => setDim(d.key, dims[d.key] + 0.1)} aria-label={`${d.label}: više`}>
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={double}
                onChange={(e) => {
                  setDouble(e.target.checked)
                  setOver({})
                }}
              />
              <span className={styles.switch} aria-hidden />
              <span>
                <b>Dvije ploče sa svake strane</b>
                <i>Jači i tiši zid</i>
              </span>
            </label>

            <figure className={styles.blue}>
              <div className={styles.wallBox}>
                <div
                  className={styles.wall}
                  data-wool={on.wool || undefined}
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

          {/* ——— 2. Izaberite materijal ——— */}
          <div className={styles.result}>
            <p className={styles.step}>
              <b>2</b> Izaberite materijal
            </p>
            <ul className={styles.list}>
              {ROWS.map((r) => {
                const sku = skuOf(r.key)
                const p = PRODUCT_MAP[sku]
                const q = qtyOf(r.key)
                const recQ = rec[r.key]?.packs ?? 0
                const edited = over[r.key] !== undefined && over[r.key] !== recQ
                const active = on[r.key]
                return (
                  <li key={r.key} className={styles.item} data-off={!active || undefined}>
                    <label className={styles.check}>
                      <input type="checkbox" checked={active} onChange={(e) => setOn((s) => ({ ...s, [r.key]: e.target.checked }))} aria-label={`Uključi: ${p?.name ?? r.hint}`} />
                      <span aria-hidden />
                    </label>
                    <img src={shotOf(sku)} alt="" width={600} height={600} loading="lazy" decoding="async" />
                    <span className={styles.what}>
                      {r.variants ? (
                        <select value={sku} onChange={(e) => setVariant((v) => ({ ...v, [r.key]: e.target.value }))} disabled={!active} aria-label="Vrsta">
                          {r.variants.map((v) => (
                            <option key={v.sku} value={v.sku}>
                              {r.key === 'board' ? `Gips-kartonska ploča · ${v.label}` : v.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <b>{p?.name ?? NORM[r.key].label}</b>
                      )}
                      <i>
                        {r.hint}
                        {edited ? ` · preporuka ${recQ}` : ''}
                      </i>
                    </span>
                    <span className={styles.qtyBox}>
                      <button type="button" onClick={() => setQty(r.key, q - 1)} disabled={!active} aria-label="Manje">
                        −
                      </button>
                      <span className={styles.qty}>
                        <Num value={q} />
                        <em>{plural(q, ...r.units)}</em>
                      </span>
                      <button type="button" onClick={() => setQty(r.key, q + 1)} disabled={!active} aria-label="Više">
                        +
                      </button>
                    </span>
                  </li>
                )
              })}
            </ul>
            <div className={styles.cta}>
              <Cta onClick={addAll} solid>
                {`Dodaj izabrano u upit (${chosen.length})`}
              </Cta>
              <p className={styles.note}>Preporučena količina je okvirna, sa {Math.round(WASTE_DEFAULT * 100)} % viška za rezanje. Tačnu količinu i cijenu potvrđuje prodaja.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
