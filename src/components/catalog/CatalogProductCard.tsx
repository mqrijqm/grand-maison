'use client'

/* eslint-disable @next/next/no-img-element -- optimizovane fotografije artikala iz kataloga */
import Link from 'next/link'
import { useState } from 'react'
import Price from '@/components/b2b/Price'
import { addToCart } from '@/lib/cart'
import { categoryName, defaultQty, qtyLabel, type Product } from '@/lib/shop'
import { toggleInquiryItem, useCatalogInquiry } from '@/lib/catalog-inquiry'
import styles from './CatalogCommerce.module.css'

export default function CatalogProductCard({ product, priority = false, dense = false }: { product: Product; priority?: boolean; dense?: boolean }) {
  const [open, setOpen] = useState(false)
  const selection = useCatalogInquiry()
  const selected = !!selection[product.sku]
  const Wrapper = dense ? 'li' : 'article'
  return (
    <Wrapper data-cell className={`${styles.productCard} ${dense ? styles.dense : ''} ${open ? styles.detailsOpen + ' bg-cobalt' : ''}`} onPointerEnter={event => { if (event.pointerType === 'mouse') setOpen(true) }} onPointerLeave={event => { if (!event.currentTarget.contains(document.activeElement)) setOpen(false) }} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false) }}>
      <div className={styles.photoArea}>
      <Link href={`/prodavnica/${product.sku}`} className={styles.productPhoto} data-cursor="Detalji">
        <img src={product.image} alt={product.name} width={900} height={1125} loading={priority ? 'eager' : 'lazy'} decoding="async" />
      </Link>
      <div id={`details-${product.sku}`} className={styles.productDetails} hidden={!open}>
        <div className={styles.productMeta}><span>{product.brand === 'Ostali proizvođači' ? categoryName(product.category) : product.brand}</span><span>{product.sku}</span></div>
        <p className={styles.spec}>{product.spec}</p>
        <p className={styles.pack}>{product.pack ? `${qtyLabel(product.pack.size, product.unit)} / ${product.pack.name}` : `Jedinica prodaje: ${product.unit}`}</p>
        <div className={styles.price}><span className={styles.priceLabel}>Orijentaciona cijena</span><Price value={product.price} unit={product.unit} /></div>
        <div className={styles.cardActions}>
          <button type="button" aria-pressed={selected} aria-label={`${selected ? 'Ukloni iz upita' : 'Dodaj u upit'}: ${product.name}`} onClick={() => toggleInquiryItem(product)}>{selected ? 'U upitu ✓' : 'Dodaj u upit'}<span aria-hidden>{selected ? '−' : '+'}</span></button>
          <button type="button" aria-label={`Dodaj u korpu: ${product.name}`} onClick={() => addToCart(product.id, defaultQty(product))}>Korpa <span aria-hidden>+</span></button>
        </div>
      </div>
      </div>
      <div className={styles.productInfo}>
        <h3 className={`font-pretty ${styles.productTitle}`}><Link href={`/prodavnica/${product.sku}`}>{product.name}</Link></h3>
        <button type="button" className={styles.detailsToggle} aria-expanded={open} aria-controls={`details-${product.sku}`} aria-label={`${open ? 'Sakrij' : 'Prikaži'} informacije: ${product.name}`} onClick={() => setOpen(value => !value)}>{open ? '−' : '+'}</button>
      </div>
    </Wrapper>
  )
}
