'use client'

import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'
import { drawOnScroll } from '@/lib/draw'
import { useMediaMotion } from '@/lib/media'
import { EASE, MQ } from '@/lib/motion'
import { revealChars, revealLines } from '@/lib/reveal'
import styles from './Heritage.module.css'

// "Kvalitet na prvom mjestu!" — tekst doslovno sa stare stranice "O nama" (grandcompany.ba,
// 2021–2025): tri stuba (pristup, vrijednosti, tim), pasus o kvalitetu i slogan "Izbor je Vaš!".
// Ikonice su linijski crteži koji se iscrtaju kad kartica uđe u ekran.

const Icon = ({ kind }: { kind: 'world' | 'check' | 'headset' }) => (
  <svg viewBox="0 0 84 84" className={styles.pillarIcon} fill="none" stroke="currentColor" strokeWidth={1.4} aria-hidden>
    {kind === 'world' && (
      <>
        <circle data-d="0" cx="42" cy="42" r="32" />
        <ellipse data-d="1" cx="42" cy="42" rx="14" ry="32" />
        <path data-d="1" d="M10 42h64M15 26h54M15 58h54" />
        <circle data-d="2" cx="42" cy="42" r="2.5" fill="currentColor" stroke="none" />
      </>
    )}
    {kind === 'check' && (
      <>
        <path data-d="0" d="M12 18h60v38H40L26 68V56H12z" />
        <path data-d="1" d="M29 37l9 9 17-18" />
      </>
    )}
    {kind === 'headset' && (
      <>
        <path data-d="0" d="M18 48V40a24 24 0 0 1 48 0v8" />
        <rect data-d="1" x="12" y="44" width="12" height="20" rx="3" />
        <rect data-d="1" x="60" y="44" width="12" height="20" rx="3" />
        <path data-d="2" d="M66 64c0 6-8 10-18 10h-4" />
      </>
    )}
  </svg>
)

const PILLARS = [
  {
    icon: 'world',
    title: 'Naš pristup',
    text: 'Ustrajni smo u tome da svojim kupcima pružimo najpouzdaniju i najširu ponudu građevinskog materijala.',
  },
  {
    icon: 'check',
    title: 'Naše vrijednosti',
    text: 'Gradimo bliske odnose s kupcima, po čemu smo drugačiji od konkurencije, razumijemo njihove potrebe i pružamo im kvalitetna rješenja.',
  },
  {
    icon: 'headset',
    title: 'Naš tim',
    text: 'Tim edukovanih i posvećenih profesionalaca u stanju je izvršiti analizu svih Vaših potreba i na te potrebe odgovoriti sa ponudom najboljeg omjera cijene i kvaliteta.',
  },
] as const

export default function Values() {
  const root = useRef<HTMLElement>(null)
  useMediaMotion(root)

  useGSAP(
    () => {
      gsap.matchMedia().add(MQ, (ctx) => {
        const { reduce } = ctx.conditions as { reduce: boolean }
        const el = root.current!
        revealChars(el.querySelector('[data-head]')!, reduce, 'top 80%')
        revealLines(el.querySelector('[data-quote]')!, reduce)
        revealChars(el.querySelector('[data-sign]')!, reduce, 'top 90%')
        el.querySelectorAll('[data-pillar] svg').forEach((svg) => drawOnScroll(svg, reduce, { trigger: svg, start: 'top 85%' }))
        if (reduce) return
        gsap.from(el.querySelectorAll('[data-pillar]'), {
          y: 80,
          autoAlpha: 0,
          duration: 0.6,
          ease: EASE.quint,
          stagger: 0.08,
          scrollTrigger: { trigger: el.querySelector('[data-pillars]'), start: 'top 88%' },
        })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="kvalitet" aria-labelledby="values-title" className={styles.values}>
      <div className="gutter">
        <h2 id="values-title" data-head className={`display invisible ${styles.valuesTitle}`}>
          Kvalitet na prvom mjestu!
        </h2>

        <div data-pillars className={styles.pillars}>
          {PILLARS.map((p, i) => (
            <article key={p.title} data-pillar className={styles.pillar}>
              <div className="flex items-start justify-between">
                <Icon kind={p.icon} />
                <span className="label opacity-60">{String(i + 1).padStart(2, '0')} / 03</span>
              </div>
              <h3 className={`display ${styles.pillarTitle}`}>{p.title}</h3>
              <p className={styles.pillarText}>{p.text}</p>
            </article>
          ))}
        </div>

        <div className={styles.quality}>
          <div>
            <span className={`label ${styles.qualityLabel}`}>Kvalitet</span>
            <p data-quote className={`font-pretty ${styles.qualityQuote}`}>
              U poslovanju naše firme kvalitet je na prvom mjestu.
            </p>
          </div>
          <div data-up className="grid gap-5">
            <p className={styles.qualityBody}>
              Zato se trudimo da sav građevinski materijal koji imamo u veleprodaji i maloprodaji bude u skladu sa našom
              poslovnom politikom, koja definiše taj kvalitet.
            </p>
            <p className={styles.qualityBody}>
              Izbor je vaš, a mi se trudimo da Vam pomognemo u izboru najboljeg što tržište nudi. Korisnim savjetima
              našeg tima potrudićemo se da Vam olakšamo izbor pravog materijala za vaše potrebe.
            </p>
          </div>
        </div>

        <p data-sign className={`display invisible ${styles.signoff}`} aria-label="Izbor je Vaš!">
          Izbor je Vaš!
        </p>
      </div>
    </section>
  )
}
