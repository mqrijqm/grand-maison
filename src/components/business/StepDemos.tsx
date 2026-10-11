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
const TRACK = ['Primljena', 'Potvrđena', 'U pripremi', 'Na putu', 'Isporučena']

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

    // Prozor scene se umanji ako ne stane u karticu (nizak ekran). offsetWidth/Height ne računaju
    // transform, pa je to uvijek prirodna veličina.
    const win = el.firstElementChild as HTMLElement
    const fit = () => {
      const cs = getComputedStyle(el)
      const h = el.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom)
      const w = el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)
      win.style.transform = `scale(${Math.min(1, h / win.offsetHeight, w / win.offsetWidth)})`
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)

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
      return () => ro.disconnect()
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
      ro.disconnect()
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
      <span data-url>{url}</span>
    </div>
  )
}

// 01 — prijava: kursor klikne mejl, otkuca ga, pa lozinku, pa "Prijava".
const FIRM = 'DEMO GRADNJA d.o.o.'
const buildLogin: Build = (q, tl, cursorTo) => {
  const field = (k: string, text: string, first = false) => {
    cursorTo(`[data-f="${k}"]`, first ? undefined : '+=0.2')
    tl.call(() => {
      el.forEach((f) => q(`[data-f="${f}"]`).removeAttribute('data-on'))
      on(q(`[data-f="${k}"]`))
    })
    type(tl, q(`[data-t="${k}"]`), text, '+=0.1')
  }
  const el = ['firm', 'email', 'pass']
  field('firm', FIRM, true)
  field('email', EMAIL)
  field('pass', PASS)
  cursorTo('[data-b="login"]', '+=0.2')
  tl.call(() => q('[data-f="pass"]').removeAttribute('data-on'))
  click(tl, q('[data-b="login"]'))
  tl.to(q('[data-s="ok"]'), { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power3.out' }, '+=0.2')
  // Bez reklama i opšte početne: odmah dashboard firme.
  tl.to(q('[data-s="dash"]'), { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '+=0.9')
  tl.fromTo(q('[data-bar]'), { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: 'power3.out' }, '<0.2')
  // Dijelovi dashboarda izranjaju jedan za drugim (pozdrav, ponuda, brojke, narudžbe, brzi unos).
  tl.fromTo(q('[data-s="dash"]').querySelectorAll('[data-dash-item]'), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power3.out', stagger: 0.07 }, '<')
}
const finalLogin = (q: (sel: string) => HTMLElement) => {
  q('[data-t="firm"]').textContent = FIRM
  q('[data-t="email"]').textContent = EMAIL
  q('[data-t="pass"]').textContent = PASS
}

// Isti prozor za prijavu kao "B2B prijava" u navbaru (LoginModal), sa istim poljima.
function LoginDemo() {
  const root = useDemo(buildLogin, finalLogin)
  return (
    <div ref={root} className={styles.demo}>
      <div className={styles.modal}>
        <span className={styles.close}>×</span>
        <p className={styles.mBrand}>
          Grand Company <span>Portal</span>
        </p>
        <p className={styles.mTitle}>Prijava na nalog firme</p>
        <span className={styles.mField} data-f="firm">
          <span>Firma ili JIB</span>
          <b>
            <em data-type data-t="firm" />
            <i className={styles.caret} />
            <u className={styles.ph}>npr. DEMO GRADNJA d.o.o.</u>
          </b>
        </span>
        <span className={styles.mField} data-f="email">
          <span>E-mail</span>
          <b>
            <em data-type data-t="email" />
            <i className={styles.caret} />
            <u className={styles.ph}>nabavka@firma.ba</u>
          </b>
        </span>
        <span className={styles.mField} data-f="pass">
          <span>Lozinka</span>
          <b>
            <em data-type data-t="pass" />
            <i className={styles.caret} />
            <s className={styles.show}>Prikaži</s>
          </b>
        </span>
        <span className={styles.mRow}>
          <span className={styles.mCheck}>
            <i>✓</i>Zapamti me na ovom uređaju
          </span>
          <span className={styles.mLink}>Zaboravljena lozinka?</span>
        </span>
        <span className={styles.mSubmit} data-b="login">
          Prijava
        </span>
        <span className={styles.mFoot}>
          Nemate nalog? <span className={styles.mLink}>Zatražite poslovni nalog</span>
        </span>
        <div className={styles.ok} data-show data-s="ok">
          <span className={styles.check}>✓</span>
          <p className={styles.h}>Dobro došli</p>
          <p className={styles.muted}>DEMO GRADNJA d.o.o.</p>
        </div>
      </div>
      {/* Poslije prijave: dashboard firme preko cijele scene (ne u maloj kartici za prijavu). */}
      <div className={styles.dash} data-show data-s="dash">
        <div className={styles.dashTop} data-dash-item>
          <span>
            <span className={styles.muted}>Dobro došli</span>
            <b className={styles.dashFirm}>DEMO GRADNJA d.o.o.</b>
          </span>
          <span className={styles.dashBadge}>Demo nalog</span>
        </div>
        <div className={styles.dashHero} data-dash-item>
          <span className={styles.dashHeroLabel}>Ponuda P-26-0142 čeka vašu potvrdu</span>
          <b className={styles.dashHeroNum}>5 stavki</b>
          <i className={styles.meter}>
            <em data-bar />
          </i>
          <span className={styles.dashHeroBtn}>Pregledaj ponudu →</span>
        </div>
        <div className={styles.dashKpis}>
          {[
            ['1', 'Ponuda čeka'],
            ['2', 'Narudžbe u toku'],
            ['3', 'Sačuvane liste'],
          ].map(([n, l]) => (
            <span key={l} className={styles.dashKpi} data-dash-item>
              <b>{n}</b>
              <span className={styles.muted}>{l}</span>
            </span>
          ))}
        </div>
        <div className={styles.dashList} data-dash-item>
          <span className={styles.muted}>Narudžbe u toku</span>
          <p>
            <span>GC-26-04477</span>
            <span className={styles.chip}>Na putu ka gradilištu</span>
          </p>
          <p>
            <span>GC-26-04480</span>
            <span className={styles.chipSoft}>U pripremi</span>
          </p>
        </div>
        <div className={styles.dashQuick} data-dash-item>
          <span className={styles.muted}>Brzi unos</span>
          <span className={styles.fakeInput}>Šifra, npr. GKP-001</span>
        </div>
      </div>
      <Cursor />
    </div>
  )
}

// 02 — brza narudžba: šifra, artikal se sam popuni, količina, "Pošalji upit".
const buildOrder: Build = (q, tl, cursorTo) => {
  const key = (label: string, at?: gsap.Position) => {
    tl.call(() => void (q('[data-t="key"]').textContent = label), undefined, at)
    tl.fromTo(q('[data-s="key"]'), { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.2 }, '<')
    tl.to(q('[data-s="key"]'), { autoAlpha: 0, duration: 0.25 }, '+=0.55')
  }
  ORDER.forEach(([sku, qty], i) => {
    if (i) tl.to(q(`[data-s="row${i}"]`), { autoAlpha: 1, y: 0, duration: 0.3 }, '<')
    else cursorTo(`[data-f="sku${i}"]`)
    tl.call(() => on(q(`[data-f="sku${i}"]`)))
    type(tl, q(`[data-t="sku${i}"]`), sku, '+=0.1')
    tl.to(q(`[data-s="name${i}"]`), { autoAlpha: 1, y: 0, duration: 0.3 }, '+=0.15')
    key('Tab ⇥', '+=0.1')
    tl.call(() => {
      q(`[data-f="sku${i}"]`).removeAttribute('data-on')
      on(q(`[data-f="qty${i}"]`))
    }, undefined, '<0.3')
    type(tl, q(`[data-t="qty${i}"]`), qty, '+=0.1')
    if (i < ORDER.length - 1) key('Enter ↵ novi red', '+=0.15')
    tl.call(() => q(`[data-f="qty${i}"]`).removeAttribute('data-on'), undefined, '+=0.1')
  })
  cursorTo('[data-b="send"]', '+=0.2')
  click(tl, q('[data-b="send"]'))
  tl.to(q('[data-s="sent"]'), { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power3.out' }, '+=0.15')
}
const finalOrder = (q: (sel: string) => HTMLElement) => {
  q('[data-t="key"]').textContent = 'Tab ⇥ · Enter ↵'
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
              <div key={sku} className={styles.row} {...(i ? { 'data-show': '', 'data-s': `row${i}` } : {})}>
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
          <p className={styles.drop}>CSV iz predmjera radova prevucite ovdje</p>
          <div className={styles.foot}>
            <span className={styles.key} data-show data-s="key">
              <kbd data-type data-t="key" />
            </span>
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
            <span>Na putu ka gradilištu · Lamela A</span>
            <b>Stiže 08–10h</b>
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
