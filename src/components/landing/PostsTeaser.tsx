'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'
import { EASE, MQ } from '@/lib/motion'
import { revealChars } from '@/lib/reveal'
import styles from './ClosingSections.module.css'

const CARDS = [
  { title: 'Pripremite spisak materijala', copy: 'Materijal, količina i jedinica mjere. Dodajte lokaciju i željeni rok.', href: '/upit-za-izvodjace', cta: 'Pripremite upit', rows: [['Materijal', 'Naziv'], ['Količina', 'Broj'], ['Jedinica', 'm² / kom']], kind: 'list' },
  { title: 'Pronađite odgovarajući materijal', copy: 'Vodiči prema namjeni i vrsti radova, za lakši izbor materijala.', href: '/vodici', cta: 'Istražite vodiče', rows: [['Suha gradnja', '↗'], ['Izolacija', '↗'], ['Završni radovi', '↗']], kind: 'list' },
  { title: 'Tehnički listovi i dokumentacija', copy: 'Navedite proizvod za koji vam trebaju tehnički podaci ili dokumentacija.', href: '/upit-za-izvodjace?vrsta=dokumentacija', cta: 'Zatražite dokumentaciju', rows: [['Tehnički list', '01'], ['Uputstvo za ugradnju', '02'], ['Deklaracija proizvoda', '03']], kind: 'docs' },
]

export default function PostsTeaser() {
  const root = useRef<HTMLElement>(null)
  useGSAP(() => {
    gsap.matchMedia().add(MQ, ctx => {
      const { reduce } = ctx.conditions as { reduce: boolean }
      const el = root.current!
      revealChars(el.querySelector('[data-head]')!, reduce, 'top 85%')
      el.querySelectorAll('[data-guide]').forEach(card => {
        if (reduce) { gsap.set(card, { autoAlpha: 1, y: 0 }); return }
        gsap.fromTo(card, { autoAlpha: 0, y: 32 }, { autoAlpha: 1, y: 0, duration: .5, ease: EASE.quint, scrollTrigger: { trigger: card, start: 'top 95%' } })
      })
    })
  }, { scope: root })
  return (
    <section ref={root} id="vodici" className={styles.guides} aria-labelledby="guides-title">
      <div className="gutter">
        <div className={styles.heading}>
          <div>
            <p className="label mb-6 opacity-60">Prije naručivanja</p>
            <h2 id="guides-title" data-head className={`display invisible ${styles.title}`}>Savjeti i tehnička dokumentacija</h2>
          </div>
          <p className={styles.lead}>Pripremite upit, pronađite materijal prema namjeni ili zatražite podatke za konkretan proizvod.</p>
        </div>
        <div className={styles.cards}>
          {CARDS.map((card, i) => (
            <article data-guide className={styles.card} key={card.title}>
              <div className={styles.art} aria-hidden>
                <span className="label opacity-50">0{i + 1} · {card.kind === 'docs' ? 'Dokumentacija po upitu' : 'Za lakši izbor'}</span>
                {card.rows.map(([label, value], j) => (
                  <div className={styles.artRow} key={label}>
                    {card.kind === 'docs' ? <svg viewBox="0 0 26 30" className={styles.document} fill="none" stroke="currentColor" strokeWidth="1"><path d="M3 1h13l7 7v21H3ZM16 1v7h7M7 14h12M7 19h12M7 24h7" /></svg> : <span className={styles.artNum}>0{j + 1}</span>}
                    <span>{label}</span><span className="opacity-60">{value}</span>
                  </div>
                ))}
              </div>
              <div className={styles.cardBottom}>
                <h3 className={`font-pretty ${styles.cardTitle}`}>{card.title}</h3>
                <p className={styles.cardCopy}>{card.copy}</p>
              </div>
              <Link href={card.href} className={styles.cardLink}><span>{card.cta}</span><span aria-hidden>↗</span></Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
