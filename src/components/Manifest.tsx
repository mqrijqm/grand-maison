'use client'

import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'
import { EASE, MQ } from '@/lib/motion'
import { revealLines } from '@/lib/reveal'
import { useLang } from '@/lib/i18n'

export default function Manifest() {
  const { t, lang } = useLang()
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const el = root.current!
      const box = el.querySelector('[data-box]')!
      const mm = gsap.matchMedia()

      mm.add(MQ, (ctx) => {
        const { reduce } = ctx.conditions as { reduce: boolean }
        if (reduce) gsap.set(box, { clipPath: 'inset(0% 0% 0% 0%)' })
        else {
          // Okvir se otvara iz sredine, a tek onda izranja tekst.
          gsap.fromTo(
            box,
            { clipPath: 'inset(50% 50% 50% 50%)' },
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              duration: 1.2,
              ease: EASE.quintInOut,
              scrollTrigger: { trigger: box, start: 'top 80%' },
            },
          )
        }
        revealLines(el.querySelector('[data-lines]')!, reduce, 'top 72%')
      })
    },
    { scope: root, dependencies: [lang], revertOnUpdate: true },
  )

  return (
    <section ref={root} className="relative z-10 flex w-full flex-col items-center py-[20dvh]">
      <div
        data-box
        className="w-[88vw] border-[10px] border-ink px-[3vw] py-[50px] md:w-[48.75vw]"
        style={{ clipPath: 'inset(50% 50% 50% 50%)' }}
      >
        <p
          data-lines
          key={lang}
          className="invisible text-center text-[clamp(14px,1.56vw,28px)] uppercase leading-none"
        >
          {t(
            <>Paleta ne ostaje<br />na ulici.<br />Kamion sa kranom<br />je spušta na etažu<br />ili na skelu.</>,
            <>The pallet never<br />stays in the street.<br />A crane truck<br />lowers it to the floor<br />or onto the scaffold.</>,
          )}
        </p>
      </div>
    </section>
  )
}
