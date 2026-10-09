'use client'

/* eslint-disable @next/next/no-img-element -- fotografije iz /public, već u WebP */

import { useRef } from 'react'
import Cta from '@/components/ui/Cta'
import { COMPANY as GC } from '@/gc/gc'
import { AUDIENCES, BUSINESS_FACTS, BUSINESS_OFFERS, BUSINESS_STEPS, TENDERS } from '@/lib/business'
import { gsap, useGSAP } from '@/lib/gsap'
import { useMediaMotion } from '@/lib/media'
import { MQ } from '@/lib/motion'
import { revealChars } from '@/lib/reveal'
import QuickOrder from './QuickOrder'
import styles from './Business.module.css'

// /za-firme — nabavka za firme, izvođače i ustanove. Javni dio bez prijave: kome je namijenjeno,
// kako ide nabavka, brza narudžba po šifri, javne nabavke kao dokaz i kontakt prodaje.
// Samo tvrdnje iz verifikovanog researcha: bez rabata, cijena po dogovoru, kredita, ERP-a i krana.

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
      {/* Hero: naslov + dvije fotografije */}
      <header className={`gutter ${styles.hero}`}>
        <div className={styles.heroText}>
          <p className={`label ${styles.kicker}`}>Za firme · izvođače · ustanove</p>
          <h1 data-head className={`display invisible ${styles.heroTitle}`}>
            Nabavka za gradilište
          </h1>
          <p data-up className={styles.lead}>
            Građevinski materijal za projekte u Banjoj Luci. Opišite šta gradite, dobijte ponudu, a robu preuzmite na stovarištu ili uz dostavu.
          </p>
          <div data-up data-delay="0.2" className={styles.actions}>
            <Cta href="/upit-za-izvodjace" solid>
              Opišite šta gradite
            </Cta>
            <Cta href="#brza-narudzba">Brza narudžba</Cta>
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

      {/* Brojke */}
      <section className="gutter" aria-label="Grand Company u brojkama">
        <dl className={styles.facts}>
          {BUSINESS_FACTS.map((f) => (
            <div key={f.label} className={styles.fact}>
              <dt className={styles.factLabel}>{f.label}</dt>
              <dd className={`order-first ${styles.factNum}`}>{f.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Za koga */}
      <section className={`gutter ${styles.block}`} aria-labelledby="biz-who">
        <div className={styles.blockHead}>
          <h2 id="biz-who" data-head className={`display invisible ${styles.title}`}>
            Za koga
          </h2>
          <p className={styles.lead}>Prodajemo na veliko i malo. Ova stranica je za one koji kupuju za posao.</p>
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

      {/* Načini nabavke + koraci */}
      <section className={`gutter ${styles.block}`} aria-labelledby="biz-how">
        <div className={styles.blockHead}>
          <h2 id="biz-how" data-head className={`display invisible ${styles.title}`}>
            Kako nabavljate
          </h2>
          <p className={styles.lead}>Isti tok za svaki upit: upit, ponuda, potvrda, isporuka.</p>
        </div>
        <div className={styles.offers}>
          {BUSINESS_OFFERS.map((o, i) => (
            <article key={o.title} className={styles.offer}>
              <p className={styles.offerNum}>{String(i + 1).padStart(2, '0')}</p>
              <h3 className={`font-pretty ${styles.offerTitle}`}>{o.title}</h3>
              <p className={styles.small}>{o.text}</p>
            </article>
          ))}
        </div>
        <ol className={styles.flow}>
          {BUSINESS_STEPS.map((s, i) => (
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

      {/* Brza narudžba */}
      <section id="brza-narudzba" className={`gutter scroll-mt-28 ${styles.block}`} aria-labelledby="biz-quick">
        <div className={styles.quick}>
          <div>
            <h2 id="biz-quick" data-head className={`display invisible ${styles.title}`}>
              Brza narudžba po šifri
            </h2>
            <p className={`mt-6 ${styles.lead}`}>
              Znate šta vam treba? Upišite šifre i količine ili ih zalijepite iz Excela. Stavke idu u upit, a ponudu potvrđuje prodaja.
            </p>
            <div data-curtain className={styles.quickPhoto}>
              <img src="/editorial/firme/ekipa.webp" alt="Dvoje izvođača sa dokumentacijom na gradilištu" width={1067} height={1334} loading="lazy" decoding="async" />
            </div>
          </div>
          <QuickOrder />
        </div>
      </section>

      {/* Javne nabavke */}
      <section className={`gutter ${styles.block}`} aria-labelledby="biz-ref">
        <div className={styles.refs}>
          <div data-curtain className={styles.refPhoto}>
            <img src="/photos/kran-utovar.webp" alt="Utovar materijala na stovarištu Grand Company, snimak iz vazduha" width={1600} height={1000} loading="lazy" decoding="async" />
          </div>
          <div>
            <h2 id="biz-ref" data-head className={`display invisible ${styles.title}`}>
              Javne nabavke
            </h2>
            <p className={`mt-6 ${styles.lead}`}>Grand Company snabdijeva i javne ustanove. Dodjele ugovora su javno objavljene.</p>
            <ul className={styles.tenders}>
              {TENDERS.map((t) => (
                <li key={t.year} className={styles.tender}>
                  <span className={styles.tenderYear}>{t.year}</span>
                  <span>
                    <span className={`font-pretty ${styles.tenderTitle}`}>{t.title}</span>
                    <span className={styles.tenderDetail}>{t.detail}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Kontakt prodaje */}
      <section className={`gutter ${styles.block}`} aria-labelledby="biz-terms">
        <div className={styles.terms}>
          <h2 id="biz-terms" data-head className={`display invisible ${styles.termsTitle}`}>
            Imate li plan šta gradite?
          </h2>
          <div className={styles.termsSide}>
            <p className={styles.lead}>
              Recite nam koji vam naši materijali i usluge trebaju. Prodaja provjerava dostupnost i šalje vam ponudu.
            </p>
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
              <Cta href="/upit-za-izvodjace" solid>
                Opišite šta gradite
              </Cta>
              <Cta href="/kontakt">Kontakt</Cta>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
