'use client'

import { useRef } from 'react'
import { useLang } from '@/lib/i18n'
import { gsap, useGSAP } from '@/lib/gsap'
import { useMediaMotion } from '@/lib/media'
import { MQ } from '@/lib/motion'
import { revealChars } from '@/lib/reveal'
import styles from './Heritage.module.css'

// Recenzije kupaca sa Kupci.com (stanje 2026-10-11): prosjek 4,9 od 15 ocjena (14 × 5★, 1 × 4★).
// Citati su doslovni (samo veličina slova ujednačena); imena skraćena na inicijal prezimena.
const REVIEWS = [
  { text: 'Stovarište građevinskog materijala. Uslužno osoblje i jako povoljne cijene. Dostava na teritoriji grada.', who: 'Vladimir K.', when: 'prije oko 7 godina',
    en: { text: 'A building-materials yard. Helpful staff and very good prices. Delivery within the city.', who: 'Vladimir K.', when: 'about 7 years ago' } },
  { text: 'Veliki izbor, povoljne cijene i uslužno osoblje.', who: 'Kupac', when: 'prije oko 2 godine',
    en: { text: 'Great selection, good prices and helpful staff.', who: 'Customer', when: 'about 2 years ago' } },
  { text: 'Najbolji i najbrži istovar.', who: 'Emin M.', when: 'prije oko 5 godina',
    en: { text: 'The best and fastest unloading.', who: 'Emin M.', when: 'about 5 years ago' } },
  { text: '…građevinske robe uz pristupačne cijene i ljubazno osoblje, imaju baš svega.', who: 'Kupac', when: 'Kupci.com',
    en: { text: '…building supplies at affordable prices and friendly staff, they have absolutely everything.', who: 'Customer', when: 'Kupci.com' } },
  { text: 'Ljubaznost na svakom koraku.', who: 'Kupac', when: 'Kupci.com',
    en: { text: 'Kindness at every step.', who: 'Customer', when: 'Kupci.com' } },
]

export default function Reviews() {
  const { t, lang } = useLang()
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
      // Sekcija se zakači, a vertikalni skrol vodi traku ulijevo sve do posljednje kartice (i na telefonu).
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const track = el.querySelector<HTMLElement>('[data-track]')!
        const distance = () => Math.max(0, track.scrollWidth - el.clientWidth)
        gsap.fromTo(
          track,
          { x: 0 },
          {
            x: () => -distance(),
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top top', end: () => `+=${distance()}`, pin: true, scrub: 0.6, anticipatePin: 1, invalidateOnRefresh: true },
          },
        )
      })
    },
    { scope: root, dependencies: [lang] },
  )

  return (
    <section ref={root} id="recenzije" aria-labelledby="reviews-title" className={styles.reviews}>
      <div className={`gutter ${styles.reviewsHead}`}>
        <h2 key={lang} id="reviews-title" data-head className={`display invisible ${styles.reviewsTitle}`}>
          {t('Šta kažu kupci', 'What customers say')}
        </h2>
        <div data-up className={styles.score}>
          <span className={`display ${styles.scoreNum}`}>{t('4,9', '4.9')}</span>
          <span className={styles.scoreMeta}>
            <span className={styles.stars} aria-hidden>
              ★★★★★
            </span>
            <span>{t('Prosjek od 15 ocjena', 'Average of 15 ratings')}</span>
            <span className="opacity-70">{t('14 × 5 zvjezdica · 1 × 4', '14 × 5 stars · 1 × 4')}</span>
          </span>
        </div>
      </div>

      <div className={styles.trackWrap}>
        <ul data-track className={`${styles.track} m-0 list-none`}>
          {REVIEWS.map((r) => (
            <li key={r.text} className={styles.card}>
              <span className={styles.cardStars} aria-label={t('5 zvjezdica', '5 stars')}>
                ★★★★★
              </span>
              <blockquote className={`font-pretty m-0 ${styles.cardQuote}`}>{t(`„${r.text}”`, `“${r.en.text}”`)}</blockquote>
              <span className={styles.cardMeta}>
                {t(r.who, r.en.who)} · {t(r.when, r.en.when)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <p className={`gutter ${styles.source}`}>
        {t('Izvor:', 'Source:')}{' '}
        <a href="https://kupci.com/ba/recenzije/grand-company" target="_blank" rel="noopener noreferrer">
          Kupci.com
        </a>
        {t(', stanje oktobar 2026.', ', as of October 2026.')}
      </p>
    </section>
  )
}
