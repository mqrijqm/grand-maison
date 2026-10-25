'use client'

import { useRef } from 'react'
import { openRegistration } from '@/lib/login-events'
import BlueWipe from '@/components/ui/BlueWipe'
import Cta from '@/components/ui/Cta'
import styles from '@/components/landing/WorkSections.module.css'
import { AUDIENCES, AUDIENCES_EN } from '@/lib/business'
import { gsap, useGSAP } from '@/lib/gsap'
import { useLang } from '@/lib/i18n'
import { MQ } from '@/lib/motion'
import { revealChars } from '@/lib/reveal'

// Za koga: isti raspored kao "Šta gradite?" na početnoj. Lijevo zalijepljen naslov na krem podlozi,
// desno plava traka (otvara se kvadratićima) sa jednim redom po vrsti kupca: broj, naslov, opis i
// konkretne koristi. Samo tekst, bez ilustracija i fotografija.
export default function WhoSplit() {
  const { t, lang } = useLang()
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
    // Naslovi se dijele na slova; pri promjeni jezika elementi se remontiraju (key) i podjela se ponovo gradi.
    { scope: root, dependencies: [lang], revertOnUpdate: true },
  )

  return (
    <section ref={root} aria-labelledby="biz-who" className="relative z-20 mt-[clamp(100px,18vh,220px)] bg-bg md:grid md:grid-cols-2">
      <div className={styles.panel}>
        <h2 key={lang} id="biz-who" data-head className={`display invisible ${styles.heading}`}>
          {t('Za koga je', 'Who is the')}
          <br />
          {t('B2B portal?', 'B2B portal for?')}
        </h2>
        <div className={styles.foot}>
          <p className="text-[14px] leading-[1.7] opacity-75">{t('Za firme koje kupuju za posao, redovno ili za jedan projekat.', 'For companies that buy for work, regularly or for a single project.')}</p>
          <Cta onClick={openRegistration} solid>
            {t('Zatražite poslovni nalog', 'Request a business account')}
          </Cta>
        </div>
      </div>
      <BlueWipe from="right" className="text-bg [--art-fill:var(--navy)] [--signal:var(--accent)]">
        {AUDIENCES.map((sr, i) => {
          const a = lang === 'en' ? { ...sr, ...AUDIENCES_EN[i] } : sr
          return (
          <article key={sr.title} data-use className={`${styles.row} md:!min-h-[44dvh] md:!py-[8vh]`}>
            <div>
              <p className="label flex items-center justify-between gap-6 text-bg/65">
                <span>
                  {String(i + 1).padStart(2, '0')} / {String(AUDIENCES.length).padStart(2, '0')}
                </span>
                <span>{a.label}</span>
              </p>
              <h3 key={lang} data-title className={`display invisible ${styles.title}`}>
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
          )
        })}
      </BlueWipe>
    </section>
  )
}
