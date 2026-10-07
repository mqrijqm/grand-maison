'use client'

import { useRef } from 'react'
import Cta from '@/components/ui/Cta'
import { gsap, useGSAP } from '@/lib/gsap'
import { MQ, EASE } from '@/lib/motion'
import { revealChars } from '@/lib/reveal'
import ProcurementArt from './ProcurementArt'
import styles from './Procurement.module.css'

const STEPS = [
  { label: 'Upit', title: 'Pošaljite upit', text: 'Navedite materijal, količine, lokaciju i rok u kojem vam je roba potrebna.' },
  { label: 'Ponuda', title: 'Provjerite ponudu', text: 'Provjerite dostupnost, cijene i moguće zamjene za traženi materijal.' },
  { label: 'Dogovor', title: 'Potvrdite narudžbu', text: 'Dogovorite količine, uslove i način preuzimanja prije potvrde narudžbe.' },
  { label: 'Preuzimanje', title: 'Preuzmite materijal', text: 'Preuzmite robu na stovarištu ili dogovorite dostavu prema lokaciji i vrsti materijala.' },
]

export default function BrandsSplit() {
  const root = useRef<HTMLElement>(null)
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(MQ, ctx => {
      const { reduce } = ctx.conditions as { reduce: boolean }
      const el = root.current!
      revealChars(el.querySelector('[data-head]')!, reduce, 'top 80%')
      el.querySelectorAll('[data-step]').forEach(row => {
        revealChars(row.querySelector('[data-title]')!, reduce, 'top 85%', row)
        if (reduce) return
        gsap.from(row.querySelector('[data-process-art]'), {
          y: 24, autoAlpha: 0, duration: .7, ease: EASE.quint,
          scrollTrigger: { trigger: row, start: 'top 80%' },
        })
        gsap.from(row.querySelectorAll('[data-detail]'), {
          strokeDasharray: 600, strokeDashoffset: 600, duration: 1.2, stagger: .06,
          ease: 'power2.out', scrollTrigger: { trigger: row, start: 'top 75%' },
        })
      })
    })
  }, { scope: root })

  return (
    <section ref={root} id="prednosti" className={styles.process} aria-labelledby="process-title">
      <div className={styles.processPanel}>
        <div>
          <p className="label mb-6 opacity-65">Kako do materijala</p>
          <h2 id="process-title" data-head className={`display invisible ${styles.processTitle}`}>Od upita do preuzimanja</h2>
        </div>
        <div className={styles.processFoot}>
          <p>Četiri koraka do dogovorene nabavke. Krenite od spiska materijala ili specifikacije projekta.</p>
          <Cta href="/upit-za-izvodjace" className="[--cta-fill:var(--bg)] [--cta-ink:var(--cobalt)]">Zatražite ponudu</Cta>
        </div>
      </div>
      <div className={styles.steps}>
        {STEPS.map((step, i) => (
          <article data-step className={styles.step} key={step.label}>
            <div className={styles.stepMeta}><span>0{i + 1} / 04</span><span>{step.label}</span></div>
            <ProcurementArt step={i} className={styles.art} />
            <h3 data-title className={`display invisible ${styles.stepTitle}`}>{step.title}</h3>
            <p className={styles.stepCopy}>{step.text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
