'use client'

/* eslint-disable @next/next/no-img-element -- fotografije artikala i SVG logotipi iz /public */
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { inquiryHref, inquiryLines, toggleInquiryItem, useCatalogInquiry } from '@/lib/catalog-inquiry'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap'
import { BRANDS, CATALOG_ITEMS, CATEGORY_NAMES, inquiryFormHref, normalize, type BrandId, type CatalogItem } from './catalog-items'
import styles from './CatalogBrowse.module.css'

// Katalog po proizvođačima, UI i UX preuzet sa mtponos.studioblink.ba/asortiman/laminati:
// centriran naslov, ljepljiva traka (pretraga, FILTERI, SORTIRAJ, broj artikala), čipovi proizvođača sa
// brojem, panel filtera u kolonama, pa blok po proizvođaču ("01 / 04", tamnoplavi logo, naziv, opis, broj)
// i prozračna mreža kvadratnih fotografija. Hover kartice: Uporedi, brzi pregled, + u upit, "Pogledaj".
// Stanje filtera je u adresi (?brend=, ?kategorija=, ?q=, ?sortiranje=), pa se linkovi sa početne
// (kartice proizvođača) i iz trake kategorija iznad otvaraju već filtrirani.

type Sort = 'preporuceno' | 'naziv' | 'naziv-obrnuto' | 'izdvojeno'
const SORTS: [Sort, string][] = [
  ['preporuceno', 'Preporučeno'],
  ['naziv', 'Naziv A–Ž'],
  ['naziv-obrnuto', 'Naziv Ž–A'],
  ['izdvojeno', 'Prvo izdvojeno'],
]
const BRAND_IDS = BRANDS.map((b) => b.id)
const count = (n: number) => `${n} ${n % 10 === 1 && n % 100 !== 11 ? 'artikal' : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? 'artikla' : 'artikala'}`

// Vrijednosti za panel filtera, svaka sa brojem artikala (kao na mtponos).
function facet(items: CatalogItem[], pick: (i: CatalogItem) => string[]) {
  const m = new Map<string, number>()
  items.forEach((i) => pick(i).forEach((v) => m.set(v, (m.get(v) ?? 0) + 1)))
  return [...m.entries()].sort((a, b) => a[0].localeCompare(b[0], 'bs'))
}

const Eye = () => (
  <svg viewBox="0 0 20 20" aria-hidden fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path d="M1.5 10S4.8 4 10 4s8.5 6 8.5 6-3.3 6-8.5 6-8.5-6-8.5-6Z" />
    <circle cx="10" cy="10" r="2.6" />
  </svg>
)

