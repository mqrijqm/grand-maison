'use client'

/* eslint-disable @next/next/no-img-element -- postojeće WebP fotografije stovarišta */
import { useRef } from 'react'
import Cta from '@/components/ui/Cta'
import { COMPANY } from '@/gc/gc'
import { MAPS_URL } from '@/lib/company'
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
            <p className="label mb-6 opacity-60">Grand Company · Banja Luka</p>
            <h2 id="yard-title" data-head className={`display invisible ${styles.title}`}>Prodaja i stovarište u Banjoj Luci</h2>
          </div>
          <p className={styles.lead}>Za izbor materijala i razgovor o nabavci javite se prodaji ili nas pronađite na adresi stovarišta.</p>
        </div>
        <div className={styles.photos}>
          {PHOTOS.map((photo, i) => (
            <figure className="m-0" key={photo.photo}>
              <div className={styles.photoWrap}>
                <img className={styles.photo} src={photo.photo} alt={photo.alt} width={1360} height={765} loading="lazy" decoding="async" />
                <img className={`${styles.photo} ${styles.photoBlue}`} src={photo.blue} alt="" aria-hidden width={1360} height={765} loading="lazy" decoding="async" />
              </div>
              <figcaption className={styles.caption}><span>{photo.label}</span><span className="opacity-45">0{i + 1}</span></figcaption>
            </figure>
          ))}
        </div>
        <div className={styles.location}>
          <div><p className="label mb-3 opacity-50">Adresa</p><p className={styles.address}>{COMPANY.address}</p></div>
          <div className={styles.contact}><p className="label mb-1 opacity-50">Prodaja</p><a href={COMPANY.phoneLandlineHref}>{COMPANY.phoneLandline}</a><a href={`mailto:${COMPANY.emailInfo}`}>{COMPANY.emailInfo}</a></div>
          <div className={styles.locationActions}><Cta href={MAPS_URL}>Otvorite mapu</Cta></div>
        </div>
      </div>
    </section>
  )
}
