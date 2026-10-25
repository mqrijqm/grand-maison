'use client'

/* eslint-disable @next/next/no-img-element -- optimizovane fotografije artikala i programa iz /public */
import Link from 'next/link'
import { useRef } from 'react'
import Price from '@/components/b2b/Price'
import { type ProgramItem } from '@/lib/catalog-copy'
import { inquiryHref, inquiryLines, toggleInquiryItem, useCatalogInquiry } from '@/lib/catalog-inquiry'
import { gsap, useGSAP } from '@/lib/gsap'
import { CATEGORIES, USES, categoryName, pName, unitL, workName, type Product } from '@/lib/shop'
import { PROGRAM_ITEMS_EN } from '@/lib/catalog-copy-en'
import { useLang } from '@/lib/i18n'
import { PROGRAM_IDS, PROGRAM_NAMES, PROGRAM_NAMES_EN, useCatalogFilters, type CatalogSort } from './catalog-filters'
import styles from './CatalogShop.module.css'

// Katalog kao web-prodavnica: jarko plavi vrh sa pretragom i kategorijama (iza veliki prozirni kvadrati),
// ispod mreža svedenih kartica — fotografija, naziv, cijena. Opis i detalji su tek na stranici artikla.


const CHIPS = [
  { id: 'sve', name: 'Sve', en: 'All' },
  ...CATEGORIES.map((c) => ({ id: c.id as string, name: c.name, en: categoryName(c.id, 'en') })),
  ...PROGRAM_IDS.map((id) => ({ id: id as string, name: PROGRAM_NAMES[id], en: PROGRAM_NAMES_EN[id] })),
]

const SORTS: { id: CatalogSort; label: string; en: string }[] = [
  { id: 'preporuceno', label: 'Preporučeno', en: 'Recommended' },
  { id: 'naziv', label: 'Naziv A–Ž', en: 'Name A–Z' },
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
  const { t, lang } = useLang()
  const name = pName(product, lang)
  const on = !!selection[product.sku]
  return (
    <li className={styles.card}>
      <Link href={`/prodavnica/${product.sku}`} className={styles.photo} data-cursor={t('Detalji', 'Details')}>
        <img src={product.image} alt={name} width={900} height={1125} loading={index < 8 ? 'eager' : 'lazy'} decoding="async" />
      </Link>
      <div className={styles.info}>
        <p className={styles.meta}>
          <span>{categoryName(product.category, lang)}</span>
          <span>{product.sku}</span>
        </p>
        <h3 className={styles.name}>
          <Link href={`/prodavnica/${product.sku}`}>{name}</Link>
        </h3>
        <div className={styles.buy}>
          <Price value={product.price} unit={product.unit} className={styles.price} />
          <button type="button" className={styles.add} aria-pressed={on} aria-label={`${on ? t('Ukloni iz upita', 'Remove from enquiry') : t('Dodaj u upit', 'Add to enquiry')}: ${name}`} onClick={() => toggleInquiryItem(product)}>
            {on ? t('U upitu ✓', 'In enquiry ✓') : t('U upit +', 'Enquire +')}
          </button>
        </div>
      </div>
    </li>
  )
}

// Artikal provjerenog proizvođača po upitu: link vodi na formu sa već upisanim nazivom artikla.
function ProgramCard({ item }: { item: ProgramItem }) {
  const { t, lang } = useLang()
  const en = lang === 'en'
  const e = PROGRAM_ITEMS_EN[item.id]
  const itemName = en ? (e?.name ?? item.name) : item.name
  const programName = en ? PROGRAM_NAMES_EN[item.program] : PROGRAM_NAMES[item.program]
  const href = `/upit-za-izvodjace?naziv=${encodeURIComponent(item.name)}${item.program === 'malteri-ljepila' ? '' : '&program=zidni-krovni'}`
  return (
    <li className={styles.card}>
      <Link href={href} className={styles.photo}>
        <img src={item.image} alt={`${itemName} (${programName})`} width={900} height={1125} loading="lazy" decoding="async" />
        <span className={styles.badge}>{item.brand}</span>
      </Link>
      <div className={styles.info}>
        <p className={styles.meta}>
          <span>{programName}</span>
          <span>{unitL(item.unit, lang)}</span>
        </p>
        <h3 className={styles.name}>
          <Link href={href}>{itemName}</Link>
        </h3>
        <p className={styles.spec}>{en ? (e?.spec ?? item.spec) : item.spec}</p>
        <div className={styles.buy}>
          <span className={styles.price}>{t('Cijena na upit', 'Price on request')}</span>
          <Link className={styles.add} href={href}>
            {t('Upit ↗', 'Enquire ↗')}
          </Link>
        </div>
      </div>
    </li>
  )
}

