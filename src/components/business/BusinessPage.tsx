'use client'

/* eslint-disable @next/next/no-img-element -- fotografije iz /public, već u WebP */

import { useRef } from 'react'
import Cta from '@/components/ui/Cta'
import PortalStage from '@/components/portal/PortalStage'
import { COMPANY as GC } from '@/gc/gc'
import { ACCESS_STEPS, AUDIENCES, B2B_FEATURES, B2B_PROPOSED, PHASES } from '@/lib/business'
import { gsap, useGSAP } from '@/lib/gsap'
import { useMediaMotion } from '@/lib/media'
import { MQ } from '@/lib/motion'
import { revealChars } from '@/lib/reveal'
import PortalExplainer from './PortalExplainer'
import styles from './Business.module.css'

// /za-firme — glavna B2B stranica: B2B portal kao usluga za firme koje nabavljaju kod Grand Company-ja.
// Živi demo dashboarda, pa isti dashboard korak po korak, funkcije za firmu, kome je namijenjeno,
// kako se dobija nalog i faze razvoja. Demo podaci su izmišljeni; rabat, odgođeno plaćanje i ERP
// stoje samo kao predložene funkcije (research nivo C).

export default function BusinessPage() {
  const root = useRef<HTMLDivElement>(null)
  useMediaMotion(root)
  useGSAP(
    () => {
      gsap.matchMedia().add(MQ, (ctx) => {
        const { reduce } = ctx.conditions as { reduce: boolean }
        root.current!.querySelectorAll('[data-head]').forEach((h) => revealChars(h, reduce, 'top 85%'))
      })
    },
    { scope: root },
  )

  return (
    <div ref={root} className={styles.page}>
      {/* Uvod */}
      <header className={`gutter ${styles.hero}`}>
        <div className={styles.heroText}>
          <p className={`label ${styles.kicker}`}>B2B portal · za firme</p>
          <h1 data-head className={`display invisible ${styles.heroTitle}`}>
            Nabavka cijele firme na jednom ekranu
          </h1>
          <p data-up className={styles.lead}>
            Nalog za vašu firmu kod Grand Company-ja: brza narudžba po šifri, ponude, narudžbe i isporuke po gradilištima, dokumenti i odobrenja u timu. Ispod je živi demo, probajte ga.
          </p>
          <div data-up data-delay="0.2" className={styles.actions}>
            <Cta href="/upit-za-izvodjace?vrsta=saradnja" solid>
              Zatražite nalog za firmu
            </Cta>
            <Cta href="#demo">Probajte demo</Cta>
          </div>
        </div>
        <div className={styles.heroPhotos}>
          <div data-curtain className={styles.heroPhotoA}>
            <img src="/editorial/firme/kran.webp" alt="Toranjski kran iznad zgrade u izgradnji" width={1200} height={1500} loading="eager" decoding="async" />
          </div>
          <div data-curtain className={styles.heroPhotoB}>
            <img src="/photos/stovariste-pregled.webp" alt="Stovarište Grand Company u Banjoj Luci, snimak iz vazduha" width={1600} height={1000} loading="eager" decoding="async" />
            <span className={styles.photoTag}>Stovarište · {GC.address.replace('Ul. ', '').replace(', 78000 Banja Luka', '')}</span>
          </div>
        </div>
      </header>

      {/* Živi demo */}
      <section id="demo" aria-label="B2B portal, živi demo" className="scroll-mt-24">
        <PortalStage />
      </section>

      {/* Dashboard korak po korak */}
      <section className={`gutter ${styles.block}`} aria-labelledby="biz-explain">
        <div className={styles.blockHead}>
          <h2 id="biz-explain" data-head className={`display invisible ${styles.title}`}>
            Portal, korak po korak
          </h2>
          <p className={styles.lead}>Deset ekrana koje firma koristi svaki dan. Skrolujte: portal desno se prebacuje na ekran o kome čitate.</p>
        </div>
        <PortalExplainer />
      </section>

      {/* Funkcije */}
      <section className={`gutter ${styles.block}`} aria-labelledby="biz-features">
        <div className={styles.blockHead}>
          <h2 id="biz-features" data-head className={`display invisible ${styles.title}`}>
            Šta dobija vaša firma
          </h2>
          <p className={styles.lead}>Sve što nabavka, poslovođe i računovodstvo rade sa nama, na jednom nalogu.</p>
        </div>
        <ul className={styles.features}>
          {B2B_FEATURES.map((f, i) => (
            <li key={f.title}>
              <span className={styles.featNum}>{String(i + 1).padStart(2, '0')}</span>
              <h3 className={styles.featTitle}>{f.title}</h3>
              <p className={styles.small}>{f.text}</p>
            </li>
          ))}
        </ul>
        <div className={styles.proposed}>
          <p className={`label ${styles.proposedLabel}`}>Predloženo · nakon dogovora sa prodajom</p>
          <ul>
            {B2B_PROPOSED.map((f) => (
              <li key={f.title}>
                <h3 className={styles.featTitle}>{f.title}</h3>
                <p className={styles.small}>{f.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Za koga */}
      <section className={`gutter ${styles.block}`} aria-labelledby="biz-who">
        <div className={styles.blockHead}>
          <h2 id="biz-who" data-head className={`display invisible ${styles.title}`}>
            Za koga
          </h2>
          <p className={styles.lead}>Za firme koje kupuju za posao, redovno ili za jedan projekat.</p>
        </div>
        <ul className={styles.who}>
          {AUDIENCES.map((a, i) => (
            <li key={a.title} className={styles.whoCard}>
              <div data-curtain className={styles.whoPhoto}>
                <img src={a.image} alt={a.alt} width={1200} height={1500} loading="lazy" decoding="async" />
              </div>
              <p className={styles.num}>{String(i + 1).padStart(2, '0')}</p>
              <h3 className={`font-pretty ${styles.whoTitle}`}>{a.title}</h3>
              <p className={styles.small}>{a.text}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Kako do naloga */}
      <section className={`gutter ${styles.block}`} aria-labelledby="biz-access">
        <div className={styles.blockHead}>
          <h2 id="biz-access" data-head className={`display invisible ${styles.title}`}>
            Kako do naloga
          </h2>
          <p className={styles.lead}>Nalog otvara prodaja, poslije kratkog razgovora o tome šta firma nabavlja.</p>
        </div>
        <ol className={styles.flow}>
          {ACCESS_STEPS.map((s, i) => (
            <li key={s.title} className={styles.flowStep}>
              <span className={styles.flowDot} aria-hidden>
                {i + 1}
              </span>
              <span className={`label ${styles.flowTitle}`}>{s.title}</span>
              <span className={styles.flowText}>{s.text}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Faze */}
      <section className={`gutter ${styles.block}`} aria-labelledby="biz-phases">
        <div className={styles.blockHead}>
          <h2 id="biz-phases" data-head className={`display invisible ${styles.title}`}>
            Razvoj u fazama
          </h2>
          <p className={styles.lead}>Portal se uvodi korak po korak, bez potrebe da se odmah kupi cijeli sistem.</p>
        </div>
        <ol className={styles.phases}>
          {PHASES.map((p) => (
            <li key={p.n} data-on={('on' in p && p.on) || undefined}>
              <span className="label">{p.n}</span>
              <h3 className={styles.featTitle}>{p.t}</h3>
              <p className={styles.small}>{p.d}</p>
            </li>
          ))}
        </ol>
        <p className={styles.disclaimer}>
          Demo firma, šifre, cijene, narudžbe i dokumenti su izmišljeni. Individualne cijene, rabat, odgođeno plaćanje i veza sa ERP-om su predložene funkcije, ne postojeći uslovi Grand Company-ja.
        </p>
      </section>

      {/* Kontakt prodaje */}
      <section className={`gutter ${styles.block}`} aria-labelledby="biz-terms">
        <div className={styles.terms}>
          <h2 id="biz-terms" data-head className={`display invisible ${styles.termsTitle}`}>
            Otvorite nalog za firmu
          </h2>
          <div className={styles.termsSide}>
            <p className={styles.lead}>Recite nam šta vaša firma nabavlja i ko u timu naručuje. Prodaja vam se javlja i dogovara saradnju.</p>
            <div className={styles.contacts}>
              <a href={GC.phoneLandlineHref}>
                <span className="label opacity-60">Prodaja</span>
                <span className={styles.contactValue}>{GC.phoneLandline}</span>
              </a>
              <a href={`mailto:${GC.emailInfo}`}>
                <span className="label opacity-60">E-pošta</span>
                <span className={styles.contactValue}>{GC.emailInfo}</span>
              </a>
            </div>
            <div className={styles.actions}>
              <Cta href="/upit-za-izvodjace?vrsta=saradnja" solid>
                Zatražite nalog
              </Cta>
              <Cta href="/kontakt">Kontakt</Cta>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
