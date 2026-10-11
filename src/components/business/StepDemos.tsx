'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import type { IntroDemo } from '@/lib/business'
import ProductGlyph from '@/components/art/ProductGlyph'
import Icon from '@/components/portal/Icon'
import LogoMark from '@/components/site/LogoMark'
import { FIRM as PORTAL_FIRM, SITES } from '@/lib/b2b-demo'
import { PRODUCT_MAP } from '@/lib/shop'
import ps from './portal/Showcase.module.css'
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

// Okvir pravog portala (isti CSS modul kao Showcase): hrom sa adresom, tamna bočna traka sa aktivnom
// stavkom, zaglavlje ekrana i sadržaj. Scena se umanji da stane u karticu (vidi fit u useDemo).
const PORTAL_NAV: { id: string; label: string; icon: string; count?: number }[] = [
  { id: 'pregled', label: 'Pregled', icon: 'pregled' },
  { id: 'materijali', label: 'Materijali', icon: 'brza', count: 2 },
  { id: 'ponude', label: 'Ponude', icon: 'ponude', count: 1 },
  { id: 'narudzbe', label: 'Narudžbe', icon: 'narudzbe', count: 2 },
]
function PortalFrame({ view, title, sub, children }: { view: string; title: string; sub: string; children: React.ReactNode }) {
  return (
    <div className={`${ps.wrap} ${ps.window} ${styles.portal}`}>
      <div className={ps.chrome} aria-hidden>
        <span className={ps.dots}>
          <i />
          <i />
          <i />
        </span>
        <span className={ps.url}>portal.grandcompany.ba/{view}</span>
        <span className={ps.demo}>Demo podaci</span>
      </div>
      <div className={`${ps.body} ${styles.portalBody}`}>
        <aside className={ps.side}>
          <p className={ps.brand}>
            <LogoMark className={ps.brandMark} />
            Grand Company <span>Portal</span>
          </p>
          <div className={ps.account}>
            <span className={ps.avatar}>{PORTAL_FIRM.short}</span>
            <span>
              <b>{PORTAL_FIRM.name}</b>
              <i>{PORTAL_FIRM.user}</i>
            </span>
          </div>
          <nav className={ps.nav} aria-hidden>
            <div className={ps.navGroup}>
              <span className={ps.navLabel}>Nabavka</span>
              {PORTAL_NAV.map((n) => (
                <button key={n.id} type="button" tabIndex={-1} aria-current={n.id === view || undefined}>
                  <Icon name={n.icon} />
                  <span>{n.label}</span>
                  {n.count ? <em>{n.count}</em> : null}
                </button>
              ))}
            </div>
          </nav>
        </aside>
        <main className={ps.main}>
          <header className={ps.head}>
            <div>
              <h3>{title}</h3>
              <p>{sub}</p>
            </div>
          </header>
          <div className={styles.portalContent}>{children}</div>
        </main>
      </div>
    </div>
  )
}

