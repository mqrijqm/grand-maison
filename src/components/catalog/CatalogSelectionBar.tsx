'use client'

import Link from 'next/link'
import { inquiryLines, useCatalogInquiry } from '@/lib/catalog-inquiry'
import styles from './CatalogCommerce.module.css'

export default function CatalogSelectionBar() {
  const items = useCatalogInquiry()
  const count = inquiryLines(items).length
  return <div className={`${styles.selectionBar} bg-cobalt`}>
    <p aria-live="polite">{count ? `Stavke u upitu: ${count}` : 'Imate li plan šta gradite?'}</p>
    <Link href="#katalog-upit">{count ? 'Pregledajte stavke i količine' : 'Opišite projekat'} ↗</Link>
  </div>
}
