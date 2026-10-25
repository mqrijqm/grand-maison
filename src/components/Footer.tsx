'use client'

import { MAPS_URL } from '@/lib/company'
import Link from 'next/link'
import { useRef } from 'react'
import FooterDots from '@/components/FooterDots'
import { COMPANY } from '@/gc/gc'
import { HOURS_SHORT, HOURS_SHORT_EN } from '@/lib/company'
import { useLang } from '@/lib/i18n'
import { gsap, useGSAP } from '@/lib/gsap'
import { EASE, MQ, fitFontSize } from '@/lib/motion'
import { revealChars } from '@/lib/reveal'

type Item = { label: string; en: string; href: string; external?: boolean }

// Tri kolone krupnih linkova sa puno praznog prostora (kao na referenci).
const COLS: { title: string; titleEn: string; items: Item[] }[] = [
  {
    title: 'Navigacija', titleEn: 'Navigation',
    items: [
      { label: 'Asortiman', en: 'Range', href: '/prodavnica' },
      { label: 'Za firme', en: 'For business', href: '/za-firme' },
      { label: 'Dostava', en: 'Delivery', href: '/dostava' },
      { label: 'Zatraži ponudu', en: 'Request a quote', href: '/upit-za-izvodjace' },
      { label: 'Kalkulator', en: 'Calculator', href: '/kalkulator' },
      { label: 'Vodiči', en: 'Guides', href: '/vodici' },
    ],
  },
  {
    title: 'Kupovina', titleEn: 'Shopping',
    items: [
      { label: 'Povrat robe', en: 'Returns', href: '/povrat-robe' },
      { label: 'Načini plaćanja', en: 'Payment methods', href: '/nacini-placanja' },
      { label: 'Uslovi kupovine', en: 'Terms of purchase', href: '/uslovi-kupovine' },
      { label: 'Privatnost', en: 'Privacy', href: '/politika-privatnosti' },
      { label: 'Sve politike', en: 'All policies', href: '/sve-politike' },
    ],
  },
  {
    title: 'Kontakt', titleEn: 'Contact',
    items: [
      { label: 'Pozovite', en: 'Call us', href: COMPANY.phoneLandlineHref, external: true },
      { label: 'Pišite', en: 'Write to us', href: `mailto:${COMPANY.emailInfo}`, external: true },
      { label: 'Viber / WhatsApp', en: 'Viber / WhatsApp', href: COMPANY.phoneMobileHref, external: true },
      { label: 'Stovarište na mapi', en: 'Yard on the map', href: MAPS_URL, external: true },
    ],
  },
]


// Minimalan footer: ispod tamne podloge je jarki kobalt koji kursor trajno otkriva kao trag
// (FooterDots), gore tri kolone linkova, pa veliki wordmark preko cijele širine, a dolje lijevo
// podaci firme i desno polje sa potpisom studija Blink.
export default function Footer() {
  const { t } = useLang()
  const root = useRef<HTMLElement>(null)

  useGSAP(
    (_, contextSafe) => {
      const el = root.current!
      const word = el.querySelector<HTMLElement>('[data-word]')!
      let dead = false
      let onResize: (() => void) | null = null

      const boot = contextSafe!(() => {
        if (dead) return
        const fit = () => {
          word.style.fontSize = `${fitFontSize(word, (el.clientWidth - 40) * 0.97)}px`
        }
        fit()
        onResize = fit
        window.addEventListener('resize', fit)
        gsap.matchMedia().add(MQ, (ctx) => {
          const { reduce } = ctx.conditions as { reduce: boolean }
          const split = revealChars(word, true)
          if (reduce) return
          gsap.fromTo(split.chars, { yPercent: 110 }, { yPercent: 0, duration: 0.6, ease: EASE.quint, stagger: 0.02, scrollTrigger: { trigger: word, start: 'top 98%' } })
          gsap.fromTo(
            el.querySelectorAll('[data-col]'),
            { autoAlpha: 0, y: 20 },
            { autoAlpha: 1, y: 0, duration: 0.55, ease: EASE.quint, stagger: 0.06, scrollTrigger: { trigger: el, start: 'top 85%' } },
          )
        })
      })

      document.fonts.ready.then(boot)
      return () => {
        dead = true
        if (onResize) window.removeEventListener('resize', onResize)
      }
    },
    { scope: root },
  )

  return (
    <div className="relative z-[50]">
    <footer ref={root} id="kontakt" className="relative z-40 isolate overflow-x-clip bg-ink text-bg">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-cobalt" />
      <FooterDots />

      <div className="relative">
        {/* Tri kolone linkova */}
        <div className="grid gap-12 px-5 pt-[14vh] sm:grid-cols-2 md:grid-cols-12 md:px-8">
          {COLS.map((c, i) => (
            <nav key={c.title} data-col aria-label={t(c.title, c.titleEn)} className={i === 2 ? 'md:col-span-4 md:col-start-9' : 'md:col-span-4'}>
              <p className="mb-5 text-[10.5px] tracking-[0.14em] opacity-45">({t(c.title, c.titleEn)})</p>
              <ul className="flex flex-col">
                {c.items.map((it) => (
                  <li key={it.label}>
                    {it.external ? (
                      <a href={it.href} {...(it.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="foot-link">
                        {t(it.label, it.en)}
                      </a>
                    ) : (
                      <Link href={it.href} className="foot-link">
                        {t(it.label, it.en)}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Veliki wordmark preko cijele širine */}
        <div className="mt-[16vh] overflow-x-clip px-5 text-center">
          <p data-word className="font-hero inline-block whitespace-nowrap leading-[0.9] tracking-[-0.02em]" aria-label="Grand Company">
            Grand Company
          </p>
        </div>

        {/* Dno: podaci lijevo, potpis studija desno */}
        <div className="flex flex-col gap-6 px-5 pb-20 pt-10 md:flex-row md:items-end md:justify-between md:px-8 md:pb-16 md:pr-20">
          <p className="max-w-[78ch] text-[11px] leading-[1.8] opacity-55">
            {COMPANY.address} · {COMPANY.phoneLandline} · {COMPANY.phoneLandline2} · {COMPANY.phoneMobile}
            <br />
            {COMPANY.emailInfo} · {t(HOURS_SHORT, HOURS_SHORT_EN)} · {t('Od', 'Since')} {COMPANY.founded}.
          </p>

        </div>
      </div>
    </footer>
    </div>
  )
}
