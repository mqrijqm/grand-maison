'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap'
import { MQ } from '@/lib/motion'
import css from './BlueWipe.module.css'

// Prelaz za plave površine: plavi sloj uklizi sa strane, a prednja ivica mu je zrnasta (dither maska,
// isti jezik kao stepeničaste trake). Skrol vodi pokret; sadržaj (bijeli tekst) se pojavi tek kad
// plavo prekrije pozadinu, inače bi bio nevidljiv na krem boji. Okidač je roditeljska sekcija.
//   from="right": plavo dolazi sa desne strane (kolona uz desnu ivicu)
//   from="left":  plavo dolazi sa lijeve strane (panel uz lijevu ivicu)

type Props = {
  children: React.ReactNode
  from: 'left' | 'right'
  className?: string
  fillClassName?: string
  contentClassName?: string
}

export default function BlueWipe({ children, from, className = '', fillClassName = 'bg-navy', contentClassName = '' }: Props) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = root.current!
      const fill = el.querySelector<HTMLElement>('[data-wipe-fill]')!
      const content = el.querySelector<HTMLElement>('[data-wipe-content]')!
      const trigger = el.parentElement ?? el
      const mm = gsap.matchMedia()
      mm.add(MQ, (ctx) => {
        const { reduce } = ctx.conditions as { reduce: boolean }
        if (reduce) return
        const start = from === 'right' ? 100 : -100
        gsap.set(fill, { xPercent: start })
        gsap.set(content, { autoAlpha: 0, y: 28 })
        const tl = gsap.timeline({ scrollTrigger: { trigger, start: 'top 92%', end: 'top 8%', scrub: 0.7 } })
        tl.to(fill, { xPercent: 0, ease: 'power2.inOut', duration: 1 }, 0)
        tl.to(content, { autoAlpha: 1, y: 0, ease: 'power1.out', duration: 0.45 }, 0.55)
        return () => {
          gsap.set([fill, content], { clearProps: 'all' })
        }
      })
    },
    { scope: root },
  )

  // Kad se visina stranice promijeni (scena herosa se učita ili padne na statičnu sliku), pozicije
  // okidača su zastarjele: bez ponovnog mjerenja plava traka ostane na početku.
  useEffect(() => {
    let timer = 0
    const observer = new ResizeObserver(() => {
      window.clearTimeout(timer)
      timer = window.setTimeout(() => ScrollTrigger.refresh(), 250)
    })
    observer.observe(document.body)
    return () => {
      window.clearTimeout(timer)
      observer.disconnect()
    }
  }, [])

  return (
    <div ref={root} className={`${css.wrap} relative ${className}`}>
      <div data-wipe-fill aria-hidden className={`${css.fill} ${fillClassName}`}>
        <i className={`${css.edge} ${from === 'right' ? css.edgeLeft : css.edgeRight}`} />
      </div>
      <div data-wipe-content className={`${css.content} ${contentClassName}`}>
        {children}
      </div>
    </div>
  )
}
