'use client'

/* eslint-disable @next/next/no-img-element -- fotografije artikala iz /public/shop, već u WebP */

import { useEffect, useMemo, useRef, useState } from 'react'
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

// Izbor materijala kao u web-prodavnici: kategorija, filter i pretraga, pa padajuća lista artikala.
type Cat = 'profili' | 'ploce' | 'izolacija' | 'pribor'
const CATS: { id: Cat; label: string }[] = [
  { id: 'profili', label: 'Profili' },
  { id: 'ploce', label: 'Ploče' },
  { id: 'izolacija', label: 'Izolacija' },
  { id: 'pribor', label: 'Spojevi i pribor' },
]
const CAT_OF: Record<string, Cat> = { cw: 'profili', uw: 'profili', board: 'ploce', wool: 'izolacija', filler: 'pribor', screws: 'pribor', tape: 'pribor' }
/** Bez ovih zid ne može; ostalo je po želji. */
const NEEDED = new Set(['cw', 'uw', 'board', 'filler', 'screws'])
type Need = 'sve' | 'potrebno' | 'dodatno'
const NEEDS: { id: Need; label: string }[] = [
  { id: 'sve', label: 'Svi artikli' },
  { id: 'potrebno', label: 'Potrebno za zid' },
  { id: 'dodatno', label: 'Dodatno' },
]
// Svaka vrsta (npr. četiri ploče) je zaseban artikal u listi; u spisku može biti jedna po redu.
const CHOICES = ROWS.flatMap((r) => (r.variants ?? [{ sku: NORM[r.key].sku, label: '' }]).map((v) => ({ key: r.key, sku: v.sku, cat: CAT_OF[r.key] })))
const nameOf = (sku: string, key: string) => PRODUCT_MAP[sku]?.name ?? NORM[key].label
const norm = (t: string) => t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'dj')

