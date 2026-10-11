import styles from './BizProblems.module.css'

// Iskreno, za direktora: šta je portal danas (prezentacija) i šta treba da postane pravi B2B.
const TODAY = [
  'Interaktivni prikaz: svi ekrani, tok upita, ponude i narudžbe rade u browseru.',
  'Demo podaci: cijene po firmi, limit, fakture i zalihe su primjer, ne stvarni podaci firme.',
  'Registracija firme i odobravanje u adminu rade, ali se pamte samo u tom browseru.',
  'Korpa na sajtu vodi na upit, ne na plaćanje. To je namjerno: faza 1 bez online plaćanja.',
]
const NEXT = [
  'Povezivanje sa programom u kojem prodaja danas radi: cjenovnici, fakture, dug i zalihe uživo.',
  'Pravi nalozi i prijava korisnika firme, sa ulogama (vlasnik, šef, majstor, računovodstvo).',
  'Slanje mejlova i SMS-a: kupcu o statusu i fakturama, prodavcu o novom upitu i isteku ponude.',
  'Admin za prodaju: odobravanje firmi, cjenovnici i limiti po klijentu, statusi narudžbi.',
]

export default function BizReality() {
  return (
    <section className={styles.reality} aria-labelledby="realnost-naslov">
      <div className="gutter">
        <p className="label opacity-70">Iskreno</p>
        <h2 id="realnost-naslov" className={`display ${styles.realityTitle}`}>
          Šta je ovo danas, a šta treba za pravi B2B
        </h2>
        <p className={styles.realityLead}>
          Portal iznad je prezentacija: pokazuje kako bi nabavka izgledala i koje probleme rješava. Da bi radio stvarno, povezuje se sa sistemom u kojem Grand Company već vodi kupce, cijene i fakture.
        </p>
        <div className={styles.realityGrid}>
          <div className={styles.col}>
            <h3>Danas na sajtu (demo)</h3>
            <ul>
              {TODAY.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
          <div className={styles.col} data-next>
            <h3>Za pravi B2B</h3>
            <ul>
              {NEXT.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
