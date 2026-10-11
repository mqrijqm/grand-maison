'use client'

/* eslint-disable @next/next/no-img-element -- postojeće WebP fotografije stovarišta */
import styles from './ClosingSections.module.css'

const PHOTOS = [
  { photo: '/stovariste/yard.webp', blue: '/stovariste/yard-blue-v2.webp', label: 'Stovarište', alt: 'Pregled stovarišta Grand Company u Banjoj Luci' },
  { photo: '/stovariste/shop.webp', blue: '/stovariste/shop-blue-v2.webp', label: 'Prodaja', alt: 'Prodajni objekat Grand Company na lokaciji stovarišta' },
]
// Dvije fotografije stovarišta od ivice do ivice, odmah ispod plave sekcije recenzija (bez naslova).
export default function Yard() {
  return (
    <section id="stovariste" className={`${styles.section} ${styles.yardBleed}`} aria-label="Prodaja i stovarište u Banjoj Luci">
      <div className={`${styles.photos} ${styles.photosFull}`}>
        {PHOTOS.map((photo) => (
          <figure className="m-0" key={photo.photo}>
            <div className={styles.photoWrap}>
              <img className={styles.photo} src={photo.photo} alt={photo.alt} width={1360} height={765} loading="lazy" decoding="async" />
              <img className={`${styles.photo} ${styles.photoBlue}`} src={photo.blue} alt="" aria-hidden width={1360} height={765} loading="lazy" decoding="async" />
            </div>
            <figcaption className={`${styles.caption} ${styles.captionCenter}`}><span>{photo.label}</span></figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
