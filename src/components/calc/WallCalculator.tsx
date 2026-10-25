'use client'

/* eslint-disable @next/next/no-img-element -- fotografije artikala iz /public/shop, već u WebP */

import { useEffect, useMemo, useRef, useState } from 'react'
import Cta from '@/components/ui/Cta'
import { addToCart, notify, openCart } from '@/lib/cart'
import { PRODUCT_MAP, pName, plural, shotOf } from '@/lib/shop'
import { useLang } from '@/lib/i18n'
import { gsap, useGSAP } from '@/lib/gsap'
import { MQ } from '@/lib/motion'
import { revealChars } from '@/lib/reveal'
import { NORMS, WASTE_DEFAULT, calcW111Area } from '@/lib/w111'
import Num from './Num'
import styles from './Calc.module.css'

// Kalkulator pregradnog zida (research 12.5), za kupca: lijevo mjere zida, desno lista artikala
// koje sam bira — uključi/isključi, izabere vrstu ploče i vune, i po želji promijeni količinu.
// Preporučene količine računa lib/w111 (orijentaciono, +5 % rezerve); prodaja ih potvrđuje.

const nfL = (n: number, d = 2, lang: 'sr' | 'en' = 'sr') => n.toLocaleString(lang === 'en' ? 'en-US' : 'de-DE', { maximumFractionDigits: d })
const clampDim = (n: number, min: number) => Math.min(30, Math.max(min, Math.round(n * 10) / 10))

type Dim = { key: 'len' | 'height'; label: string; en: string; min: number }
const DIMS: Dim[] = [
  { key: 'len', label: 'Dužina zida', en: 'Wall length', min: 0.5 },
  { key: 'height', label: 'Visina zida', en: 'Wall height', min: 1 },
]

type Variant = { sku: string; label: string; en: string }
type Row = {
  key: string
  units: [string, string, string]
  hint: string
  hintEn: string
  /** jednina i množina na engleskom */
  unitsEn: [string, string]
  variants?: Variant[]
  /** uključeno na početku */
  on: boolean
}

// Redovi u redoslijedu ugradnje. Vrste su artikli iz kataloga sajta (demo šifre).
const ROWS: Row[] = [
  { key: 'cw', units: ['stub', 'stuba', 'stubova'], unitsEn: ['stud', 'studs'], hint: 'Dužina 3 m, ide svakih 62,5 cm', hintEn: '3 m long, one every 62.5 cm', on: true },
  { key: 'uw', units: ['vodilica', 'vodilice', 'vodilica'], unitsEn: ['track', 'tracks'], hint: 'Za pod i plafon, dužina 4 m', hintEn: 'For the floor and ceiling, 4 m long', on: true },
  {
    key: 'board',
    units: ['ploča', 'ploče', 'ploča'],
    unitsEn: ['board', 'boards'],
    hint: '1,25 × 2 m, debljina 12,5 mm',
    hintEn: '1.25 × 2 m, 12.5 mm thick',
    on: true,
    variants: [
      { sku: 'GKP-001', label: 'Obična (GKB)', en: 'Standard (GKB)' },
      { sku: 'GKP-002', label: 'Za kupatilo (GKBI)', en: 'Bathroom (GKBI)' },
      { sku: 'GKP-003', label: 'Vatrootporna (GKF)', en: 'Fire-rated (GKF)' },
      { sku: 'GKP-004', label: 'Tvrda', en: 'Hard' },
    ],
  },
  {
    key: 'wool',
    units: ['ploča', 'ploče', 'ploča'],
    unitsEn: ['slab', 'slabs'],
    hint: 'Ide u zid, za zvučnu izolaciju',
    hintEn: 'Goes inside the wall, for sound insulation',
    on: true,
    variants: [
      { sku: 'ISO-001', label: 'Kamena vuna 50 mm', en: 'Stone wool 50 mm' },
      { sku: 'ISO-002', label: 'Kamena vuna 100 mm', en: 'Stone wool 100 mm' },
    ],
  },
  { key: 'filler', units: ['vreća', 'vreće', 'vreća'], unitsEn: ['bag', 'bags'], hint: 'Vreća 5 kg', hintEn: '5 kg bag', on: true },
  { key: 'screws', units: ['kutija', 'kutije', 'kutija'], unitsEn: ['box', 'boxes'], hint: '1.000 komada u kutiji', hintEn: '1,000 pieces per box', on: true },
  { key: 'tape', units: ['rolna', 'rolne', 'rolni'], unitsEn: ['roll', 'rolls'], hint: 'Rolna 25 m, po potrebi', hintEn: '25 m roll, as needed', on: false },
]

