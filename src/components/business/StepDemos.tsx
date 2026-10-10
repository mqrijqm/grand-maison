'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import type { IntroDemo } from '@/lib/business'
import { PRODUCT_MAP } from '@/lib/shop'
import styles from './StepDemos.module.css'

// Animirane UI scene uz uvodne korake na /za-firme: kursor prelazi preko forme, kuca i klikće.
// Scena se pokreće kad je bar 55% vidljiva (IntersectionObserver radi i sa horizontalnim pomjeranjem
// trake jer računa stvarni položaj), vrti se u krug i vraća na početak kad izađe iz ekrana.
// Reduced motion: odmah završno stanje, bez kursora.

type Build = (q: (sel: string) => HTMLElement, tl: gsap.core.Timeline, cursorTo: (sel: string, at?: gsap.Position) => void) => void

const EMAIL = 'nabavka@demogradnja.ba'
const PASS = '••••••••••'
const ORDER: [string, string][] = [
  ['GKP-001', '260'],
  ['PRF-075', '90'],
]
const TRACK = ['Primljena', 'Potvrđena', 'U pripremi', 'Spremna', 'Isporučena']

// Kucanje teksta znak po znak.
function type(tl: gsap.core.Timeline, el: HTMLElement, text: string, at?: gsap.Position) {
  const o = { n: 0 }
  tl.to(o, { n: text.length, duration: text.length * 0.055, ease: 'none', onUpdate: () => void (el.textContent = text.slice(0, Math.round(o.n))) }, at)
}

function useDemo(build: Build, final: (q: (sel: string) => HTMLElement) => void) {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = root.current!
    const q = (sel: string) => el.querySelector<HTMLElement>(sel)!
    const cursor = q('[data-cursor]')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let tl: gsap.core.Timeline | null = null
    let again: gsap.core.Tween | null = null

    // Početno stanje: prazna polja, ništa označeno.
    const reset = () => {
      el.querySelectorAll<HTMLElement>('[data-type]').forEach((t) => (t.textContent = ''))
      el.querySelectorAll<HTMLElement>('[data-on]').forEach((t) => t.removeAttribute('data-on'))
      gsap.set(el.querySelectorAll('[data-show]'), { autoAlpha: 0, y: 6 })
      gsap.set(cursor, { x: el.clientWidth * 0.82, y: el.clientHeight * 0.9, autoAlpha: 0 })
    }
    if (reduce) {
      final(q)
      gsap.set(el.querySelectorAll('[data-show]'), { autoAlpha: 1, y: 0 })
      gsap.set(cursor, { autoAlpha: 0 })
      return
    }

    const cursorTo = (sel: string, at?: gsap.Position) => {
      tl!.to(
        cursor,
        {
          x: () => {
            const t = q(sel).getBoundingClientRect(), r = el.getBoundingClientRect()
            return t.left - r.left + t.width * 0.3
          },
          y: () => {
            const t = q(sel).getBoundingClientRect(), r = el.getBoundingClientRect()
            return t.top - r.top + t.height * 0.55
          },
          duration: 0.7,
          ease: 'power2.inOut',
        },
        at,
      )
    }
    const run = () => {
      tl?.kill()
      reset()
      tl = gsap.timeline({ onComplete: () => void (again = gsap.delayedCall(2.4, run)) })
      tl.to(cursor, { autoAlpha: 1, duration: 0.25 })
      build(q, tl, cursorTo)
    }
    const stop = () => {
      tl?.kill()
      again?.kill()
      tl = null
      reset()
    }

    reset()
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) stop()
        else if (!tl) run()
      },
      { threshold: 0.55 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      stop()
    }
  }, [build, final])

  return root
}

const on = (el: HTMLElement) => el.setAttribute('data-on', '')
const click = (tl: gsap.core.Timeline, el: HTMLElement, at?: gsap.Position) =>
  tl.to(el, { scale: 0.96, duration: 0.09, yoyo: true, repeat: 1, ease: 'power1.inOut' }, at)

