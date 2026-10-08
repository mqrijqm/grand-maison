'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { inquiryHref, inquiryLines, inquiryQty, removeInquiryItem, setInquiryQuantity, useCatalogInquiry } from '@/lib/catalog-inquiry'
import styles from './CatalogCommerce.module.css'

export default function CatalogProjectQuote({ embedded = false }: { embedded?: boolean }) {
  const items = useCatalogInquiry()
  const lines = inquiryLines(items)
  const router = useRouter()
  const content = (
    <section id="katalog-spisak" className={`${styles.project} bg-cobalt ${embedded ? styles.embedded : styles.banded}`} aria-labelledby="catalog-project-title">
      <div className={`gutter ${styles.projectLayout}`}>
        <div>
          <p className="label opacity-65">Nabavka za vaš projekat</p>
          <h2 id="catalog-project-title" className={`display ${styles.projectTitle}`}>Od materijala do ponude</h2>
          <p className={styles.projectLead}>Sastavite spisak iz kataloga ili priložite svoj predmjer. U upitu dodajte kontakt, lokaciju i željeni rok.</p>
        </div>
        <div className={styles.listPanel}>
          <div className={styles.listHeading}><h3>Vaš spisak materijala</h3><span aria-live="polite">{lines.length ? `${lines.length} stavki` : 'Spisak po upitu'}</span></div>
          {lines.length ? <form onSubmit={event => {
            event.preventDefault()
            const form = new FormData(event.currentTarget)
            const next: Record<string, number> = {}
            for (const { product } of lines) {
              const qty = inquiryQty(form.get(product.sku))
              if (qty === null) return
              next[product.sku] = qty
              setInquiryQuantity(product.sku, qty)
            }
            router.push(inquiryHref(next))
          }}>
            <ul className={styles.draftList}>{lines.map(({ product, qty }) => <li className={styles.draftRow} key={product.sku}>
              <div><p className={styles.draftName}>{product.name}</p><span className={styles.draftSpec}>{product.spec}</span></div>
              <label className={styles.quantity}><span>{product.unit}</span><input type="number" name={product.sku} defaultValue={qty} required min={.01} max={9999} step={.01} aria-label={`Količina: ${product.name}`} onChange={event => { const value = inquiryQty(event.target.value); if (value !== null) setInquiryQuantity(product.sku, value) }} /></label>
              <button type="button" className={styles.remove} aria-label={`Ukloni iz spiska: ${product.name}`} onClick={() => removeInquiryItem(product.sku)}>×</button>
            </li>)}</ul>
            <button type="submit" className={styles.send}><span>Nastavite na upit za ponudu</span><span aria-hidden>↗</span></button>
            <p className={styles.listHelp}>Spisak i količine prenose se u obrazac. Cijenu i dostupnost potvrđuje prodaja. Nalog nije potreban.</p>
          </form> : <>
            <p className={styles.emptyList}>Dodajte artikle iz kataloga u upit. Ako već imate spisak, priložite PDF, Excel ili fotografiju u obrascu.</p>
            <Link className={styles.send} href="/upit-za-izvodjace"><span>Pošaljite svoj spisak</span><span aria-hidden>↗</span></Link>
            <p className={styles.listHelp}>Za ponudu su korisni materijal, količina i jedinica mjere. Poslovni nalog nije potreban.</p>
          </>}
        </div>
      </div>
    </section>
  )
  return content
}
