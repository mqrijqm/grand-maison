'use client'

import { useRef } from 'react'
import Cta from '@/components/ui/Cta'
import SquareDissolve from '@/components/ui/SquareDissolve'
import { COMPANY as GC } from '@/gc/gc'
import { gsap, useGSAP } from '@/lib/gsap'
import { useMediaMotion } from '@/lib/media'
import { MQ } from '@/lib/motion'
import { revealChars } from '@/lib/reveal'
import PartnerSteps from './PartnerSteps'
import PortalTour from './PortalTour'
import Showcase from './portal/Showcase'
import WhoSplit from './WhoSplit'
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
      {/* 01–02 — Plavi početak: kratak centriran naslov, jedan mali UI element, pa portal na istoj plavoj.
          Ispod donje polovine portala plavo se kvadratićima raspe u krem stranicu. */}
      <div className={styles.blue}>
        <header className={`gutter ${styles.hero}`}>
          <p className={`label ${styles.heroKicker}`}>Grand Company / Za firme</p>
          <h1 data-head className={`display invisible ${styles.heroTitle}`}>
            Nabavka za vašu firmu
          </h1>
          <p data-up className={styles.heroLead}>
            Materijal, upiti, ponude i narudžbe, na jednom nalogu.
          </p>
          <div data-up data-delay="0.15" className={styles.heroPill} aria-hidden>
            <span className={styles.pillSku}>GKP-001</span>
            <span className={styles.pillName}>Gips-kartonska ploča GKB 12,5 mm</span>
            <span className={styles.pillQty}>120 m²</span>
            <span className={styles.pillBtn}>U upit</span>
          </div>
          <div data-up data-delay="0.25" className={styles.heroActions}>
            <Cta href="#portal" solid>
              Istražite B2B portal
            </Cta>
            <Cta href="/upit-za-izvodjace?vrsta=saradnja">Zatražite poslovni nalog</Cta>
          </div>
        </header>

        <section id="portal" className={`gutter scroll-mt-24 ${styles.portalBlock}`} aria-label="B2B portal, interaktivni prikaz">
          <Showcase />
        </section>
        <SquareDissolve className={styles.dissolve} />
      </div>

      {/* Koraci do naloga: prijava, narudžba po šifri, praćenje (kao u V1) */}
      <PartnerSteps />

      {/* Portal, ekran po ekran: pravi portal sa kursorom koji pokazuje radnje */}
      <section id="biz-explain" className={styles.explainBlock} aria-label="Portal, ekran po ekran">
        <PortalTour />
      </section>

      {/* Za koga: raspored kao "Šta gradite?" na početnoj */}
      <WhoSplit />

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
