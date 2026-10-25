'use client'

import { useEffect, useMemo } from 'react'
import { resetFilters, setFilter, useShop } from '@/lib/cart'
import { ScrollTrigger } from '@/lib/gsap'
import {
  CATEGORIES,
  PRICE_BANDS,
  PRODUCTS,
  SORTS,
  USES,
  artikala,
  filterProducts,
  workName,
  type Filters,
} from '@/lib/shop'
import { CATEGORIES_EN } from '@/gc/gc'
import { useLang } from '@/lib/i18n'
import ProductCard from './ProductCard'
import SectionHead from './SectionHead'

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: [string, string][]
  onChange: (value: string) => void
}) {
  return (
    <label className="flex flex-col gap-2 text-micro uppercase">
      <span className="text-ink/60">{label}</span>
      <span className="relative block">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full cursor-pointer appearance-none border-2 border-ink bg-transparent py-3 pl-3 pr-9 text-micro uppercase outline-none focus-visible:bg-ink focus-visible:text-bg"
        >
          {options.map(([v, l]) => (
            <option key={v} value={v} className="bg-bg text-ink">
              {l}
            </option>
          ))}
        </select>
        <svg
          viewBox="0 0 12 8"
          aria-hidden
          className="pointer-events-none absolute right-3 top-1/2 w-3 -translate-y-1/2"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M1 1.5 6 6.5l5-5" />
        </svg>
      </span>
    </label>
  )
}

export default function Shop() {
  const { t, lang } = useLang()
  const { query, category, use, price, sort, onlySaved, saved, cart, compare } = useShop()

  const items = useMemo(
    () => filterProducts({ query, category, use, price, sort, onlySaved }, saved),
    [query, category, use, price, sort, onlySaved, saved],
  )

  const filtered = query !== '' || category !== 'sve' || use !== 'sve' || price !== 'sve' || onlySaved

  // Kad se lista promijeni, sekcije ispod se pomjeraju pa ScrollTrigger mora ponovo izmjeriti položaje.
  const key = items.map((p) => p.id).join()
  useEffect(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 200)
    return () => window.clearTimeout(id)
  }, [key])

  return (
    <section id="prodavnica" data-spy className="gutter scroll-mt-[var(--bar)] py-[14dvh]">
      <SectionHead
        no="03"
        label={t('Katalog', 'Catalogue')}
        title={t('Cijela ponuda', 'The full range')}
        lead={t('Knauf suha gradnja, izolacija, veziva i pribor. Cijene u KM sa PDV-om, po jedinici artikla.', 'Knauf drywall, insulation, binders and accessories. Prices in KM including VAT, per item unit.')}
      />

      {/* Pretraga */}
      <div className="mt-[8dvh] flex items-end gap-5 border-b-2 border-ink pb-3">
        <label htmlFor="shop-q" className="shrink-0 pb-1 text-micro uppercase">
          {t('Traži', 'Search')}
        </label>
        <input
          id="shop-q"
          type="search"
          value={query}
          onChange={(e) => setFilter({ query: e.target.value })}
          placeholder={t('Artikal, brend ili šifra', 'Item, brand or code')}
          autoComplete="off"
          className="w-full min-w-0 bg-transparent text-lead uppercase outline-none placeholder:text-ink/25"
        />
      </div>

      {/* Kategorije */}
      <div role="group" aria-label={t('Kategorija', 'Category')} className="mt-6 flex flex-wrap gap-2">
        {[{ id: 'sve', name: t('Sve', 'All') }, ...CATEGORIES.map((c) => ({ ...c, name: lang === 'en' ? CATEGORIES_EN[c.id].label : c.name }))].map((c) => {
          const on = category === c.id
          const n = c.id === 'sve' ? PRODUCTS.length : PRODUCTS.filter((p) => p.category === c.id).length
          return (
            <button
              key={c.id}
              type="button"
              aria-pressed={on}
              onClick={() => setFilter({ category: c.id as Filters['category'] })}
              className={`border-2 border-ink px-4 py-2.5 text-micro uppercase transition-colors duration-300 ${
                on ? 'bg-ink text-bg' : 'hover:bg-ink hover:text-bg'
              }`}
            >
              {c.name} <span className="ml-1 tabular-nums opacity-60">{n}</span>
            </button>
          )
        })}
      </div>

      {/* Ostali filteri */}
      <div className="mt-6 grid grid-cols-2 items-end gap-3 md:grid-cols-4 md:gap-[1.5vw]">
        <Select
          label={t('Namjena', 'Application')}
          value={use}
          onChange={(v) => setFilter({ use: v as Filters['use'] })}
          options={[['sve', t('Sve namjene', 'All applications')], ...USES.map((u): [string, string] => [u.id, workName(u.id, lang)])]}
        />
        <Select
          label={t('Cijena', 'Price')}
          value={price}
          onChange={(v) => setFilter({ price: v })}
          options={[['sve', t('Sve cijene', 'All prices')], ...PRICE_BANDS.map((b): [string, string] => [b.id, lang === 'en' ? b.labelEn : b.label])]}
        />
        <Select
          label={t('Sortiraj', 'Sort by')}
          value={sort}
          onChange={(v) => setFilter({ sort: v as Filters['sort'] })}
          options={SORTS.map((s): [string, string] => [s.id, lang === 'en' ? s.labelEn : s.label])}
        />
        <div className="col-span-2 flex items-stretch gap-2 md:col-span-1">
          <button
            type="button"
            aria-pressed={onlySaved}
            onClick={() => setFilter({ onlySaved: !onlySaved })}
            className={`flex-1 border-2 border-ink px-3 py-3 text-micro uppercase transition-colors duration-300 ${
              onlySaved ? 'bg-ink text-bg' : 'hover:bg-ink hover:text-bg'
            }`}
          >
            {t('Sačuvano', 'Saved')} <span className="tabular-nums opacity-60">{saved.length}</span>
          </button>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between text-micro uppercase" aria-live="polite">
        <p>{artikala(items.length, lang)}</p>
        {filtered && (
          <button type="button" onClick={() => resetFilters()} className="underline underline-offset-4">
            {t('Poništi filtere', 'Clear filters')}
          </button>
        )}
      </div>

      {/* Mreža artikala */}
      {items.length > 0 ? (
        <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 md:gap-x-[1.5vw] md:gap-y-[6dvh] xl:grid-cols-4">
          {items.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} qty={cart[p.id] ?? 0} saved={saved.includes(p.id)} compared={compare.includes(p.id)} />
          ))}
        </div>
      ) : (
        <div className="mt-6 flex min-h-[40dvh] flex-col items-start justify-center gap-6 border-2 border-ink p-6 md:p-[3vw]">
          <p className="text-lead uppercase">{t('Nema artikala za ove filtere.', 'No items match these filters.')}</p>
          <button
            type="button"
            onClick={() => resetFilters()}
            className="border-2 border-ink px-4 py-3 text-micro uppercase transition-colors duration-300 hover:bg-ink hover:text-bg"
          >
            {t('Poništi filtere', 'Clear filters')}
          </button>
        </div>
      )}
    </section>
  )
}