function Cursor() {
  return (
    <svg data-cursor className={styles.cursor} viewBox="0 0 20 22" aria-hidden>
      <path d="M2 1.5v16.2l4.3-4.1 2.8 6.6 3-1.3-2.8-6.5H15z" />
    </svg>
  )
}

function Bar({ url }: { url: string }) {
  return (
    <div className={styles.bar} aria-hidden>
      <i />
      <i />
      <i />
      <span>{url}</span>
    </div>
  )
}

// 01 — prijava: kursor klikne mejl, otkuca ga, pa lozinku, pa "Prijava".
const buildLogin: Build = (q, tl, cursorTo) => {
  cursorTo('[data-f="email"]')
  tl.call(() => on(q('[data-f="email"]')))
  type(tl, q('[data-t="email"]'), EMAIL, '+=0.1')
  cursorTo('[data-f="pass"]', '+=0.2')
  tl.call(() => {
    q('[data-f="email"]').removeAttribute('data-on')
    on(q('[data-f="pass"]'))
  })
  type(tl, q('[data-t="pass"]'), PASS, '+=0.1')
  cursorTo('[data-b="login"]', '+=0.2')
  tl.call(() => q('[data-f="pass"]').removeAttribute('data-on'))
  click(tl, q('[data-b="login"]'))
  tl.to(q('[data-s="ok"]'), { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power3.out' }, '+=0.2')
}
const finalLogin = (q: (sel: string) => HTMLElement) => {
  q('[data-t="email"]').textContent = EMAIL
  q('[data-t="pass"]').textContent = PASS
}

function LoginDemo() {
  const root = useDemo(buildLogin, finalLogin)
  return (
    <div ref={root} className={styles.demo}>
      <div className={styles.win}>
        <Bar url="portal.grandcompany.ba/prijava" />
        <div className={styles.loginBody}>
          <div className={styles.login}>
            <p className={styles.brand}>
              Grand Company <span>Portal</span>
            </p>
            <p className={styles.h}>Prijava na nalog firme</p>
            <label className={styles.field} data-f="email">
              <span>E-mail</span>
              <b>
                <em data-type data-t="email" />
                <i className={styles.caret} />
              </b>
            </label>
            <label className={styles.field} data-f="pass">
              <span>Lozinka</span>
              <b>
                <em data-type data-t="pass" />
                <i className={styles.caret} />
              </b>
            </label>
            <span className={styles.btn} data-b="login">
              Prijava
            </span>
          </div>
          <div className={styles.ok} data-show data-s="ok">
            <span className={styles.check}>✓</span>
            <p className={styles.h}>Dobro došli</p>
            <p className={styles.muted}>DEMO GRADNJA d.o.o.</p>
          </div>
        </div>
      </div>
      <Cursor />
    </div>
  )
}

// 02 — brza narudžba: šifra, artikal se sam popuni, količina, "Pošalji upit".
const buildOrder: Build = (q, tl, cursorTo) => {
  ORDER.forEach(([sku, qty], i) => {
    cursorTo(`[data-f="sku${i}"]`, i ? '+=0.2' : undefined)
    tl.call(() => on(q(`[data-f="sku${i}"]`)))
    type(tl, q(`[data-t="sku${i}"]`), sku, '+=0.1')
    tl.to(q(`[data-s="name${i}"]`), { autoAlpha: 1, y: 0, duration: 0.3 }, '+=0.15')
    cursorTo(`[data-f="qty${i}"]`, '+=0.1')
    tl.call(() => {
      q(`[data-f="sku${i}"]`).removeAttribute('data-on')
      on(q(`[data-f="qty${i}"]`))
    })
    type(tl, q(`[data-t="qty${i}"]`), qty, '+=0.1')
    tl.call(() => q(`[data-f="qty${i}"]`).removeAttribute('data-on'), undefined, '+=0.15')
  })
  cursorTo('[data-b="send"]', '+=0.2')
  click(tl, q('[data-b="send"]'))
  tl.to(q('[data-s="sent"]'), { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power3.out' }, '+=0.15')
}
const finalOrder = (q: (sel: string) => HTMLElement) => {
  ORDER.forEach(([sku, qty], i) => {
    q(`[data-t="sku${i}"]`).textContent = sku
    q(`[data-t="qty${i}"]`).textContent = qty
  })
}

function OrderDemo() {
  const root = useDemo(buildOrder, finalOrder)
  return (
    <div ref={root} className={styles.demo}>
      <div className={styles.win}>
        <Bar url="portal.grandcompany.ba/brza-narudzba" />
        <div className={styles.pad}>
          <p className={styles.h}>Brza narudžba</p>
          <div className={styles.table}>
            <div className={styles.thead}>
              <span>Šifra</span>
              <span>Artikal</span>
              <span>Količina</span>
            </div>
            {ORDER.map(([sku], i) => (
              <div key={sku} className={styles.row}>
                <span className={styles.cell} data-f={`sku${i}`}>
                  <em data-type data-t={`sku${i}`} />
                  <i className={styles.caret} />
                </span>
                <span className={styles.name} data-show data-s={`name${i}`}>
                  <i className={styles.valid}>✓</i>
                  {PRODUCT_MAP[sku]?.name}
                </span>
                <span className={`${styles.cell} ${styles.qty}`} data-f={`qty${i}`}>
                  <em data-type data-t={`qty${i}`} />
                  <i className={styles.caret} />
                  <small>{PRODUCT_MAP[sku]?.unit}</small>
                </span>
              </div>
            ))}
          </div>
          <div className={styles.foot}>
            <span className={styles.toast} data-show data-s="sent">
              ✓ Upit je poslat prodaji
            </span>
            <span className={styles.btn} data-b="send">
              Pošalji upit
            </span>
          </div>
        </div>
      </div>
      <Cursor />
    </div>
  )
}

// 03 — ponuda i isporuka: "Prihvati ponudu", status ide korak po korak, pa termin dostave.
const buildTrack: Build = (q, tl, cursorTo) => {
  cursorTo('[data-b="accept"]')
  click(tl, q('[data-b="accept"]'))
  tl.call(() => on(q('[data-b="accept"]')))
  TRACK.slice(0, 4).forEach((_, i) => tl.call(() => on(q(`[data-k="${i}"]`)), undefined, i ? '+=0.55' : '+=0.3'))
  tl.to(q('[data-s="slot"]'), { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power3.out' }, '+=0.3')
  cursorTo('[data-s="slot"]', '+=0.2')
}
const finalTrack = (q: (sel: string) => HTMLElement) => {
  on(q('[data-b="accept"]'))
  TRACK.slice(0, 4).forEach((_, i) => on(q(`[data-k="${i}"]`)))
}

function TrackDemo() {
  const root = useDemo(buildTrack, finalTrack)
  return (
    <div ref={root} className={styles.demo}>
      <div className={styles.win}>
        <Bar url="portal.grandcompany.ba/ponude" />
        <div className={styles.pad}>
          <div className={styles.quote}>
            <div>
              <p className={styles.muted}>Ponuda P-26-0142</p>
              <p className={styles.h}>Pregradni zidovi, sprat 3</p>
            </div>
            <span className={styles.btn} data-b="accept">
              <span className={styles.idle}>Prihvati ponudu</span>
              <span className={styles.done}>Prihvaćeno ✓</span>
            </span>
          </div>
          <ol className={styles.track}>
            {TRACK.map((t, i) => (
              <li key={t} data-k={i}>
                <i />
                <span>{t}</span>
              </li>
            ))}
          </ol>
          <div className={styles.slot} data-show data-s="slot">
            <span>Dostava na gradilište</span>
            <b>Sutra 08–10h</b>
          </div>
        </div>
      </div>
      <Cursor />
    </div>
  )
}

export default function StepDemo({ demo }: { demo: IntroDemo }) {
  if (demo === 'login') return <LoginDemo />
  if (demo === 'order') return <OrderDemo />
  return <TrackDemo />
}
