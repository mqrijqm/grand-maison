'use client'

/* eslint-disable @next/next/no-img-element -- postojeće WebP fotografije stovarišta */
import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'
import { MQ } from '@/lib/motion'
import { revealChars } from '@/lib/reveal'
import styles from './ClosingSections.module.css'

const PHOTOS = [
  { photo: '/stovariste/yard.webp', blue: '/stovariste/yard-blue-v2.webp', label: 'Stovarište', alt: 'Pregled stovarišta Grand Company u Banjoj Luci' },
  { photo: '/stovariste/shop.webp', blue: '/stovariste/shop-blue-v2.webp', label: 'Prodaja', alt: 'Prodajni objekat Grand Company na lokaciji stovarišta' },
]
export default function Yard() {
  const root = useRef<HTMLElement>(null)
  useGSAP(() => {
    gsap.matchMedia().add(MQ, ctx => {
      const { reduce } = ctx.conditions as { reduce: boolean }
      revealChars(root.current!.querySelector('[data-head]')!, reduce, 'top 85%')
    })
  }, { scope: root })
  return (
    <section ref={root} id="stovariste" className={styles.section} aria-labelledby="yard-title">
      <div className="gutter">
        <div className={styles.heading}>
          <div>
            <h2 id="yard-title" data-head className={`display invisible ${styles.title}`}>Prodaja i stovarište u Banjoj Luci</h2>
          </div>
        </div>
        <div className={styles.photos}>
          {PHOTOS.map((photo) => (
            <figure className="m-0" key={photo.photo}>
              <div className={styles.photoWrap}>
                <img className={styles.photo} src={photo.photo} alt={photo.alt} width={1360} height={765} loading="lazy" decoding="async" />
                <img className={`${styles.photo} ${styles.photoBlue}`} src={photo.blue} alt="" aria-hidden width={1360} height={765} loading="lazy" decoding="async" />
              </div>
              <figcaption className={styles.caption}><span>{photo.label}</span></figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
