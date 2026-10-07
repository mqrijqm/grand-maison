'use client'

import { useRef } from 'react'
import Link from 'next/link'
import Cta from '@/components/ui/Cta'
import { gsap, useGSAP } from '@/lib/gsap'
import { useMediaMotion } from '@/lib/media'
import { EASE, MQ } from '@/lib/motion'
import { revealChars } from '@/lib/reveal'
import styles from './Procurement.module.css'

export default function Bento() {
  const root = useRef<HTMLElement>(null)
  useMediaMotion(root)
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(MQ, ctx => {
      const { reduce } = ctx.conditions as { reduce: boolean }
      const el = root.current!
      revealChars(el.querySelector('[data-head]')!, reduce, 'top 80%')
      if (reduce) return
      el.querySelectorAll('[data-bento]').forEach(card => {
        gsap.from(card, { y: 45, autoAlpha: 0, duration: .6, ease: EASE.quint,
          scrollTrigger: { trigger: card, start: 'top 90%' } })
      })
    })
  }, { scope: root })

  return (
    <section ref={root} id="b2b" className="relative z-20 bg-bg py-[14vh]" aria-labelledby="procurement-title">
      <div className="gutter">
        <div className={styles.heading}>
          <div>
            <p className="label mb-6 opacity-60">Veleprodaja · Poslovni kupci</p>
            <h2 id="procurement-title" data-head className={`display invisible ${styles.title}`}>Nabavka za firme i izvođače</h2>
          </div>
          <p data-up className={styles.lead}>Pošaljite spisak materijala, količine i lokaciju projekta. Započnite upit za ponudu na jednom mjestu.</p>
        </div>
        <div className={styles.cards}>
          <article data-bento className={`${styles.card} ${styles.blue}`}>
            <div className={styles.eyebrow}><span>Imate predmjer?</span><span>01</span></div>
            <h3 className={`font-pretty ${styles.cardTitle}`}>Ponuda prema vašem spisku</h3>
            <div className={styles.mockup}>
              <div className={styles.sheet}>
                <div className={styles.sheetHead}><span>Spisak materijala</span><span className={styles.sheetLabel}>Primjer</span></div>
                <table className={styles.table} aria-label="Primjer spiska za upit">
                  <thead><tr><th>Materijal</th><th>Količina</th><th>Jedinica</th></tr></thead>
                  <tbody>
                    <tr><td>Gipsane ploče</td><td>120</td><td>m²</td></tr>
                    <tr><td>Kamena vuna</td><td>80</td><td>m²</td></tr>
                    <tr><td>Ljepilo</td><td>24</td><td>vreće</td></tr>
                  </tbody>
                </table>
                <div className={styles.attachments}><span>PDF</span><span>Excel</span><span>Fotografija spiska</span></div>
              </div>
            </div>
            <p className={styles.copy}>Već znate šta vam treba? Pripremite materijal, količine i jedinice mjere.</p>
            <Link className={styles.link} href="/upit-za-izvodjace?vrsta=spisak"><span>Pošaljite spisak materijala</span><span aria-hidden>↗</span></Link>
          </article>
          <article data-bento className={styles.card}>
            <div className={styles.eyebrow}><span>Planirate radove?</span><span>02</span></div>
            <h3 className={`font-pretty ${styles.cardTitle}`}>Nabavka za projekat</h3>
            <div className={styles.mockup}>
              <div className={styles.sheet}>
                <div className={styles.sheetHead}><span>Vaš projekat</span><span className={styles.sheetLabel}>Za upit</span></div>
                <div className={styles.field}><span>Lokacija</span><span>Mjesto radova</span></div>
                <div className={styles.field}><span>Faza</span><span>Vrsta radova</span></div>
                <div className={styles.field}><span>Količine</span><span>Prema specifikaciji</span></div>
                <div className={styles.field}><span>Termin</span><span>Željeni rok</span></div>
              </div>
            </div>
            <p className={styles.copy}>Pošaljite specifikaciju i plan radova. Mogućnosti nabavke i isporuke dogovorite s prodajom.</p>
            <Link className={styles.link} href="/upit-za-izvodjace?vrsta=projekat"><span>Zatražite ponudu za projekat</span><span aria-hidden>↗</span></Link>
          </article>
          <article data-bento className={`${styles.card} ${styles.dark}`}>
            <div className={styles.eyebrow}><span>Nabavljate redovno?</span><span>03</span></div>
            <h3 className={`font-pretty ${styles.cardTitle}`}>Saradnja za redovnu nabavku</h3>
            <div className={styles.mockup}>
              <div className={styles.cycle}>
                {[
                  ['Vaša firma', 'Djelatnost i kontakt'],
                  ['Vaše potrebe', 'Program i obim nabavke'],
                  ['Način saradnje', 'Razgovor s prodajom'],
                ].map(([title, note], i) => (
                  <div key={title} className={styles.cycleRow}>
                    <span className={styles.cycleNumber}>0{i + 1}</span>
                    <div><span className={styles.cycleTitle}>{title}</span><span className={styles.cycleNote}>{note}</span></div>
                  </div>
                ))}
              </div>
            </div>
            <p className={styles.copy}>Za firme i izvođače koji nabavljaju kontinuirano. Javite nam šta vam treba i koliko često.</p>
            <Link className={styles.link} href="/upit-za-izvodjace?vrsta=saradnja"><span>Kontaktirajte prodaju za firme</span><span aria-hidden>↗</span></Link>
          </article>
        </div>
        <div id="partneri" className={styles.terms}>
          <div>
            <p className="label mb-4 opacity-60">Uslovi saradnje</p>
            <h3 className={`font-pretty ${styles.termsTitle}`}>Prema vašoj nabavci</h3>
            <p className={styles.termsText}>Navedite obim i učestalost nabavke. Konkretne cijene i uslove provjerite s prodajom.</p>
          </div>
          <div>
            {[
              ['Cijene i rabat', 'Prema ponudi'],
              ['Uslovi plaćanja', 'Prema dogovoru'],
              ['Preuzimanje i dostava', 'Prema robi i lokaciji'],
            ].map(([name, answer], i) => (
              <div key={name} className={styles.termRow}>
                <span className={styles.termNumber}>0{i + 1}</span>
                <span className={styles.termName}>{name}</span>
                <span className={styles.termAnswer}>{answer}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.portal}>
          <p><span className="font-medium">Već imate poslovni nalog?</span><br />Pristupite partnerskom portalu.</p>
          <Cta href="/portal">B2B portal</Cta>
        </div>
      </div>
    </section>
  )
}
