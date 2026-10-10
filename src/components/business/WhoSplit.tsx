'use client'

import { useRef } from 'react'
import BlueWipe from '@/components/ui/BlueWipe'
import Cta from '@/components/ui/Cta'
import { axisShift } from '@/components/landing/iso'
import WorkArt from '@/components/landing/WorkArt'
import styles from '@/components/landing/WorkSections.module.css'
import { AUDIENCES } from '@/lib/business'
import { drawOnScroll } from '@/lib/draw'
import { gsap, useGSAP } from '@/lib/gsap'
import { MQ } from '@/lib/motion'
import { revealChars } from '@/lib/reveal'

// Za koga: isti raspored kao "Šta gradite?" na početnoj. Lijevo zalijepljen naslov na krem podlozi,
// desno plava traka (otvara se kvadratićima) sa jednim redom po vrsti kupca: broj, naslov, linijski
// crtež posla i dvije konkretne koristi. Bez fotografija, minimalno.
export default function WhoSplit() {
  const root = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      const el = root.current!
      gsap.matchMedia().add(MQ, (ctx) => {
        const { reduce } = ctx.conditions as { reduce: boolean }
        revealChars(el.querySelector('[data-head]')!, reduce, 'top 75%')
        gsap.utils.toArray<HTMLElement>('[data-use]', el).forEach((row) => {
          revealChars(row.querySelector('[data-title]')!, reduce, 'top 80%', row)
          row.querySelectorAll<SVGSVGElement>('[data-work-art] svg').forEach((svg) => {
            drawOnScroll(svg, reduce, { trigger: row, start: 'top bottom' })
            if (reduce) return
            const axis = svg.dataset.axis as 'x' | 'y' | 'z'
            const gap = Number(svg.dataset.gap)
            if (!gap) return
            gsap.utils.toArray<SVGGElement>('[data-layer]', svg).forEach((layer, k) => {
              const { x, y } = axisShift(axis, k * gap)
              gsap.fromTo(layer, { x: 0, y: 0 }, { x, y, ease: 'none', scrollTrigger: { trigger: row, start: 'top 60%', end: 'bottom 30%', scrub: 0.8 } })
            })
          })
        })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} aria-labelledby="biz-who" className="relative z-20 mt-[clamp(100px,18vh,220px)] bg-bg md:grid md:grid-cols-2">
      <div className={styles.panel}>
        <h2 id="biz-who" data-head className={`display invisible ${styles.heading}`}>
          Za
          <br />
          koga?
        </h2>
        <div className={styles.foot}>
          <p className="text-[14px] leading-[1.7] opacity-75">Za firme koje kupuju za posao, redovno ili za jedan projekat.</p>
          <Cta href="/upit-za-izvodjace?vrsta=saradnja" solid>
            Zatražite poslovni nalog
          </Cta>
        </div>
      </div>
      <BlueWipe from="right" className="text-bg [--art-fill:var(--navy)] [--signal:var(--accent)]">
        {AUDIENCES.map((a, i) => (
          <article key={a.title} data-use className={styles.row}>
            <div>
              <p className="label flex items-center justify-between gap-6 text-bg/65">
                <span>
                  {String(i + 1).padStart(2, '0')} / {String(AUDIENCES.length).padStart(2, '0')}
                </span>
                <span>{a.label}</span>
              </p>
              <h3 data-title className={`display invisible ${styles.title}`}>
                {a.title}
              </h3>
            </div>
            <div className={styles.illustration}>
              <WorkArt kind={a.art} />
            </div>
            <div className={styles.bottom}>
              <p className={styles.description}>{a.text}</p>
              <ul className="mt-5 grid gap-2 text-[13px] normal-case tracking-normal">
                {a.points.map((p) => (
                  <li key={p} className="flex items-center gap-3">
                    <i className="block size-[7px] bg-bg" aria-hidden />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </BlueWipe>
    </section>
  )
}
