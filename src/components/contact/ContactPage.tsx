/* eslint-disable @next/next/no-img-element -- dvije sitne, već optimizovane fotografije iz /public */
import Pw from '@/components/ui/Pw'
import { COMPANY as GC } from '@/gc/gc'
import { HOURS, MAPS_URL } from '@/lib/company'
import styles from './ContactPage.module.css'

// Kontakt kao zasebna stranica, apstraktnijeg rasporeda: krupna tipografija, tanke linije, koncentrični
// lukovi u pozadini i dvije ravne fotografije.
const ROWS: { n: string; label: string; value: string; href: string; external?: boolean }[] = [
  { n: '01', label: 'Prodaja', value: GC.phoneLandline, href: GC.phoneLandlineHref },
  { n: '02', label: 'Mobilni', value: GC.phoneMobile, href: GC.phoneMobileHref },
  { n: '03', label: 'E-pošta', value: GC.emailInfo, href: `mailto:${GC.emailInfo}` },
  { n: '04', label: 'Stovarište', value: GC.address, href: MAPS_URL, external: true },
]

export default function ContactPage() {
  return (
    <div className={styles.page}>
      <svg className={styles.arcs} viewBox="0 0 800 800" fill="none" stroke="currentColor" strokeWidth={1} aria-hidden>
        <circle cx="400" cy="400" r="120" />
        <circle cx="400" cy="400" r="230" />
        <circle cx="400" cy="400" r="340" />
        <circle cx="400" cy="400" r="390" strokeDasharray="2 7" />
        <path d="M400 0v800M0 400h800" strokeDasharray="1 9" />
      </svg>

      <header className={`gutter ${styles.top}`}>
        <div className={styles.titleBlock}>
          <h1 className={`display ${styles.title}`}>
            <Pw>Kontakt</Pw>
          </h1>
          <p className={styles.lead}>Imate li plan šta gradite? Recite nam koji vam naši materijali i usluge trebaju. Ponudu i isporuku dogovaramo direktno s vama.</p>
        </div>

        <div className={styles.composition}>
          <img className={styles.photoA} src="/editorial/contact-plans.webp" alt="" width={900} height={1125} loading="eager" decoding="async" aria-hidden />
          <img className={styles.photoB} src="/editorial/contact-yard.webp" alt="" width={900} height={1125} loading="lazy" decoding="async" aria-hidden />
        </div>
      </header>

      <section className={`gutter ${styles.list}`} aria-label="Kontakt podaci">
        {ROWS.map((row) => (
          <a key={row.n} className={styles.row} href={row.href} {...(row.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
            <span className={styles.rowNumber}>{row.n}</span>
            <span className={`label ${styles.rowLabel}`}>{row.label}</span>
            <span className={`${styles.rowValue} ${row.n === '03' ? styles.rowEmail : ''}`}>{row.value}</span>
            <span className={styles.rowArrow} aria-hidden>↗</span>
          </a>
        ))}
      </section>

      <section className={`gutter ${styles.hours}`} aria-label="Radno vrijeme">
        <p className="label opacity-60">05 · Radno vrijeme</p>
        <dl>
          {HOURS.map((h) => (
            <div key={h.days}>
              <dt>{h.days}</dt>
              <dd>{h.time}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  )
}
