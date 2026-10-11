'use client'

import { useRef } from 'react'
import { openRegistration } from '@/lib/login-events'
import BlueWipe from '@/components/ui/BlueWipe'
import Cta from '@/components/ui/Cta'
import styles from '@/components/landing/WorkSections.module.css'
import { AUDIENCES } from '@/lib/business'
import { gsap, useGSAP } from '@/lib/gsap'
import { MQ } from '@/lib/motion'
import { revealChars } from '@/lib/reveal'

// Za koga: isti raspored kao "Šta gradite?" na početnoj. Lijevo zalijepljen naslov na krem podlozi,
// desno plava traka (otvara se kvadratićima) sa jednim redom po vrsti kupca: broj, naslov, opis i
// konkretne koristi. Samo tekst, bez ilustracija i fotografija.
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
        })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} aria-labelledby="biz-who" className="relative z-20 mt-[clamp(100px,18vh,220px)] bg-bg md:grid md:grid-cols-2">
      <div className={styles.panel}>
        <h2 id="biz-who" data-head className={`display invisible ${styles.heading}`}>
          Za koga je
          <br />
          B2B portal?
        </h2>
        <div className={styles.foot}>
          <p className="text-[14px] leading-[1.7] opacity-75">Za firme koje kupuju za posao, redovno ili za jedan projekat.</p>
          <Cta onClick={openRegistration} solid>
            Zatražite poslovni nalog
          </Cta>
        </div>
      </div>
      <BlueWipe from="right" className="text-bg [--art-fill:var(--navy)] [--signal:var(--accent)]">
        {AUDIENCES.map((a, i) => (
          <article key={a.title} data-use className={`${styles.row} md:!min-h-[44dvh] md:!py-[8vh]`}>
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
