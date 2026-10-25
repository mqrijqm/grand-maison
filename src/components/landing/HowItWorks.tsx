'use client'

/* eslint-disable @next/next/no-img-element -- fotografije iz /public, već u WebP */

import Link from 'next/link'
import { useRef } from 'react'
import { useLang } from '@/lib/i18n'
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
    en: { title: 'Choose your material', text: 'A catalogue by category.', alt: 'Shelving with profiles and boards in a building-materials warehouse' },
  },
  {
    title: 'Izračunajte krov i zid',
    text: 'Kalkulatori proizvođača za Tondach i Porotherm.',
    href: '/kalkulator',
    image: '/stock/board-cut.webp',
    alt: 'Mjerenje i rezanje gips-kartonske ploče',
    en: { title: 'Calculate your roof and wall', text: 'Manufacturer calculators for Tondach and Porotherm.', alt: 'Measuring and cutting a plasterboard sheet' },
  },
  {
    title: 'Opišite šta gradite',
    text: 'Upit bez naloga.',
    image: '/editorial/firme/spisak.webp',
    alt: 'Ruka piše bilješke na podlozi sa planovima',
    en: { title: 'Tell us what you are building', text: 'Enquiry without an account.', alt: 'A hand writing notes on a surface covered in plans' },
  },
  {
    title: 'Preuzmite ili dostava',
    text: 'Stovarište ili dostava.',
    image: '/photos/palete-viljuskar.webp',
    alt: 'Palete sa materijalom i kamion na stovarištu Grand Company, snimak iz vazduha',
    en: { title: 'Collect or have it delivered', text: 'Yard pickup or delivery.', alt: 'Pallets of material and a truck at the Grand Company yard, aerial view' },
  },
] as const

export default function HowItWorks() {
  const { t, lang } = useLang()
  const root = useRef<HTMLElement>(null)
  useMediaMotion(root)
  useGSAP(
    () => {
      gsap.matchMedia().add(MQ, (ctx) => {
        const { reduce } = ctx.conditions as { reduce: boolean }
        revealChars(root.current!.querySelector('[data-head]')!, reduce, 'top 80%')
      })
    },
    { scope: root, dependencies: [lang] },
  )

  return (
    <section ref={root} id="kako" aria-labelledby="how-title" className={styles.section}>
      <div className="gutter">
        <div className={styles.head}>
          <h2 key={lang} id="how-title" data-head className={`display invisible ${styles.title}`}>
            {t('Od plana do gradilišta', 'From plan to building site')}
          </h2>
          <p data-up className={styles.lead}>{t('Četiri koraka, kao na šalteru stovarišta.', 'Four steps, just like at the yard counter.')}</p>
        </div>

        <ol className={styles.steps}>
          {STEPS.map((s, i) => (
            <li key={s.title} className={styles.step}>
              <div data-curtain className={styles.stepPhoto}>
                <img src={s.image} alt={t(s.alt, s.en.alt)} width={1200} height={900} loading="lazy" decoding="async" />
              </div>
              <div className={styles.stepBody}>
                <span className={styles.stepNum} aria-hidden>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>
                  <h3 className={styles.stepTitle}>{'href' in s ? <Link href={s.href} className="ulink">{t(s.title, s.en.title)}</Link> : t(s.title, s.en.title)}</h3>
                  <p className={styles.stepText}>{t(s.text, s.en.text)}</p>
                </span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