export default function CatalogBrowse() {
  const root = useRef<HTMLElement>(null)
  const search = useSearchParams()
  const selection = useCatalogInquiry()
  const picked = inquiryLines(selection).length

  const initBrand = search.get('brend')
  const [brand, setBrand] = useState<BrandId | 'sve'>(BRAND_IDS.includes(initBrand as BrandId) ? (initBrand as BrandId) : 'sve')
  const [q, setQ] = useState(search.get('q') ?? '')
  const initSort = search.get('sortiranje') as Sort
  const [sort, setSort] = useState<Sort>(SORTS.some(([s]) => s === initSort) ? initSort : 'preporuceno')
  const [cats, setCats] = useState<string[]>(() => (search.get('kategorija') ?? '').split(',').filter((c) => c in CATEGORY_NAMES))
  const [units, setUnits] = useState<string[]>([])
  const [uses, setUses] = useState<string[]>([])
  const [featuredOnly, setFeaturedOnly] = useState(false)
  const [panel, setPanel] = useState(cats.length > 0)
  const [compare, setCompare] = useState<string[]>([])
  const [compareOpen, setCompareOpen] = useState(false)
  const [quick, setQuick] = useState<CatalogItem | null>(null)

  // Adresa prati filtere (bez novog unosa u istoriji), da se link može podijeliti.
  useEffect(() => {
    const next = new URLSearchParams(window.location.search)
    const set = (k: string, v: string) => (v ? next.set(k, v) : next.delete(k))
    set('brend', brand === 'sve' ? '' : brand)
    set('kategorija', cats.join(','))
    set('q', q.trim())
    set('sortiranje', sort === 'preporuceno' ? '' : sort)
    next.delete('namjena')
    const url = `${window.location.pathname}${next.size ? `?${next}` : ''}${window.location.hash}`
    window.history.replaceState(window.history.state, '', url)
  }, [brand, cats, q, sort])

  // Kad stranica dođe sa #artikli (kartice sa početne, traka kategorija), skrol na katalog tek kad
  // zakačena sekcija iznad izračuna svoju visinu, inače bi skok završio usred animacije.
  useEffect(() => {
    if (window.location.hash !== '#artikli') return
    // Visina zakačene sekcije iznad se mijenja dok se slike i pin mjere: ponavlja se dok se cilj ne smiri.
    let last = -1
    let calm = 0
    let tries = 0
    const id = window.setInterval(() => {
      const el = document.getElementById('artikli')
      if (!el) return
      if (tries === 1) ScrollTrigger.refresh()
      const y = Math.round(el.getBoundingClientRect().top + window.scrollY - 70)
      if (window.__gcLenis) window.__gcLenis.scrollTo(y, { immediate: true, force: true })
      else window.scrollTo(0, y)
      calm = Math.abs(y - last) < 2 ? calm + 1 : 0
      last = y
      if (++tries > 30 || (calm >= 3 && tries > 6)) window.clearInterval(id)
    }, 160)
    return () => window.clearInterval(id)
  }, [])

  // Bez filtera proizvođača: osnova za brojeve na čipovima proizvođača.
  const base = useMemo(() => {
    const words = normalize(q).split(/\s+/).filter(Boolean)
    return CATALOG_ITEMS.filter(
        (i) =>
          (cats.length === 0 || cats.includes(i.category)) &&
          (units.length === 0 || units.includes(i.unit)) &&
          (uses.length === 0 || i.uses.some((u) => uses.includes(u))) &&
          (!featuredOnly || i.featured) &&
          words.every((w) => normalize(`${i.name} ${i.code} ${i.spec} ${i.brandName} ${i.lead} ${CATEGORY_NAMES[i.category] ?? ''}`).includes(w)),
    )
  }, [cats, units, uses, featuredOnly, q])
  const visible = useMemo(() => {
    const list = base.filter((i) => brand === 'sve' || i.brand === brand)
    if (sort === 'naziv') list.sort((a, b) => a.code.localeCompare(b.code, 'bs'))
    if (sort === 'naziv-obrnuto') list.sort((a, b) => b.code.localeCompare(a.code, 'bs'))
    if (sort === 'izdvojeno') list.sort((a, b) => Number(b.featured) - Number(a.featured))
    return list
  }, [base, brand, sort])
  const groups = BRANDS.map((b) => ({ brand: b, items: visible.filter((i) => i.brand === b.id) })).filter((g) => g.items.length > 0)
  const filtered = brand !== 'sve' || cats.length > 0 || units.length > 0 || uses.length > 0 || featuredOnly || !!q.trim()

  const reset = () => {
    setBrand('sve')
    setCats([])
    setUnits([])
    setUses([])
    setFeaturedOnly(false)
    setQ('')
  }
  const toggle = (list: string[], set: (v: string[]) => void, v: string) => set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v])
  const toggleCompare = (key: string) =>
    setCompare((c) => (c.includes(key) ? c.filter((k) => k !== key) : c.length >= 4 ? c : [...c, key]))

  // Animacija: blokovi proizvođača i kartice ulaze odozdo dok se skroluje; poslije promjene filtera
  // ponovo se izmjere pozicije (visina kataloga se mijenja).
  useGSAP(
    () => {
      const el = root.current!
      gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from(el.querySelectorAll('[data-intro] > *'), { y: 40, autoAlpha: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08, scrollTrigger: { trigger: el, start: 'top 80%' } })
        el.querySelectorAll<HTMLElement>('[data-brand-head]').forEach((head) => {
          gsap.from(head.querySelectorAll('[data-lift]'), { y: 50, autoAlpha: 0, duration: 0.9, ease: 'power3.out', stagger: 0.07, scrollTrigger: { trigger: head, start: 'top 85%' } })
        })
        ScrollTrigger.batch(el.querySelectorAll('[data-item]'), {
          start: 'top 92%',
          once: true,
          onEnter: (batch) => gsap.fromTo(batch, { y: 46, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, ease: 'power3.out', stagger: 0.06, overwrite: true }),
        })
      })
      ScrollTrigger.refresh()
    },
    { scope: root, dependencies: [visible.map((i) => i.key).join('|')], revertOnUpdate: true },
  )

  // Esc zatvara brzi pregled i poređenje.
  useEffect(() => {
    if (!quick && !compareOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setQuick(null)
        setCompareOpen(false)
      }
    }
    window.__gcLenis?.stop?.()
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.__gcLenis?.start?.()
    }
  }, [quick, compareOpen])

  const compared = compare.map((k) => CATALOG_ITEMS.find((i) => i.key === k)!).filter(Boolean)

  const chip = (label: string, n: number, on: boolean, onClick: () => void, key?: string) => (
    <button key={key ?? label} type="button" className={styles.chip} aria-pressed={on} onClick={onClick}>
      {label}
      <sup>{n}</sup>
    </button>
  )

  const addButton = (item: CatalogItem, big = false) => {
    const on = !!(item.product && selection[item.product.sku])
    const cls = big ? styles.addBig : styles.add
    if (item.product) {
      const p = item.product
      return (
        <button type="button" className={cls} aria-pressed={on} aria-label={`${on ? 'Ukloni iz upita' : 'Dodaj u upit'}: ${item.name}`} onClick={() => toggleInquiryItem(p)}>
          <span aria-hidden>{on ? '✓' : '+'}</span>
          <em>{on ? 'U upitu' : 'Dodaj u upit'}</em>
        </button>
      )
    }
    return (
      <Link href={inquiryFormHref(item)} className={cls} aria-label={`Dodaj u upit: ${item.name}`}>
        <span aria-hidden>+</span>
        <em>Dodaj u upit</em>
      </Link>
    )
  }

  return (
    <section ref={root} id="artikli" aria-labelledby="artikli-naslov" className={styles.root}>
      <header data-intro className={styles.intro}>
        <p className={styles.kicker}>Asortiman</p>
        <h2 id="artikli-naslov" className={styles.title}>
          Svi artikli
        </h2>
        <p className={styles.lead}>
          Tondach crijep, Porotherm opeka i Baumalt malteri i ljepila, uz suhu gradnju i kamenu vunu. Cijene i dostupnost na upit, dostava po Banjoj Luci.
        </p>
      </header>

      {/* Ljepljiva traka alata, kao na mtponos: ostaje ispod navbara dok se lista skroluje. */}
      <div className={styles.bar}>
        <div className={styles.barRow}>
          <label className={styles.search}>
            <svg viewBox="0 0 20 20" aria-hidden fill="none" stroke="currentColor" strokeWidth={1.6}>
              <circle cx="9" cy="9" r="6" />
              <path d="m13.5 13.5 4 4" />
            </svg>
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Naziv, dimenzija ili proizvođač" aria-label="Pretraga artikala" />
          </label>
          <button type="button" className={styles.filterBtn} aria-expanded={panel} aria-controls="katalog-filteri" onClick={() => setPanel((p) => !p)}>
            Filteri
            {cats.length + units.length + uses.length + Number(featuredOnly) > 0 && <sup>{cats.length + units.length + uses.length + Number(featuredOnly)}</sup>}
          </button>
          <label className={styles.sort}>
            <span>Sortiraj</span>
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} aria-label="Sortiranje">
              {SORTS.map(([id, label]) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <p className={styles.total} aria-live="polite">
            {count(visible.length)}
          </p>
        </div>
        <div className={styles.chips} role="group" aria-label="Proizvođač">
          {chip('Sve', base.length, brand === 'sve', () => setBrand('sve'))}
          {BRANDS.map((b) => chip(b.id === 'ostalo' ? 'Ostali program' : b.name, base.filter((i) => i.brand === b.id).length, brand === b.id, () => setBrand(b.id), b.id))}
        </div>

        <div id="katalog-filteri" className={styles.panel} data-open={panel} hidden={!panel}>
          <div className={styles.facet}>
            <p>Kategorija</p>
            <div>{facet(CATALOG_ITEMS, (i) => [i.category]).map(([v, n]) => chip(CATEGORY_NAMES[v] ?? v, n, cats.includes(v), () => toggle(cats, setCats, v), v))}</div>
          </div>
          <div className={styles.facet}>
            <p>Namjena</p>
            <div>{facet(CATALOG_ITEMS, (i) => i.uses).map(([v, n]) => chip(v, n, uses.includes(v), () => toggle(uses, setUses, v), v))}</div>
          </div>
          <div className={styles.facet}>
            <p>Jedinica</p>
            <div>{facet(CATALOG_ITEMS, (i) => [i.unit]).map(([v, n]) => chip(v, n, units.includes(v), () => toggle(units, setUnits, v), v))}</div>
          </div>
          <div className={styles.facet}>
            <p>Ponuda</p>
            <div>{chip('Izdvojeno', CATALOG_ITEMS.filter((i) => i.featured).length, featuredOnly, () => setFeaturedOnly((f) => !f))}</div>
          </div>
          {filtered && (
            <button type="button" className={styles.resetLink} onClick={reset}>
              Poništi filtere
            </button>
          )}
        </div>
      </div>

      {groups.length === 0 && (
        <div className={styles.empty}>
          <p>Nema artikala za ove filtere.</p>
          <button type="button" className={styles.resetLink} onClick={reset}>
            Poništi filtere
          </button>
        </div>
      )}

      {groups.map(({ brand: b, items }) => {
        const index = BRANDS.findIndex((x) => x.id === b.id) + 1
        return (
          <section key={b.id} id={`brend-${b.id}`} aria-labelledby={`${b.id}-naslov`} className={styles.group}>
            <div data-brand-head className={styles.brandHead}>
              <p data-lift className={styles.order}>
                <span className={styles.num}>{String(index).padStart(2, '0')}</span>
                <span className={styles.of}>/ {String(BRANDS.length).padStart(2, '0')}</span>
              </p>
              <h3 data-lift id={`${b.id}-naslov`} className={styles.brandName}>
                {b.name}
              </h3>
              <div data-lift className={styles.brandText}>
                {b.logo ? <img className={styles.logo} src={b.logo} alt={`${b.name} logo`} height={56} decoding="async" /> : <span className={styles.logoWord}>Grand Company · stovarište</span>}
                <p>{b.text}</p>
                <p className={styles.groupCount}>{count(items.length)}</p>
              </div>
            </div>

            <ul className={styles.grid}>
              {items.map((item, i) => {
                const inCompare = compare.includes(item.key)
                return (
                  <li key={item.key} data-item className={styles.card}>
                    <div className={styles.photo}>
                      <img src={item.image} alt={item.name} width={600} height={600} loading={i < 4 ? 'eager' : 'lazy'} decoding="async" />
                      {item.hover && <img className={styles.project} src={item.hover} alt="" width={600} height={600} loading="lazy" decoding="async" aria-hidden />}
                      {item.featured && <span className={styles.badge}>Izdvojeno</span>}
                      {item.href ? (
                        <Link href={item.href} className={styles.cover} aria-label={`Pogledaj proizvod: ${item.name}`}>
                          <span className={styles.view}>Pogledaj proizvod →</span>
                        </Link>
                      ) : (
                        <button type="button" className={styles.cover} aria-label={`Pogledaj proizvod: ${item.name}`} onClick={() => setQuick(item)}>
                          <span className={styles.view}>Pogledaj proizvod →</span>
                        </button>
                      )}
                      <button type="button" className={styles.compare} aria-pressed={inCompare} onClick={() => toggleCompare(item.key)} aria-label={`Uporedi: ${item.name}`}>
                        <span className={styles.box} aria-hidden />
                        <em>Uporedi</em>
                      </button>
                      <div className={styles.tools}>
                        <button type="button" className={styles.icon} onClick={() => setQuick(item)} aria-label={`Brzi pregled: ${item.name}`}>
                          <Eye />
                        </button>
                        {addButton(item)}
                      </div>
                    </div>
                    <p className={styles.caption}>
                      {item.href ? (
                        <Link href={item.href} className={styles.code}>
                          {item.code}
                        </Link>
                      ) : (
                        <button type="button" className={styles.code} onClick={() => setQuick(item)}>
                          {item.code}
                        </button>
                      )}
                    </p>
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}

      {/* Donja traka: poređenje i upit (pojavljuje se tek kad nešto izaberete). */}
      {(compare.length > 0 || picked > 0) && (
        <div className={styles.tray} role="status">
          {compare.length > 0 && (
            <div className={styles.trayCompare}>
              <span>Uporedi: {compare.length} / 4</span>
              <button type="button" onClick={() => setCompareOpen(true)} disabled={compare.length < 2}>
                {compare.length < 2 ? 'Izaberite još jedan' : 'Prikaži poređenje'}
              </button>
              <button type="button" onClick={() => setCompare([])} aria-label="Očisti poređenje">
                ×
              </button>
            </div>
          )}
          {picked > 0 && (
            <Link className={styles.trayInquiry} href={inquiryHref(selection)}>
              U upitu: {count(picked)} · Pošaljite upit →
            </Link>
          )}
        </div>
      )}

      {quick && (
        <div className={styles.modal} role="dialog" aria-modal="true" aria-label={quick.name} onClick={() => setQuick(null)}>
          <div className={styles.sheet} onClick={(e) => e.stopPropagation()} data-lenis-prevent>
            <button type="button" className={styles.close} onClick={() => setQuick(null)} aria-label="Zatvori">
              ×
            </button>
            <div className={styles.sheetPhoto}>
              <img src={quick.image} alt={quick.name} width={600} height={600} />
            </div>
            <div className={styles.sheetBody}>
              <p className={styles.kicker}>
                {quick.brandName} · {CATEGORY_NAMES[quick.category]}
              </p>
              <h3 className={styles.sheetTitle}>{quick.name}</h3>
              <p className={styles.sheetLead}>{quick.lead}</p>
              <dl className={styles.specs}>
                <div>
                  <dt>Specifikacija</dt>
                  <dd>{quick.spec}</dd>
                </div>
                <div>
                  <dt>Jedinica</dt>
                  <dd>{quick.unit}</dd>
                </div>
                {quick.uses.length > 0 && (
                  <div>
                    <dt>Namjena</dt>
                    <dd>{quick.uses.join(', ')}</dd>
                  </div>
                )}
                <div>
                  <dt>Cijena</dt>
                  <dd>Na upit</dd>
                </div>
              </dl>
              <div className={styles.sheetActions}>
                {addButton(quick, true)}
                {quick.href ? (
                  <Link className={styles.ghost} href={quick.href}>
                    Stranica artikla →
                  </Link>
                ) : quick.source ? (
                  <a className={styles.ghost} href={quick.source} target="_blank" rel="noopener noreferrer">
                    Podaci proizvođača ↗
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}

      {compareOpen && compared.length > 1 && (
        <div className={styles.modal} role="dialog" aria-modal="true" aria-label="Poređenje artikala" onClick={() => setCompareOpen(false)}>
          <div className={`${styles.sheet} ${styles.compareSheet}`} onClick={(e) => e.stopPropagation()} data-lenis-prevent>
            <button type="button" className={styles.close} onClick={() => setCompareOpen(false)} aria-label="Zatvori">
              ×
            </button>
            <p className={styles.kicker}>Poređenje</p>
            <div className={styles.table} style={{ '--cols': compared.length } as React.CSSProperties}>
              <div className={styles.tRow}>
                <span />
                {compared.map((i) => (
                  <div key={i.key} className={styles.tHead}>
                    <img src={i.image} alt="" width={160} height={160} />
                    <strong>{i.code}</strong>
                  </div>
                ))}
              </div>
              {(
                [
                  ['Proizvođač', (i: CatalogItem) => i.brandName],
                  ['Kategorija', (i: CatalogItem) => CATEGORY_NAMES[i.category]],
                  ['Specifikacija', (i: CatalogItem) => i.spec],
                  ['Jedinica', (i: CatalogItem) => i.unit],
                  ['Namjena', (i: CatalogItem) => i.uses.join(', ') || '—'],
                  ['Cijena', () => 'Na upit'],
                ] as [string, (i: CatalogItem) => string][]
              ).map(([label, get]) => (
                <div key={label} className={styles.tRow}>
                  <span className={styles.tLabel}>{label}</span>
                  {compared.map((i) => (
                    <span key={i.key}>{get(i)}</span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
