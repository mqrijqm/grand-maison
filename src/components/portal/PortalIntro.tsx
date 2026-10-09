'use client'

/* eslint-disable @next/next/no-img-element -- fotografije iz /public, već u WebP */

import { useRef, useState, type FormEvent } from 'react'
import Cta from '@/components/ui/Cta'
import { gsap, useGSAP } from '@/lib/gsap'
import { useMediaMotion } from '@/lib/media'
import { MQ } from '@/lib/motion'
import { revealChars } from '@/lib/reveal'
import { DEMO_PASSWORD, PARTNER_TIERS, PORTAL_PARTNERS, portalLogin, portalLoginAs } from '@/lib/portal'
import styles from './Portal.module.css'

// Javni dio portala (bez prijave): šta portal daje partneru, šta obuhvata i demo prijava.
// Tekst prati Blink ponudu (str. 9–11); sve je označeno kao demo.

const CHIPS = [
  ['B2B nalog', '#obuhvata'],
  ['Rabatna skala', '#rabat'],
  ['Kreditni limit', '#obuhvata'],
  ['Fakture', '#obuhvata'],
  ['Praćenje narudžbe', '#obuhvata'],
  ['Odgođeno plaćanje', '#rabat'],
] as const

const POINTS = ['Partner vidi svoje cijene, rabat i stanje', 'Naručuje u okviru kreditnog limita', 'Prati narudžbe, fakture i dostavu']

// Ikonice modula: tanke linije, isti potez kao ilustracije sajta.
const ICONS: Record<string, React.ReactNode> = {
  nalog: <><circle cx="20" cy="14" r="6" /><path d="M8 34c1.5-7 6.5-10 12-10s10.5 3 12 10" /></>,
  rabat: <><path d="M10 30 30 10" /><circle cx="12" cy="12" r="4" /><circle cx="28" cy="28" r="4" /></>,
  fakture: <><path d="M10 5h15l6 6v24H10z" /><path d="M25 5v6h6M15 18h11M15 23h11M15 28h7" /></>,
  narudzbe: <><path d="M4 12h20v14H4zM24 17h7l5 5v4H24" /><circle cx="11" cy="29" r="3" /><circle cx="29" cy="29" r="3" /></>,
  erp: <><ellipse cx="20" cy="10" rx="11" ry="4" /><path d="M9 10v20c0 2.2 4.9 4 11 4s11-1.8 11-4V10M9 20c0 2.2 4.9 4 11 4s11-1.8 11-4" /></>,
  admin: <><rect x="6" y="6" width="12" height="12" /><rect x="22" y="6" width="12" height="12" /><rect x="6" y="22" width="12" height="12" /><path d="M22 28h12M28 22v12" /></>,
}

const MODULES = [
  ['nalog', 'Partnerski nalozi i ugovorene cijene'],
  ['rabat', 'Rabatne skale i kreditni limiti'],
  ['fakture', 'Odgođeno plaćanje i otvorene fakture'],
  ['narudzbe', 'Praćenje narudžbi i isporuke'],
  ['erp', 'Stanje zaliha i cijene iz ERP-a'],
  ['admin', 'Admin upravljanje partnerima i narudžbama'],
] as const

const TABLE = [
  { area: 'Partnerski nalozi', partner: ['Ugovorene cijene i rabat', 'Kreditni limit i rok plaćanja'], gc: ['Pravila po partneru', 'Upravljanje nalozima'] },
  { area: 'Naručivanje i logistika', partner: ['Katalog sa svojim uslovima', 'Korpa / zahtjev za ponudu', 'Dostava i status'], gc: ['Pregled narudžbi', 'Status isporuke', 'Admin kataloga'] },
  { area: 'ERP i self-service', partner: ['Stanje zaliha i cijene', 'Otvorene fakture i dokumenti'], gc: ['Dvosmjerna ERP veza', 'Manje ručnog unosa podataka'] },
]

