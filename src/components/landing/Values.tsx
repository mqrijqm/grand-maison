'use client'

import { useRef } from 'react'
import { useLang } from '@/lib/i18n'
import { gsap, useGSAP } from '@/lib/gsap'
import { drawOnScroll } from '@/lib/draw'
import { useMediaMotion } from '@/lib/media'
import { EASE, MQ } from '@/lib/motion'
import { revealChars, revealLines } from '@/lib/reveal'
import Cta from '@/components/ui/Cta'
import styles from './Heritage.module.css'

// "Kvalitet na prvom mjestu!" — tekst doslovno sa stare stranice "O nama" (grandcompany.ba,
// 2021–2025): tri stuba (pristup, vrijednosti, tim), pasus o kvalitetu i slogan "Izbor je Vaš!".
// Ikonice su linijski crteži koji se iscrtaju kad kartica uđe u ekran.

const Icon = ({ kind }: { kind: 'world' | 'check' | 'headset' }) => (
  <svg viewBox="0 0 48 48" className={styles.pillarIcon} fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="square" strokeLinejoin="miter" aria-hidden>
    {/* Naš pristup: krug, upisan romb i tačka u centru */}
    {kind === 'world' && (
      <>
        <circle data-d="0" cx="24" cy="24" r="19" />
        <path data-d="1" d="M24 8 40 24 24 40 8 24Z" />
        <rect data-d="2" x="21.5" y="21.5" width="5" height="5" fill="currentColor" stroke="none" />
      </>
    )}
    {/* Naše vrijednosti: dva kvadrata koji se preklapaju — bliski odnos */}
    {kind === 'check' && (
      <>
        <rect data-d="0" x="6" y="6" width="22" height="22" />
        <rect data-d="1" x="20" y="20" width="22" height="22" />
        <rect data-d="2" x="20" y="20" width="8" height="8" fill="currentColor" stroke="none" />
      </>
    )}
    {/* Naš tim: tri kruga u trouglu */}
    {kind === 'headset' && (
      <>
        <circle data-d="0" cx="24" cy="13" r="8" />
        <circle data-d="1" cx="13" cy="33" r="8" />
        <circle data-d="1" cx="35" cy="33" r="8" />
      </>
    )}
  </svg>
)

const PILLARS = [
  {
    icon: 'world',
    title: 'Naš pristup',
    en: { title: 'Our approach', text: 'We are committed to giving our customers the most reliable and the widest range of construction materials.' },
    text: 'Ustrajni smo u tome da svojim kupcima pružimo najpouzdaniju i najširu ponudu građevinskog materijala.',
  },
  {
    icon: 'check',
    title: 'Naše vrijednosti',
    en: { title: 'Our values', text: 'We build close relationships with our customers, which sets us apart from the competition: we understand their needs and deliver quality solutions.' },
    text: 'Gradimo bliske odnose s kupcima, po čemu smo drugačiji od konkurencije, razumijemo njihove potrebe i pružamo im kvalitetna rješenja.',
  },
  {
    icon: 'headset',
    title: 'Naš tim',
    en: { title: 'Our team', text: 'A trained and dedicated team analyses your needs and offers the best balance of price and quality.' },
    text: 'Edukovan i posvećen tim analizira vaše potrebe i nudi najbolji omjer cijene i kvaliteta.',
  },
] as const

export default function Values() {
  const { t, lang } = useLang()
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
    { scope: root, dependencies: [lang] },
  )

  return (
    <section ref={root} id="kvalitet" aria-labelledby="values-title" className={styles.values}>
      <div className="gutter">
        <h2 key={lang} id="values-title" data-head className={`display invisible ${styles.valuesTitle}`}>
          {t('Kvalitet na prvom mjestu!', 'Quality comes first!')}
        </h2>

        <div data-pillars className={styles.pillars}>
          {PILLARS.map((p, i) => (
            <article key={p.title} data-pillar className={styles.pillar}>
              <div className="flex items-start justify-between">
                <Icon kind={p.icon} />
                <span className="label opacity-60">{String(i + 1).padStart(2, '0')} / 03</span>
              </div>
              <h3 className={`display ${styles.pillarTitle}`}>{t(p.title, p.en.title)}</h3>
              <p className={styles.pillarText}>{t(p.text, p.en.text)}</p>
            </article>
          ))}
        </div>

        <div className={styles.quality}>
          <div>
            <span className={`label ${styles.qualityLabel}`}>{t('Kvalitet', 'Quality')}</span>
            <p key={lang} data-quote className={`font-pretty ${styles.qualityQuote}`}>
              {t('U poslovanju naše firme kvalitet je na prvom mjestu.', 'In how our company does business, quality comes first.')}
            </p>
          </div>
          <div data-up className="grid gap-5">
            <p className={styles.qualityBody}>
              {t(
                'Izbor je vaš, a mi se trudimo da Vam pomognemo u izboru najboljeg što tržište nudi. Korisnim savjetima našeg tima potrudićemo se da Vam olakšamo izbor pravog materijala za vaše potrebe.',
                'The choice is yours, and we do our best to help you pick the best the market has to offer. With practical advice from our team, we will make it easier to choose the right material for your needs.',
              )}
            </p>
          </div>
        </div>

        {/* Suha gradnja: skraćeno sa profila firme na moja-djelatnost.ba (segment "Sistem suhe gradnje").
            Formulisano kao savjet i materijal; ugradnja nije potvrđena. */}
        <div data-up className={styles.dry}>
          <span className={`label ${styles.qualityLabel}`}>{t('Sistem suhe gradnje', 'Drywall systems')}</span>
          <div className={styles.dryGrid}>
            <p className={`font-pretty ${styles.dryTitle}`}>{t('Stručan savjet za suhu gradnju, jedan poziv daleko.', 'Expert drywall advice, one call away.')}</p>
            <div className="grid gap-5">
              <p className={styles.qualityBody}>
                {t(
                  'Tim Grand Companyja stalno usavršava znanje i prati novosti u građevinarstvu. Ljubazni su i pristupačni, i rado objašnjavaju izbor ploča, profila i pribora za vaš pregradni zid ili plafon, da proces bude što jednostavniji.',
                  'The Grand Company team keeps building its knowledge and follows developments in construction. They are friendly and approachable, and happy to explain the choice of boards, profiles and accessories for your partition wall or ceiling, so the process is as simple as possible.',
                )}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Cta href="/upit-za-izvodjace" solid>
                  {t('Pošaljite upit', 'Send an enquiry')}
                </Cta>
              </div>
            </div>
          </div>
        </div>

        <p key={lang} data-sign className={`display invisible ${styles.signoff}`} aria-label={t('Izbor je Vaš!', 'The choice is yours!')}>
          {t('Izbor je Vaš!', 'The choice is yours!')}
        </p>
      </div>
    </section>
  )
}
