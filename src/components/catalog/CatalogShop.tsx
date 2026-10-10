'use client'

/* eslint-disable @next/next/no-img-element -- optimizovane fotografije artikala i programa iz /public */
import Link from 'next/link'
import { useRef } from 'react'
import Price from '@/components/b2b/Price'
import { type ProgramItem } from '@/lib/catalog-copy'
import { inquiryHref, inquiryLines, toggleInquiryItem, useCatalogInquiry } from '@/lib/catalog-inquiry'
import { gsap, useGSAP } from '@/lib/gsap'
import { OFFERINGS } from '@/lib/offerings'
import { CATEGORIES, USES, categoryName, type Product } from '@/lib/shop'
import { PRICE_BANDS, PROGRAM_IDS, useCatalogFilters, type CatalogSort } from './catalog-filters'
import styles from './CatalogShop.module.css'

// Katalog kao web-prodavnica: jarko plavi vrh sa pretragom i kategorijama (iza veliki prozirni kvadrati),
// ispod mreža svedenih kartica — fotografija, naziv, cijena. Opis i detalji su tek na stranici artikla.

const offering = (id: string) => OFFERINGS.find((item) => item.id === id)!

const CHIPS = [
  { id: 'sve', name: 'Sve' },
  ...CATEGORIES.map((c) => ({ id: c.id as string, name: c.name })),
  ...PROGRAM_IDS.map((id) => ({ id: id as string, name: offering(id).name })),
]

const SORTS: { id: CatalogSort; label: string }[] = [
  { id: 'preporuceno', label: 'Preporučeno' },
  { id: 'cijena-rastuce', label: 'Cijena: niža prvo' },
  { id: 'cijena-opadajuce', label: 'Cijena: viša prvo' },
  { id: 'naziv', label: 'Naziv A–Ž' },
]

// Veliki prozirni kvadrati iza plavog vrha: [lijevo %, gore %, veličina vw, prozirnost, brzina]
const SQUARES: [number, number, number, number, number][] = [
  [-4, 8, 26, 0.07, 30],
  [70, -12, 34, 0.06, -20],
  [58, 52, 14, 0.1, 45],
  [22, 64, 9, 0.12, -35],
  [88, 60, 18, 0.07, 25],
  [40, 4, 6, 0.14, 60],
]

function Card({ product, index }: { product: Product; index: number }) {
  const selection = useCatalogInquiry()
  const on = !!selection[product.sku]
  return (
    <li className={styles.card}>
      <Link href={`/prodavnica/${product.sku}`} className={styles.photo} data-cursor="Detalji">
        <img src={product.image} alt={product.name} width={900} height={1125} loading={index < 8 ? 'eager' : 'lazy'} decoding="async" />
      </Link>
      <div className={styles.info}>
        <p className={styles.meta}>
          <span>{categoryName(product.category)}</span>
          <span>{product.sku}</span>
        </p>
        <h3 className={styles.name}>
          <Link href={`/prodavnica/${product.sku}`}>{product.name}</Link>
        </h3>
        <div className={styles.buy}>
          <Price value={product.price} unit={product.unit} className={styles.price} />
          <button type="button" className={styles.add} aria-pressed={on} aria-label={`${on ? 'Ukloni iz upita' : 'Dodaj u upit'}: ${product.name}`} onClick={() => toggleInquiryItem(product)}>
            {on ? 'U upitu ✓' : 'U upit +'}
          </button>
        </div>
      </div>
    </li>
  )
}

function ProgramCard({ item }: { item: ProgramItem }) {
  const o = offering(item.program)
  return (
    <li className={styles.card}>
      <Link href={`/upit-za-izvodjace?program=${item.program}`} className={styles.photo}>
        <img src={o.image} alt={o.alt} width={900} height={1125} loading="lazy" decoding="async" />
        <span className={styles.badge}>Po upitu</span>
      </Link>
      <div className={styles.info}>
        <p className={styles.meta}>
          <span>{o.name}</span>
          <span>{item.unit}</span>
        </p>
        <h3 className={styles.name}>
          <Link href={`/upit-za-izvodjace?program=${item.program}`}>{item.name}</Link>
        </h3>
        <div className={styles.buy}>
          <span className={styles.price}>Cijena na upit</span>
          <Link className={styles.add} href={`/upit-za-izvodjace?program=${item.program}`}>
            Upit ↗
          </Link>
        </div>
      </div>
    </li>
  )
}

