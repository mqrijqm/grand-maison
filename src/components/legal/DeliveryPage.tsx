import Image from 'next/image'
import Link from 'next/link'
import { COMPANY, MAPS_URL } from '@/lib/company'
import type { LegalDoc } from '@/lib/legal-types'
import { pw } from '@/components/ui/Pw'
import styles from './DeliveryPage.module.css'
import StepBand from '@/components/ui/StepBand'

const QUESTIONS = [
  { number: '01', title: 'Lično preuzimanje', body: 'Stovarište je u Banjoj Luci. Prije dolaska provjerite raspoloživost robe i dogovorite preuzimanje.', link: 'Pogledajte lokaciju', href: MAPS_URL, external: true },
  { number: '02', title: 'Dostava na adresu', body: 'Pošaljite adresu i spisak materijala. Prodaja će provjeriti mogućnost, termin i trošak isporuke.', link: 'Pošaljite upit', href: '/upit-za-izvodjace?vrsta=dostava' },
  { number: '03', title: 'Pristup i istovar', body: 'Navedite kakav je prilaz lokaciji i gdje robu treba odložiti. Način istovara dogovara se prema robi i uslovima na terenu.', link: 'Provjerite uslove', href: '#teska-roba-i-istovar' },
] as const

export default function DeliveryPage({ doc }: { doc: LegalDoc }) {
  return (
    <>
      <div className={styles.page}>
        <div className={styles.hero}>
          <div className={styles.copy}>
            <p className="label">Kupovina · Dostava</p>
            <h1 className={`display ${styles.title}`}>Dostava i preuzimanje materijala</h1>
            <p className={styles.lead}>Preuzmite robu u stovarištu ili pošaljite upit za isporuku. Mogućnost dostave, termin i uslove provjerite s prodajom prema robi i lokaciji.</p>
            <Link href="/upit-za-izvodjace?vrsta=dostava" className={styles.cta}>Provjerite mogućnosti dostave <span aria-hidden>↗</span></Link>
          </div>
          <figure className={styles.visual}>
            <Image src="/editorial/delivery-pickup-v2.webp" alt="Ilustrativna fotografija materijala pripremljenog za otpremu" fill priority sizes="(max-width: 900px) 100vw, 50vw" className={styles.image} />
            <figcaption>Priprema materijala · ilustracija</figcaption>
          </figure>
        </div>

        <div className={styles.questions}>
          {QUESTIONS.map(item => <article className={styles.question} key={item.number}>
            <span className={styles.number}>{item.number}</span>
            <h2>{item.title}</h2>
            <p>{item.body}</p>
            {'external' in item && item.external ? <a href={item.href} target="_blank" rel="noopener noreferrer">{item.link} <span aria-hidden>↗</span></a> : <Link href={item.href}>{item.link} <span aria-hidden>↗</span></Link>}
          </article>)}
        </div>

        <StepBand as="div" tone="navy" profile="valley" steps={11} className="!z-[25]">
        <section className={styles.brief} aria-labelledby="delivery-brief-title">
          <div><p className="label">Za upit prodaji</p><h2 id="delivery-brief-title">Šta nam poslati?</h2></div>
          <div className={styles.briefFields}>
            {['Materijal i količina', 'Adresa ili lično preuzimanje', 'Željeni termin', 'Uslovi prilaza i istovara'].map((field, index) => <p key={field}><span>0{index + 1}</span>{field}</p>)}
          </div>
          <Link href="/upit-za-izvodjace?vrsta=dostava" className={styles.briefLink}>Pošaljite spisak materijala <span aria-hidden>↗</span></Link>
        </section>
        </StepBand>
      </div>
      <section className={styles.terms} aria-labelledby="delivery-terms-title">
        <div className={styles.termsIntro}><p className="label">Detalji usluge</p><h2 id="delivery-terms-title">Uslovi dostave i preuzimanja</h2><p>Za konkretan termin i način isporuke kontaktirajte prodaju na {COMPANY.phone}.</p></div>
        <div className={styles.termSections}>{doc.sections.map(section => <section id={section.id} key={section.id} className={styles.termSection}><h3>{pw(section.title)}</h3><DeliveryBlocks blocks={section.blocks} /></section>)}</div>
        <Link href="/sve-politike" className={styles.policies}>Sve politike ↗</Link>
      </section>
    </>
  )
}

import { T } from './LegalText'
import type { LegalBlock } from '@/lib/legal-types'

function DeliveryBlocks({ blocks }: { blocks: LegalBlock[] }) {
  return blocks.map((block, index) => {
    if (block.t === 'p' || block.t === 'note') return <p key={index}><T s={block.text} /></p>
    if (block.t === 'ul' || block.t === 'ol') {
      const Tag = block.t
      return <Tag key={index}>{block.items.map((item, i) => <li key={i}><T s={item} /></li>)}</Tag>
    }
    if (block.t === 'dl') return <dl key={index}>{block.items.map(item => <div key={item.k}><dt>{item.k}</dt><dd><T s={item.v} /></dd></div>)}</dl>
    return <div key={index}>{block.title && <strong>{block.title}</strong>}{block.lines.map((line, i) => <p key={i}><T s={line} /></p>)}</div>
  })
}
