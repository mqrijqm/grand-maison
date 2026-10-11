'use client'

import { useRef } from 'react'
import Cta from '@/components/ui/Cta'
import { gsap, useGSAP } from '@/lib/gsap'
import { useMediaMotion } from '@/lib/media'
import { MQ } from '@/lib/motion'
import { revealChars } from '@/lib/reveal'
import CatalogMarkets from '@/components/catalog/CatalogMarkets'
import styles from './Offerings.module.css'

// Prvi ekran poslije herosa: naslov i kratak opis, pa iste kartice kategorija kao na prodavnici
// (CatalogMarkets, varijanta "strip"). id="radovi" je postojeći okidač za odlazak velikog wordmarka.

export default function Intro() {
  const root = useRef<HTMLElement>(null)
  useMediaMotion(root)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ, (ctx) => {
        const { reduce } = ctx.conditions as { reduce: boolean }
        revealChars(root.current!.querySelector('[data-head]')!, reduce, 'top 80%')
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="radovi" aria-labelledby="offerings-title" className="relative z-20 bg-bg pb-[8vh] pt-[24vh]">
      <div className={`gutter ${styles.heading}`}>
        <h2
          id="offerings-title"
          data-head
          className={`display invisible ${styles.title}`}
        >
          Krov, zid, malter i izolacija na jednom mjestu
        </h2>

        <div data-up data-delay="0.1" className={styles.lead}>
            <p className="text-[15px] leading-[1.7] opacity-75">
              Stovarište, veleprodaja i maloprodaja građevinskog materijala u Banjoj Luci, od 2012. Za firme, izvođače i vaš sljedeći projekat.
            </p>
            <div data-up data-delay="0.2" className="mt-7 flex flex-wrap gap-3">
              <Cta href="/prodavnica" solid>
                Asortiman
              </Cta>
              <Cta href="/upit-za-izvodjace">Opišite šta gradite</Cta>
            </div>
        </div>
      </div>

      {/* Iste kartice kategorija kao na prodavnici (fotografija, naslov, opis, podkategorije): zakačena
          traka koju skrol vodi ulijevo; na telefonu se lista prstom. */}
      <div className="mt-[12vh]">
        <CatalogMarkets variant="strip" />
      </div>
    </section>
  )
}
