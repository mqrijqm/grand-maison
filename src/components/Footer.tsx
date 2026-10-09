'use client'

import { MAPS_URL } from '@/lib/company'
import Link from 'next/link'
import { useRef } from 'react'
import FooterDots from '@/components/FooterDots'
import { COMPANY } from '@/gc/gc'
import { HOURS_SHORT } from '@/lib/company'
import { gsap, useGSAP } from '@/lib/gsap'
import { EASE, MQ, fitFontSize } from '@/lib/motion'
import { revealChars } from '@/lib/reveal'

type Item = { label: string; href: string; external?: boolean }

// Tri kolone krupnih linkova sa puno praznog prostora (kao na referenci).
const COLS: { title: string; items: Item[] }[] = [
  {
    title: 'Navigacija',
    items: [
      { label: 'Asortiman', href: '/prodavnica' },
      { label: 'Za firme', href: '/za-firme' },
      { label: 'Dostava', href: '/dostava' },
      { label: 'Zatraži ponudu', href: '/upit-za-izvodjace' },
      { label: 'Kalkulator', href: '/kalkulator' },
      { label: 'Vodiči', href: '/vodici' },
    ],
  },
  {
    title: 'Kupovina',
    items: [
      { label: 'Povrat robe', href: '/povrat-robe' },
      { label: 'Načini plaćanja', href: '/nacini-placanja' },
      { label: 'Uslovi kupovine', href: '/uslovi-kupovine' },
      { label: 'Privatnost', href: '/politika-privatnosti' },
      { label: 'Sve politike', href: '/sve-politike' },
    ],
  },
  {
    title: 'Kontakt',
    items: [
      { label: 'Pozovite', href: COMPANY.phoneLandlineHref, external: true },
      { label: 'Pišite', href: `mailto:${COMPANY.emailInfo}`, external: true },
      { label: 'Viber / WhatsApp', href: COMPANY.phoneMobileHref, external: true },
      { label: 'Stovarište na mapi', href: MAPS_URL, external: true },
    ],
  },
]


// Minimalan footer: ispod tamne podloge je jarki kobalt koji kursor trajno otkriva kao trag
// (FooterDots), gore tri kolone linkova, pa veliki wordmark preko cijele širine, a dolje lijevo
// podaci firme i desno polje sa potpisom studija Blink.
export default function Footer() {
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
            <nav key={c.title} data-col aria-label={c.title} className={i === 2 ? 'md:col-span-4 md:col-start-9' : 'md:col-span-4'}>
              <p className="mb-5 text-[10.5px] tracking-[0.14em] opacity-45">({c.title})</p>
              <ul className="flex flex-col">
                {c.items.map((it) => (
                  <li key={it.label}>
                    {it.external ? (
                      <a href={it.href} {...(it.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="foot-link">
                        {it.label}
                      </a>
                    ) : (
                      <Link href={it.href} className="foot-link">
                        {it.label}
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
            {COMPANY.address} · {COMPANY.phoneLandline} · {COMPANY.phoneMobile}
            <br />
            {COMPANY.emailInfo} · {HOURS_SHORT}
          </p>

        </div>
      </div>
    </footer>
    </div>
  )
}
