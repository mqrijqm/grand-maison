'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { cartCount, openCart, useShop } from '@/lib/cart'
import { gsap, useGSAP } from '@/lib/gsap'
import { EASE, MQ } from '@/lib/motion'
import { pw } from '@/components/ui/Pw'
import { LOGIN_EVENT, type LoginMode } from '@/lib/login-events'
import LoginModal from './LoginModal'
import LangToggle from './LangToggle'
import { useLang } from '@/lib/i18n'
import LogoMark from './LogoMark'

// Navbar cijelog sajta: linkovi lijevo, logo (znak + GRAND COMPANY) u sredini, desno crveni
// "Kupuj" i korpa kao ikonica (na hover iza nje izraste crveni romb). Na telefonu: tri crte
// lijevo (meni preko cijelog ekrana), logo u sredini, korpa desno.
//
// variant="home": tokom herosa traka stoji ispod velikog wordmarka, a logo u sredini je prazan.
// Kad se pređe hero, SiteChrome "spusti" veliki wordmark u sredinu trake (smanji ga tačno na
// mjesto ovog logotipa) i postavi html[data-wm-docked] — tek tada se logo ovdje pokaže.
// variant="inner": traka je na vrhu i logo se vidi odmah.

const LINKS = [
  ['Asortiman', '/prodavnica', 'Range'],
  ['Za firme', '/za-firme', 'For business'],
  ['Kontakt', '/kontakt', 'Contact'],
] as const

const MENU = [['Početna', '/', 'Home'], ...LINKS, ['Kalkulator', '/kalkulator', 'Calculator'], ['Vodiči', '/vodici', 'Guides']] as const

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="nav__cart-icon" fill="none" stroke="currentColor" strokeWidth={1.4} aria-hidden>
      <path d="M5 8h14l-1.2 12H6.2L5 8Z" />
      <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
    </svg>
  )
}

