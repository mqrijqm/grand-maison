import { amount, km, name, unit } from '@/lib/b2b-demo'
import s from './Snippets.module.css'

// Mali isječci iz portala (statični, demo podaci) za heroj, mogućnosti i korake.
// Isti vizuelni jezik kao interaktivni prikaz, ali bez interakcije: služe da se odmah vidi o čemu je riječ.

const LINES = [
  { sku: 'GKP-001', qty: 120 },
  { sku: 'PRF-075', qty: 40 },
  { sku: 'ISO-001', qty: 60 },
]

export function Snippet({ kind }: { kind: string }) {
  if (kind === 'account')
    return (
      <div className={s.box}>
        <div className={s.acc}>
          <span className={s.av}>DG</span>
          <span>
            <b>DEMO GRADNJA d.o.o.</b>
            <i>Nalog firme · 3 korisnika</i>
          </span>
        </div>
        <div className={s.tabs}>
          <span data-on>Upiti 1</span>
          <span>Ponude 2</span>
          <span>Narudžbe 3</span>
        </div>
      </div>
    )
  if (kind === 'lines' || kind === 'send')
    return (
      <div className={s.box}>
        {kind === 'send' && <p className={s.kick}>Upit · Lamela A · dostava</p>}
        <ul className={s.lines}>
          {(kind === 'send' ? LINES : LINES).map((l) => (
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
        {kind === 'send' && <span className={s.btn}>Pošalji upit</span>}
      </div>
    )
  if (kind === 'offer')
    return (
      <div className={s.box}>
        <div className={s.row}>
          <span>
            <i>Ponuda P-26-0142</i>
            <b>Pregradni zidovi, sprat 3</b>
          </span>
          <span className={s.chip} data-k="act">
            Čeka potvrdu
          </span>
        </div>
        <div className={s.row}>
          <i>5 stavki · važi 14 dana</i>
          <b>{km(amount([{ sku: 'GKP-001', qty: 420 }, { sku: 'PRF-075', qty: 180 }, { sku: 'PRF-UW75', qty: 64 }, { sku: 'ISO-001', qty: 380 }, { sku: 'CHM-001', qty: 24 }]))}</b>
        </div>
        <span className={s.btn}>Potvrdi ponudu</span>
      </div>
    )
  if (kind === 'track')
    return (
      <div className={s.box}>
        <div className={s.row}>
          <span>
            <i>Narudžba GC-26-04512</i>
            <b>Na putu ka gradilištu</b>
          </span>
          <span className={s.chip}>Danas 08–10h</span>
        </div>
        <ol className={s.track}>
          {['Primljena', 'Potvrđena', 'U pripremi', 'Na putu', 'Isporučena'].map((t, i) => (
            <li key={t} data-done={i <= 3 || undefined}>
              <i />
              <span>{t}</span>
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
            <i>Isporučeno 27.09. · Lamela A</i>
            <b>Narudžba GC-26-04402</b>
          </span>
          <span className={s.ghost}>↻ Ponovi</span>
        </div>
        <div className={s.row}>
          <span>
            <i>Sačuvana lista · 5 stavki</i>
            <b>Pregradni zid 100 mm</b>
          </span>
          <span className={s.ghost}>U upit</span>
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
          <span className={s.btn}>Dodaj</span>
        </div>
      </div>
    )
  return null
}

/** Heroj: upit u pripremi, ponuda koja čeka i isporuka, kao jedan pogled u portal. */
export function HeroPreview() {
  return (
    <div className={s.hero} aria-label="Isječak iz B2B portala (demo)">
      <div className={s.bar} aria-hidden>
        <i />
        <i />
        <i />
        <span>portal.grandcompany.ba</span>
        <em>Demo</em>
      </div>
      <div className={s.heroBody}>
        <p className={s.kick}>Novi upit · Lamela A</p>
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
        <div className={s.heroFoot}>
          <span className={s.chip} data-k="act">
            Ponuda P-26-0142 čeka potvrdu
          </span>
          <span className={s.chip}>GC-26-04512 · dostava sutra 08–10h</span>
        </div>
      </div>
    </div>
  )
}
