'use client'

import styles from './BizProblems.module.css'

// "Koji problemi nestaju": stranica prvo govori jezikom problema (kupac i prodaja), a tek onda pokazuje
// portal. Svako dugme otvara tačan ekran demo portala ispod (događaj gc-portal) i skroluje do njega.

type Item = { quote: string; fix: string; view: string; cta: string }

const BUYERS: Item[] = [
  { quote: 'Zovem vas tri puta dok ne dobijem ponudu.', fix: 'Upit se pošalje iz portala, prodaja ga vidi odmah, a ponuda se vrati u isti nalog. Nema izgubljenih mejlova.', view: 'ponude', cta: 'Ponude' },
  { quote: 'Ne znam je li mi stigla roba.', fix: 'Status svake narudžbe: primljena, u pripremi, na putu, isporučena. Bez zvanja skladišta.', view: 'narudzbe', cta: 'Narudžbe' },
  { quote: 'Šef pita koliko smo ove godine potrošili kod vas.', fix: 'Fakture, ponude i narudžbe na jednom mjestu, sa potrošnjom za godinu. Izvoz u Excel jednim klikom.', view: 'dokumenti', cta: 'Dokumenti i izvoz' },
  { quote: 'Svaki mjesec naručujem isto, a svaki put mi treba pola sata.', fix: 'Ponovite prošlu narudžbu, promijenite količinu i pošaljite. Trideset sekundi umjesto poziva.', view: 'pregled', cta: 'Ponovi narudžbu' },
  { quote: 'Koliko nam je ostalo limita?', fix: 'Firma u svakom trenutku vidi koliko duguje, koliki joj je limit i koje fakture treba platiti.', view: 'dokumenti', cta: 'Dug i limit' },
]

const SALES: Item[] = [
  { quote: 'Svaka firma ima svoju cijenu, a ja je držim u glavi ili u Excelu.', fix: 'Cjenovnik po firmi: kupac se prijavi i vidi svoju cijenu za istu ploču. Firma koja kupuje 500.000 KM godišnje i ona od 20.000 KM vide različito, bez računanja.', view: 'materijali', cta: 'Cijene po firmi' },
  { quote: 'Prije svake isporuke ručno provjeravam limit.', fix: 'Portal računa iskorišten limit iz faktura i narudžbi u toku i upozori kad upit prelazi slobodan iznos.', view: 'admin', cta: 'Cjenovnici i limiti' },
  { quote: 'Majstor pošalje narudžbu koju niko nije odobrio.', fix: 'Uloge u firmi: majstor šalje upit, šef potvrđuje ponudu, računovodstvo vidi fakture, vlasnik sve.', view: 'tim', cta: 'Ko šta smije' },
  { quote: 'Upit dođe na mejl i neko zaboravi.', fix: 'Novi upit prodavcu stiže SMS-om i mejlom, a prije isteka ponude stiže podsjetnik.', view: 'admin', cta: 'Obavještenja prodaji' },
]

function open(view: string) {
  window.dispatchEvent(new CustomEvent('gc-portal', { detail: view }))
  const el = document.getElementById('portal')
  if (!el) return
  const y = el.getBoundingClientRect().top + window.scrollY - 70
  if (window.__gcLenis) window.__gcLenis.scrollTo(y)
  else window.scrollTo({ top: y, behavior: 'smooth' })
}

function List({ items, start }: { items: Item[]; start: number }) {
  return (
    <ol className={styles.list}>
      {items.map((it, i) => (
        <li key={it.quote} data-up className={styles.item}>
          <span className={styles.num}>{String(start + i).padStart(2, '0')}</span>
          <p className={styles.quote}>„{it.quote}”</p>
          <div className={styles.fix}>
            <p>{it.fix}</p>
            <button type="button" className={styles.go} onClick={() => open(it.view)}>
              {it.cta} u portalu
              <svg viewBox="0 0 24 12" aria-hidden fill="none" stroke="currentColor" strokeWidth={1.6}>
                <path d="M0 6h22M17 1l5 5-5 5" />
              </svg>
            </button>
          </div>
        </li>
      ))}
    </ol>
  )
}

export default function BizProblems() {
  return (
    <section id="problemi" className={`gutter ${styles.root}`} aria-labelledby="problemi-naslov">
      <header className={styles.head}>
        <p className="label">Šta portal rješava</p>
        <h2 id="problemi-naslov" data-head className={`display invisible ${styles.title}`}>
          Koji problemi nestaju
        </h2>
      </header>

      <div className={styles.group}>
        <h3 className={styles.groupTitle}>
          Za firme koje kupuju <span>5</span>
        </h3>
        <List items={BUYERS} start={1} />
      </div>
      <div className={styles.group}>
        <h3 className={styles.groupTitle}>
          Za prodaju Grand Company-ja <span>4</span>
        </h3>
        <List items={SALES} start={6} />
      </div>
    </section>
  )
}
