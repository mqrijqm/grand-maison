'use client'

/* eslint-disable @next/next/no-img-element -- fotografije iz /public, već u WebP */

import Link from 'next/link'
import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'
import { useMediaMotion } from '@/lib/media'
import { MQ } from '@/lib/motion'
import { revealChars } from '@/lib/reveal'
import styles from './Story.module.css'

// Šta sajt radi, u četiri koraka: katalog → kalkulator → upit → preuzimanje. Svaki korak je broj,
// fotografija i jedna rečenica. Četvrti kadar je stvarno stovarište Grand Company.
const STEPS = [
  {
    title: 'Izaberite materijal',
    text: 'Katalog po kategorijama: suha gradnja, kamena vuna, građevinska hemija, drvo i sanitarna oprema.',
    image: '/stock/warehouse-profiles.webp',
    alt: 'Regali sa profilima i pločama u skladištu građevinskog materijala',
    href: '/prodavnica',
    cta: 'Katalog',
  },
  {
    title: 'Izračunajte količine',
    text: 'Upišite dužinu i visinu zida, a kalkulator izračuna ploče, profile i pribor.',
    image: '/stock/board-cut.webp',
    alt: 'Mjerenje i rezanje gips-kartonske ploče',
    href: '/kalkulator',
    cta: 'Kalkulator',
  },
  {
    title: 'Opišite šta gradite',
    text: 'Recite nam šta gradite i koji vam materijal treba. Nalog vam nije potreban.',
    image: '/editorial/firme/spisak.webp',
    alt: 'Ruka piše bilješke na podlozi sa planovima',
    href: '/upit-za-izvodjace',
    cta: 'Zatražite ponudu',
  },
  {
    title: 'Preuzmite ili dostava',
    text: 'Robu preuzimate na stovarištu u Banjoj Luci ili je dogovarate dostavom na adresu.',
    image: '/photos/palete-viljuskar.webp',
    alt: 'Palete sa materijalom i kamion na stovarištu Grand Company, snimak iz vazduha',
    href: '/dostava',
    cta: 'Dostava',
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
          <p data-up className={styles.lead}>
            Sajt radi ono što biste uradili na šalteru stovarišta: pronađete materijal, izračunate količine i opišete šta gradite.
          </p>
        </div>

        <ol className={styles.steps}>
          {STEPS.map((s, i) => (
            <li key={s.title}>
              <Link href={s.href} className={styles.step}>
                <span className={styles.stepNum} aria-hidden>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div data-curtain className={styles.stepPhoto}>
                  <img src={s.image} alt={s.alt} width={1200} height={1500} loading="lazy" decoding="async" />
                </div>
                <h3 className={`font-pretty ${styles.stepTitle}`}>{s.title}</h3>
                <p className={styles.stepText}>{s.text}</p>
                <span className={styles.stepLink}>
                  {s.cta}
                  <span aria-hidden>→</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