export default function PortalIntro() {
  const root = useRef<HTMLDivElement>(null)
  const [email, setEmail] = useState(PORTAL_PARTNERS[1].email)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  useMediaMotion(root)
  useGSAP(
    () => {
      gsap.matchMedia().add(MQ, (ctx) => {
        const { reduce } = ctx.conditions as { reduce: boolean }
        root.current!.querySelectorAll('[data-head]').forEach((h) => revealChars(h, reduce, 'top 88%'))
      })
    },
    { scope: root },
  )

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!portalLogin(email, password)) setError(`Demo pristup: izaberite nalog ispod ili upišite lozinku „${DEMO_PASSWORD}“.`)
    else window.scrollTo({ top: 0 })
  }

  return (
    <div ref={root} className={styles.page}>
      <header className={`gutter ${styles.hero}`}>
        <div className={styles.heroText}>
          <span className={styles.demo}>B2B portal · demo</span>
          <h1 data-head className={`display invisible ${styles.heroTitle}`}>
            Portal za partnere i građevinske firme
          </h1>
          <p data-up className={styles.lead}>
            Ugovorni partneri dobijaju svoj nalog: ugovoreni rabat, kreditni limit i odgođeno plaćanje na 30, 60 ili 90 dana. Naručuju sami, a prate narudžbe, fakture i dostavu na jednom mjestu.
          </p>
          <div className={styles.actions}>
            <Cta href="#prijava" solid>
              Prijava u demo nalog
            </Cta>
            <Cta href="/upit-za-izvodjace?vrsta=saradnja">Zatražite partnerski nalog</Cta>
          </div>
        </div>

        <div className={styles.heroSide}>
          <div data-curtain className={styles.heroPhoto}>
            <img src="/editorial/portal/tablet.webp" alt="Inženjerka na gradilištu provjerava narudžbu na tabletu" width={1066} height={1333} loading="eager" decoding="async" />
          </div>
          <form id="prijava" className={`scroll-mt-28 ${styles.login}`} onSubmit={submit}>
            <h2>Prijava</h2>
            <p className={`mt-2 ${styles.small}`}>Partnerski nalog otvara prodaja nakon dogovora o saradnji.</p>
            <label className={styles.field}>
              E-pošta
              <input className={styles.input} type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError('') }} autoComplete="username" />
            </label>
            <label className={styles.field}>
              Lozinka
              <input className={styles.input} type="password" value={password} onChange={(e) => { setPassword(e.target.value); setError('') }} placeholder={DEMO_PASSWORD} autoComplete="current-password" />
            </label>
            {error && <p className={styles.error} role="alert">{error}</p>}
            <button type="submit" className={styles.submit}>
              Prijavi se <span aria-hidden>→</span>
            </button>
            <div className={styles.quick}>
              <p>Brzi demo pristup</p>
              <div className={styles.quickBtns}>
                {PORTAL_PARTNERS.map((p) => (
                  <button key={p.id} type="button" className={styles.quickBtn} onClick={() => { portalLoginAs(p.id); window.scrollTo({ top: 0 }) }}>
                    <span>{p.short}</span>
                    <span>Nivo {p.level}</span>
                  </button>
                ))}
              </div>
            </div>
          </form>
        </div>
      </header>

      <nav className={`gutter ${styles.chips}`} aria-label="Moduli portala">
        {CHIPS.map(([label, href]) => (
          <a key={label} href={href} className={styles.chip}>
            {label}
          </a>
        ))}
      </nav>

      {/* Zašto */}
      <section className={`gutter ${styles.block}`} aria-labelledby="portal-why">
        <div className={styles.blockHead}>
          <h2 id="portal-why" data-head className={`display invisible ${styles.title}`}>
            Radni alat, ne samo katalog
          </h2>
          <p className={styles.lead}>Građevinske firme i izvođači naručuju sami, u okviru svojih uslova. Prodaja zadržava kontrolu nad cijenama, limitima i narudžbama.</p>
        </div>
        <ol className={styles.points}>
          {POINTS.map((p, i) => (
            <li key={p} className={styles.point}>
              <span className={styles.pointNum}>{String(i + 1).padStart(2, '0')}</span>
              <span className={styles.pointText}>{p}</span>
            </li>
          ))}
        </ol>
        <p className={styles.goal}>Cilj: manje telefona i ručnog provjeravanja, više self-service naručivanja.</p>
      </section>

      {/* Šta obuhvata */}
      <section id="obuhvata" className={`gutter scroll-mt-28 ${styles.block}`} aria-labelledby="portal-what">
        <div className={styles.split}>
          <div data-curtain className={styles.photo}>
            <img src="/editorial/portal/isporuka.webp" alt="Viljuškar utovara složenu građu u skladištu" width={1066} height={1333} loading="lazy" decoding="async" />
          </div>
          <div>
            <h2 id="portal-what" data-head className={`display invisible ${styles.title}`}>
              Šta portal obuhvata
            </h2>
            <ol className={styles.modules}>
              {MODULES.map(([icon, name], i) => (
                <li key={name} className={styles.module}>
                  <span className={styles.moduleNum}>{String(i + 1).padStart(2, '0')}</span>
                  <svg className={styles.moduleIcon} viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth={1.4} aria-hidden>
                    {ICONS[icon]}
                  </svg>
                  <span className={styles.moduleName}>{name}</span>
                </li>
              ))}
            </ol>

            <div className={styles.table} role="table" aria-label="Podjela: partner i Grand Company">
              <div className={styles.tableHead} role="row">
                <span role="columnheader">Oblast</span>
                <span role="columnheader">Partner</span>
                <span role="columnheader">Grand Company</span>
              </div>
              {TABLE.map((r) => (
                <div key={r.area} className={styles.tableRow} role="row">
                  <span className={styles.tableArea} role="cell">{r.area}</span>
                  <span className={`${styles.tableCell} ${styles.muted}`} role="cell">
                    <b>Partner</b>
                    {r.partner.map((t) => <span key={t}>{t}</span>)}
                  </span>
                  <span className={styles.tableCell} role="cell">
                    <b>Grand Company</b>
                    {r.gc.map((t) => <span key={t}>{t}</span>)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Rabatna skala */}
      <section id="rabat" className={`gutter scroll-mt-28 ${styles.block}`} aria-labelledby="portal-tiers">
        <div className={styles.blockHead}>
          <h2 id="portal-tiers" data-head className={`display invisible ${styles.title}`}>
            Rabatna skala i plaćanje
          </h2>
          <p className={styles.lead}>Primjer pravila po partneru: nivo određuje rabat, kreditni limit i valutu plaćanja. Stvarne uslove dogovara prodaja.</p>
        </div>
        <div className={styles.tiers}>
          {PARTNER_TIERS.map((t, i) => (
            <article key={t.name} className={`${styles.tier} ${i === 2 ? styles.hl : ''}`}>
              <span className={styles.tierName}>{t.name}</span>
              <span className={styles.tierRebate}>{t.rebate}</span>
              <span className={styles.tierWho}>{t.who}</span>
              <span className={styles.tierMeta}>
                {t.limit}
                <br />
                {t.days}
              </span>
            </article>
          ))}
        </div>
        <p className={styles.note}>Demo: nivoi, procenti i limiti su primjer za prezentaciju, nisu objavljeni uslovi Grand Company.</p>
      </section>

      <div className={`gutter`}>
        <div data-curtain className={styles.wide}>
          <img src="/editorial/portal/gradiliste.webp" alt="Radnici na oplati armiranobetonske ploče" width={2000} height={1125} loading="lazy" decoding="async" />
        </div>
        <div className={styles.actions}>
          <Cta href="#prijava" solid>
            Isprobajte demo nalog
          </Cta>
          <Cta href="/za-firme">Nazad na Za firme</Cta>
        </div>
      </div>
    </div>
  )
}
