'use client'

import { useSearchParams } from 'next/navigation'
import { PROGRAM_ITEMS } from '@/lib/catalog-copy'
import { PROGRAM_ITEMS_EN } from '@/lib/catalog-copy-en'
import { useLang } from '@/lib/i18n'
import { CATEGORIES, PRODUCTS, USES, pDesc, pName, pSpec } from '@/lib/shop'

export type CatalogSort = 'preporuceno' | 'cijena-rastuce' | 'cijena-opadajuce' | 'naziv'

// Grupe po upitu: provjereni proizvođači (Tondach, Porotherm, Baumalt), prikazani u istoj mreži.
export const PROGRAM_IDS = ['krovni-sistemi', 'zidni-blokovi', 'malteri-ljepila'] as const
export const PROGRAM_NAMES: Record<(typeof PROGRAM_IDS)[number], string> = {
  'krovni-sistemi': 'Krovni sistemi',
  'zidni-blokovi': 'Zidni sistemi',
  'malteri-ljepila': 'Građevinska hemija',
}
export const PROGRAM_NAMES_EN: Record<(typeof PROGRAM_IDS)[number], string> = {
  'krovni-sistemi': 'Roofing systems',
  'zidni-blokovi': 'Wall systems',
  'malteri-ljepila': 'Construction chemicals',
}
export type ProgramId = (typeof PROGRAM_IDS)[number]

export const CATALOG_BRANDS = [...new Set(PRODUCTS.map(p => p.brand).filter(brand => brand !== 'Ostali proizvođači'))].sort((a, b) => a.localeCompare(b, 'bs'))
export const CATALOG_UNITS = [...new Set([...PRODUCTS.map(p => p.unit), ...PROGRAM_ITEMS.map(p => p.unit)])].sort((a, b) => a.localeCompare(b, 'bs'))
export const PRICE_BANDS = [
  { id: 'do-5', label: 'Do 5 KM', labelEn: 'Up to 5 KM', min: 0, max: 5 },
  { id: '5-10', label: '5 – 10 KM', labelEn: '5 – 10 KM', min: 5, max: 10 },
  { id: '10-20', label: '10 – 20 KM', labelEn: '10 – 20 KM', min: 10, max: 20 },
  { id: 'preko-20', label: 'Preko 20 KM', labelEn: 'Over 20 KM', min: 20, max: Infinity },
] as const

export const normalizeCatalog = (value: string) => value.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'dj')

export function useCatalogFilters() {
  const { lang } = useLang()
  const search = useSearchParams()
  const category = search.get('kategorija')
  const cat: string = CATEGORIES.find(c => c.id === category)?.id ?? PROGRAM_IDS.find(id => id === category) ?? 'sve'
  const use = USES.find(u => u.id === search.get('namjena'))?.id ?? 'sve'
  const order = search.get('sortiranje')
  const sort: CatalogSort = order === 'naziv' || order === 'cijena-rastuce' || order === 'cijena-opadajuce' ? order : 'preporuceno'
  const q = search.get('q') ?? ''
  const brandParam = search.get('brend')
  const brand = brandParam && CATALOG_BRANDS.includes(brandParam) ? brandParam : 'sve'
  const unitParam = search.get('jedinica')
  const unit = unitParam && CATALOG_UNITS.includes(unitParam) ? unitParam : 'sve'
  const band = PRICE_BANDS.find(b => b.id === search.get('cijena'))
  const price = band?.id ?? 'sve'
  const featured = search.get('izdvojeno') === '1'

  function update(patch: Record<string, string>, push = false) {
    const next = new URLSearchParams(window.location.search)
    Object.entries(patch).forEach(([key, value]) => {
      if (!value || value === 'sve' || value === 'preporuceno') next.delete(key)
      else next.set(key, value)
    })
    const url = `${window.location.pathname}${next.size ? `?${next}` : ''}${window.location.hash}`
    if (push) window.history.pushState(null, '', url)
    else window.history.replaceState(null, '', url)
  }
  function reset() { update({ kategorija: 'sve', namjena: 'sve', brend: 'sve', jedinica: 'sve', cijena: 'sve', izdvojeno: '', sortiranje: 'preporuceno', q: '' }) }

  const words = normalizeCatalog(q).split(/\s+/).filter(Boolean)
  const isProgramCat = (PROGRAM_IDS as readonly string[]).includes(cat)
  const list = isProgramCat ? [] : PRODUCTS.filter(p => (cat === 'sve' || p.category === cat)
    && (use === 'sve' || p.uses.includes(use)) && (brand === 'sve' || p.brand === brand)
    && (unit === 'sve' || p.unit === unit) && (!band || (p.price >= band.min && p.price < band.max)) && (!featured || !!p.featured)
    && words.every(word => normalizeCatalog(`${p.sku} ${p.name} ${p.brand} ${p.spec} ${pName(p, 'en')} ${pSpec(p, 'en')} ${pDesc(p, 'en')}`).includes(word)))
  if (sort === 'naziv') list.sort((a, b) => pName(a, lang).localeCompare(pName(b, lang), lang === 'en' ? 'en' : 'bs'))
  else if (sort === 'cijena-rastuce') list.sort((a, b) => a.price - b.price)
  else if (sort === 'cijena-opadajuce') list.sort((a, b) => b.price - a.price)
  else list.sort((a, b) => Number(!!b.featured) - Number(!!a.featured))

  // Programi po upitu nemaju cijenu, brend ni namjenu: kad je neki od tih filtera aktivan, ne prikazuju se.
  const programsHidden = use !== 'sve' || brand !== 'sve' || !!band || featured || (!!cat && cat !== 'sve' && !isProgramCat)
  const programs = programsHidden ? [] : PROGRAM_ITEMS.filter(item => (cat === 'sve' || item.program === cat)
    && (unit === 'sve' || item.unit === unit)
    && words.every(word => normalizeCatalog(`${item.brand} ${item.name} ${item.spec} ${item.lead} ${PROGRAM_ITEMS_EN[item.id]?.name ?? item.name} ${PROGRAM_ITEMS_EN[item.id]?.spec ?? ''} ${PROGRAM_ITEMS_EN[item.id]?.lead ?? ''}`).includes(word)))
  if (sort === 'naziv') programs.sort((a, b) => (lang === 'en' ? (PROGRAM_ITEMS_EN[a.id]?.name ?? a.name) : a.name).localeCompare(lang === 'en' ? (PROGRAM_ITEMS_EN[b.id]?.name ?? b.name) : b.name, lang === 'en' ? 'en' : 'bs'))

  return { q, cat, use, brand, unit, price, featured, sort, list, programs, update, reset,
    filtered: !!q.trim() || cat !== 'sve' || use !== 'sve' || brand !== 'sve' || unit !== 'sve' || price !== 'sve' || featured || sort !== 'preporuceno' }
}
