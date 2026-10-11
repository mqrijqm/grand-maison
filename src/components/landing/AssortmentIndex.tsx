'use client'

import { useRef } from 'react'
import Cta from '@/components/ui/Cta'
import { gsap, useGSAP } from '@/lib/gsap'
import { useMediaMotion } from '@/lib/media'
import { EASE, MQ } from '@/lib/motion'
import { revealChars } from '@/lib/reveal'
import styles from './Heritage.module.css'

// Asortiman kao tipografski indeks. Grupe su doslovno sa stare stranice "O nama" (grandcompany.ba,
// 2021–2025), plus suha gradnja (javno naveden segment). Bilješke desno su samo ono što je
// potvrđeno izvorom; bez artikala, cijena i stanja (javnog cjenovnika nema).
const GROUPS: { name: string; note?: string }[] = [
  { name: 'Fasadni sistemi' },
  { name: 'Termoizolacioni sistemi', note: 'Uključujući kamenu vunu' },
  { name: 'Hidroizolacioni sistemi' },
  { name: 'Krovni sistemi', note: 'Tondach crijep i krovni elementi' },
  { name: 'Keramička ljepila' },
  { name: 'Cementi' },
  { name: 'Mašinski malteri' },
  { name: 'Željezo' },
  { name: 'Blokovi', note: 'Porotherm blokovi od opeke' },
  { name: 'Suha gradnja', note: 'Sistemi za pregradne zidove i plafone' },
]

// Prodajna mjesta prema javnim listama proizvođača (Baumalt; Wienerberger, april 2020).
const MAKERS = [
  { name: 'Baumalt', text: 'Građevinska hemija. Grand Company je na Baumaltovoj listi prodajnih lokacija za Banju Luku.' },
  { name: 'Tondach', text: 'Crijep i krovni sistemi grupe Wienerberger.' },
  { name: 'Porotherm', text: 'Zidni blokovi od opeke grupe Wienerberger.' },
]

export default function AssortmentIndex() {
  const root = useRef<HTMLElement>(null)
  useMediaMotion(root)

  useGSAP(
    () => {
      gsap.matchMedia().add(MQ, (ctx) => {
        const { reduce } = ctx.conditions as { reduce: boolean }
        const el = root.current!
        revealChars(el.querySelector('[data-head]')!, reduce, 'top 80%')
        if (reduce) return
        // Redovi indeksa ulaze jedan za drugim, kao kad se lista ispisuje.
        gsap.from(el.querySelectorAll('[data-row]'), {
          yPercent: 60,
          autoAlpha: 0,
          duration: 0.5,
          ease: EASE.quint,
          stagger: 0.05,
          scrollTrigger: { trigger: el.querySelector('[data-list]'), start: 'top 85%' },
        })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="asortiman-grupe" aria-labelledby="index-title" className={styles.index}>
      <div className={`gutter ${styles.indexHead}`}>
        <h2 id="index-title" data-head className={`display invisible ${styles.indexTitle}`}>
          Veliki izbor asortimana
        </h2>
        <div data-up className="grid justify-items-start gap-6">
          <p className={styles.indexLead}>
            Za vaše potrebe spremili smo veliki izbor asortimana, u veleprodaji i maloprodaji. Tačnu dostupnost i
            količine potvrđujemo po upitu.
          </p>
          <Cta href="/upit-za-izvodjace" solid>
            Pitajte za dostupnost
          </Cta>
        </div>
      </div>

      <ol data-list className={styles.list}>
        {GROUPS.map((g, i) => (
          <li key={g.name} data-row className={styles.row}>
            <span className={styles.num}>{String(i + 1).padStart(2, '0')}</span>
            <span className={`display ${styles.name}`}>{g.name}</span>
            <span className={styles.note}>{g.note ?? ''}</span>
          </li>
        ))}
      </ol>

      <div className={`gutter ${styles.makers}`}>
        <div data-up>
          <p className="label opacity-60">Proizvođači</p>
          <p className={`mt-4 max-w-[34ch] ${styles.indexLead}`}>
            Grand Company je prodajno mjesto za proizvode ovih proizvođača.
          </p>
        </div>
        <div>
          <div className={styles.makerList}>
            {MAKERS.map((m) => (
              <article key={m.name} data-up className={styles.maker}>
                <h3 className={`display ${styles.makerName}`}>{m.name}</h3>
                <p className={styles.makerText}>{m.text}</p>
              </article>
            ))}
          </div>
          <p className={styles.fine}>Prema javnim listama prodajnih mjesta proizvođača.</p>
        </div>
      </div>
    </section>
  )
}
