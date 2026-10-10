'use client'

import { useRef } from 'react'
import Showcase from '@/components/business/portal/Showcase'
import SquareDissolve from '@/components/ui/SquareDissolve'
import { gsap, useGSAP } from '@/lib/gsap'
import s from '@/components/portal/Portal.module.css'

// Odmah ispod B2B blokova (Bento): isti interaktivni portal kao na /za-firme, bez uvodnog teksta.
// Na ulazu je širok kao blokovi iznad (ista margina), pa se skrolom "odzumira" na svoju veličinu.
// Pozadina je bijela; pri dnu niču kvadratići, prvo blijedi pa jarko plavi, i nastavljaju se u
// plavi prelaz sekcije ispod (BrandsSplit).
export default function ForBusiness() {
  const root = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      gsap.matchMedia().add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
        const el = root.current!
        const frame = el.querySelector<HTMLElement>('[data-zoom]')!
        // Početni zum: širina okvira = širina sekcije minus margina blokova (12–16 px).
        const start = () => (el.clientWidth - 32) / frame.offsetWidth
        gsap.fromTo(
          frame,
          { scale: start },
          { scale: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 10%', scrub: 0.6, invalidateOnRefresh: true } },
        )
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="za-firme" aria-label="B2B portal, interaktivni prikaz" className={s.forBiz}>
      <div className={`gutter ${s.forBizInner}`}>
        <div data-zoom className={s.forBizFrame}>
          <Showcase light />
        </div>
      </div>
      <SquareDissolve className={s.forBizDissolve} color="var(--cobalt)" tint solid={false} />
    </section>
  )
}
