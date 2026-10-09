'use client'

/* eslint-disable @next/next/no-img-element -- fotografija iz /public, već u WebP */

import { useRef } from 'react'
import Cta from '@/components/ui/Cta'
import { gsap, useGSAP } from '@/lib/gsap'
import { useMediaMotion } from '@/lib/media'
import { MQ } from '@/lib/motion'
import { revealChars } from '@/lib/reveal'
import { BUSINESS_FACTS, BUSINESS_OFFERS } from '@/lib/business'
import styles from './Story.module.css'

// Ulaz za firme na početnoj: kome je namijenjeno, dva načina nabavke i javne nabavke iz researcha.
// Sve vodi na /za-firme (detalji + brza narudžba po šifri) ili na upit.
export default function ForBusiness() {
  const root = useRef<HTMLElement>(null)
  useMediaMotion(root)
  useGSAP(
    () => {
      gsap.matchMedia().add(MQ, (ctx) => {
        const { reduce } = ctx.conditions as { reduce: boolean }
        revealChars(root.current!.querySelector('[data-head]')!, reduce, 'top 80%')
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="za-firme" aria-labelledby="biz-title" className={styles.section}>
      <div className={`gutter ${styles.biz}`}>
        <div data-curtain className={styles.bizPhoto}>
          <img src="/editorial/firme/kran.webp" alt="Toranjski kran iznad zgrade u izgradnji" width={1200} height={1500} loading="lazy" decoding="async" />
          <span className={styles.bizTag}>Za firme i izvođače</span>
        </div>

        <div>
          <p className={`label ${styles.kicker}`}>Veleprodaja i maloprodaja</p>
          <h2 id="biz-title" data-head className={`display invisible mt-5 ${styles.title}`}>
            Nabavka za gradilište
          </h2>
          <p data-up className={`mt-6 ${styles.lead}`}>
            Za građevinske firme, izvođače, majstore i javne ustanove. Jedan upit za cijeli projekat, a ponudu vam šalje prodaja.
          </p>

          <ol className={styles.bizList}>
            {BUSINESS_OFFERS.map((o, i) => (
              <li key={o.title} className={styles.bizRow}>
                <span className={styles.bizNum}>{String(i + 1).padStart(2, '0')}</span>
                <h3 className={`font-pretty ${styles.bizName}`}>{o.title}</h3>
                <p className={styles.bizText}>{o.text}</p>
              </li>
            ))}
          </ol>

          <dl className={styles.facts}>
            {BUSINESS_FACTS.map((f) => (
              <div key={f.label} className={styles.fact}>
                <dt className={styles.factLabel}>{f.label}</dt>
                <dd className={`order-first ${styles.factNum}`}>{f.value}</dd>
              </div>
            ))}
          </dl>

          <div className={styles.actions}>
            <Cta href="/za-firme" solid>
              Za firme
            </Cta>
            <Cta href="/portal">B2B portal</Cta>
          </div>
        </div>
      </div>
    </section>
  )
}
