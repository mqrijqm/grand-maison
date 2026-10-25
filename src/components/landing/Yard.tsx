'use client'

/* eslint-disable @next/next/no-img-element -- postojeće WebP fotografije stovarišta */
import { useLang } from '@/lib/i18n'
import styles from './ClosingSections.module.css'

const PHOTOS = [
  { photo: '/stovariste/yard.webp', blue: '/stovariste/yard-blue-v2.webp', label: 'Stovarište', alt: 'Pregled stovarišta Grand Company u Banjoj Luci', en: { label: 'The yard', alt: 'Overview of the Grand Company yard in Banja Luka' } },
  { photo: '/stovariste/shop.webp', blue: '/stovariste/shop-blue-v2.webp', label: 'Prodaja', alt: 'Prodajni objekat Grand Company na lokaciji stovarišta', en: { label: 'Sales', alt: 'The Grand Company sales building at the yard location' } },
]
// Dvije fotografije stovarišta od ivice do ivice, odmah ispod plave sekcije recenzija (bez naslova).
export default function Yard() {
  const { t } = useLang()
  return (
    <section id="stovariste" className={`${styles.section} ${styles.yardBleed}`} aria-label={t('Prodaja i stovarište u Banjoj Luci', 'Sales and yard in Banja Luka')}>
      <div className={`${styles.photos} ${styles.photosFull}`}>
        {PHOTOS.map((photo) => (
          <figure className="m-0" key={photo.photo}>
            <div className={styles.photoWrap}>
              <img className={styles.photo} src={photo.photo} alt={t(photo.alt, photo.en.alt)} width={1360} height={765} loading="lazy" decoding="async" />
              <img className={`${styles.photo} ${styles.photoBlue}`} src={photo.blue} alt="" aria-hidden width={1360} height={765} loading="lazy" decoding="async" />
            </div>
            <figcaption className={`${styles.caption} ${styles.captionCenter}`}><span>{t(photo.label, photo.en.label)}</span></figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