/** `embedded`: ista tabla kao sekcija početne (h2, sidro #kalkulator, ulaz na skrol). */
export default function WallCalculator({ embedded = false }: { embedded?: boolean }) {
  const root = useRef<HTMLElement>(null)
  const [dims, setDims] = useState({ len: 4, height: 2.6 })
  const [text, setText] = useState({ len: '4', height: '2,6' })
  const [double, setDouble] = useState(false)
  const [on, setOn] = useState<Record<string, boolean>>({})
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
  const chosenRows = ROWS.filter((r) => on[r.key])
  const chosen = chosenRows.filter((r) => qtyOf(r.key) > 0)

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
  // Izbor materijala: kategorija + filter + pretraga otvaraju padajuću listu artikala.
  const [query, setQuery] = useState('')
  const [cat, setCat] = useState<Cat | 'sve'>('sve')
  const [need, setNeed] = useState<Need>('sve')
  const [openList, setOpenList] = useState(false)
  const picker = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const close = (e: MouseEvent) => !picker.current?.contains(e.target as Node) && setOpenList(false)
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])
  const words = norm(query).split(/\s+/).filter(Boolean)
  const options = CHOICES.filter(
    (c) =>
      (cat === 'sve' || c.cat === cat) &&
      (need === 'sve' || (need === 'potrebno') === NEEDED.has(c.key)) &&
      words.every((w) => norm(`${c.sku} ${nameOf(c.sku, c.key)} ${PRODUCT_MAP[c.sku]?.spec ?? ''}`).includes(w)),
  )
  const inList = (c: (typeof CHOICES)[number]) => !!on[c.key] && skuOf(c.key) === c.sku
  const pick = (c: (typeof CHOICES)[number]) => {
    if (ROWS.find((r) => r.key === c.key)?.variants) setVariant((v) => ({ ...v, [c.key]: c.sku }))
    setOn((st) => ({ ...st, [c.key]: true }))
    setQuery('')
  }
  const addNeeded = () => setOn((st) => ({ ...st, ...Object.fromEntries([...NEEDED].map((k) => [k, true])) }))
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

  // Crtež prati spisak: crta se samo ono što je dodato, u količini koja piše u spisku.
  const onWall = (key: string) => !!on[key] && qtyOf(key) > 0
  const studs = onWall('cw') ? Math.min(qtyOf('cw'), 60) : 0
  // Stubovi ravnomjerno po dužini; jedan stub stoji na sredini.
  const studX = Array.from({ length: studs }, (_, i) => (studs === 1 ? 50 : (i / (studs - 1)) * 100))
  // Spojevi ploča: ploča je široka 1,25 m, pa spoj ide na svakih 1,25 m dužine.
  const seams = onWall('board') ? Array.from({ length: Math.max(0, Math.ceil(dims.len / 1.25) - 1) }, (_, i) => (((i + 1) * 1.25) / dims.len) * 100) : []
  const drawn = ROWS.filter((r) => onWall(r.key) && ['cw', 'uw', 'board', 'wool'].includes(r.key)).map(
    (r) => `${qtyOf(r.key)} ${plural(qtyOf(r.key), ...r.units)}${r.key === 'wool' ? ' vune' : ''}`,
  )

  return (
    <section ref={root} id={embedded ? 'kalkulator' : undefined} aria-labelledby="calc-title" className={styles.page}>
      <div className={styles.card}>
        <header className={styles.head}>
          <p className={`label ${styles.kicker}`}>Kalkulator · pregradni zid</p>
          <Heading id="calc-title" data-head className={`display invisible ${styles.title}`}>
            Koliko materijala vam treba?
          </Heading>
          <p className={styles.sub}>Mjere zida, pa materijal. Količine računamo mi.</p>
        </header>

        <div className={styles.body}>
          {/* ——— 1. Vaš zid ——— */}
          <div className={styles.input}>
            <p className={styles.step}>Vaš zid</p>
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
                  data-wool={onWall('wool') || undefined}
                  data-boards={onWall('board') || undefined}
                  data-double={(onWall('board') && double) || undefined}
                  style={{ width: `${wPct}%`, height: `${hPct}%` }}
                >
                  {onWall('uw') && (
                    <>
                      <i className={`${styles.track} ${styles.trackTop}`} aria-hidden />
                      <i className={`${styles.track} ${styles.trackBottom}`} aria-hidden />
                    </>
                  )}
                  {seams.map((x) => (
                    <i key={`s${x}`} className={styles.seam} style={{ left: `${x}%` }} aria-hidden />
                  ))}
                  {studX.map((x, i) => (
                    <i key={`c${i}`} className={styles.stud} style={{ left: `${x}%` }} aria-hidden />
                  ))}
                  <span className={styles.wallW}>{nf(dims.len, 1)} m</span>
                  <span className={styles.wallH}>{nf(dims.height, 1)} m</span>
                </div>
              </div>
              <p className={styles.drawn} aria-live="polite">
                {drawn.length ? `Na crtežu: ${drawn.join(' · ')}` : 'Dodajte materijal u spisak, pa se pojavi na crtežu.'}
              </p>
              <figcaption className={styles.area}>
                <span className="label">Površina zida</span>
                <b>
                  <Num value={area} decimals={2} /> m²
                </b>
              </figcaption>
            </figure>
          </div>

          {/* ——— 2. Materijal ——— */}
          <div className={styles.result}>
            <p className={styles.step}>Materijal</p>
            <div ref={picker} className={styles.picker}>
              <div className={styles.cats} role="group" aria-label="Kategorija">
                {[{ id: 'sve' as const, label: 'Sve' }, ...CATS].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    aria-pressed={cat === c.id}
                    onClick={() => {
                      setCat(c.id)
                      setOpenList(true)
                    }}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
              <div className={styles.bar}>
                <label className={styles.search}>
                  <svg viewBox="0 0 16 16" aria-hidden>
                    <path d="M7 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM10.6 10.6l3.9 3.9" fill="none" stroke="currentColor" strokeWidth="1.4" />
                  </svg>
                  <input
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value)
                      setOpenList(true)
                    }}
                    onFocus={() => setOpenList(true)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && options[0]) {
                        e.preventDefault()
                        pick(options[0])
                      }
                      if (e.key === 'Escape') setOpenList(false)
                    }}
                    placeholder="Traži po nazivu ili šifri"
                    aria-label="Traži materijal"
                    aria-expanded={openList}
                    role="combobox"
                    aria-controls="calc-options"
                  />
                </label>
                <select className={styles.filter} value={need} onChange={(e) => (setNeed(e.target.value as Need), setOpenList(true))} aria-label="Filter">
                  {NEEDS.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.label}
                    </option>
                  ))}
                </select>
              </div>
              {openList && (
                <div className={styles.drop}>
                  <p className={styles.dropHead}>
                    <span>
                      {options.length} {plural(options.length, 'artikal', 'artikla', 'artikala')}
                    </span>
                    <button type="button" onClick={() => setOpenList(false)}>
                      Zatvori
                    </button>
                  </p>
                  <ul id="calc-options" role="listbox" className={styles.options}>
                    {options.length === 0 && <li className={styles.optEmpty}>Nema artikala za ovaj izbor.</li>}
                    {options.map((c) => {
                      const added = inList(c)
                      const swap = !added && !!on[c.key]
                      return (
                        <li key={c.sku} role="option" aria-selected={added}>
                          <button type="button" disabled={added} onClick={() => pick(c)}>
                            <img src={shotOf(c.sku)} alt="" width={600} height={600} loading="lazy" decoding="async" />
                            <span>
                              <b>{nameOf(c.sku, c.key)}</b>
                              <i>
                                {c.sku} · {CATS.find((x) => x.id === c.cat)!.label}
                              </i>
                            </span>
                            <em>{added ? 'U spisku' : swap ? 'Zamijeni' : 'Dodaj'}</em>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}
            </div>

            <div className={styles.sheet}>
              <p className={styles.sheetHead}>
                <span>Vaš spisak</span>
                <span>Količina</span>
              </p>
              {chosenRows.length === 0 ? (
                <div className={styles.sheetEmpty}>
                  <p>Izaberite artikle iz liste iznad.</p>
                  <button type="button" onClick={addNeeded}>
                    Dodaj sve potrebno za zid
                  </button>
                </div>
              ) : (
                CATS.filter((c) => chosenRows.some((r) => CAT_OF[r.key] === c.id)).map((c) => (
                  <div key={c.id} className={styles.group}>
                    <p className={styles.groupName}>{c.label}</p>
                    {chosenRows
                      .filter((r) => CAT_OF[r.key] === c.id)
                      .map((r) => {
                        const sku = skuOf(r.key)
                        const q = qtyOf(r.key)
                        const name = nameOf(sku, r.key)
                        return (
                          <div key={r.key} className={styles.line}>
                            <span className={styles.what}>
                              <b>{name}</b>
                              <i>
                                {sku} · {r.hint}
                              </i>
                            </span>
                            <span className={styles.qtyBox}>
                              <button type="button" onClick={() => setQty(r.key, q - 1)} aria-label={`${name}: manje`}>
                                −
                              </button>
                              <span className={styles.qty}>
                                {q} {plural(q, ...r.units)}
                              </span>
                              <button type="button" onClick={() => setQty(r.key, q + 1)} aria-label={`${name}: više`}>
                                +
                              </button>
                            </span>
                            <button type="button" className={styles.remove} onClick={() => setOn((st) => ({ ...st, [r.key]: false }))} aria-label={`Ukloni: ${name}`}>
                              ×
                            </button>
                          </div>
                        )
                      })}
                  </div>
                ))
              )}
            </div>
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
