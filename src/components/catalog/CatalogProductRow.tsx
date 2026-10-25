'use client'

/* eslint-disable @next/next/no-img-element -- gotove fotografije artikala iz kataloga */
import Link from 'next/link'
import Price from '@/components/b2b/Price'
import { toggleInquiryItem, useCatalogInquiry } from '@/lib/catalog-inquiry'
import { brandL, pName, pSpec, unitL, type Product } from '@/lib/shop'
import { useLang } from '@/lib/i18n'
import styles from './CatalogCommerce.module.css'

export default function CatalogProductRow({ product }: { product: Product }) {
  const selection = useCatalogInquiry()
  const { t, lang } = useLang()
  const name = pName(product, lang)
  const selected = !!selection[product.sku]
  return (
    <li className={styles.row}>
      <Link href={`/prodavnica/${product.sku}`} tabIndex={-1} aria-hidden><img src={product.image} alt="" width={64} height={80} loading="lazy" decoding="async" className={styles.thumb} /></Link>
      <div className={styles.rowMain}>
        <span className={styles.rowMeta}>{product.sku}{product.brand !== 'Ostali proizvođači' && ` · ${brandL(product.brand, lang)}`}</span>
        <Link href={`/prodavnica/${product.sku}`} className={styles.rowTitle}>{name}</Link>
        <span className={styles.rowSpec}>{pSpec(product, lang)} · {t('Jedinica', 'Unit')}: {unitL(product.unit, lang)}</span>
      </div>
      <div className={styles.rowPrice}><Price value={product.price} unit={product.unit} /></div>
      <button className={styles.rowAction} type="button" aria-pressed={selected} aria-label={`${selected ? t('Ukloni iz upita', 'Remove from enquiry') : t('Dodaj u upit', 'Add to enquiry')}: ${name}`} onClick={() => toggleInquiryItem(product)}>{selected ? t('U upitu ✓', 'In enquiry ✓') : t('Dodaj u upit', 'Add to enquiry')}</button>
    </li>
  )
}