const NORM = Object.fromEntries(NORMS.map((n) => [n.key, n]))

// Izbor materijala kao u web-prodavnici: kategorija, filter i pretraga, pa padajuća lista artikala.
type Cat = 'profili' | 'ploce' | 'izolacija' | 'pribor'
const CATS: { id: Cat; label: string; en: string }[] = [
  { id: 'profili', label: 'Profili', en: 'Profiles' },
  { id: 'ploce', label: 'Ploče', en: 'Boards' },
  { id: 'izolacija', label: 'Izolacija', en: 'Insulation' },
  { id: 'pribor', label: 'Spojevi i pribor', en: 'Joints and accessories' },
]
const CAT_OF: Record<string, Cat> = { cw: 'profili', uw: 'profili', board: 'ploce', wool: 'izolacija', filler: 'pribor', screws: 'pribor', tape: 'pribor' }
/** Bez ovih zid ne može; ostalo je po želji. */
const NEEDED = new Set(['cw', 'uw', 'board', 'filler', 'screws'])
type Need = 'sve' | 'potrebno' | 'dodatno'
const NEEDS: { id: Need; label: string; en: string }[] = [
  { id: 'sve', label: 'Svi artikli', en: 'All items' },
  { id: 'potrebno', label: 'Potrebno za zid', en: 'Needed for the wall' },
  { id: 'dodatno', label: 'Dodatno', en: 'Extras' },
]
// Svaka vrsta (npr. četiri ploče) je zaseban artikal u listi; u spisku može biti jedna po redu.
const CHOICES = ROWS.flatMap((r) => (r.variants ?? [{ sku: NORM[r.key].sku, label: '' }]).map((v) => ({ key: r.key, sku: v.sku, cat: CAT_OF[r.key] })))
const nameOf = (sku: string, key: string, lang: 'sr' | 'en' = 'sr') =>
  PRODUCT_MAP[sku] ? pName(PRODUCT_MAP[sku], lang) : lang === 'en' ? NORM[key].labelEn : NORM[key].label
const norm = (t: string) => t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'dj')

