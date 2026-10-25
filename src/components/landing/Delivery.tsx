'use client'

/* eslint-disable @next/next/no-img-element -- optimizovana editorijalna fotografija iz /public */
import { useRef } from 'react'
import { useLang } from '@/lib/i18n'
import Cta from '@/components/ui/Cta'
import { gsap, useGSAP } from '@/lib/gsap'
import { EASE, MQ } from '@/lib/motion'
import { revealChars } from '@/lib/reveal'
import styles from './DeliveryOverview.module.css'

const FIELDS = [
  ['Materijal', 'Vrsta robe', 'Material', 'Type of goods'],
  ['Količine', 'Količina i pakovanje', 'Quantities', 'Quantity and packaging'],
  ['Adresa', 'Lokacija isporuke', 'Address', 'Delivery location'],
  ['Termin', 'Željeni dan i rok', 'Schedule', 'Preferred day and deadline'],
]

export default function Delivery() {
  const { t, lang } = useLang()
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
  }, { scope: root, dependencies: [lang] })

  return (
    <section ref={root} id="isporuka" className={styles.section} aria-labelledby="delivery-title">
      <div className={`gutter ${styles.top}`}>
        <div className={styles.intro}>
          <p className="label mb-6 opacity-60">{t('Dostava na vašu lokaciju', 'Delivery to your location')}</p>
          <h2 key={lang} id="delivery-title" data-head className={`display invisible ${styles.title}`}>{t('Materijal do vašeg gradilišta', 'Materials to your building site')}</h2>
          <p data-up className={styles.lead}>{t('Pošaljite lokaciju i spisak robe. S prodajom provjerite mogućnost isporuke, termin i trošak dostave.', 'Send us the location and a list of goods. Check delivery options, timing and cost with our sales team.')}</p>
          <p data-up className={styles.unload}><span className="font-medium">{t('Pristup i istovar', 'Access and unloading')}</span><br />{t('Opišite prilaz lokaciji i mjesto odlaganja robe. Način istovara dogovorite prema materijalu i uslovima na terenu.', 'Describe the approach to the site and where the goods should be placed. The unloading method is agreed based on the material and conditions on site.')}</p>
          <div data-up><Cta href="/dostava" className={styles.deliveryCta} solid>{t('Provjerite mogućnosti dostave', 'Check delivery options')}</Cta></div>
        </div>
        <figure data-up className={styles.figure}>
          <img className={styles.photo} src="/editorial/delivery-pickup-v2.webp" alt={t('Paletirani materijal pripremljen za otpremu — ilustrativna fotografija', 'Palletised material prepared for dispatch — illustrative photo')} width={1536} height={1024} loading="lazy" decoding="async" />
          <figcaption className={styles.caption}>{t('Priprema materijala za otpremu · ilustracija', 'Preparing material for dispatch · illustration')}</figcaption>
        </figure>
      </div>
      <div data-up className={`gutter ${styles.brief}`}>
        <p className="label opacity-60">{t('Za dogovor dostave', 'To arrange delivery')}</p>
        <div className={styles.fields}>
          {FIELDS.map(([name, note, nameEn, noteEn], i) => (
            <div className={styles.field} key={name}>
              <span className={styles.number}>0{i + 1}</span>
              <span className={styles.fieldName}>{t(name, nameEn)}</span>
              <span className={styles.fieldNote}>{t(note, noteEn)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