export default function CatalogShop() {
  const root = useRef<HTMLDivElement>(null)
  const { q, cat, use, price, sort, list, programs, filtered, update, reset } = useCatalogFilters()
  const selection = useCatalogInquiry()
  const picked = inquiryLines(selection).length
  const total = list.length + programs.length

  useGSAP(
    () => {
      gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        const hero = root.current!.querySelector<HTMLElement>('[data-hero]')!
        hero.querySelectorAll<HTMLElement>('[data-sq]').forEach((sq) => {
          gsap.fromTo(sq, { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.4, ease: 'power3.out', delay: Math.random() * 0.4 })
          gsap.to(sq, { yPercent: Number(sq.dataset.sq), ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.6 } })
        })
      })
    },
    { scope: root },
  )

  const select = (label: string, value: string, key: string, options: [string, string][]) => (
    <label className={styles.select}>
      <span className="sr-only">{label}</span>
      <select value={value} onChange={(e) => update({ [key]: e.target.value })} aria-label={label}>
        {options.map(([id, name]) => (
          <option key={id} value={id}>
            {name}
          </option>
        ))}
      </select>
    </label>
  )

  return (
    <div ref={root}>
      <header data-hero className={styles.hero}>
        <div aria-hidden className={styles.squares}>
          {SQUARES.map(([x, y, size, alpha, speed], i) => (
            <i key={i} data-sq={speed} style={{ left: `${x}%`, top: `${y}%`, width: `${size}vw`, height: `${size}vw`, background: `rgb(255 255 255 / ${alpha})` }} />
          ))}
        </div>
        <div className={`gutter ${styles.heroInner}`}>
          <p className="label">Grand Company / Katalog</p>
          <h1 className={`display ${styles.title}`}>Asortiman</h1>
          <label className={styles.search}>
            <svg viewBox="0 0 20 20" aria-hidden fill="none" stroke="currentColor" strokeWidth={1.6}>
              <circle cx="9" cy="9" r="6" />
              <path d="m13.5 13.5 4 4" />
            </svg>
            <input type="search" value={q} onChange={(e) => update({ q: e.target.value })} placeholder="Naziv, šifra ili dimenzija" aria-label="Pretraga artikala" />
            {q && (
              <button type="button" onClick={() => update({ q: '' })} aria-label="Obriši pretragu">
                ×
              </button>
            )}
          </label>
          <div className={styles.chips} role="group" aria-label="Kategorije">
            {CHIPS.map((c) => (
              <button key={c.id} type="button" aria-pressed={cat === c.id} onClick={() => update({ kategorija: c.id }, true)}>
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </header>

      <section id="artikli" className={`gutter scroll-mt-24 ${styles.shop}`} aria-label="Artikli">
        <div className={styles.toolbar}>
          <p className={styles.count} aria-live="polite">
            {total} {total === 1 ? 'artikal' : 'artikala'}
            {filtered && (
              <button type="button" onClick={reset}>
                Poništi filtere
              </button>
            )}
          </p>
          <div className={styles.selects}>
            {select('Namjena', use, 'namjena', [['sve', 'Sve namjene'], ...USES.map((u): [string, string] => [u.id, u.name])])}
            {select('Cijena', price, 'cijena', [['sve', 'Sve cijene'], ...PRICE_BANDS.map((b): [string, string] => [b.id, b.label])])}
            {select('Sortiranje', sort, 'sortiranje', SORTS.map((s): [string, string] => [s.id, s.label]))}
          </div>
        </div>

        {total > 0 ? (
          <ul className={styles.grid}>
            {list.map((p, i) => (
              <Card key={p.id} product={p} index={i} />
            ))}
            {programs.map((item) => (
              <ProgramCard key={item.id} item={item} />
            ))}
          </ul>
        ) : (
          <div className={styles.empty}>
            <p>Nema artikala za ove filtere.</p>
            <button type="button" onClick={reset}>
              Poništi filtere
            </button>
          </div>
        )}
      </section>

      {picked > 0 && (
        <div className={styles.tray} role="status">
          <span>
            U upitu: {picked} {picked === 1 ? 'artikal' : 'artikla'}
          </span>
          <Link href={inquiryHref(selection)}>Pošaljite upit →</Link>
        </div>
      )}
    </div>
  )
}

