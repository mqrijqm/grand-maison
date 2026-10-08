'use client'

import { useSearchParams } from 'next/navigation'
import { PROGRAM_ITEMS } from '@/lib/catalog-copy'
import { CATEGORIES, PRODUCTS, USES } from '@/lib/shop'

export type CatalogSort = 'preporuceno' | 'cijena-rastuce' | 'cijena-opadajuce' | 'naziv'

// Oblasti koje se prodaju po upitu: nemaju cijenu, pa se prikazuju kao pozicije u istoj lepezi.
export const PROGRAM_IDS = ['zidni-krovni', 'drvni-program', 'sanitarna-oprema'] as const
export type ProgramId = (typeof PROGRAM_IDS)[number]

export const CATALOG_BRANDS = [...new Set(PRODUCTS.map(p => p.brand).filter(brand => brand !== 'Ostali proizvođači'))].sort((a, b) => a.localeCompare(b, 'bs'))
export const CATALOG_UNITS = [...new Set([...PRODUCTS.map(p => p.unit), ...PROGRAM_ITEMS.map(p => p.unit)])].sort((a, b) => a.localeCompare(b, 'bs'))
export const PRICE_BANDS = [
  { id: 'do-5', label: 'Do 5 KM', min: 0, max: 5 },
  { id: '5-10', label: '5 – 10 KM', min: 5, max: 10 },
  { id: '10-20', label: '10 – 20 KM', min: 10, max: 20 },
  { id: 'preko-20', label: 'Preko 20 KM', min: 20, max: Infinity },
] as const

export const normalizeCatalog = (value: string) => value.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'dj')

export function useCatalogFilters() {
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
    && words.every(word => normalizeCatalog(`${p.sku} ${p.name} ${p.brand} ${p.spec}`).includes(word)))
  if (sort === 'naziv') list.sort((a, b) => a.name.localeCompare(b.name, 'bs'))
  else if (sort === 'cijena-rastuce') list.sort((a, b) => a.price - b.price)
  else if (sort === 'cijena-opadajuce') list.sort((a, b) => b.price - a.price)
  else list.sort((a, b) => Number(!!b.featured) - Number(!!a.featured))

  // Programi po upitu nemaju cijenu, brend ni namjenu: kad je neki od tih filtera aktivan, ne prikazuju se.
  const programsHidden = use !== 'sve' || brand !== 'sve' || !!band || featured || (!!cat && cat !== 'sve' && !isProgramCat)
  const programs = programsHidden ? [] : PROGRAM_ITEMS.filter(item => (cat === 'sve' || item.program === cat)
    && (unit === 'sve' || item.unit === unit)
    && words.every(word => normalizeCatalog(`${item.name} ${item.spec} ${item.lead}`).includes(word)))
  if (sort === 'naziv') programs.sort((a, b) => a.name.localeCompare(b.name, 'bs'))

  return { q, cat, use, brand, unit, price, featured, sort, list, programs, update, reset,
    filtered: !!q.trim() || cat !== 'sve' || use !== 'sve' || brand !== 'sve' || unit !== 'sve' || price !== 'sve' || featured || sort !== 'preporuceno' }
}
