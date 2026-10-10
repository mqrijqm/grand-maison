'use client'

import { useEffect, useRef, useState } from 'react'
import TourWindow, { type TourStep } from './TourWindow'
import styles from './Business.module.css'

// Portal, ekran po ekran: lijevo kratki koraci, desno jedan svedeni prozor portala (TourWindow) u kome
// je pravi samo element o kome je riječ; kursor ga pokaže (kuca šifru, bira, klikne). Na telefonu nema zalijepljenog
// prozora: koraci su kratke kartice, a interaktivni portal je iznad.
const STEPS: { tour: TourStep; title: string; text: string }[] = [
  { tour: 'pregled', title: 'Pregled', text: 'Prvo što vidite: ponuda koja čeka odluku i njene stavke.' },
  { tour: 'materijali', title: 'Materijal po šifri', text: 'Upišite šifru ili naziv i dodajte u upit.' },
  { tour: 'upit', title: 'Upit za gradilište', text: 'Izaberite gradilište i dostavu, pa pošaljite.' },
  { tour: 'ponude', title: 'Ponuda', text: 'Provjerite stavke i potvrdite jednim klikom.' },
  { tour: 'narudzbe', title: 'Narudžba', text: 'Status do isporuke i ponavljanje narudžbe.' },
  { tour: 'gradilista', title: 'Gradilišta', text: 'Sve razvrstano po mjestu isporuke.' },
]

export default function PortalTour() {
  const list = useRef<HTMLOListElement>(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const items = [...list.current!.querySelectorAll<HTMLElement>('[data-step]')]
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.step))
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    items.forEach((i) => io.observe(i))
    return () => io.disconnect()
  }, [])

  return (
    <div className={styles.explain}>
      <ol ref={list} className={styles.explainSteps}>
        {STEPS.map((s, i) => {
          const num = String(i + 1).padStart(2, '0')
          return (
            <li key={s.tour} data-step={i} data-on={i === active || undefined} className={styles.explainStep}>
              <span aria-hidden className={styles.explainNum}>{num}</span>
              <p className={`label ${styles.explainLabel}`}>Korak {num}</p>
              <h3 className={styles.explainTitle}>{s.title}</h3>
              <p className={styles.explainText}>{s.text}</p>
            </li>
          )
        })}
      </ol>
      <div className={styles.explainStage}>
        <div className={styles.explainSticky}>
          <p className={`label ${styles.explainNow}`}>
            <i />
            {String(active + 1).padStart(2, '0')} · {STEPS[active].title}
          </p>
          <TourWindow step={STEPS[active].tour} />
        </div>
      </div>
    </div>
  )
}