export default function CatalogShop({ compact = false }: { compact?: boolean }) {
  const { t, lang } = useLang()
  const root = useRef<HTMLDivElement>(null)
  const { q, cat, use, sort, list, programs, filtered, update, reset } = useCatalogFilters()
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
      <header data-hero className={`${styles.hero} ${compact ? styles.heroCompact : ''}`}>
        {!compact && <div aria-hidden className={styles.squares}>
          {SQUARES.map(([x, y, size, alpha, speed], i) => (
            <i key={i} data-sq={speed} style={{ left: `${x}%`, top: `${y}%`, width: `${size}vw`, height: `${size}vw`, background: `rgb(255 255 255 / ${alpha})` }} />
          ))}
        </div>}
        <div className={`gutter ${styles.heroInner}`}>
          <p className="label">{t('Grand Company / Katalog', 'Grand Company / Catalogue')}</p>
          {compact ? <h2 className={`display ${styles.titleCompact}`}>{t('Svi artikli', 'All items')}</h2> : <h1 className={`display ${styles.title}`}>{t('Asortiman', 'Range')}</h1>}
          <label className={styles.search}>
            <svg viewBox="0 0 20 20" aria-hidden fill="none" stroke="currentColor" strokeWidth={1.6}>
              <circle cx="9" cy="9" r="6" />
              <path d="m13.5 13.5 4 4" />
            </svg>
            <input type="search" value={q} onChange={(e) => update({ q: e.target.value })} placeholder={t('Naziv, šifra ili dimenzija', 'Name, code or dimensions')} aria-label={t('Pretraga artikala', 'Search items')} />
            {q && (
              <button type="button" onClick={() => update({ q: '' })} aria-label={t('Obriši pretragu', 'Clear search')}>
                ×
              </button>
            )}
          </label>
          <div className={styles.chips} role="group" aria-label={t('Kategorije', 'Categories')}>
            {CHIPS.map((c) => (
              <button key={c.id} type="button" aria-pressed={cat === c.id} onClick={() => update({ kategorija: c.id }, true)}>
                {lang === 'en' ? c.en : c.name}
              </button>
            ))}
          </div>
        </div>
      </header>

      <section id="artikli" className={`gutter scroll-mt-24 ${styles.shop}`} aria-label={t('Artikli', 'Items')}>
        <div className={styles.toolbar}>
          <p className={styles.count} aria-live="polite">
            {total} {lang === 'en' ? (total === 1 ? 'item' : 'items') : total === 1 ? 'artikal' : 'artikala'}
            {filtered && (
              <button type="button" onClick={reset}>
                {t('Poništi filtere', 'Clear filters')}
              </button>
            )}
          </p>
          <div className={styles.selects}>
            {select(t('Namjena', 'Application'), use, 'namjena', [['sve', t('Sve namjene', 'All applications')], ...USES.map((u): [string, string] => [u.id, workName(u.id, lang)])])}
            {select(t('Sortiranje', 'Sorting'), sort, 'sortiranje', SORTS.map((s): [string, string] => [s.id, lang === 'en' ? s.en : s.label]))}
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
            <p>{t('Nema artikala za ove filtere.', 'No items match these filters.')}</p>
            <button type="button" onClick={reset}>
              {t('Poništi filtere', 'Clear filters')}
            </button>
          </div>
        )}
      </section>

      {picked > 0 && (
        <div className={styles.tray} role="status">
          <span>
            {t('U upitu', 'In enquiry')}: {picked} {lang === 'en' ? (picked === 1 ? 'item' : 'items') : picked === 1 ? 'artikal' : 'artikla'}
          </span>
          <Link href={inquiryHref(selection)}>{t('Pošaljite upit →', 'Send enquiry →')}</Link>
        </div>
      )}
    </div>
  )
}

