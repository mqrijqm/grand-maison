'use client'

/* eslint-disable @next/next/no-img-element -- WebP fotografije iz /public */

import Link from 'next/link'
import { useRef, useState } from 'react'
import { COMPANY as GC } from '@/gc/gc'
import { SHOW_DRYWALL_CALC } from '@/lib/flags'
import { gsap, useGSAP } from '@/lib/gsap'
import styles from './CatalogMarkets.module.css'

// Uvod kataloga po uzoru na lpas.com: tamna fotografija stovarišta preko cijelog ekrana, a skrol
// vozi traku velikih kartica kategorija preko nje. Kartica koja dolazi ulijevo dobija višu fotografiju
// (a niži panel), kartice desno su "na čekanju" sa nižom fotografijom.
//
// Kategorije su samo provjerene (istraživanje 2026-10-11): Tondach i Porotherm su na Wienerbergerovoj
// mapi prodajnih mjesta, Baumalt na svojoj listi partnera; suha gradnja i izolacija su grupe kataloga.
// Ostale grupe sa starog sajta firme idu na posljednju karticu, po upitu.
// Boje panela: tamno plava, bakar i oker iz logotipa, kobalt sajta i krem; tekst bijel ili tamno plav prema pozadini.
// Fotografije: Pexels (izvori u public/stock/credits.json), Codex samo crop i ton. Uvod: dron snimak stovarišta.

type Market = {
  id: string
  title: string
  sub: string
  desc: string
  href: string
  img: string
  bg: string
  ink: 'light' | 'dark'
  links?: { label: string; href: string }[]
}

const MARKETS: Market[] = [
  {
    id: 'krovni',
    title: 'Krovni sistemi',
    sub: 'Tondach crijep, Wienerberger',
    desc: 'Glineni crijep i sistemska oprema za kose krovove: Continental, Traditon, Twiston, Planoton i drugi modeli.',
    href: '/prodavnica?kategorija=krovni-sistemi#artikli',
    img: '/markets/krovni.webp',
    bg: '#1b2436',
    ink: 'light',
    links: [
      { label: 'Tondach crijep', href: '/prodavnica?kategorija=krovni-sistemi#artikli' },
      { label: 'Kalkulatori za krov', href: '/kalkulator' },
      { label: 'Upit za krovni program', href: '/upit-za-izvodjace?program=zidni-krovni' },
    ],
  },
  {
    id: 'blokovi',
    title: 'Zidni blokovi',
    sub: 'Porotherm, Wienerberger',
    desc: 'Opeka za nosive, spoljne i pregradne zidove, debljine od 10 do 50 cm, i blokovi punjeni kamenom vunom.',
    href: '/prodavnica?kategorija=zidni-blokovi#artikli',
    img: '/markets/blokovi.webp',
    bg: '#b46c44',
    ink: 'light',
    links: [
      { label: 'Porotherm blokovi', href: '/prodavnica?kategorija=zidni-blokovi#artikli' },
      { label: 'Kalkulatori za zid', href: '/kalkulator' },
      { label: 'Upit za zidni program', href: '/upit-za-izvodjace?program=zidni-krovni' },
    ],
  },
  {
    id: 'malteri',
    title: 'Malteri i ljepila',
    sub: 'Baumalt i gipsane mase',
    desc: 'Mašinski cementno-krečni i gipsani malteri, ljepila za keramiku i dekorativni malteri Baumalt.',
    href: '/prodavnica?kategorija=malteri-ljepila#artikli',
    img: '/markets/malteri-ljepila.webp',
    bg: '#3156ea',
    ink: 'light',
    links: [
      { label: 'Baumalt malteri i ljepila', href: '/prodavnica?kategorija=malteri-ljepila#artikli' },
      { label: 'Gipsane mase', href: '/prodavnica?kategorija=veziva#artikli' },
    ],
  },
  {
    id: 'suha-gradnja',
    title: 'Suha gradnja',
    sub: 'Ploče, profili i pribor',
    desc: 'Gips-kartonske ploče, pocinčani profili i pribor za pregradne zidove i spuštene plafone.',
    href: '/prodavnica?kategorija=suha-gradnja#artikli',
    img: '/markets/suha-gradnja.webp',
    bg: '#bd9446',
    ink: 'dark',
    links: [
      { label: 'Gips-kartonske ploče', href: '/prodavnica?kategorija=suha-gradnja&q=plo%C4%8Da#artikli' },
      { label: 'Profili', href: '/prodavnica?kategorija=suha-gradnja&q=profil#artikli' },
      { label: 'Pribor', href: '/prodavnica?kategorija=oprema#artikli' },
      ...(SHOW_DRYWALL_CALC ? [{ label: 'Kalkulator za zid', href: '/kalkulator' }] : []),
    ],
  },
  {
    id: 'izolacija',
    title: 'Izolacija',
    sub: 'Kamena vuna u pločama',
    desc: 'Kamena vuna u pločama za toplotnu i zvučnu izolaciju zidova, potkrovlja i krovova.',
    href: '/prodavnica?kategorija=izolacija#artikli',
    img: '/markets/izolacija.webp',
    bg: '#f4f1ec',
    ink: 'dark',
    links: [{ label: 'Kamena vuna', href: '/prodavnica?kategorija=izolacija#artikli' }],
  },
]


