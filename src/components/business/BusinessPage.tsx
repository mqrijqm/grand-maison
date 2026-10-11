'use client'

/* eslint-disable @next/next/no-img-element -- fotografija iz /public, već u WebP */

import { useRef } from 'react'
import Cta from '@/components/ui/Cta'
import { gsap, useGSAP } from '@/lib/gsap'
import { useMediaMotion } from '@/lib/media'
import { MQ } from '@/lib/motion'
import { revealChars } from '@/lib/reveal'
import BizProblems from './BizProblems'
import BizReality from './BizReality'
import PartnerSteps from './PartnerSteps'
import PortalTour from './PortalTour'
import Showcase from './portal/Showcase'
import WhoSplit from './WhoSplit'
import styles from './Business.module.css'

// /za-firme: predloženi B2B portal Grand Company-ja. Stranica prvo govori o problemima (kupca i prodaje),
// pa tek onda pokazuje portal, gdje svaki problem ima svoj ekran: heroj, problemi, portal (demo), koraci,
// ekran po ekran, šta je ovo danas a šta treba za pravi B2B, kome je namijenjeno, završni poziv.

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
      {/* 01–02 — Plavi početak: kratak centriran naslov, jedan mali UI element, pa portal na istoj plavoj.
          Ispod donje polovine portala plavo se kvadratićima raspe u krem stranicu. */}
      <div className={styles.blue}>
        <header className={`gutter ${styles.hero}`}>
          <p className={`label ${styles.heroKicker}`}>Grand Company / Za firme</p>
          <h1 data-head className={`display invisible ${styles.heroTitle}`}>
            Nabavka za vašu firmu
          </h1>
          <p data-up className={styles.heroLead}>
            Manje poziva i nijedan izgubljen upit. Firma naručuje po svom cjenovniku, prati isporuke i vidi svoj dug i limit.
          </p>
          <div data-up data-delay="0.25" className={styles.heroActions}>
            <Cta href="#problemi" solid>
              Koji problemi nestaju
            </Cta>
            <Cta href="#portal">Isprobajte portal</Cta>
          </div>
        </header>

        <BizProblems />

        <section id="portal" className={`gutter scroll-mt-24 ${styles.portalBlock}`} aria-label="B2B portal, interaktivni prikaz">
          <p className={styles.portalHint}>
            <b>Isprobajte portal.</b> Svaki problem iznad ima svoj ekran. Lijevo u meniju promijenite ulogu (vlasnik, šef, majstor, računovodstvo) i vidite šta ko smije; Admin je pogled prodaje Grand Company-ja. Demo podaci.
          </p>
          <Showcase light />
        </section>
      </div>

      {/* Koraci do naloga: prijava, narudžba po šifri, praćenje (kao u V1) */}
      <PartnerSteps />

      {/* Portal, ekran po ekran: pravi portal sa kursorom koji pokazuje radnje */}
      <section id="biz-explain" className={styles.explainBlock} aria-label="Portal, ekran po ekran">
        <PortalTour />
      </section>

      {/* Iskreno: šta je portal danas (prezentacija) i šta treba za pravi B2B */}
      <BizReality />

      {/* Za koga: raspored kao "Šta gradite?" na početnoj */}
      <WhoSplit />

      {/* 06 — Završni poziv: kratko, jedan CTA i uska vertikalna fotografija */}
      <section className={`gutter ${styles.block}`} aria-labelledby="biz-cta">
        <div className={styles.final}>
          <div>
            <h2 id="biz-cta" data-head className={`display invisible ${styles.finalTitle}`}>
              Jednostavnija nabavka za vašu firmu.
            </h2>
            <p className={styles.lead}>Pošaljite upit za poslovnu saradnju, prodaja vam se javlja.</p>
            <div className={styles.actions}>
              <Cta href="/upit-za-izvodjace?vrsta=saradnja" solid>
                Zatražite poslovni nalog
              </Cta>
            </div>
          </div>
          <div data-curtain className={styles.finalPhoto}>
            <img src="/editorial/firme/kran.webp" alt="Toranjski kran iznad zgrade u izgradnji" width={1200} height={1500} loading="lazy" decoding="async" />
          </div>
        </div>
      </section>
    </div>
  )
}
