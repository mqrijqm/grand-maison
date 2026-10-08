'use client'

/* eslint-disable @next/next/no-img-element -- fotografija iz /public, već u WebP */

import { useRef } from 'react'
import Cta from '@/components/ui/Cta'
import { drawOnScroll } from '@/lib/draw'
import { gsap, useGSAP } from '@/lib/gsap'
import { useMediaMotion } from '@/lib/media'
import { MQ } from '@/lib/motion'
import { revealChars } from '@/lib/reveal'
import { WASTE_DEFAULT, calcW111Area } from '@/lib/w111'
import UseArt from './UseArt'
import styles from './Story.module.css'

// Kalkulator u jednoj slici: dimenzije zida → površina → spisak. Brojevi nisu upisani ručno, računa ih
// ista funkcija kao /kalkulator (W111, jednostruka obloga, vuna, 5 % rezerve), pa uvijek odgovaraju.
const L = 4
const H = 2.6
const AREA = Math.round(L * H * 100) / 100
const LINES = calcW111Area(AREA, 'single', 'GKP-001', { wool: true, tape: false, waste: WASTE_DEFAULT })

const nf = (n: number) => n.toLocaleString('de-DE', { maximumFractionDigits: 2 })

export default function CalcTeaser() {
  const root = useRef<HTMLElement>(null)
  useMediaMotion(root)
  useGSAP(
    () => {
      const el = root.current!
      gsap.matchMedia().add(MQ, (ctx) => {
        const { reduce } = ctx.conditions as { reduce: boolean }
        revealChars(el.querySelector('[data-head]')!, reduce, 'top 80%')
        const svg = el.querySelector('[data-calc-art] svg')
        if (svg) drawOnScroll(svg, reduce, { trigger: el, start: 'top 70%' })
        if (reduce) return
        gsap.from(el.querySelectorAll('[data-bom]'), {
          autoAlpha: 0,
          x: -16,
          duration: 0.45,
          ease: 'power3.out',
          stagger: 0.06,
          scrollTrigger: { trigger: el.querySelector('[data-bom-list]'), start: 'top 85%' },
        })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="kalkulator" aria-labelledby="calc-title" className={styles.section}>
      <div className={`gutter ${styles.calc}`}>
        <div>
          <p className={`label ${styles.kicker}`}>Kalkulator · pregradni zid</p>
          <h2 id="calc-title" data-head className={`display invisible mt-5 ${styles.title}`}>
            Koliko materijala vam treba?
          </h2>

          <p className={styles.equation} aria-label={`Zid ${nf(L)} puta ${nf(H)} metra je ${nf(AREA)} kvadratnih metara`}>
            <span className={styles.eqIn}>
              {nf(L)} × {nf(H)}
              <span className={styles.eqUnit}>m</span>
            </span>
            <span className={styles.eqArrow} aria-hidden>→</span>
            <span className={styles.eqOut}>
              {nf(AREA)}
              <span className={styles.eqUnit}>m²</span>
            </span>
          </p>

          <ul data-bom-list className={styles.bom}>
            {LINES.map((l) => (
              <li key={l.key} data-bom className={styles.bomRow}>
                <span className={styles.bomQty}>{l.packs}</span>
                <span className={styles.bomName}>
                  {l.label}
                  <span className={styles.bomPack}>{l.packName}</span>
                </span>
              </li>
            ))}
          </ul>
          <p className={styles.note}>
            Primjer za zid {nf(L)} × {nf(H)} m sa vunom i 5 % rezerve. Proračun je orijentacioni; količine potvrđuje prodaja uz ponudu.
          </p>
          <div className={styles.actions}>
            <Cta href="/kalkulator" solid>
              Izračunajte svoj zid
            </Cta>
          </div>
        </div>

        <figure className={`m-0 ${styles.calcArt}`}>
          <div data-calc-art className={styles.calcArtBox}>
            <UseArt use="pregradni-zid" title="Presjek pregradnog zida: ploče, metalni profili i kamena vuna" />
          </div>
          <div data-curtain className={styles.calcPhoto}>
            <img src="/photos/drywall-frame.webp" alt="Metalna potkonstrukcija pregradnog zida prije oblaganja pločama" width={900} height={1125} loading="lazy" decoding="async" />
          </div>
          <figcaption className={styles.calcCaption}>
            <span>Ploča · profil · vuna</span>
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
