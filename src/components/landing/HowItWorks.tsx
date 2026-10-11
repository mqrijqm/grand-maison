'use client'

/* eslint-disable @next/next/no-img-element -- fotografije iz /public, već u WebP */

import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'
import { useMediaMotion } from '@/lib/media'
import { MQ } from '@/lib/motion'
import { revealChars } from '@/lib/reveal'
import styles from './Story.module.css'

// Šta sajt radi, u četiri koraka: katalog → kalkulator → upit → preuzimanje. Svaki korak je manja
// fotografija, mali blijedi broj, naslov i jedna kratka rečenica (bez dugmadi). Četvrti kadar je stvarno stovarište Grand Company.
const STEPS = [
  {
    title: 'Izaberite materijal',
    text: 'Katalog po kategorijama.',
    image: '/stock/warehouse-profiles.webp',
    alt: 'Regali sa profilima i pločama u skladištu građevinskog materijala',
  },
  {
    title: 'Izračunajte količine',
    text: 'Kalkulator za pregradni zid.',
    image: '/stock/board-cut.webp',
    alt: 'Mjerenje i rezanje gips-kartonske ploče',
  },
  {
    title: 'Opišite šta gradite',
    text: 'Upit bez naloga.',
    image: '/editorial/firme/spisak.webp',
    alt: 'Ruka piše bilješke na podlozi sa planovima',
  },
  {
    title: 'Preuzmite ili dostava',
    text: 'Stovarište ili dostava.',
    image: '/photos/palete-viljuskar.webp',
    alt: 'Palete sa materijalom i kamion na stovarištu Grand Company, snimak iz vazduha',
  },
] as const

export default function HowItWorks() {
  const root = useRef<HTMLElement>(null)
  useMediaMotion(root)
  useGSAP(
    () => {
      gsap.matchMedia().add(MQ, (ctx) => {
        const { reduce } = ctx.conditions as { reduce: boolean }
        revealChars(root.current!.querySelector('[data-head]')!, reduce, 'top 80%')
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="kako" aria-labelledby="how-title" className={styles.section}>
      <div className="gutter">
        <div className={styles.head}>
          <h2 id="how-title" data-head className={`display invisible ${styles.title}`}>
            Od plana do gradilišta
          </h2>
          <p data-up className={styles.lead}>Četiri koraka, kao na šalteru stovarišta.</p>
        </div>

        <ol className={styles.steps}>
          {STEPS.map((s, i) => (
            <li key={s.title} className={styles.step}>
              <div data-curtain className={styles.stepPhoto}>
                <img src={s.image} alt={s.alt} width={1200} height={900} loading="lazy" decoding="async" />
              </div>
              <div className={styles.stepBody}>
                <span className={styles.stepNum} aria-hidden>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>
                  <h3 className={styles.stepTitle}>{s.title}</h3>
                  <p className={styles.stepText}>{s.text}</p>
                </span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
