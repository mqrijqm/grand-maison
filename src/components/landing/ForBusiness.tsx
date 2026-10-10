'use client'

import { useRef } from 'react'
import Cta from '@/components/ui/Cta'
import Showcase from '@/components/business/portal/Showcase'
import { gsap, useGSAP } from '@/lib/gsap'
import { MQ } from '@/lib/motion'
import { revealChars } from '@/lib/reveal'
import s from '@/components/portal/Portal.module.css'

// Ulaz za firme na početnoj: isti interaktivni B2B portal (Showcase) kao na /za-firme, sa scenarijem
// narudžbe u četiri koraka. Vodi na /za-firme (glavna B2B stranica).
export default function ForBusiness() {
  const root = useRef<HTMLElement>(null)
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
    <section ref={root} id="za-firme" aria-labelledby="biz-title">
      <header className={`gutter ${s.intro}`}>
        <p className={`label ${s.kicker}`}>
          <i />
          Za firme i izvođače
        </p>
        <h2 id="biz-title" data-head className={`display invisible ${s.title}`}>
          B2B portal za nabavku
        </h2>
        <div className={s.introSide}>
          <p className={s.lead}>Za građevinske firme, izvođače i javne ustanove: brza narudžba po šifri, ponude, narudžbe i isporuke po gradilištima, dokumenti i odobrenja u timu. Ispod je interaktivni prikaz portala.</p>
          <div className={s.actions}>
            <Cta href="/za-firme" solid>
              Saznajte više
            </Cta>
            <Cta href="/upit-za-izvodjace?vrsta=saradnja">Zatražite nalog</Cta>
          </div>
        </div>
      </header>
      {/* Isti interaktivni portal kao na /za-firme, na plavoj traci preko cijele širine */}
      <div className={`gutter ${s.showcaseBand}`}>
        <Showcase />
      </div>
    </section>
  )
}
