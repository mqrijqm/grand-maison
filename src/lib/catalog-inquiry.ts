'use client'

import { useSyncExternalStore } from 'react'
import { PRODUCTS, defaultQty, qtyLabel, type Product } from './shop'

type Selection = Record<string, number>
const EMPTY: Selection = {}
const KEY = 'grand-catalog-inquiry-v1'
let selection = EMPTY
let loaded = false
const listeners = new Set<() => void>()
const productBySku = new Map(PRODUCTS.map(product => [product.sku, product]))

export function inquiryQty(value: unknown) {
  const qty = Number(value)
  if (!Number.isFinite(qty) || qty < .01 || qty > 9999) return null
  return Math.round(qty * 100) / 100
}
function load() {
  if (loaded || typeof window === 'undefined') return
  loaded = true
  try {
    const saved = JSON.parse(window.sessionStorage.getItem(KEY) || '{}')
    const next: Selection = {}
    for (const [sku, value] of Object.entries(saved ?? {})) {
      const qty = inquiryQty(value)
      if (productBySku.has(sku) && qty !== null) next[sku] = qty
    }
    selection = next
  } catch { /* Upit radi i kada browser ne dozvoljava pamćenje. */ }
}
function save(next: Selection) {
  selection = next
  try { window.sessionStorage.setItem(KEY, JSON.stringify(next)) } catch {}
  listeners.forEach(listener => listener())
}
function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => { listeners.delete(listener) }
}
export function useCatalogInquiry() {
  return useSyncExternalStore(subscribe, () => { load(); return selection }, () => EMPTY)
}
export function setInquiryQuantity(sku: string, value: number) {
  load()
  const qty = inquiryQty(value)
  if (productBySku.has(sku) && qty !== null) save({ ...selection, [sku]: qty })
}
export function removeInquiryItem(sku: string) {
  load()
  const next = { ...selection }
  delete next[sku]
  save(next)
}
export function toggleInquiryItem(product: Product) {
  load()
  if (selection[product.sku]) removeInquiryItem(product.sku)
  else setInquiryQuantity(product.sku, defaultQty(product))
}
export function inquiryLines(items: Selection) {
  return PRODUCTS.flatMap(product => {
    const qty = inquiryQty(items[product.sku])
    return qty === null ? [] : [{ product, qty }]
  })
}
export function inquiryHref(items: Selection) {
  const encoded = inquiryLines(items).map(({ product, qty }) => `${product.sku}:${qty}`).join(',')
  return encoded ? `/upit-za-izvodjace?${new URLSearchParams({ spisak: encoded })}` : '/upit-za-izvodjace'
}
export function inquiryTextFromQuery(query: URLSearchParams) {
  const entries: Selection = {}
  const encoded = (query.get('spisak') || '').slice(0, 3000)
  encoded.split(',').forEach(entry => {
    const [sku, raw] = entry.split(':')
    const qty = inquiryQty(raw)
    if (productBySku.has(sku) && qty !== null) entries[sku] = qty
  })
  const single = productBySku.get(query.get('artikal') || '')
  if (single && !encoded) entries[single.sku] = inquiryQty(query.get('kolicina')) ?? defaultQty(single)
  return inquiryLines(entries).map(({ product, qty }) => `${product.name}\n${product.spec}\nKoličina: ${qtyLabel(qty, product.unit)} · Šifra: ${product.sku}`).join('\n\n')
}
