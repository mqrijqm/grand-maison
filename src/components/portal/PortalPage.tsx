import Cta from '@/components/ui/Cta'
import PortalStage from './PortalStage'
import s from './Portal.module.css'

// /portal — B2B portal kao zaseban proizvod (faza "Grand Company Business" iz researcha 12.19).
// Cijela stranica je sam dashboard; ispod su samo moduli i faze razvoja. Sve je demo:
// izmišljena firma, demo šifre i cijene, rabat/limit samo kao predložena funkcija.

const MODULES = [
  { n: '01', t: 'Brza narudžba', d: 'Šifra i količina, red po red ili zalijepljena tabela iz Excela. Šifre se provjeravaju odmah.' },
  { n: '02', t: 'Ponude', d: 'Ponude prodaje na jednom mjestu, sa rokom važenja. Prihvatite ih ili izmijenite stavke.' },
  { n: '03', t: 'Narudžbe i isporuke', d: 'Status od prijema do isporuke, termini po danima i jednim klikom ponovljena narudžba.' },
  { n: '04', t: 'Gradilišta', d: 'Nabavka po projektu: koliko je nabavljeno u odnosu na plan i šta stiže sljedeće.' },
  { n: '05', t: 'Sačuvane liste', d: 'Liste iz kalkulatora i ranijih narudžbi, spremne za novi upit.' },
  { n: '06', t: 'Dokumenti i tim', d: 'Fakture, otpremnice i tehnički listovi. Poslovođe šalju zahtjeve, nabavka odobrava.' },
]

const PHASES = [
  { n: 'Faza 1', t: 'Grand Company Digital', d: 'Sajt, katalog, pretraga, kalkulator materijala, upit za ponudu.' },
  { n: 'Faza 2', t: 'Grand Company Business', d: 'Ovaj portal: nalozi firmi, brza narudžba, ponude, narudžbe, dokumenti, tim.', on: true },
  { n: 'Faza 3', t: 'Grand Company Connected', d: 'Veza sa postojećim ERP i skladišnim sistemom: artikli, zalihe i cijene bez ručnog unosa.' },
]

export default function PortalPage() {
  return (
    <div className={s.page}>
      <header className={`gutter ${s.intro}`}>
        <p className={`label ${s.kicker}`}>
          <i />B2B portal · demo
        </p>
        <h1 className={`display ${s.title}`}>Portal za građevinske firme</h1>
        <div className={s.introSide}>
          <p className={s.lead}>Nabavka cijele firme na jednom ekranu: šta je naručeno, šta stiže na koje gradilište, koje ponude čekaju i ko je šta odobrio. Probajte demo ispod. Sve radi, a podaci su izmišljeni.</p>
          <div className={s.actions}>
            <Cta href="/kontakt" solid>
              Zatražite pristup
            </Cta>
            <Cta href="/za-firme">Za firme</Cta>
          </div>
        </div>
      </header>

      <PortalStage />

      <section className={`gutter ${s.modules}`} aria-labelledby="mod-title">
        <h2 id="mod-title" className={`label ${s.kicker}`}>
          <i />
          Moduli portala
        </h2>
        <ol className={s.modGrid}>
          {MODULES.map((m) => (
            <li key={m.n}>
              <span className={s.modNum}>{m.n}</span>
              <h3 className={s.modTitle}>{m.t}</h3>
              <p>{m.d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={`gutter ${s.phases}`} aria-labelledby="ph-title">
        <h2 id="ph-title" className={`label ${s.kicker}`}>
          <i />
          Razvoj u fazama
        </h2>
        <ol className={s.phGrid}>
          {PHASES.map((p) => (
            <li key={p.n} data-on={p.on || undefined}>
              <span className="label">{p.n}</span>
              <h3 className={s.modTitle}>{p.t}</h3>
              <p>{p.d}</p>
            </li>
          ))}
        </ol>
        <p className={s.disclaimer}>
          Demo firma, šifre, cijene, narudžbe i dokumenti su izmišljeni. Individualne cijene, rabat i odgođeno plaćanje su predložena funkcija, ne postojeći uslovi Grand Company-ja. Uslove saradnje dogovarate sa prodajom.
        </p>
      </section>
    </div>
  )
}
