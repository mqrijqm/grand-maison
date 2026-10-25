'use client'

import { useRef, useState } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'
import { useLang } from '@/lib/i18n'
import TourWindow, { type TourStep } from './TourWindow'
import styles from './Business.module.css'

// Portal, ekran po ekran. Desktop: sekcija se zakači, svedeni prozor portala (TourWindow) stoji
// centriran, a koraci su vodoravna traka iznad njega. Skrol vodi traku ulijevo i bira aktivni korak;
// prozor pokaže taj korak (kursor kuca, bira, klikne). Telefon i reduced motion: bez kačenja,
// traka se prevlači prstom, a klik na korak ga bira.
const STEPS: { tour: TourStep; title: string; text: string; en: { title: string; text: string } }[] = [
  { tour: 'pregled', title: 'Pregled', text: 'Ponuda koja čeka odluku i njene stavke.', en: { title: 'Overview', text: 'The offer awaiting your decision and its line items.' } },
  { tour: 'materijali', title: 'Materijal po šifri', text: 'Šifra ili naziv, pa u upit.', en: { title: 'Materials by code', text: 'Code or name, then into the inquiry.' } },
  { tour: 'upit', title: 'Upit za gradilište', text: 'Gradilište, dostava, slanje.', en: { title: 'Site inquiry', text: 'Site, delivery, send.' } },
  { tour: 'ponude', title: 'Ponuda', text: 'Provjerite stavke i potvrdite.', en: { title: 'Offer', text: 'Check the line items and confirm.' } },
  { tour: 'narudzbe', title: 'Narudžba', text: 'Status do isporuke.', en: { title: 'Order', text: 'Status through to delivery.' } },
  { tour: 'gradilista', title: 'Gradilišta', text: 'Sve po mjestu isporuke.', en: { title: 'Sites', text: 'Everything by delivery location.' } },
]

export default function PortalTour() {
  const { t, lang } = useLang()
  const root = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  useGSAP(
    () => {
      gsap.matchMedia().add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const el = root.current!
        const track = el.querySelector<HTMLElement>('[data-track]')!
        const items = [...track.children] as HTMLElement[]
        // Traka se pomjera tako da aktivni korak bude na sredini ekrana.
        const shift = (i: number) => {
          const it = items[i]
          return window.innerWidth / 2 - (it.offsetLeft + it.offsetWidth / 2)
        }
        let last = -1
        gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: 'top top',
            end: () => `+=${STEPS.length * window.innerHeight * 0.55}`,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const i = Math.min(STEPS.length - 1, Math.floor(self.progress * STEPS.length))
              if (i !== last) {
                last = i
                setActive(i)
                gsap.to(track, { x: shift(i), duration: 0.6, ease: 'power3.out', overwrite: true })
              }
            },
            onRefresh: () => gsap.set(track, { x: shift(Math.max(0, last)) }),
          },
        })
      })
    },
    { scope: root },
  )

  return (
    <div ref={root} className={styles.tour}>
      <div className={styles.tourHead}>
        <p className={`label ${styles.kicker}`}>{t('Portal, ekran po ekran', 'The portal, screen by screen')}</p>
        <p className={styles.tourCount}>
          {String(active + 1).padStart(2, '0')} / {String(STEPS.length).padStart(2, '0')}
        </p>
      </div>
      <div className={styles.tourStrip}>
        <ol data-track className={styles.tourTrack}>
          {STEPS.map((s, i) => (
            <li key={s.tour}>
              <button type="button" className={styles.tourStep} data-on={i === active || undefined} onClick={() => setActive(i)}>
                <span className={styles.tourNum}>{String(i + 1).padStart(2, '0')}</span>
                <span>
                  <b>{lang === 'en' ? s.en.title : s.title}</b>
                  <i>{lang === 'en' ? s.en.text : s.text}</i>
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>
      <div className={styles.tourStage}>
        <TourWindow step={STEPS[active].tour} />
      </div>
    </div>
  )
}
