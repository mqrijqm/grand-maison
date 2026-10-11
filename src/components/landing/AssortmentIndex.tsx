'use client'

/* eslint-disable @next/next/no-img-element -- male WebP fotografije iz /public */

import Link from 'next/link'
import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'
import { useMediaMotion } from '@/lib/media'
import { EASE, MQ } from '@/lib/motion'
import styles from './Heritage.module.css'

// Asortiman kao tipografski indeks. Grupe su doslovno sa stare stranice "O nama" (grandcompany.ba,
// 2021–2025), plus suha gradnja (javno naveden segment), plus programi predstavljeni na Danu otvorenih
// vrata u Grand Company (Tondach, oko 2023: dimnjački i cijevni sistemi, opločnici, sinterovani kamen) —
// označeni su "po upitu", jer prezentacija ne dokazuje stalan lager. Bilješke desno su samo ono što je
// potvrđeno izvorom; bez artikala, cijena i stanja (javnog cjenovnika nema).
// Fotografije su prave (Pexels, izvori u public/stock/credits.json); Codex ih je samo izrezao i ujednačio ton.
const GROUPS: { name: string; img: string; note?: string }[] = [
  { name: 'Fasadni sistemi', img: 'fasadni' },
  { name: 'Termoizolacioni sistemi', img: 'termoizolacioni', note: 'Kamena vuna' },
  { name: 'Hidroizolacioni sistemi', img: 'hidroizolacioni' },
  { name: 'Krovni sistemi', img: 'krovni', note: 'Tondach crijep i krovni elementi' },
  { name: 'Dimnjački sistemi', img: 'dimnjacki', note: 'Po upitu' },
  { name: 'Blokovi', img: 'blokovi', note: 'Porotherm blokovi od opeke' },
  { name: 'Suha gradnja', img: 'suha-gradnja', note: 'Sistemi za pregradne zidove i plafone' },
  { name: 'Keramička ljepila', img: 'keramicka-ljepila' },
  { name: 'Mašinski malteri', img: 'masinski-malteri', note: 'Baumalt malteri' },
  { name: 'Cementi', img: 'cementi' },
  { name: 'Željezo', img: 'zeljezo' },
  { name: 'Cijevni sistemi', img: 'cijevni', note: 'Po upitu' },
  { name: 'Opločnici', img: 'oplocnici', note: 'Po upitu' },
  { name: 'Sinterovani kamen', img: 'sinterovani-kamen', note: 'Po upitu' },
  { name: 'Drvni program', img: 'drvni-program', note: 'Registrovana djelatnost · po upitu' },
  { name: 'Sanitarna oprema', img: 'sanitarna-oprema', note: 'Registrovana djelatnost · po upitu' },
]
const src = (img: string) => `/assortment/${img}.webp`

// Prodajna mjesta prema javnim listama proizvođača: Baumalt (aktuelna lista partnera), Wienerberger
// (lista prodajnih mjesta, april 2020 — istorijski dokaz, pa dostupnost modela potvrđuje prodaja).
const MAKERS = [
  { name: 'Baumalt', text: 'Građevinska hemija. Grand Company je na Baumaltovoj listi prodajnih lokacija za Banju Luku.', href: '/prodavnica?brend=baumalt#artikli' },
  { name: 'Tondach', text: 'Crijep i krovni sistemi grupe Wienerberger. Na Wienerbergerovoj listi prodajnih mjesta (2020).', href: '/prodavnica?brend=tondach#artikli' },
  { name: 'Porotherm', text: 'Zidni blokovi od opeke grupe Wienerberger. Na Wienerbergerovoj listi prodajnih mjesta (2020).', href: '/prodavnica?brend=porotherm#artikli' },
]

