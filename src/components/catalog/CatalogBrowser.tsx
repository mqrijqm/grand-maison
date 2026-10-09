'use client'

/* eslint-disable @next/next/no-img-element -- optimizovane fotografije kategorija iz /public */
import Link from 'next/link'
import { GROUP_COPY, type ProgramItem } from '@/lib/catalog-copy'
import { OFFERINGS } from '@/lib/offerings'
import { CATEGORIES, PRODUCTS, USES } from '@/lib/shop'
import CatalogProductCard from './CatalogProductCard'
import CatalogSelectionBar from './CatalogSelectionBar'
import styles from './CatalogBrowser.module.css'
import { CATALOG_BRANDS, CATALOG_UNITS, PRICE_BANDS, PROGRAM_IDS, useCatalogFilters, type CatalogSort } from './catalog-filters'

// Katalog: red kategorija, a ispod jedna lepeza malih kartica sa pretragom, filterima i sortiranjem.

type Offering = (typeof OFFERINGS)[number]
const offering = (id: Offering['id']) => OFFERINGS.find((item) => item.id === id)!

type Tile = { id: string; name: string; image: string; alt: string; count: number; po: boolean }
const TILES: Tile[] = [
  ...CATEGORIES.map((category) => ({
    id: category.id,
    name: category.name,
    image: category.id === 'oprema' ? '/editorial/programs/pribor.webp' : offering(category.id as Offering['id']).image,
    alt: category.id === 'oprema' ? 'Samourezni vijci za gips-kartonske ploče — pribor za suhu gradnju' : offering(category.id as Offering['id']).alt,
    count: PRODUCTS.filter((product) => product.category === category.id).length,
    po: false,
  })),
  ...PROGRAM_IDS.map((id) => ({
    id,
    name: offering(id).name,
    image: offering(id).image,
    alt: offering(id).alt,
    count: 0,
    po: true,
  })),
]

const SORTS: { id: CatalogSort; label: string }[] = [
  { id: 'preporuceno', label: 'Preporučeno' },
  { id: 'cijena-rastuce', label: 'Cijena ↑' },
  { id: 'cijena-opadajuce', label: 'Cijena ↓' },
  { id: 'naziv', label: 'Naziv A–Ž' },
]

function ProgramCell({ item }: { item: ProgramItem }) {
  return (
    <li className={styles.programCell}>
      <span className={styles.programTag}>Po upitu</span>
      <h3 className={`font-pretty ${styles.programName}`}>{item.name}</h3>
      <p className={styles.programSpec}>
        {item.spec} · {item.unit}
      </p>
      <p className={styles.programLead}>{item.lead}</p>
      <Link className={styles.programLink} href={`/upit-za-izvodjace?program=${item.program}`}>
        Zatražite ponudu <span aria-hidden>↗</span>
      </Link>
    </li>
  )
}

