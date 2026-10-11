'use client'

/* eslint-disable @next/next/no-img-element -- WebP fotografije iz /public */

import { useRef } from 'react'
import Cta from '@/components/ui/Cta'
import { gsap, useGSAP } from '@/lib/gsap'
import { CALC_GROUPS, MANUFACTURER_CALCS } from '@/lib/manufacturer-calculators'
import { useMediaMotion } from '@/lib/media'
import { EASE, MQ } from '@/lib/motion'
import { revealChars } from '@/lib/reveal'
import styles from './CalculatorsHub.module.css'

// "Kalkulatori": kartice koje vode na zvanične kalkulatore Wienerbergera (Tondach krov, Porotherm zid).
// Grand Company je na Wienerbergerovoj listi prodajnih mjesta (april 2020) za ove proizvode; kalkulatori
// nisu naši i otvaraju se na sajtu proizvođača. `embedded` = sekcija na početnoj (h2, sidro #kalkulator).

const External = () => (
  <svg viewBox="0 0 16 16" aria-hidden className={styles.ext} fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path d="M9 3h4v4M13 3 7 9M11 9.5V13H3V5h3.5" />
  </svg>
)

export default function CalculatorsHub({ embedded = false }: { embedded?: boolean }) {
  const root = useRef<HTMLElement>(null)
  useMediaMotion(root)

  useGSAP(
    () => {
      const el = root.current!
      gsap.matchMedia().add(MQ, (ctx) => {
        const { reduce } = ctx.conditions as { reduce: boolean }
        revealChars(el.querySelector('[data-head]')!, reduce, 'top 82%')
        if (reduce) return
        el.querySelectorAll<HTMLElement>('[data-group]').forEach((group) => {
          gsap.from(group.querySelectorAll('[data-card]'), {
            y: 50,
            autoAlpha: 0,
            duration: 0.55,
            ease: EASE.quint,
            stagger: 0.08,
            scrollTrigger: { trigger: group, start: 'top 85%' },
          })
        })
      })
    },
    { scope: root },
  )

  const Heading = embedded ? 'h2' : 'h1'

  return (
    <section ref={root} id={embedded ? 'kalkulator' : undefined} aria-labelledby="calcs-title" className={styles.page}>
      <header className={`gutter ${styles.head}`}>
        <div>
          <p className="label opacity-60">Kalkulatori · Tondach i Porotherm</p>
          <Heading id="calcs-title" data-head className={`display invisible ${styles.title}`}>
            Izračunajte krov i zid
          </Heading>
        </div>
        <p data-up className={`${styles.lead} ${styles.headLead}`}>
          Za krov od Tondach crijepa i zid od Porotherm opeke proizvođač Wienerberger nudi besplatne kalkulatore. Grand
          Company je na Wienerbergerovoj listi prodajnih mjesta za ove proizvode, a dostupnost modela potvrđuje prodaja.
        </p>
      </header>

      {CALC_GROUPS.map((g) => (
        <div key={g.id} data-group className={`gutter ${styles.group}`}>
          <p className={styles.groupLabel}>
            <span>{g.label}</span>
            <span className="opacity-60">{g.brand}</span>
          </p>
          <ul className={styles.grid}>
            {MANUFACTURER_CALCS.filter((c) => c.group === g.id).map((c) => (
              <li key={c.id} data-card className={styles.card}>
                <a className={styles.art} href={c.href} target="_blank" rel="noopener noreferrer" tabIndex={-1} aria-hidden>
                  {/* Prava fotografija materijala izbliza (Pexels); Codex samo crop i ton. */}
                  <img src={c.image} alt="" width={1200} height={800} loading="lazy" decoding="async" />
                </a>
                <div className={styles.body}>
                  <h3 className={`font-pretty ${styles.cardTitle}`}>{c.title}</h3>
                  <p className={styles.cardText}>{c.text}</p>
                  <a className={styles.open} href={c.href} target="_blank" rel="noopener noreferrer" aria-label={`${c.title} (otvara se na sajtu Wienerbergera)`}>
                    Otvori kalkulator
                    <External />
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div className={`gutter ${styles.after}`}>
        <div data-up className={styles.other}>
          <div>
            <p className="label opacity-60">Upit</p>
            <h2 className={`display ${styles.otherTitle}`}>Nešto drugo ili složen objekat?</h2>
          </div>
          <div className="grid justify-items-start gap-5">
            <p className={styles.lead}>
              Pošaljite mjere, plan ili rezultat iz kalkulatora, a prodaja vam javlja dostupnost, količinu i cijenu.
            </p>
            <Cta href="/upit-za-izvodjace?program=zidni-krovni&izvor=kalkulator" solid>
              Pošaljite upit
            </Cta>
          </div>
        </div>
        <p data-up className={styles.note}>
          Kalkulatori su alati proizvođača Wienerberger i otvaraju se na njihovom sajtu. Grand Company ih ne izrađuje.
          Tačnu količinu i cijenu potvrđuje prodaja.
        </p>
      </div>
    </section>
  )
}
