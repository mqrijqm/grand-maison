'use client'

import { useRef } from 'react'
import Showcase from '@/components/business/portal/Showcase'
import { gsap, useGSAP } from '@/lib/gsap'
import s from '@/components/portal/Portal.module.css'

// Odmah ispod B2B blokova (Bento): isti interaktivni portal kao na /za-firme, bez teksta i koraka.
// Na ulazu je iste širine kao blokovi iznad; skrolom se smanji i odmakne od ivica ekrana.
// Pozadina je mirna krem, bez animiranih kvadratića.
export default function ForBusiness() {
  const root = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      gsap.matchMedia().add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
        const frame = root.current!.querySelector<HTMLElement>('[data-zoom]')!
        gsap.fromTo(frame, { scale: 1 }, { scale: 0.84, ease: 'none', scrollTrigger: { trigger: root.current!, start: 'top 70%', end: 'top 5%', scrub: 0.6 } })
      })
    },
    { scope: root },
  )
  return (
    <section ref={root} id="za-firme" aria-label="B2B portal, interaktivni prikaz" className={s.forBiz}>
      <div className={s.forBizInner}>
        <div data-zoom className={s.forBizFrame}>
          <Showcase light steps={false} />
        </div>
      </div>
    </section>
  )
}