export default function AssortmentIndex() {
  const root = useRef<HTMLElement>(null)
  useMediaMotion(root)

  useGSAP(
    () => {
      const el = root.current!
      gsap.matchMedia().add(MQ, (ctx) => {
        const { reduce } = ctx.conditions as { reduce: boolean }
        if (reduce) return
        // Redovi indeksa ulaze jedan za drugim, kao kad se lista ispisuje.
        gsap.from(el.querySelectorAll('[data-row]'), {
          yPercent: 60,
          autoAlpha: 0,
          duration: 0.5,
          ease: EASE.quint,
          stagger: 0.05,
          scrollTrigger: { trigger: el.querySelector('[data-list]'), start: 'top 85%' },
        })
      })

      // Hover kvadrat sa fotografijom: prati kursor preko liste, a slika se mijenja po redu.
      // Samo uređaji sa mišem; na dodir svaki red ima svoju malu sličicu (CSS).
      gsap.matchMedia().add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
        const list = el.querySelector<HTMLElement>('[data-list]')!
        const float = el.querySelector<HTMLElement>('[data-float]')!
        const imgs = gsap.utils.toArray<HTMLElement>('[data-float-img]', float)
        const rows = gsap.utils.toArray<HTMLElement>('[data-row]', list)
        gsap.set(float, { xPercent: -50, yPercent: -50, scale: 0, autoAlpha: 0 })
        const x = gsap.quickTo(float, 'x', { duration: 0.45, ease: 'power3' })
        const y = gsap.quickTo(float, 'y', { duration: 0.45, ease: 'power3' })
        let first = true
        const move = (e: PointerEvent) => {
          const r = list.getBoundingClientRect()
          const px = e.clientX - r.left
          const py = e.clientY - r.top
          // Prvi ulazak: kvadrat se pojavi tačno ispod kursora, bez klizanja iz ugla.
          if (first) {
            gsap.set(float, { x: px, y: py })
            x(px)
            y(py)
            first = false
            return
          }
          x(px)
          y(py)
        }
        const show = (i: number) => {
          imgs.forEach((img, k) => img.classList.toggle(styles.floatOn, k === i))
          gsap.to(float, { scale: 1, autoAlpha: 1, duration: 0.35, ease: 'power3.out', overwrite: 'auto' })
        }
        const hide = () => {
          first = true
          gsap.to(float, { scale: 0, autoAlpha: 0, duration: 0.25, ease: 'power2.in', overwrite: 'auto' })
        }
        const enters = rows.map((row, i) => {
          const fn = () => show(i)
          row.addEventListener('pointerenter', fn)
          return fn
        })
        list.addEventListener('pointermove', move)
        list.addEventListener('pointerleave', hide)
        return () => {
          rows.forEach((row, i) => row.removeEventListener('pointerenter', enters[i]))
          list.removeEventListener('pointermove', move)
          list.removeEventListener('pointerleave', hide)
        }
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="asortiman-grupe" aria-label="Asortiman" className={styles.index}>
      <div className={`gutter ${styles.indexHead}`}>
        <p data-up className="label opacity-60">
          Asortiman
        </p>
      </div>

      <div className={styles.listWrap}>
        <ol data-list className={styles.list}>
          {GROUPS.map((g, i) => (
            <li key={g.name} data-row className={styles.row}>
              <span className={styles.num}>{String(i + 1).padStart(2, '0')}</span>
              <span className={`display ${styles.name}`}>{g.name}</span>
              <span className={styles.note}>{g.note ?? ''}</span>
              <img className={styles.thumb} src={src(g.img)} alt="" width={800} height={800} loading="lazy" decoding="async" />
            </li>
          ))}
        </ol>
        {/* Kvadrat koji prati kursor; sve slike su već tu, pa nema čekanja na hover. */}
        <div data-float aria-hidden className={styles.float}>
          {GROUPS.map((g) => (
            <img key={g.img} data-float-img src={src(g.img)} alt="" width={800} height={800} loading="lazy" decoding="async" />
          ))}
        </div>
      </div>

      <div className={`gutter ${styles.makers}`}>
        <div data-up>
          <p className="label opacity-60">Proizvođači</p>
          <p className={`mt-4 max-w-[34ch] ${styles.indexLead}`}>
            Grand Company je na listama prodajnih mjesta ovih proizvođača. Dostupnost pojedinih modela potvrđuje prodaja.
          </p>
        </div>
        <div>
          <div className={styles.makerList}>
            {MAKERS.map((m) => (
              <Link key={m.name} href={m.href} data-up className={styles.maker} aria-label={`${m.name}: artikli u asortimanu`}>
                <h3 className={`display ${styles.makerName}`}>{m.name}</h3>
                <p className={styles.makerText}>{m.text}</p>
                <span className={styles.makerGo}>
                  Asortiman
                  <svg viewBox="0 0 24 12" aria-hidden fill="none" stroke="currentColor" strokeWidth={1.6}>
                    <path d="M0 6h22M17 1l5 5-5 5" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
