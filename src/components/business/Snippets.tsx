'use client'

import { amount, kmL, nameL, unitL } from '@/lib/b2b-demo'
import { useLang } from '@/lib/i18n'
import s from './Snippets.module.css'

// Mali isječci iz portala (statični, demo podaci) za heroj, mogućnosti i korake.
// Isti vizuelni jezik kao interaktivni prikaz, ali bez interakcije: služe da se odmah vidi o čemu je riječ.

const LINES = [
  { sku: 'GKP-001', qty: 120 },
  { sku: 'PRF-075', qty: 40 },
  { sku: 'ISO-001', qty: 60 },
]

export function Snippet({ kind }: { kind: string }) {
  const { t, lang } = useLang()
  const name = (sku: string) => nameL(sku, lang)
  const unit = (sku: string) => unitL(sku, lang)
  if (kind === 'account')
    return (
      <div className={s.box}>
        <div className={s.acc}>
          <span className={s.av}>DG</span>
          <span>
            <b>DEMO GRADNJA d.o.o.</b>
            <i>{t('Nalog firme · 3 korisnika', 'Company account · 3 users')}</i>
          </span>
        </div>
        <div className={s.tabs}>
          <span data-on>{t('Upiti 1', 'Inquiries 1')}</span>
          <span>{t('Ponude 2', 'Offers 2')}</span>
          <span>{t('Narudžbe 3', 'Orders 3')}</span>
        </div>
      </div>
    )
  if (kind === 'lines' || kind === 'send')
    return (
      <div className={s.box}>
        {kind === 'send' && <p className={s.kick}>{t('Upit · Lamela A · dostava', 'Inquiry · Lamela A · delivery')}</p>}
        <ul className={s.lines}>
          {LINES.map((l) => (
            <li key={l.sku}>
              <span>
                <b>{name(l.sku)}</b>
                <i>{l.sku}</i>
              </span>
              <em>
                {l.qty} {unit(l.sku)}
              </em>
            </li>
          ))}
        </ul>
        {kind === 'send' && <span className={s.btn}>{t('Pošalji upit', 'Send inquiry')}</span>}
      </div>
    )
  if (kind === 'offer')
    return (
      <div className={s.box}>
        <div className={s.row}>
          <span>
            <i>{t('Ponuda P-26-0142', 'Offer P-26-0142')}</i>
            <b>{t('Pregradni zidovi, sprat 3', 'Partition walls, floor 3')}</b>
          </span>
          <span className={s.chip} data-k="act">
            {t('Čeka potvrdu', 'Awaiting confirmation')}
          </span>
        </div>
        <div className={s.row}>
          <i>{t('5 stavki · važi 14 dana', '5 items · valid for 14 days')}</i>
          <b>{kmL(amount([{ sku: 'GKP-001', qty: 420 }, { sku: 'PRF-075', qty: 180 }, { sku: 'PRF-UW75', qty: 64 }, { sku: 'ISO-001', qty: 380 }, { sku: 'CHM-001', qty: 24 }]), lang)}</b>
        </div>
        <span className={s.btn}>{t('Potvrdi ponudu', 'Confirm offer')}</span>
      </div>
    )
  if (kind === 'track')
    return (
      <div className={s.box}>
        <div className={s.row}>
          <span>
            <i>{t('Narudžba GC-26-04512', 'Order GC-26-04512')}</i>
            <b>{t('Na putu ka gradilištu', 'On the way to the site')}</b>
          </span>
          <span className={s.chip}>{t('Danas 08–10h', 'Today 08:00–10:00')}</span>
        </div>
        <ol className={s.track}>
          {t(['Primljena', 'Potvrđena', 'U pripremi', 'Na putu', 'Isporučena'], ['Received', 'Confirmed', 'In preparation', 'On the way', 'Delivered']).map((label, i) => (
            <li key={label} data-done={i <= 3 || undefined}>
              <i />
              <span>{label}</span>
            </li>
          ))}
        </ol>
      </div>
    )
  if (kind === 'repeat')
    return (
      <div className={s.box}>
        <div className={s.row}>
          <span>
            <i>{t('Isporučeno 27.09. · Lamela A', 'Delivered Sep 27 · Lamela A')}</i>
            <b>{t('Narudžba GC-26-04402', 'Order GC-26-04402')}</b>
          </span>
          <span className={s.ghost}>{t('↻ Ponovi', '↻ Repeat')}</span>
        </div>
        <div className={s.row}>
          <span>
            <i>{t('Sačuvana lista · 5 stavki', 'Saved list · 5 items')}</i>
            <b>{t('Pregradni zid 100 mm', 'Partition wall 100 mm')}</b>
          </span>
          <span className={s.ghost}>{t('U upit', 'Add to inquiry')}</span>
        </div>
      </div>
    )
  if (kind === 'pick')
    return (
      <div className={s.box}>
        <span className={s.search}>⌕ CW 75</span>
        <div className={s.row}>
          <span>
            <b>{name('PRF-075')}</b>
            <i>PRF-075 · 3000 × 75 × 50 mm</i>
          </span>
          <span className={s.btn}>{t('Dodaj', 'Add')}</span>
        </div>
      </div>
    )
  return null
}

/** Heroj: upit u pripremi, ponuda koja čeka i isporuka, kao jedan pogled u portal. */
export function HeroPreview() {
  const { t, lang } = useLang()
  return (
    <div className={s.hero} aria-label={t('Isječak iz B2B portala (demo)', 'Excerpt from the B2B portal (demo)')}>
      <div className={s.bar} aria-hidden>
        <i />
        <i />
        <i />
        <span>portal.grandcompany.ba</span>
        <em>Demo</em>
      </div>
      <div className={s.heroBody}>
        <p className={s.kick}>{t('Novi upit · Lamela A', 'New inquiry · Lamela A')}</p>
        <ul className={s.lines}>
          {LINES.map((l) => (
            <li key={l.sku}>
              <span>
                <b>{nameL(l.sku, lang)}</b>
                <i>{l.sku}</i>
              </span>
              <em>
                {l.qty} {unitL(l.sku, lang)}
              </em>
            </li>
          ))}
        </ul>
        <div className={s.heroFoot}>
          <span className={s.chip} data-k="act">
            {t('Ponuda P-26-0142 čeka potvrdu', 'Offer P-26-0142 awaiting confirmation')}
          </span>
          <span className={s.chip}>{t('GC-26-04512 · dostava sutra 08–10h', 'GC-26-04512 · delivery tomorrow 08:00–10:00')}</span>
        </div>
      </div>
    </div>
  )
}
