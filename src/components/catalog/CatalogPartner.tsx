'use client'

/* eslint-disable @next/next/no-img-element -- male fotografije artikala iz /public/shop */
import Cta from '@/components/ui/Cta'
import { PRODUCTS, pName } from '@/lib/shop'
import { T, useLang } from '@/lib/i18n'
import styles from './CatalogPartner.module.css'

// Kraj kataloga: kratak poziv firmama. Lijevo naslov i dugme, u sredini svedeni prozor B2B portala
// (ponuda koja čeka potvrdu), desno uska kolona malih fotografija artikala koja polako klizi naviše.

const LINES = [
  { sku: 'GKP-001', qty: '120 m²', qtyEn: '120 m²' },
  { sku: 'PRF-075', qty: '86 kom', qtyEn: '86 pcs' },
  { sku: 'ISO-001', qty: '60 m²', qtyEn: '60 m²' },
]
const STRIP = PRODUCTS.filter((p, i) => i % 2 === 0).slice(0, 8)

export default function CatalogPartner() {
  const { t } = useLang()
  const lines = LINES.map((l) => ({ ...l, p: PRODUCTS.find((p) => p.sku === l.sku)! }))
  return (
    <section className={`gutter ${styles.wrap}`} aria-labelledby="partner-title">
      <div className={styles.box}>
        <div className={styles.copy}>
          <p className="label"><T sr="Za firme" en="For companies" /></p>
          <h2 id="partner-title" className={`display ${styles.title}`}>
            <T sr="Firma ste? Postanite partner." en="A company? Become a partner." />
          </h2>
          <p className={styles.lead}><T sr="Poslovni nalog: upiti, ponude i narudžbe na jednom mjestu." en="Business account: enquiries, quotes and orders in one place." /></p>
          <Cta href="/za-firme" solid>
            {t('Postanite partner', 'Become a partner')}
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
                <b><T sr="Ponuda za gradilište" en="Quote for a building site" /></b>
                <i><T sr="3 stavke" en="3 items" /></i>
              </span>
              <span className={styles.chip}><T sr="Čeka potvrdu" en="Awaiting confirmation" /></span>
            </p>
            <ul className={styles.lines}>
              {lines.map((l) => (
                <li key={l.sku}>
                  <span className={styles.sku}>{l.sku}</span>
                  <span className={styles.lineName}><T sr={pName(l.p)} en={pName(l.p, 'en')} /></span>
                  <span><T sr={l.qty} en={l.qtyEn} /></span>
                </li>
              ))}
            </ul>
            <p className={styles.total}>
              <span><T sr="Cijena" en="Price" /></span>
              <b><T sr="Na upit" en="On request" /></b>
            </p>
            <span className={styles.confirm}><T sr="Potvrdi ponudu" en="Confirm quote" /></span>
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
