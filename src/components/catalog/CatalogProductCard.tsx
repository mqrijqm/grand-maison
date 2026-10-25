'use client'

/* eslint-disable @next/next/no-img-element -- optimizovane fotografije artikala iz kataloga */
import Link from 'next/link'
import { useState } from 'react'
import Price from '@/components/b2b/Price'
import { addToCart } from '@/lib/cart'
import { brandL, categoryName, defaultQty, packNameL, pName, pSpec, qtyLabelL, unitL, type Product } from '@/lib/shop'
import { useLang } from '@/lib/i18n'
import { toggleInquiryItem, useCatalogInquiry } from '@/lib/catalog-inquiry'
import styles from './CatalogCommerce.module.css'

export default function CatalogProductCard({ product, priority = false, dense = false }: { product: Product; priority?: boolean; dense?: boolean }) {
  const [open, setOpen] = useState(false)
  const { t, lang } = useLang()
  const name = pName(product, lang)
  const selection = useCatalogInquiry()
  const selected = !!selection[product.sku]
  const Wrapper = dense ? 'li' : 'article'
  return (
    <Wrapper data-cell className={`${styles.productCard} ${dense ? styles.dense : ''} ${open ? styles.detailsOpen + ' bg-cobalt' : ''}`} onPointerEnter={event => { if (event.pointerType === 'mouse') setOpen(true) }} onPointerLeave={event => { if (!event.currentTarget.contains(document.activeElement)) setOpen(false) }} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false) }}>
      <div className={styles.photoArea}>
      <Link href={`/prodavnica/${product.sku}`} className={styles.productPhoto} data-cursor={t('Detalji', 'Details')}>
        <img src={product.image} alt={name} width={900} height={1125} loading={priority ? 'eager' : 'lazy'} decoding="async" />
      </Link>
      <div id={`details-${product.sku}`} className={styles.productDetails} hidden={!open}>
        <div className={styles.productMeta}><span>{product.brand === 'Ostali proizvođači' ? categoryName(product.category, lang) : brandL(product.brand, lang)}</span><span>{product.sku}</span></div>
        <p className={styles.spec}>{pSpec(product, lang)}</p>
        <p className={styles.pack}>{product.pack ? `${qtyLabelL(product.pack.size, product.unit, lang)} / ${packNameL(product.pack.name, lang)}` : `${t('Jedinica prodaje', 'Sales unit')}: ${unitL(product.unit, lang)}`}</p>
        <div className={styles.price}><span className={styles.priceLabel}>{t('Cijena', 'Price')}</span><Price /></div>
        <div className={styles.cardActions}>
          <button type="button" aria-pressed={selected} aria-label={`${selected ? t('Ukloni iz upita', 'Remove from enquiry') : t('Dodaj u upit', 'Add to enquiry')}: ${name}`} onClick={() => toggleInquiryItem(product)}>{selected ? t('U upitu ✓', 'In enquiry ✓') : t('Dodaj u upit', 'Add to enquiry')}<span aria-hidden>{selected ? '−' : '+'}</span></button>
          <button type="button" aria-label={`${t('Dodaj u korpu', 'Add to basket')}: ${name}`} onClick={() => addToCart(product.id, defaultQty(product))}>{t('Korpa', 'Basket')} <span aria-hidden>+</span></button>
        </div>
      </div>
      </div>
      <div className={styles.productInfo}>
        <h3 className={`font-pretty ${styles.productTitle}`}><Link href={`/prodavnica/${product.sku}`}>{name}</Link></h3>
        <button type="button" className={styles.detailsToggle} aria-expanded={open} aria-controls={`details-${product.sku}`} aria-label={`${open ? t('Sakrij informacije', 'Hide information') : t('Prikaži informacije', 'Show information')}: ${name}`} onClick={() => setOpen(value => !value)}>{open ? '−' : '+'}</button>
      </div>
    </Wrapper>
  )
}
