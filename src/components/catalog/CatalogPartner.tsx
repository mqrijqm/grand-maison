/* eslint-disable @next/next/no-img-element -- male fotografije artikala iz /public/shop */
import Cta from '@/components/ui/Cta'
import { PRODUCTS } from '@/lib/shop'
import styles from './CatalogPartner.module.css'

// Kraj kataloga: kratak poziv firmama. Lijevo naslov i dugme, u sredini svedeni prozor B2B portala
// (ponuda koja čeka potvrdu), desno uska kolona malih fotografija artikala koja polako klizi naviše.

const LINES = [
  { sku: 'GKP-001', qty: '120 m²' },
  { sku: 'PRF-075', qty: '86 kom' },
  { sku: 'ISO-001', qty: '60 m²' },
]
const STRIP = PRODUCTS.filter((p, i) => i % 2 === 0).slice(0, 8)

export default function CatalogPartner() {
  const lines = LINES.map((l) => ({ ...l, p: PRODUCTS.find((p) => p.sku === l.sku)! }))
  return (
    <section className={`gutter ${styles.wrap}`} aria-labelledby="partner-title">
      <div className={styles.box}>
        <div className={styles.copy}>
          <p className="label">Za firme</p>
          <h2 id="partner-title" className={`display ${styles.title}`}>
            Firma ste? Postanite partner.
          </h2>
          <p className={styles.lead}>Poslovni nalog: upiti, ponude i narudžbe na jednom mjestu.</p>
          <Cta href="/za-firme" solid>
            Postanite partner
          </Cta>
        </div>

        <div className={styles.win} aria-hidden>
          <div className={styles.chrome}>
            <span className={styles.dots}>
              <i />
              <i />
              <i />
            </span>
            <span>B2B portal</span>
            <em>Demo</em>
          </div>
          <div className={styles.panel}>
            <p className={styles.panelHead}>
              <span>
                <b>Ponuda za gradilište</b>
                <i>3 stavke</i>
              </span>
              <span className={styles.chip}>Čeka potvrdu</span>
            </p>
            <ul className={styles.lines}>
              {lines.map((l) => (
                <li key={l.sku}>
                  <span className={styles.sku}>{l.sku}</span>
                  <span className={styles.lineName}>{l.p.name}</span>
                  <span>{l.qty}</span>
                </li>
              ))}
            </ul>
            <p className={styles.total}>
              <span>Cijena</span>
              <b>Na upit</b>
            </p>
            <span className={styles.confirm}>Potvrdi ponudu</span>
          </div>
        </div>

        <div className={styles.strip} aria-hidden>
          <div className={styles.reel}>
            {[...STRIP, ...STRIP].map((p, i) => (
              <img key={i} src={p.image} alt="" width={900} height={1125} loading="lazy" decoding="async" />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
