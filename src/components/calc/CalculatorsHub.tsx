'use client'

/* eslint-disable @next/next/no-img-element -- WebP fotografije iz /public */

import { useRef } from 'react'
import Cta from '@/components/ui/Cta'
import { gsap, useGSAP } from '@/lib/gsap'
import { CALC_GROUPS, MANUFACTURER_CALCS } from '@/lib/manufacturer-calculators'
import { useMediaMotion } from '@/lib/media'
import { EASE, MQ } from '@/lib/motion'
import { revealChars } from '@/lib/reveal'
import { useLang } from '@/lib/i18n'
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
  const { t, lang } = useLang()
  const en = lang === 'en'
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
    // Naslov se dijeli (SplitText) jednom po jeziku: element se remontira (key), pa se podjela ponovi.
    { scope: root, dependencies: [lang], revertOnUpdate: true },
  )

  const Heading = embedded ? 'h2' : 'h1'

  return (
    <section ref={root} id={embedded ? 'kalkulator' : undefined} aria-labelledby="calcs-title" className={styles.page}>
      <header className={`gutter ${styles.head}`}>
        <div>
          <p className="label opacity-60">{t('Kalkulatori · Tondach i Porotherm', 'Calculators · Tondach and Porotherm')}</p>
          <Heading key={`h-${lang}`} id="calcs-title" data-head className={`display invisible ${styles.title}`}>
            {t('Izračunajte krov i zid', 'Calculate your roof and wall')}
          </Heading>
        </div>
        <p data-up className={`${styles.lead} ${styles.headLead}`}>
          {t(
            'Za krov od Tondach crijepa i zid od Porotherm opeke proizvođač Wienerberger nudi besplatne kalkulatore. Grand Company je na Wienerbergerovoj listi prodajnih mjesta za ove proizvode, a dostupnost modela potvrđuje prodaja.',
            'For a roof of Tondach tiles and a wall of Porotherm clay blocks, the manufacturer Wienerberger offers free calculators. Grand Company is on Wienerberger’s list of points of sale for these products, and sales confirms the availability of each model.',
          )}
        </p>
      </header>

      {CALC_GROUPS.map((g) => (
        <div key={g.id} data-group className={`gutter ${styles.group}`}>
          <p className={styles.groupLabel}>
            <span>{en ? g.labelEn : g.label}</span>
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
                  <h3 className={`font-pretty ${styles.cardTitle}`}>{en ? (c.titleEn ?? c.title) : c.title}</h3>
                  <p className={styles.cardText}>{en ? (c.textEn ?? c.text) : c.text}</p>
                  <a className={styles.open} href={c.href} target="_blank" rel="noopener noreferrer" aria-label={t(`${c.title} (otvara se na sajtu Wienerbergera)`, `${c.titleEn ?? c.title} (opens on the Wienerberger site)`)}>
                    {t('Otvori kalkulator', 'Open calculator')}
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
            <p className="label opacity-60">{t('Upit', 'Enquiry')}</p>
            <h2 className={`display ${styles.otherTitle}`}>{t('Nešto drugo ili složen objekat?', 'Something else, or a complex project?')}</h2>
          </div>
          <div className="grid justify-items-start gap-5">
            <p className={styles.lead}>
              {t('Pošaljite mjere, plan ili rezultat iz kalkulatora, a prodaja vam javlja dostupnost, količinu i cijenu.', 'Send the dimensions, a plan or the result from the calculator, and sales will get back to you with availability, quantity and price.')}
            </p>
            <Cta href="/upit-za-izvodjace?program=zidni-krovni&izvor=kalkulator" solid>
              {t('Pošaljite upit', 'Send an enquiry')}
            </Cta>
          </div>
        </div>
        <p data-up className={styles.note}>
          {t(
            'Kalkulatori su alati proizvođača Wienerberger i otvaraju se na njihovom sajtu. Grand Company ih ne izrađuje. Tačnu količinu i cijenu potvrđuje prodaja.',
            'The calculators are tools by the manufacturer Wienerberger and open on their website. Grand Company does not build them. Sales confirms the exact quantity and price.',
          )}
        </p>
      </div>
    </section>
  )
}