export default function CatalogBrowser() {
  const { q, cat, use, brand, unit, price, featured, sort, list, programs, filtered, update, reset } = useCatalogFilters()
  const total = list.length + programs.length
  const all = PRODUCTS.length + PROGRAM_IDS.length * 5
  const active = TILES.find((tile) => tile.id === cat)
  const toGrid = () => {
    const el = document.getElementById('lepeza')
    if (!el) return
    const y = el.getBoundingClientRect().top + window.scrollY - 80
    if (window.__gcLenis) window.__gcLenis.scrollTo(y)
    else window.scrollTo({ top: y, behavior: 'smooth' })
  }
  const chooseCat = (id: string) => {
    update({ kategorija: id }, true)
    toGrid()
  }
  const select = (label: string, value: string, key: string, options: [string, string][]) => (
    <label>
      <span>{label}</span>
      <select value={value} onChange={(event) => update({ [key]: event.target.value })} aria-label={label}>
        {options.map(([id, name]) => (
          <option key={id} value={id}>
            {name}
          </option>
        ))}
      </select>
    </label>
  )

  return (
    <div id="artikli">
      <section className={`gutter ${styles.tiles}`} aria-label="Kategorije">
        <ul className={styles.tileGrid}>
          {TILES.map((tile) => (
            <li key={tile.id}>
              <button type="button" className={`${styles.tile} ${cat === tile.id ? styles.tileOn : ''}`} aria-pressed={cat === tile.id} onClick={() => chooseCat(cat === tile.id ? 'sve' : tile.id)}>
                <span className={styles.tilePhoto}>
                  <img src={tile.image} alt={tile.alt} width={900} height={1350} loading="lazy" decoding="async" />
                </span>
                <span className={styles.tileMeta}>
                  <span>{tile.po ? 'Po upitu' : `${tile.count} artikala`}</span>
                </span>
                <span className={`font-pretty ${styles.tileName}`}>{tile.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section id="lepeza" className={`gutter ${styles.browser}`} aria-label="Svi artikli">
        <div className={styles.controls}>
          <label className={styles.search}>
            <svg viewBox="0 0 20 20" aria-hidden fill="none" stroke="currentColor" strokeWidth={1.6}>
              <circle cx="9" cy="9" r="6" />
              <path d="m13.5 13.5 4 4" />
            </svg>
            <input type="search" value={q} onChange={(event) => update({ q: event.target.value })} placeholder="Traži po nazivu, šifri ili specifikaciji" aria-label="Pretraga artikala" />
            {q && (
              <button type="button" onClick={() => update({ q: '' })} aria-label="Obriši pretragu">
                ×
              </button>
            )}
          </label>

          <div className={styles.selects}>
            {select('Kategorija', cat, 'kategorija', [['sve', 'Sve kategorije'], ...TILES.map((tile): [string, string] => [tile.id, tile.name])])}
            {select('Namjena', use, 'namjena', [['sve', 'Sve namjene'], ...USES.map((item): [string, string] => [item.id, item.name])])}
            {select('Cijena', price, 'cijena', [['sve', 'Sve cijene'], ...PRICE_BANDS.map((band): [string, string] => [band.id, band.label])])}
            {select('Jedinica', unit, 'jedinica', [['sve', 'Sve jedinice'], ...CATALOG_UNITS.map((item): [string, string] => [item, item])])}
            {select('Brend', brand, 'brend', [['sve', 'Svi brendovi'], ...CATALOG_BRANDS.map((item): [string, string] => [item, item])])}
            {select('Sortiranje', sort, 'sortiranje', SORTS.map((item): [string, string] => [item.id, item.label]))}
          </div>

          <div className={styles.row}>
            <button type="button" className={styles.toggle} aria-pressed={featured} onClick={() => update({ izdvojeno: featured ? '' : '1' })}>
              <span aria-hidden className={styles.toggleBox} />
              Samo najčešće birano
            </button>
            <p className={styles.count} aria-live="polite">
              {filtered ? `${total} od ${all} pozicija` : `Prikazano svih ${total} pozicija`}
            </p>
            {filtered && (
              <button type="button" className={styles.reset} onClick={reset}>
                Poništi filtere
              </button>
            )}
          </div>
        </div>

        {active && (
          <p className={styles.activeNote}>
            <span>{GROUP_COPY[active.id as keyof typeof GROUP_COPY].intro[0]}</span>
            <Link href={`/upit-za-izvodjace?program=${active.id === 'oprema' ? 'suha-gradnja' : active.id}`}>Zatražite ponudu za ovu kategoriju ↗</Link>
          </p>
        )}

        <CatalogSelectionBar />

        {total > 0 ? (
          <ul className={styles.grid}>
            {list.map((product, index) => (
              <CatalogProductCard key={product.id} product={product} priority={index < 6} dense />
            ))}
            {programs.map((item) => (
              <ProgramCell key={item.id} item={item} />
            ))}
          </ul>
        ) : (
          <div className={styles.empty}>
            <p className="font-pretty">Nema pozicija za ove filtere.</p>
            <button type="button" onClick={reset}>
              Poništi filtere
            </button>
          </div>
        )}

      </section>
    </div>
  )
}