// 02 — isti ekran kao "Materijali i brza narudžba" u portalu: šifra u pretragu, artikal se pojavi
// u rezultatima, ide u "Vaš upit" sa količinom, pa "Pošalji upit".
const buildOrder: Build = (q, tl, cursorTo) => {
  cursorTo('[data-f="q"]')
  ORDER.forEach(([sku, qty], i) => {
    tl.call(() => {
      q('[data-t="q"]').textContent = ''
      on(q('[data-f="q"]'))
    })
    type(tl, q('[data-t="q"]'), sku, '+=0.15')
    tl.to(q(`[data-s="res${i}"]`), { autoAlpha: 1, y: 0, duration: 0.25 }, '+=0.1')
    cursorTo(`[data-s="res${i}"] em`, '+=0.1')
    click(tl, q(`[data-s="res${i}"] em`))
    tl.call(() => q('[data-f="q"]').removeAttribute('data-on'))
    tl.to(q(`[data-s="res${i}"]`), { autoAlpha: 0, duration: 0.2 }, '+=0.05')
    tl.to(q(`[data-s="line${i}"]`), { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power3.out' }, '<')
    tl.call(() => on(q(`[data-f="qty${i}"]`)))
    type(tl, q(`[data-t="qty${i}"]`), qty, '+=0.1')
    tl.call(() => q(`[data-f="qty${i}"]`).removeAttribute('data-on'), undefined, '+=0.15')
    if (i < ORDER.length - 1) cursorTo('[data-f="q"]', '+=0.1')
  })
  cursorTo('[data-b="send"]', '+=0.2')
  click(tl, q('[data-b="send"]'))
  tl.to(q('[data-s="sent"]'), { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power3.out' }, '+=0.15')
}
const finalOrder = (q: (sel: string) => HTMLElement) => {
  ORDER.forEach(([, qty], i) => (q(`[data-t="qty${i}"]`).textContent = qty))
}

function OrderDemo() {
  const root = useDemo(buildOrder, finalOrder)
  return (
    <div ref={root} className={styles.demo}>
      <PortalFrame view="materijali" title="Materijali i brza narudžba" sub="Odaberite artikle, upišite količine i pošaljite jedan upit za više proizvoda.">
        <div className={ps.split}>
          <section className={ps.card}>
            <h4>Dodajte materijal</h4>
            <div className={ps.finder}>
              <span className={ps.groupSelect}>Sve grupe</span>
              <span className={`${ps.search} ${styles.pSearch}`} data-f="q">
                <Icon name="search" />
                <span>
                  <em data-type data-t="q" />
                  <i className={styles.caret} />
                </span>
              </span>
            </div>
            <ul className={styles.pResults}>
              {ORDER.map(([sku], i) => (
                <li key={sku} data-show data-s={`res${i}`}>
                  <span className={ps.glyph} aria-hidden>
                    {PRODUCT_MAP[sku] && <ProductGlyph product={PRODUCT_MAP[sku]} kind={sku.startsWith('GKP-') ? 'board' : undefined} />}
                  </span>
                  <span className={ps.resName}>
                    <b>{PRODUCT_MAP[sku]?.name}</b>
                    <i>{sku}</i>
                  </span>
                  <em>+ Dodaj</em>
                </li>
              ))}
            </ul>
            <p className={ps.fine}>Količinu mijenjate u upitu desno.</p>
          </section>
          <aside className={`${ps.card} ${ps.request}`}>
            <h4>Vaš upit</h4>
            <span className={`${ps.field} ${styles.pField}`}>
              <span>Gradilište</span>
              <b>{SITES[0].name}</b>
            </span>
            <ul className={ps.lines}>
              {ORDER.map(([sku], i) => (
                <li key={sku} data-show data-s={`line${i}`}>
                  <span>
                    <b>{PRODUCT_MAP[sku]?.name}</b>
                    <i>{sku}</i>
                  </span>
                  <span className={styles.pQty} data-f={`qty${i}`}>
                    <em data-type data-t={`qty${i}`} />
                    <i className={styles.caret} />
                    <small>{PRODUCT_MAP[sku]?.unit}</small>
                  </span>
                </li>
              ))}
            </ul>
            <span className={`${ps.primary} ${ps.wide}`} data-b="send">
              Pošalji upit (demo) <Icon name="arrow" />
            </span>
            <span className={styles.pToast} data-show data-s="sent">
              ✓ Upit je poslat prodaji
            </span>
          </aside>
        </div>
      </PortalFrame>
      <Cursor />
    </div>
  )
}

// 03 — isti ekran kao "Ponude" u portalu: izabrana ponuda, stavke "na upit", "Potvrdi ponudu",
// pa status narudžbe korak po korak i dogovoreni termin.
const OFFER_LINES: [string, string][] = [
  ['GKP-001', '420'],
  ['PRF-075', '180'],
  ['ISO-001', '380'],
]
const all = (q: (sel: string) => HTMLElement, sel: string) => Array.from(q('[data-root]').querySelectorAll<HTMLElement>(sel))
const buildTrack: Build = (q, tl, cursorTo) => {
  cursorTo('[data-b="accept"]')
  click(tl, q('[data-b="accept"]'))
  tl.call(() => {
    on(q('[data-b="accept"]'))
    all(q, '[data-chip]').forEach(on)
  })
  tl.to(q('[data-s="progress"]'), { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power3.out' }, '+=0.2')
  TRACK.slice(0, 4).forEach((_, i) => tl.call(() => on(q(`[data-k="${i}"]`)), undefined, i ? '+=0.5' : '+=0.2'))
  tl.to(q('[data-s="slot"]'), { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power3.out' }, '+=0.3')
  cursorTo('[data-s="slot"]', '+=0.2')
}
const finalTrack = (q: (sel: string) => HTMLElement) => {
  on(q('[data-b="accept"]'))
  all(q, '[data-chip]').forEach(on)
  TRACK.slice(0, 4).forEach((_, i) => on(q(`[data-k="${i}"]`)))
}

function TrackDemo() {
  const root = useDemo(buildTrack, finalTrack)
  return (
    <div ref={root} className={styles.demo}>
      <PortalFrame view="ponude" title="Ponude" sub="Ponude koje prodaja pripremi po vašem upitu. Provjerite stavke i potvrdite.">
        <div className={ps.split} data-root>
          <section className={ps.card}>
            <ul className={ps.pick}>
              <li>
                <button type="button" tabIndex={-1} aria-pressed="true">
                  <span>
                    <b>P-26-0142</b>
                    <i>{SITES[0].name} · 5 stavki</i>
                  </span>
                  <span className={`${ps.chip} ${styles.pChip}`} data-k="act" data-chip>
                    <span className={styles.idle}>Čeka potvrdu</span>
                    <span className={styles.done}>Potvrđena</span>
                  </span>
                </button>
              </li>
              <li>
                <button type="button" tabIndex={-1}>
                  <span>
                    <b>P-26-0131</b>
                    <i>{SITES[2].name} · 3 stavke</i>
                  </span>
                  <span className={ps.chip} data-k="done">
                    Potvrđena
                  </span>
                </button>
              </li>
            </ul>
          </section>
          <section className={`${ps.card} ${ps.detail}`}>
            <div className={ps.detailHead}>
              <span>
                <span className={ps.kicker}>Ponuda P-26-0142</span>
                <b>{SITES[0].phase}</b>
                <i>{SITES[0].name} · važi 14 dana</i>
              </span>
            </div>
            <ul className={ps.lines}>
              {OFFER_LINES.map(([sku, qty]) => (
                <li key={sku}>
                  <span>
                    <b>{PRODUCT_MAP[sku]?.name}</b>
                    <i>
                      {sku} · {qty} {PRODUCT_MAP[sku]?.unit}
                    </i>
                  </span>
                  <span className={styles.pPrice}>Na upit</span>
                </li>
              ))}
            </ul>
            <span className={`${ps.primary} ${styles.pAccept}`} data-b="accept">
              <span className={styles.idle}>Potvrdi ponudu (demo) ✓</span>
              <span className={styles.done}>Ponuda potvrđena ✓</span>
            </span>
            <div className={styles.pProgress} data-show data-s="progress">
              <ol className={styles.track}>
                {TRACK.map((t, i) => (
                  <li key={t} data-k={i}>
                    <i />
                    <span>{t}</span>
                  </li>
                ))}
              </ol>
              <div className={styles.slot} data-show data-s="slot">
                <span>Dostava · {SITES[0].name}</span>
                <b>Sutra, 07–09h</b>
              </div>
            </div>
          </section>
        </div>
      </PortalFrame>
      <Cursor />
    </div>
  )
}

export default function StepDemo({ demo }: { demo: IntroDemo }) {
  if (demo === 'login') return <LoginDemo />
  if (demo === 'order') return <OrderDemo />
  return <TrackDemo />
}
