'use client'

/* eslint-disable @next/next/no-img-element -- optimizovana editorijalna fotografija iz /public */
import { useRef } from 'react'
import Cta from '@/components/ui/Cta'
import { gsap, useGSAP } from '@/lib/gsap'
import { EASE, MQ } from '@/lib/motion'
import { revealChars } from '@/lib/reveal'
import styles from './DeliveryOverview.module.css'

const FIELDS = [
  ['Materijal', 'Vrsta robe'],
  ['Količine', 'Količina i pakovanje'],
  ['Adresa', 'Lokacija isporuke'],
  ['Termin', 'Željeni dan i rok'],
]

export default function Delivery() {
  const root = useRef<HTMLElement>(null)
  useGSAP(() => {
    gsap.matchMedia().add(MQ, ctx => {
      const { reduce } = ctx.conditions as { reduce: boolean }
      const el = root.current!
      revealChars(el.querySelector('[data-head]')!, reduce, 'top 85%')
      el.querySelectorAll('[data-up]').forEach(block => {
        if (reduce) { gsap.set(block, { autoAlpha: 1, y: 0 }); return }
        gsap.fromTo(block, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: .4, ease: EASE.quint,
          scrollTrigger: { trigger: block, start: 'top 95%' } })
      })
    })
  }, { scope: root })

  return (
    <section ref={root} id="isporuka" className={styles.section} aria-labelledby="delivery-title">
      <div className={`gutter ${styles.top}`}>
        <div className={styles.intro}>
          <p className="label mb-6 opacity-60">Dostava na vašu lokaciju</p>
          <h2 id="delivery-title" data-head className={`display invisible ${styles.title}`}>Materijal do vašeg gradilišta</h2>
          <p data-up className={styles.lead}>Pošaljite lokaciju i spisak robe. S prodajom provjerite mogućnost isporuke, termin i trošak dostave.</p>
          <p data-up className={styles.unload}><span className="font-medium">Pristup i istovar</span><br />Opišite prilaz lokaciji i mjesto odlaganja robe. Način istovara dogovorite prema materijalu i uslovima na terenu.</p>
          <div data-up><Cta href="/dostava" className={styles.deliveryCta} solid>Provjerite mogućnosti dostave</Cta></div>
        </div>
        <figure data-up className={styles.figure}>
          <img className={styles.photo} src="/editorial/delivery-pickup-v2.webp" alt="Paletirani materijal pripremljen za otpremu — ilustrativna fotografija" width={1536} height={1024} loading="lazy" decoding="async" />
          <figcaption className={styles.caption}>Priprema materijala za otpremu · ilustracija</figcaption>
        </figure>
      </div>
      <div data-up className={`gutter ${styles.brief}`}>
        <p className="label opacity-60">Za dogovor dostave</p>
        <div className={styles.fields}>
          {FIELDS.map(([name, note], i) => (
            <div className={styles.field} key={name}>
              <span className={styles.number}>0{i + 1}</span>
              <span className={styles.fieldName}>{name}</span>
              <span className={styles.fieldNote}>{note}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
