'use client'

import { useRef } from 'react'
import { openRegistration } from '@/lib/login-events'
import Cta from '@/components/ui/Cta'
import { PORTAL_INTRO_STEPS, PORTAL_INTRO_STEPS_EN } from '@/lib/business'
import { useLang } from '@/lib/i18n'
import { gsap, useGSAP } from '@/lib/gsap'
import StepDemo from './StepDemos'
import styles from './Business.module.css'

const pad = (n: number) => String(n).padStart(2, '0')
const TOTAL = PORTAL_INTRO_STEPS.length

// "Vi ste firma i želite da koristite usluge Grand Company-ja?": tri koraka, horizontalno.
// Svaki korak je par: info kartica + širok pravougaonik sa animiranom UI scenom (StepDemos).
// Desktop: sekcija se pina, skrol pomjera kartice ulijevo, a cijela stranica prelazi
// (`.page`) iz krem u plavu i nazad kad se stigne do dashboard koraka ispod. Telefon i reduced motion:
// sekcija je sama plava, a kartice se prevlače prstom (hs-viewport).
export default function PartnerSteps() {
  const { t, lang } = useLang()
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.matchMedia().add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const el = root.current!
        // Ref roditelja još nije povezan dok se pokreće efekat djeteta, pa stranicu tražimo kroz DOM.
        const bg = el.closest<HTMLElement>(`.${styles.page}`)!
        const track = el.querySelector<HTMLElement>('[data-track]')!
        const count = el.querySelector<HTMLElement>('[data-count]')!
        const next = document.getElementById('biz-explain')!
        const dist = () => Math.max(0, track.scrollWidth - window.innerWidth)
        const cream = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim()
        const ink = getComputedStyle(document.documentElement).getPropertyValue('--ink').trim()
        const blue = getComputedStyle(document.documentElement).getPropertyValue('--cobalt').trim()

        gsap.to(track, {
          x: () => -dist(),
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top top',
            end: () => `+=${dist()}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              count.textContent = pad(1 + Math.min(TOTAL - 1, Math.floor(self.progress * TOTAL)))
            },
          },
        })
        // Stranica postaje plava dok sekcija ulazi u ekran...
        gsap.fromTo(
          bg,
          { backgroundColor: cream, color: ink },
          { backgroundColor: blue, color: '#fff', ease: 'none', immediateRender: false, scrollTrigger: { trigger: el, start: 'top 75%', end: 'top 10%', scrub: true } },
        )
        // ...i vraća se u krem kad naiđu dashboard koraci.
        gsap.fromTo(
          bg,
          { backgroundColor: blue, color: '#fff' },
          { backgroundColor: cream, color: ink, ease: 'none', immediateRender: false, scrollTrigger: { trigger: next, start: 'top 95%', end: 'top 45%', scrub: true } },
        )
        return () => gsap.set(bg, { clearProps: 'backgroundColor,color' })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} className={styles.partner} aria-labelledby="biz-partner">
      <div className={`gutter ${styles.partnerHead}`}>
        <h2 key={lang} id="biz-partner" data-head className={`display invisible ${styles.partnerTitle}`}>
          {t('Vi ste firma i želite da koristite usluge Grand Company-ja?', 'Are you a business that wants to use Grand Company’s services?')}
        </h2>
        {/* Brojač prati skrol samo na desktopu; na telefonu se kartice prevlače. */}
        <p className={styles.partnerHint}>
          <span className={styles.partnerCount}>
            {t('Korak', 'Step')} <span data-count>01</span> / {pad(TOTAL)}
          </span>
          <span className={styles.partnerSwipe}>{t(`${pad(TOTAL)} koraka · prevucite`, `${pad(TOTAL)} steps · swipe`)}</span>
        </p>
      </div>
      <div className="hs-viewport">
        <ol data-track className={styles.partnerTrack}>
          {PORTAL_INTRO_STEPS.map((sr, i) => {
            const s = lang === 'en' ? { ...sr, ...PORTAL_INTRO_STEPS_EN[i] } : sr
            return (
            <li key={sr.title} className={styles.partnerPair}>
              <div className={styles.partnerCard}>
                <span aria-hidden className={styles.partnerNum}>{pad(i + 1)}</span>
                <p className={`label ${styles.partnerLabel}`}>{t('Korak', 'Step')} {pad(i + 1)}</p>
                <h3 className={styles.partnerCardTitle}>{s.title}</h3>
                <p className={styles.partnerText}>{s.text}</p>
                <ul className={styles.partnerPoints}>
                  {s.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
              <div className={styles.partnerDemo} aria-hidden>
                <StepDemo demo={s.demo} />
              </div>
            </li>
            )
          })}
          <li className={styles.partnerEnd}>
            <p>{t('Firma još nema nalog? Pošaljite zahtjev, a prodaja otvara nalog i javlja vam se.', 'Your company doesn’t have an account yet? Send a request and sales will open one and get in touch.')}</p>
            <Cta onClick={openRegistration}>{t('Zatražite nalog za firmu', 'Request a company account')}</Cta>
          </li>
        </ol>
      </div>
    </section>
  )
}
