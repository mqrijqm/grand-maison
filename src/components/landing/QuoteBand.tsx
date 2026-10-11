'use client'

/* eslint-disable @next/next/no-img-element -- fotografija iz /public, već u WebP */

import { useRef } from 'react'
import Cta from '@/components/ui/Cta'
import { COMPANY as GC } from '@/gc/gc'
import { gsap, useGSAP } from '@/lib/gsap'
import { useMediaMotion } from '@/lib/media'
import { MQ } from '@/lib/motion'
import { revealChars } from '@/lib/reveal'
import styles from './Story.module.css'

// Završni poziv pred podnožjem: jedno pitanje, jedno dugme, telefon i radno vrijeme.
export default function QuoteBand() {
  const root = useRef<HTMLElement>(null)
  useMediaMotion(root)
  useGSAP(
    () => {
      gsap.matchMedia().add(MQ, (ctx) => {
        const { reduce } = ctx.conditions as { reduce: boolean }
        revealChars(root.current!.querySelector('[data-head]')!, reduce, 'top 85%')
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} aria-labelledby="band-title" className={`${styles.section} pb-[14vh]`}>
      <div className={`gutter ${styles.band}`}>
        <div>
          <h2 id="band-title" data-head className={`display invisible ${styles.bandTitle}`}>
            Imate li plan šta gradite?
          </h2>
          <p data-up className={`mt-8 ${styles.lead}`}>
            Recite nam koji vam materijal treba i u kojoj količini. Prodaja vam šalje ponudu sa cijenom i dostupnošću, a naš tim vam savjetuje izbor.
          </p>
          <div className={styles.actions}>
            <Cta href="/upit-za-izvodjace" solid>
              Opišite šta gradite
            </Cta>
            <Cta href="/kontakt">Kontakt</Cta>
          </div>
        </div>

        <div className={styles.bandSide}>
          <div data-curtain className={styles.bandPhoto}>
            <img src="/editorial/firme/planovi.webp" alt="Ruke nad građevinskim planovima" width={1200} height={1500} loading="lazy" decoding="async" />
          </div>
          <div className={styles.bandMeta}>
            <div>
              <p className="label opacity-60">Prodaja</p>
              <a href={GC.phoneLandlineHref} className="mt-2 block">
                {GC.phoneLandline}
              </a>
              <a href={GC.phoneLandline2Href} className="block">
                {GC.phoneLandline2}
              </a>
            </div>
            <div>
              <p className="label opacity-60">Radno vrijeme</p>
              <span className="mt-2 block">07:00–16:00</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
