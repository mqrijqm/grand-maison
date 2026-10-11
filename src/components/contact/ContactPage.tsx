/* eslint-disable @next/next/no-img-element -- dvije sitne, već optimizovane fotografije iz /public */
import Pw from '@/components/ui/Pw'
import { COMPANY as GC } from '@/gc/gc'
import { HOURS, MAPS_URL } from '@/lib/company'
import styles from './ContactPage.module.css'

// Kontakt kao zasebna stranica: krupna tipografija, tanke linije i dvije ravne fotografije.
const ROWS: { n: string; label: string; value: string; href: string; external?: boolean }[] = [
  { n: '01', label: 'Prodaja', value: GC.phoneLandline, href: GC.phoneLandlineHref },
  { n: '02', label: 'Prodaja', value: GC.phoneLandline2, href: GC.phoneLandline2Href },
  { n: '03', label: 'Mobilni', value: GC.phoneMobile, href: GC.phoneMobileHref },
  { n: '04', label: 'E-pošta', value: GC.emailInfo, href: `mailto:${GC.emailInfo}` },
  { n: '05', label: 'Stovarište', value: GC.address, href: MAPS_URL, external: true },
]

export default function ContactPage() {
  return (
    <div className={styles.page}>

      <header className={`gutter ${styles.top}`}>
        <div className={styles.titleBlock}>
          <h1 className={`display ${styles.title}`}>
            <Pw>Kontakt</Pw>
          </h1>
          <p className={styles.lead}>Imate li plan šta gradite? Recite nam koji vam materijal treba i u kojoj količini. Cijenu, dostupnost i dostavu po Banjoj Luci dogovaramo direktno s vama.</p>
        </div>

        <div className={styles.composition}>
          <img className={styles.photoA} src="/editorial/contact-plans.webp" alt="" width={900} height={1125} loading="eager" decoding="async" aria-hidden />
          <img className={styles.photoB} src="/editorial/contact-yard.webp" alt="" width={900} height={1125} loading="lazy" decoding="async" aria-hidden />
        </div>
      </header>

      <section className={`gutter ${styles.list}`} aria-label="Kontakt podaci">
        {/* Tri broja telefona u jednom redu, razdvojena jedva vidljivim linijama; svaki je svoj link. */}
        <div className={styles.phones}>
          {ROWS.filter((row) => row.href.startsWith('tel:')).map((row) => (
            <a key={row.n} className={styles.phone} href={row.href}>
              <span className={styles.phoneTop}>
                <span className={styles.rowNumber}>{row.n}</span>
                <span className={`label ${styles.rowLabel}`}>{row.label}</span>
              </span>
              <span className={styles.phoneValue}>{row.value}</span>
              <span className={styles.phoneArrow} aria-hidden>↗</span>
            </a>
          ))}
        </div>
        {ROWS.filter((row) => !row.href.startsWith('tel:')).map((row) => (
          <a key={row.n} className={styles.row} href={row.href} {...(row.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
            <span className={styles.rowNumber}>{row.n}</span>
            <span className={`label ${styles.rowLabel}`}>{row.label}</span>
            <span className={`${styles.rowValue} ${row.label === 'E-pošta' ? styles.rowEmail : ''}`}>{row.value}</span>
            <span className={styles.rowArrow} aria-hidden>↗</span>
          </a>
        ))}
      </section>

      <section className={`gutter ${styles.hours}`} aria-label="Radno vrijeme">
        <p className="label opacity-60">06 · Radno vrijeme</p>
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
