'use client'

/* eslint-disable @next/next/no-img-element -- fotografije iz /public, već u WebP */

import { useRef } from 'react'
import Cta from '@/components/ui/Cta'
import { COMPANY as GC } from '@/gc/gc'
import { AUDIENCES, BENEFITS, CAPABILITIES, JOURNEY, SECONDARY } from '@/lib/business'
import { gsap, useGSAP } from '@/lib/gsap'
import { useMediaMotion } from '@/lib/media'
import { MQ } from '@/lib/motion'
import { revealChars } from '@/lib/reveal'
import Showcase from './portal/Showcase'
import { HeroPreview, Snippet } from './Snippets'
import styles from './Business.module.css'

// /za-firme: predloženi B2B portal Grand Company-ja, kao jednostavniji način da firma naruči materijal.
// Šest sekcija: heroj, interaktivni prikaz portala, pet mogućnosti, tok nabavke, kome je namijenjeno,
// završni poziv. Sve u portalu je demo; ERP, zalihe uživo, ugovorne cijene i limiti nisu dio ovog prikaza.

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
      {/* 01 — Heroj */}
      <header className={`gutter ${styles.hero}`}>
        <div className={styles.heroText}>
          <p className={`label ${styles.kicker}`}>Grand Company / Za firme</p>
          <h1 data-head className={`display invisible ${styles.heroTitle}`}>
            Nabavka materijala, jednostavnija za vaše poslovanje.
          </h1>
          <p data-up className={styles.lead}>
            Od izbora materijala i slanja upita do ponuda i pregleda narudžbi. Sve na jednom mjestu, kroz nalog vaše firme.
          </p>
          <div data-up data-delay="0.2" className={styles.actions}>
            <Cta href="#portal" solid>
              Istražite B2B portal
            </Cta>
            <Cta href="/upit-za-izvodjace?vrsta=saradnja">Zatražite poslovni nalog</Cta>
          </div>
        </div>
        <div className={styles.heroVisual}>
          <div data-curtain className={styles.heroPhoto}>
            <img src="/editorial/firme/kran.webp" alt="Toranjski kran iznad zgrade u izgradnji" width={1200} height={1500} loading="eager" decoding="async" />
          </div>
          <div data-up data-delay="0.35" className={styles.heroCard}>
            <HeroPreview />
          </div>
        </div>
      </header>

      {/* 02 — Interaktivni prikaz portala */}
      <section id="portal" className={`gutter scroll-mt-24 ${styles.block}`} aria-labelledby="biz-portal">
        <div className={styles.blockHead}>
          <div>
            <p className={`label ${styles.kicker}`}>02 / Portal uživo</p>
            <h2 id="biz-portal" data-head className={`display invisible ${styles.title}`}>
              Probajte kako se naručuje
            </h2>
          </div>
          <p className={styles.lead}>
            Primjer naloga izmišljene građevinske firme. Dodajte materijal, pošaljite upit, potvrdite ponudu i pratite narudžbu.
          </p>
        </div>
        <div className={styles.showcase}>
          <Showcase />
        </div>
      </section>

      {/* 03 — Mogućnosti */}
      <section className={`gutter ${styles.block}`} aria-labelledby="biz-caps">
        <div className={styles.blockHead}>
          <div>
            <p className={`label ${styles.kicker}`}>03 / Šta portal radi</p>
            <h2 id="biz-caps" data-head className={`display invisible ${styles.title}`}>
              Pet stvari koje firma radi svaki dan
            </h2>
          </div>
        </div>
        <ul className={styles.caps}>
          {CAPABILITIES.map((c) => (
            <li key={c.no} className={styles.cap} data-k={c.snippet}>
              <div className={styles.capText}>
                <p className={styles.capNo}>{c.no} /</p>
                <h3 className={styles.capTitle}>{c.title}</h3>
                <p className={styles.small}>{c.text}</p>
              </div>
              <div className={styles.capSnippet}>
                <Snippet kind={c.snippet} />
              </div>
            </li>
          ))}
        </ul>
        <ul className={styles.secondary}>
          {SECONDARY.map((x) => (
            <li key={x.title}>
              <b>{x.title}</b>
              <span>{x.text}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 04 — Kako funkcioniše */}
      <section className={`gutter ${styles.block}`} aria-labelledby="biz-how">
        <div className={styles.blockHead}>
          <div>
            <p className={`label ${styles.kicker}`}>04 / Kako funkcioniše</p>
            <h2 id="biz-how" data-head className={`display invisible ${styles.title}`}>
              Od materijala do isporuke
            </h2>
          </div>
          <p className={styles.lead}>Četiri koraka, isti kao kad zovete prodaju, samo bez čekanja na telefonu.</p>
        </div>
        <ol className={styles.journey}>
          {JOURNEY.map((j) => (
            <li key={j.no} className={styles.jStep}>
              <span className={styles.jDot} aria-hidden>
                {j.no}
              </span>
              <h3 className={styles.jTitle}>{j.title}</h3>
              <p className={styles.small}>{j.text}</p>
              <div className={styles.jDetail}>
                <Snippet kind={j.detail} />
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* 05 — Za građevinske firme */}
      <section className={`gutter ${styles.block}`} aria-labelledby="biz-who">
        <div className={styles.blockHead}>
          <div>
            <p className={`label ${styles.kicker}`}>05 / Za koga</p>
            <h2 id="biz-who" data-head className={`display invisible ${styles.title}`}>
              Napravljeno za građevinu
            </h2>
          </div>
          <p className={styles.lead}>Za firme koje kupuju za posao, redovno ili za jedan projekat.</p>
        </div>
        <ul className={styles.who}>
          {AUDIENCES.map((a) => (
            <li key={a.title} className={styles.whoCard}>
              <div data-curtain className={styles.whoPhoto}>
                <img src={a.image} alt={a.alt} width={1200} height={1500} loading="lazy" decoding="async" />
              </div>
              <h3 className={styles.whoTitle}>{a.title}</h3>
              <p className={styles.small}>{a.text}</p>
              <ul className={styles.points}>
                {a.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <ul className={styles.benefits}>
          {BENEFITS.map((b, i) => (
            <li key={b.title}>
              <span className={styles.capNo}>{String(i + 1).padStart(2, '0')}</span>
              <b>{b.title}</b>
              <span>{b.text}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 06 — Završni poziv */}
      <section className={`gutter ${styles.block}`} aria-labelledby="biz-cta">
        <div className={styles.final}>
          <h2 id="biz-cta" data-head className={`display invisible ${styles.finalTitle}`}>
            Materijal za vaše projekte. Jednostavnija nabavka za vašu firmu.
          </h2>
          <div className={styles.finalSide}>
            <p className={styles.lead}>Pošaljite nam upit za poslovnu saradnju i saznajte kako Grand Company može pojednostaviti vašu svakodnevnu nabavku.</p>
            <div className={styles.actions}>
              <Cta href="/upit-za-izvodjace?vrsta=saradnja" solid>
                Zatražite poslovni nalog
              </Cta>
              <Cta href="/kontakt">Kontaktirajte prodaju</Cta>
            </div>
            <p className={styles.fine}>
              Nalog otvara prodaja nakon razgovora o saradnji. Prodaja: <a href={GC.phoneLandlineHref}>{GC.phoneLandline}</a> · <a href={`mailto:${GC.emailInfo}`}>{GC.emailInfo}</a>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
