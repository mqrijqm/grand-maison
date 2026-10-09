'use client'

import { useRef } from 'react'
import Cta from '@/components/ui/Cta'
import PortalStage from '@/components/portal/PortalStage'
import { gsap, useGSAP } from '@/lib/gsap'
import { MQ } from '@/lib/motion'
import { revealChars } from '@/lib/reveal'
import s from '@/components/portal/Portal.module.css'

// Ulaz za firme na početnoj prati B2B portal: isti živi dashboard kao na /portal,
// koji se sam "vozi" dok ga posjetilac ne preuzme mišem. Vodi na /portal i /za-firme.
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
          <p className={s.lead}>Za građevinske firme, izvođače i javne ustanove: brza narudžba po šifri, ponude, narudžbe i isporuke po gradilištima, dokumenti i odobrenja u timu. Ispod je živi demo.</p>
          <div className={s.actions}>
            <Cta href="/portal" solid>
              Otvorite portal
            </Cta>
            <Cta href="/za-firme">Za firme</Cta>
          </div>
        </div>
      </header>
      <PortalStage variant="preview" />
    </section>
  )
}
