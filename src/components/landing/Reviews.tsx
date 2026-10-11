'use client'

import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'
import { useMediaMotion } from '@/lib/media'
import { MQ } from '@/lib/motion'
import { revealChars } from '@/lib/reveal'
import styles from './Heritage.module.css'

// Recenzije kupaca sa Kupci.com (stanje 2026-10-11): prosjek 4,9 od 15 ocjena (14 × 5★, 1 × 4★).
// Citati su doslovni (samo veličina slova ujednačena); imena skraćena na inicijal prezimena.
const REVIEWS = [
  { text: 'Stovarište građevinskog materijala. Uslužno osoblje i jako povoljne cijene. Dostava na teritoriji grada.', who: 'Vladimir K.', when: 'prije oko 7 godina' },
  { text: 'Veliki izbor, povoljne cijene i uslužno osoblje.', who: 'Kupac', when: 'prije oko 2 godine' },
  { text: 'Najbolji i najbrži istovar.', who: 'Emin M.', when: 'prije oko 5 godina' },
  { text: '…građevinske robe uz pristupačne cijene i ljubazno osoblje, imaju baš svega.', who: 'Kupac', when: 'Kupci.com' },
  { text: 'Ljubaznost na svakom koraku.', who: 'Kupac', when: 'Kupci.com' },
]

export default function Reviews() {
  const root = useRef<HTMLElement>(null)
  useMediaMotion(root)

  useGSAP(
    () => {
      const el = root.current!
      const mm = gsap.matchMedia()
      mm.add(MQ, (ctx) => {
        const { reduce } = ctx.conditions as { reduce: boolean }
        revealChars(el.querySelector('[data-head]')!, reduce, 'top 80%')
      })
      // Desktop: traka citata klizi ulijevo dok sekcija prolazi kroz ekran (bez pina).
      mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
        const track = el.querySelector<HTMLElement>('[data-track]')!
        const distance = () => Math.max(0, track.scrollWidth - el.clientWidth)
        gsap.fromTo(
          track,
          { x: () => distance() * 0.25 },
          { x: () => -distance(), ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.6, invalidateOnRefresh: true } },
        )
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="recenzije" aria-labelledby="reviews-title" className={styles.reviews}>
      <div className={`gutter ${styles.reviewsHead}`}>
        <h2 id="reviews-title" data-head className={`display invisible ${styles.reviewsTitle}`}>
          Šta kažu kupci
        </h2>
        <div data-up className={styles.score}>
          <span className={`display ${styles.scoreNum}`}>4,9</span>
          <span className={styles.scoreMeta}>
            <span className={styles.stars} aria-hidden>
              ★★★★★
            </span>
            <span>Prosjek od 15 ocjena</span>
            <span className="opacity-70">14 × 5 zvjezdica · 1 × 4</span>
          </span>
        </div>
      </div>

      <div className={styles.trackWrap}>
        <ul data-track className={`${styles.track} m-0 list-none`}>
          {REVIEWS.map((r) => (
            <li key={r.text} className={styles.card}>
              <span className={styles.cardStars} aria-label="5 zvjezdica">
                ★★★★★
              </span>
              <blockquote className={`font-pretty m-0 ${styles.cardQuote}`}>„{r.text}”</blockquote>
              <span className={styles.cardMeta}>
                {r.who} · {r.when}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <p className={`gutter ${styles.source}`}>
        Izvor:{' '}
        <a href="https://kupci.com/ba/recenzije/grand-company" target="_blank" rel="noopener noreferrer">
          Kupci.com
        </a>
        , stanje oktobar 2026.
      </p>
    </section>
  )
}