const Plus = () => (
  <svg viewBox="0 0 20 20" aria-hidden fill="none" stroke="currentColor" strokeWidth={1.3}>
    <path d="M10 3v14M3 10h14" />
  </svg>
)
const Chevron = () => (
  <svg viewBox="0 0 10 16" aria-hidden fill="none" stroke="currentColor" strokeWidth={1.3}>
    <path d="m2 2 6 6-6 6" />
  </svg>
)

/** strip: samo traka kartica (bez uvoda sa fotografijom stovarišta), npr. na početnoj ispod naslova. */
export default function CatalogMarkets({ variant = 'page' }: { variant?: 'page' | 'strip' }) {
  const strip = variant === 'strip'
  const root = useRef<HTMLElement>(null)
  const [open, setOpen] = useState<string | null>(null)

  useGSAP(
    () => {
      const el = root.current!
      const stage = el.querySelector<HTMLElement>('[data-stage]')!
      const track = el.querySelector<HTMLElement>('[data-track]')!
      const cards = gsap.utils.toArray<HTMLElement>('[data-card]', track)
      const shade = el.querySelector<HTMLElement>('[data-shade]')
      const introText = el.querySelector<HTMLElement>('[data-intro-text]')
      const bg = el.querySelector<HTMLElement>('[data-intro-bg]')
      const mm = gsap.matchMedia()

      // Desktop: scena se zakači, skrol vodi traku ulijevo (scrub = mekano kašnjenje kao na lpas).
      mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
        const vw = () => window.innerWidth
        // Prodavnica: prva kartica viri ~14 % ekrana preko uvoda. Traka na početnoj kreće od lijeve margine.
        const start = () => (strip ? Math.min(vw() * 0.06, 90) : vw() * 0.86)
        const distance = () => start() + track.scrollWidth - vw()

        // Visina fotografije po kartici: desno 50 %, kad stigne do lijeve trećine 68 %.
        const setters = cards.map((c) => gsap.quickSetter(c, '--img', '%'))
        const imgs = cards.map((c) => c.querySelector<HTMLElement>('[data-img]'))
        const layout = () => {
          const w = vw()
          cards.forEach((c, i) => {
            const x = c.getBoundingClientRect().left
            const t = gsap.utils.clamp(0, 1, gsap.utils.mapRange(w * 0.72, w * 0.12, 0, 1, x))
            setters[i](50 + 18 * t)
            // Slika u kartici klizi sporije od kartice (parallax).
            const img = imgs[i]
            if (img) gsap.set(img, { xPercent: gsap.utils.mapRange(-w, w, 8, -8, x - w * 0.2) })
          })
        }

        gsap.set(track, { x: start() })
        layout()
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: stage,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
          onUpdate: layout,
        })
        tl.fromTo(track, { x: () => start() }, { x: () => -(track.scrollWidth - vw()), ease: 'none' }, 0)
        // Uvod tamni i blago se povlači ulijevo dok ga kartice prekrivaju.
        if (shade && introText && bg) {
          tl.fromTo(shade, { opacity: 0.38 }, { opacity: 0.8, ease: 'none', duration: 0.35 }, 0)
          tl.fromTo(introText, { x: 0 }, { x: () => -vw() * 0.06, ease: 'none', duration: 0.35 }, 0)
          tl.fromTo(bg, { scale: 1.08 }, { scale: 1, ease: 'none', duration: 0.5 }, 0)
        }
        return () => {
          gsap.set(track, { clearProps: 'transform' })
          cards.forEach((c) => c.style.removeProperty('--img'))
        }
      })

      // Ulaz: tekst uvoda izranja, prva kartica uklizi sa desne ivice.
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        if (introText) gsap.from(introText.querySelectorAll('[data-line]'), { yPercent: 110, duration: 0.9, ease: 'power4.out', stagger: 0.08, delay: 0.15 })
        gsap.from(el.querySelectorAll('[data-meta]'), { autoAlpha: 0, y: 12, duration: 0.6, ease: 'power3.out', stagger: 0.06, delay: 0.35 })
      })

      // Krug "Pogledaj" prati kursor preko fotografije kartice.
      mm.add('(hover: hover) and (pointer: fine)', () => {
        const blob = el.querySelector<HTMLElement>('[data-blob]')!
        gsap.set(blob, { xPercent: -50, yPercent: -50, scale: 0 })
        const bx = gsap.quickTo(blob, 'x', { duration: 0.5, ease: 'power3' })
        const by = gsap.quickTo(blob, 'y', { duration: 0.5, ease: 'power3' })
        const move = (e: PointerEvent) => {
          const r = stage.getBoundingClientRect()
          bx(e.clientX - r.left)
          by(e.clientY - r.top)
        }
        const show = () => gsap.to(blob, { scale: 1, duration: 0.45, ease: 'back.out(1.6)', overwrite: 'auto' })
        const hide = () => gsap.to(blob, { scale: 0, duration: 0.3, ease: 'power2.in', overwrite: 'auto' })
        const links = gsap.utils.toArray<HTMLElement>('[data-img-link]', el)
        stage.addEventListener('pointermove', move)
        links.forEach((l) => {
          l.addEventListener('pointerenter', show)
          l.addEventListener('pointerleave', hide)
        })
        return () => {
          stage.removeEventListener('pointermove', move)
          links.forEach((l) => {
            l.removeEventListener('pointerenter', show)
            l.removeEventListener('pointerleave', hide)
          })
        }
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} className={`${styles.root} ${strip ? styles.strip : ''}`} aria-label="Kategorije kataloga">
      <div data-stage className={styles.stage}>
        {/* ——— Uvod ——— */}
        {!strip && <div className={styles.intro}>
          <div className={styles.introBg}>
            <div data-intro-bg className={styles.introPics}>
              {/* Stalna pozadina: plavi duotone dron snimka stovarišta, krov i fasada u boji. */}
              <img src="/stovariste/shop-duotone-roof.webp" alt="" width={1581} height={995} fetchPriority="high" decoding="async" />
            </div>
            <span data-shade className={styles.shade} aria-hidden />
          </div>
          <div data-intro-text className={styles.introText}>
            <div className={styles.meta}>
              <span data-meta>Grand Company · Katalog</span>
              <span data-meta>Stovarište, veleprodaja i maloprodaja</span>
              <span data-meta className={styles.metaScroll}>
                Skrolujte
                <span className={styles.metaArrow} aria-hidden>
                  <Chevron />
                </span>
              </span>
            </div>
            <h1 className={styles.statement}>
              <span className={styles.lineMask}>
                <span data-line>Građevinski materijal</span>
              </span>
              <span className={styles.lineMask}>
                <span data-line>sa stovarišta u</span>
              </span>
              <span className={styles.lineMask}>
                <span data-line>
                  Banjoj Luci
                  <a href="#artikli" className={styles.statementBtn} aria-label="Na artikle">
                    <Chevron />
                  </a>
                </span>
              </span>
            </h1>
          </div>
        </div>}

        {/* ——— Kartice kategorija ——— */}
        <div data-track className={styles.track}>
          {MARKETS.map((m, i) => (
            <article
              key={m.id}
              data-card
              className={styles.card}
              data-ink={m.ink}
              data-open={open === m.id || undefined}
            >
              <Link href={m.href} data-img-link className={styles.cardImage} aria-label={`Pogledajte: ${m.title}`}>
                <img data-img src={m.img} alt="" width={1280} height={1024} loading={i < 2 ? 'eager' : 'lazy'} decoding="async" />
              </Link>
              {/* Boja je na panelu (ne na kartici): GSAP piše --img na karticu, pa joj ne dira ostale stilove. */}
              <div className={styles.panel} style={{ '--panel': m.bg } as React.CSSProperties}>
                <button
                  type="button"
                  className={styles.plus}
                  aria-expanded={open === m.id}
                  aria-label={`${open === m.id ? 'Zatvori' : 'Otvori'} podkategorije: ${m.title}`}
                  onClick={() => setOpen((o) => (o === m.id ? null : m.id))}
                >
                  <Plus />
                </button>
                {m.links && (
                  <ul className={styles.subs}>
                    {m.links.map((l) => (
                      <li key={l.label}>
                        <Link href={l.href} tabIndex={open === m.id ? 0 : -1}>
                          {l.label}
                          <Chevron />
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
                {/* Naslov je na vrhu panela (odmah ispod fotografije), da se vidi na svakoj visini ekrana. */}
                <div className={styles.panelHead}>
                  <h2 className={styles.cardTitle}>{m.title}</h2>
                  <p className={styles.count}>
                    {i + 1} / {MARKETS.length}
                  </p>
                  <p className={styles.cardDesc}>{m.desc}</p>
                </div>
                <p className={styles.cardSub}>{m.sub}</p>
              </div>
            </article>
          ))}

          {/* Posljednja kartica: pitch i poziv. Ostale grupe sa starog sajta firme (fasade, hidroizolacija,
              cement, željezo) i programi predstavljeni na Danu otvorenih vrata (dimnjački i cijevni sistemi,
              opločnici, sinterovani kamen) nemaju potvrđen lager, pa idu kao upit, ne kao lista artikala. */}
          <article data-card className={`${styles.card} ${styles.cardLast}`} data-ink="light">
            <div className={styles.lastInner}>
              <p className={styles.lastLabel}>Ostali program · po upitu</p>
              <h2 className={styles.lastTitle}>Ne vidite šta vam treba?</h2>
              <p className={styles.lastText}>
                Za dimnjačke i cijevne sisteme, hidroizolaciju, opločnike, sinterovani kamen, fasadne sisteme, cemente i
                željezo pošaljite upit sa količinama.
                Prodaja vam javlja dostupnost, cijenu i termin preuzimanja ili dostave po Banjoj Luci.
              </p>
              <div className={styles.lastActions}>
                <Link href="/upit-za-izvodjace" className={styles.lastBtn}>
                  Pošaljite upit
                  <Chevron />
                </Link>
                <a href={GC.phoneLandlineHref} className={styles.lastPhone}>
                  ili pozovite {GC.phoneLandline}
                </a>
              </div>
            </div>
          </article>
        </div>

        <span data-blob className={styles.blob} aria-hidden>
          Pogledaj
        </span>
      </div>
    </section>
  )
}
