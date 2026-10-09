'use client'

/* eslint-disable @next/next/no-img-element -- gotove fotografije artikala iz kataloga */
import Link from 'next/link'
import Price from '@/components/b2b/Price'
import { toggleInquiryItem, useCatalogInquiry } from '@/lib/catalog-inquiry'
import { type Product } from '@/lib/shop'
import styles from './CatalogCommerce.module.css'

export default function CatalogProductRow({ product }: { product: Product }) {
  const selection = useCatalogInquiry()
  const selected = !!selection[product.sku]
  return (
    <li className={styles.row}>
      <Link href={`/prodavnica/${product.sku}`} tabIndex={-1} aria-hidden><img src={product.image} alt="" width={64} height={80} loading="lazy" decoding="async" className={styles.thumb} /></Link>
      <div className={styles.rowMain}>
        <span className={styles.rowMeta}>{product.sku}{product.brand !== 'Ostali proizvođači' && ` · ${product.brand}`}</span>
        <Link href={`/prodavnica/${product.sku}`} className={styles.rowTitle}>{product.name}</Link>
        <span className={styles.rowSpec}>{product.spec} · Jedinica: {product.unit}</span>
      </div>
      <div className={styles.rowPrice}><Price value={product.price} unit={product.unit} /></div>
      <button className={styles.rowAction} type="button" aria-pressed={selected} aria-label={`${selected ? 'Ukloni iz upita' : 'Dodaj u upit'}: ${product.name}`} onClick={() => toggleInquiryItem(product)}>{selected ? 'U upitu ✓' : 'Dodaj u upit'}</button>
    </li>
  )
}