export default function SiteHeader({ variant }: { variant: 'inner' | 'overlay' | 'home' }) {
  const home = variant !== 'inner'
  const header = useRef<HTMLElement>(null)
  const menu = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [login, setLogin] = useState(false)
  const closeLogin = useCallback(() => setLogin(false), [])
  // Režim prozora i brojač otvaranja (svako otvaranje kreće od čistog stanja: prijava ili registracija).
  const [loginMode, setLoginMode] = useState<LoginMode>('login')
  const [loginSeq, setLoginSeq] = useState(0)
  const openLoginModal = useCallback((mode: LoginMode = 'login') => {
    setLoginMode(mode)
    setLoginSeq((n) => n + 1)
    setLogin(true)
  }, [])
  useEffect(() => {
    const on = (e: Event) => openLoginModal((e as CustomEvent<LoginMode>).detail ?? 'login')
    window.addEventListener(LOGIN_EVENT, on)
    return () => window.removeEventListener(LOGIN_EVENT, on)
  }, [openLoginModal])
  const { t } = useLang()
  const pathname = usePathname()
  const { cart } = useShop()
  const count = cartCount(cart)

  // Zaključaj skrol dok je meni otvoren
  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', open)
    if (open) window.__gcLenis?.stop?.()
    else window.__gcLenis?.start?.()
  }, [open])

  // Unutrašnje stranice: traka se sakrije kad se skrola nadolje, vrati kad se krene nagore.
  useGSAP(
    () => {
      if (home) return
      let last = window.scrollY
      const mm = gsap.matchMedia()
      mm.add(MQ, (context) => {
        const { reduce } = context.conditions as { reduce: boolean }
        const onScroll = () => {
          const y = window.scrollY
          if (Math.abs(y - last) < 6) return
          const hidden = !open && y > last && y > 160
          gsap.to(header.current, { yPercent: hidden ? -100 : 0, duration: reduce ? 0 : 0.6, ease: EASE.quint, overwrite: 'auto' })
          last = y
        }
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
      })
    },
    { scope: header, dependencies: [open, home] },
  )

  // Meni preko cijelog ekrana: zavjesa odozgo, stavke izranjaju jedna za drugom.
  useGSAP(
    () => {
      const panel = menu.current?.querySelector('[data-panel]')
      const items = menu.current?.querySelectorAll('[data-item]')
      if (!panel || !items) return
      const mm = gsap.matchMedia()
      mm.add(MQ, (context) => {
        const { reduce } = context.conditions as { reduce: boolean }
        gsap.to(panel, { clipPath: open ? 'inset(0% 0% 0% 0%)' : 'inset(0% 0% 100% 0%)', duration: reduce ? 0 : 0.8, ease: EASE.quintInOut })
        gsap.fromTo(
          items,
          { yPercent: open ? 60 : 0, autoAlpha: open ? 0 : 1 },
          { yPercent: open ? 0 : 30, autoAlpha: open ? 1 : 0, duration: reduce ? 0 : 0.7, ease: EASE.quint, stagger: 0.05, delay: open && !reduce ? 0.25 : 0 },
        )
      })
    },
    { scope: menu, dependencies: [open] },
  )

  const active = (href: string) => !href.includes('#') && href !== '/' && (pathname === href || pathname.startsWith(`${href}/`))

  return (
    <>
      <header ref={header} className={`nav ${home ? 'nav--home' : 'nav--inner'} ${open ? 'is-open' : ''}`}>
        <div className="nav__bar">
          {/* lijevo: linkovi (desktop) / tri crte (telefon) */}
          <div className="nav__side">
            <ul className="nav__links">
              {LINKS.map(([label, href, en]) => (
                <li key={href}>
                  <Link href={href} className={`nav__link ${active(href) ? 'is-active' : ''}`}>
                    <span>{t(label, en)}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="nav__burger"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="site-menu"
              aria-label={open ? t('Zatvori meni', 'Close menu') : t('Otvori meni', 'Open menu')}
            >
              <i />
              <i />
              <i />
            </button>
          </div>

          {/* sredina: logo */}
          <Link href="/" className="nav__logo" aria-label={t('Grand Company, početna', 'Grand Company, home')} onClick={() => setOpen(false)}>
            <LogoMark className="nav__mark" />
            <span data-nav-word className="nav__word font-hero">
              Grand Company
            </span>
          </Link>

          {/* desno: Kupuj + korpa */}
          <div className="nav__side nav__side--end">
            <Link href="/upit-za-izvodjace" className="nav__buy">
              {t('Zatraži ponudu', 'Request a quote')}
              <svg viewBox="0 0 24 12" className="nav__buy-arrow" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden>
                <path d="M0 6h22M17 1l5 5-5 5" />
              </svg>
            </Link>
            <LangToggle className="nav__lang" />
            <button type="button" onClick={() => openLoginModal('login')} className="nav__login" aria-haspopup="dialog">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.4} aria-hidden>
                <rect x="3" y="7" width="10" height="7" />
                <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
              </svg>
              <span>{t('B2B prijava', 'B2B login')}</span>
            </button>
            <button type="button" onClick={openCart} className="nav__cart" aria-label={t(`Korpa, ${count} artikala`, `Cart, ${count} ${count === 1 ? 'item' : 'items'}`)}>
              <span className="nav__cart-bg" aria-hidden />
              <CartIcon />
              {count > 0 && <span className="nav__cart-count">{count}</span>}
            </button>
          </div>
        </div>
      </header>

      {/* Meni preko cijelog ekrana (tri crte): jarka kobalt podloga iznad navbara, stavke lijevo
          poravnate i odvojene linijama, na dnu iste CTA radnje kao na desktopu. */}
      <div ref={menu} id="site-menu" className={`menu ${open ? 'is-open' : ''}`} aria-hidden={!open}>
        <div data-panel className="menu__panel" style={{ clipPath: 'inset(0% 0% 100% 0%)' }}>
          <div className="menu__head">
            <Link href="/" className="menu__logo" onClick={() => setOpen(false)} aria-label={t('Grand Company, početna', 'Grand Company, home')}>
              <LogoMark className="menu__mark" />
              <span className="font-hero">Grand Company</span>
            </Link>
            <LangToggle className="menu__lang" />
            <button type="button" className="menu__close" onClick={() => setOpen(false)} aria-label={t('Zatvori meni', 'Close menu')}>
              <svg viewBox="0 0 20 20" aria-hidden fill="none" stroke="currentColor" strokeWidth={1.6}>
                <path d="M4 4l12 12M16 4 4 16" />
              </svg>
            </button>
          </div>
          <nav className="menu__list" aria-label={t('Meni', 'Menu')}>
            {MENU.map(([label, href, en]) => (
              <Link key={href} data-item href={href} onClick={() => setOpen(false)} className={`menu__item ${active(href) ? 'is-active' : ''}`}>
                <span>{pw(t(label, en))}</span>
                <svg viewBox="0 0 24 12" aria-hidden fill="none" stroke="currentColor" strokeWidth={1.6}>
                  <path d="M0 6h22M17 1l5 5-5 5" />
                </svg>
              </Link>
            ))}
          </nav>
          <div data-item className="menu__foot">
            <Link href="/upit-za-izvodjace" onClick={() => setOpen(false)} className="menu__cta menu__cta--buy">
              {t('Zatraži ponudu', 'Request a quote')}
              <svg viewBox="0 0 24 12" aria-hidden fill="none" stroke="currentColor" strokeWidth={1.6}>
                <path d="M0 6h22M17 1l5 5-5 5" />
              </svg>
            </Link>
            <button
              type="button"
              className="menu__cta menu__cta--login"
              onClick={() => {
                setOpen(false)
                openLoginModal('login')
              }}
            >
              <svg viewBox="0 0 16 16" aria-hidden fill="none" stroke="currentColor" strokeWidth={1.4}>
                <rect x="3" y="7" width="10" height="7" />
                <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
              </svg>
              {t('B2B prijava', 'B2B login')}
            </button>
            <a href="tel:+38765516696" className="menu__tel">
              065 516-696
            </a>
          </div>
        </div>
      </div>
      <LoginModal key={loginSeq} open={login} onClose={closeLogin} initialMode={loginMode} />
    </>
  )
}
