'use client'

import Link from 'next/link'
import { useState } from 'react'
import { addToCart } from '@/lib/cart'
import { defaultQty, qtyLabel, type Product } from '@/lib/shop'
import { inquiryQty, setInquiryQuantity, useCatalogInquiry } from '@/lib/catalog-inquiry'
import Price from '@/components/b2b/Price'
import styles from './CatalogSupport.module.css'

type Props = { product: Product }

export default function ProductBuy({ product }: Props) {
  const step = defaultQty(product)
  const [input, setInput] = useState(String(step))
  const qty = inquiryQty(input)
  const items = useCatalogInquiry()
  const changeQuantity = (direction: number) => setInput(String(Math.round(Math.min(9999, Math.max(step, (qty ?? step) + direction * step)) * 100) / 100))

  return (
    <div>
      <div className={styles.purchase}>
        <label className="label opacity-55" htmlFor={`qty-${product.sku}`}>Količina u jedinici prodaje</label>
        <div className={styles.quantityRow}>
          <div className={styles.quantity}>
            <button type="button" aria-label="Smanji količinu" onClick={() => changeQuantity(-1)}>−</button>
            <input id={`qty-${product.sku}`} type="number" min={.01} max={9999} step={.01} required value={input} onChange={event => setInput(event.target.value)} aria-invalid={qty === null} aria-describedby={`quantity-hint-${product.sku}`} />
            <span className="pr-3 text-[12px]">{product.unit}</span>
            <button type="button" aria-label="Povećaj količinu" onClick={() => changeQuantity(1)}>+</button>
          </div>
          {qty !== null && <span className="text-[12px]" aria-live="polite"><span className="block text-[9px] opacity-55">Orijentacioni iznos</span><Price value={product.price} qty={qty} /></span>}
        </div>
        <p id={`quantity-hint-${product.sku}`} className="text-[10px] normal-case leading-relaxed opacity-60">{qty === null ? 'Unesite količinu od 0,01 do 9.999.' : product.pack ? `Pakovanje: ${qtyLabel(product.pack.size, product.unit)} / ${product.pack.name}. Količine i dostupnost potvrđuje prodaja.` : `Jedinica prodaje: ${product.unit}. Količine i dostupnost potvrđuje prodaja.`}</p>
        <div className={styles.purchaseActions}>
          <button type="button" disabled={qty === null} onClick={() => { if (qty !== null) setInquiryQuantity(product.sku, qty) }}><span>{items[product.sku] ? 'Ažuriraj količinu u upitu' : 'Dodaj u upit za ponudu'}</span><span aria-hidden>+</span></button>
          <button type="button" disabled={qty === null} onClick={() => { if (qty !== null) addToCart(product.id, qty) }}><span>Dodaj u korpu</span><span aria-hidden>+</span></button>
        </div>
        <p className={styles.purchaseStatus} aria-live="polite">{items[product.sku] && <><span>U upitu: {qtyLabel(items[product.sku], product.unit)} · </span><Link href="/prodavnica#katalog-upit">Pregledajte cijeli upit ↗</Link></>}</p>
      </div>
    </div>
  )
}