/** `embedded`: ista tabla kao sekcija početne (h2, sidro #kalkulator, ulaz na skrol). */
export default function WallCalculator({ embedded = false }: { embedded?: boolean }) {
  const { t, lang } = useLang()
  const en = lang === 'en'
  const nf = (n: number, d = 2) => nfL(n, d, lang)
  // Naziv jedinice u ispravnom broju i jeziku
  const pl = (n: number, r: Row) => (en ? (n === 1 ? r.unitsEn[0] : r.unitsEn[1]) : plural(n, ...r.units))
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

  // Decimalni zarez / tačka u poljima mjera prati jezik.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- tekst polja se osvježava pri promjeni jezika
    setText({ len: nfL(dims.len, 1, lang), height: nfL(dims.height, 1, lang) })
    // eslint-disable-next-line react-hooks/exhaustive-deps -- samo pri promjeni jezika
  }, [lang])

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
      words.every((w) => norm(`${c.sku} ${nameOf(c.sku, c.key)} ${nameOf(c.sku, c.key, 'en')} ${PRODUCT_MAP[c.sku]?.spec ?? ''}`).includes(w)),
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
    // Naslov se dijeli (SplitText) jednom po jeziku: element se remontira (key), pa se podjela ponovi.
    { scope: root, dependencies: [lang], revertOnUpdate: true },
  )

  const addAll = () => {
    if (!chosen.length) return
    chosen.forEach((r) => {
      const packs = qtyOf(r.key)
      // Ploče i vuna se u katalogu prodaju po m² (cijela pakovanja), ostalo po komadu / kutiji / vreći.
      const byArea = r.key === 'board' || r.key === 'wool'
      addToCart(skuOf(r.key), byArea ? Math.round(packs * NORM[r.key].pack * 100) / 100 : packs)
    })
    notify(
      en
        ? `Wall ${nf(area)} m²: ${chosen.length} ${chosen.length === 1 ? 'item' : 'items'} added to enquiry`
        : `Zid ${nf(area)} m²: ${chosen.length} ${plural(chosen.length, 'artikal', 'artikla', 'artikala')} dodato u upit`,
      { label: en ? 'Basket' : 'Korpa', open: 'cart' },
    )
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
    (r) => (en ? `${qtyOf(r.key)} ${r.key === 'wool' ? 'wool ' : ''}${pl(qtyOf(r.key), r)}` : `${qtyOf(r.key)} ${pl(qtyOf(r.key), r)}${r.key === 'wool' ? ' vune' : ''}`),
  )

  return (
    <section ref={root} id={embedded ? 'kalkulator' : undefined} aria-labelledby="calc-title" className={styles.page}>
      <div className={styles.card}>
        <header className={styles.head}>
          <p className={`label ${styles.kicker}`}>{t('Kalkulator · pregradni zid', 'Calculator · partition wall')}</p>
          <Heading key={`h-${lang}`} id="calc-title" data-head className={`display invisible ${styles.title}`}>
            {t('Koliko materijala vam treba?', 'How much material do you need?')}
          </Heading>
          <p className={styles.sub}>{t('Mjere zida, pa materijal. Količine računamo mi.', 'Wall dimensions first, then material. We work out the quantities.')}</p>
        </header>

        <div className={styles.body}>
          {/* ——— 1. Vaš zid ——— */}
          <div className={styles.input}>
            <p className={styles.step}>{t('Vaš zid', 'Your wall')}</p>
            <div className={styles.dims}>
              {DIMS.map((d) => (
                <div key={d.key} className={styles.dim}>
                  <label htmlFor={`calc-${d.key}`} className={styles.dimLabel}>
                    {en ? d.en : d.label}
                  </label>
                  <div className={styles.stepper}>
                    <button type="button" onClick={() => setDim(d.key, dims[d.key] - 0.1)} aria-label={`${en ? d.en : d.label}: ${t('manje', 'less')}`}>
                      −
                    </button>
                    <span className={styles.field}>
                      <input id={`calc-${d.key}`} value={text[d.key]} onChange={(e) => typeDim(d.key, e.target.value)} onBlur={() => setDim(d.key, dims[d.key])} inputMode="decimal" />
                      <i>m</i>
                    </span>
                    <button type="button" onClick={() => setDim(d.key, dims[d.key] + 0.1)} aria-label={`${en ? d.en : d.label}: ${t('više', 'more')}`}>
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
                <b>{t('Dvije ploče sa svake strane', 'Two boards on each side')}</b>
                <i>{t('Jači i tiši zid', 'A stronger, quieter wall')}</i>
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
                {drawn.length ? `${t('Na crtežu', 'In the drawing')}: ${drawn.join(' · ')}` : t('Dodajte materijal u spisak, pa se pojavi na crtežu.', 'Add material to the list and it will appear in the drawing.')}
              </p>
              <figcaption className={styles.area}>
                <span className="label">{t('Površina zida', 'Wall area')}</span>
                <b>
                  <Num value={area} decimals={2} /> m²
                </b>
              </figcaption>
            </figure>
          </div>

          {/* ——— 2. Materijal ——— */}
          <div className={styles.result}>
            <p className={styles.step}>{t('Materijal', 'Material')}</p>
            <div ref={picker} className={styles.picker}>
              <div className={styles.cats} role="group" aria-label={t('Kategorija', 'Category')}>
                {[{ id: 'sve' as const, label: 'Sve', en: 'All' }, ...CATS].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    aria-pressed={cat === c.id}
                    onClick={() => {
                      setCat(c.id)
                      setOpenList(true)
                    }}
                  >
                    {en ? c.en : c.label}
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
                    placeholder={t('Traži po nazivu ili šifri', 'Search by name or code')}
                    aria-label={t('Traži materijal', 'Search material')}
                    aria-expanded={openList}
                    role="combobox"
                    aria-controls="calc-options"
                  />
                </label>
                <select className={styles.filter} value={need} onChange={(e) => (setNeed(e.target.value as Need), setOpenList(true))} aria-label={t('Filter', 'Filter')}>
                  {NEEDS.map((n) => (
                    <option key={n.id} value={n.id}>
                      {en ? n.en : n.label}
                    </option>
                  ))}
                </select>
              </div>
              {openList && (
                <div className={styles.drop}>
                  <p className={styles.dropHead}>
                    <span>
                      {options.length} {en ? (options.length === 1 ? 'item' : 'items') : plural(options.length, 'artikal', 'artikla', 'artikala')}
                    </span>
                    <button type="button" onClick={() => setOpenList(false)}>
                      {t('Zatvori', 'Close')}
                    </button>
                  </p>
                  <ul id="calc-options" role="listbox" className={styles.options}>
                    {options.length === 0 && <li className={styles.optEmpty}>{t('Nema artikala za ovaj izbor.', 'No items for this selection.')}</li>}
                    {options.map((c) => {
                      const added = inList(c)
                      const swap = !added && !!on[c.key]
                      return (
                        <li key={c.sku} role="option" aria-selected={added}>
                          <button type="button" disabled={added} onClick={() => pick(c)}>
                            <img src={shotOf(c.sku)} alt="" width={600} height={600} loading="lazy" decoding="async" />
                            <span>
                              <b>{nameOf(c.sku, c.key, lang)}</b>
                              <i>
                                {c.sku} · {en ? CATS.find((x) => x.id === c.cat)!.en : CATS.find((x) => x.id === c.cat)!.label}
                              </i>
                            </span>
                            <em>{added ? t('U spisku', 'In list') : swap ? t('Zamijeni', 'Replace') : t('Dodaj', 'Add')}</em>
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
                <span>{t('Vaš spisak', 'Your list')}</span>
                <span>{t('Količina', 'Quantity')}</span>
              </p>
              {chosenRows.length === 0 ? (
                <div className={styles.sheetEmpty}>
                  <p>{t('Izaberite artikle iz liste iznad.', 'Choose items from the list above.')}</p>
                  <button type="button" onClick={addNeeded}>
                    {t('Dodaj sve potrebno za zid', 'Add everything needed for the wall')}
                  </button>
                </div>
              ) : (
                CATS.filter((c) => chosenRows.some((r) => CAT_OF[r.key] === c.id)).map((c) => (
                  <div key={c.id} className={styles.group}>
                    <p className={styles.groupName}>{en ? c.en : c.label}</p>
                    {chosenRows
                      .filter((r) => CAT_OF[r.key] === c.id)
                      .map((r) => {
                        const sku = skuOf(r.key)
                        const q = qtyOf(r.key)
                        const name = nameOf(sku, r.key, lang)
                        return (
                          <div key={r.key} className={styles.line}>
                            <span className={styles.what}>
                              <b>{name}</b>
                              <i>
                                {sku} · {en ? r.hintEn : r.hint}
                              </i>
                            </span>
                            <span className={styles.qtyBox}>
                              <button type="button" onClick={() => setQty(r.key, q - 1)} aria-label={`${name}: ${t('manje', 'less')}`}>
                                −
                              </button>
                              <span className={styles.qty}>
                                {q} {pl(q, r)}
                              </span>
                              <button type="button" onClick={() => setQty(r.key, q + 1)} aria-label={`${name}: ${t('više', 'more')}`}>
                                +
                              </button>
                            </span>
                            <button type="button" className={styles.remove} onClick={() => setOn((st) => ({ ...st, [r.key]: false }))} aria-label={`${t('Ukloni', 'Remove')}: ${name}`}>
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
                {t(`Dodaj izabrano u upit (${chosen.length})`, `Add selected to enquiry (${chosen.length})`)}
              </Cta>
              <p className={styles.note}>{t(`Preporučena količina je okvirna, sa ${Math.round(WASTE_DEFAULT * 100)} % viška za rezanje. Tačnu količinu i cijenu potvrđuje prodaja.`, `The recommended quantity is indicative, with ${Math.round(WASTE_DEFAULT * 100)}% extra for cutting. Sales confirms the exact quantity and price.`)}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
