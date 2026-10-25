'use client'

import Image from 'next/image'
import Link from 'next/link'
import { COMPANY, MAPS_URL } from '@/lib/company'
import type { LegalDoc } from '@/lib/legal-types'
import { pw } from '@/components/ui/Pw'
import styles from './DeliveryPage.module.css'
import StepBand from '@/components/ui/StepBand'
import { legalDocFor } from '@/lib/legal-en'
import { useLang } from '@/lib/i18n'

const QUESTIONS = [
  { number: '01', title: 'Lično preuzimanje', titleEn: 'Collection in person', body: 'Stovarište je u Banjoj Luci. Prije dolaska provjerite raspoloživost robe i dogovorite preuzimanje.', bodyEn: 'Our yard is in Banja Luka. Before you come, check that the goods are available and arrange the pick-up.', link: 'Pogledajte lokaciju', linkEn: 'See the location', href: MAPS_URL, external: true },
  { number: '02', title: 'Dostava na adresu', titleEn: 'Delivery to an address', body: 'Pošaljite adresu i spisak materijala. Prodaja će provjeriti mogućnost, termin i trošak isporuke.', bodyEn: 'Send the address and a list of materials. Sales will check whether delivery is possible and confirm the date and the delivery cost.', link: 'Pošaljite upit', linkEn: 'Send an enquiry', href: '/upit-za-izvodjace?vrsta=dostava' },
  { number: '03', title: 'Pristup i istovar', titleEn: 'Access and unloading', body: 'Navedite kakav je prilaz lokaciji i gdje robu treba odložiti. Način istovara dogovara se prema robi i uslovima na terenu.', bodyEn: 'Tell us what the approach to the site is like and where the goods should be placed. The unloading method is agreed according to the goods and the conditions on site.', link: 'Provjerite uslove', linkEn: 'Check the conditions', href: '#teska-roba-i-istovar' },
] as const

export default function DeliveryPage({ doc: srDoc }: { doc: LegalDoc }) {
  const { t, lang } = useLang()
  const doc = legalDocFor(srDoc, lang)
  return (
    <>
      <div className={styles.page}>
        <div className={styles.hero}>
          <div className={styles.copy}>
            <p className="label">{t('Kupovina · Dostava', 'Shopping · Delivery')}</p>
            <h1 className={`display ${styles.title}`}>{t('Dostava i preuzimanje materijala', 'Delivery and collection of materials')}</h1>
            <p className={styles.lead}>{t('Preuzmite robu u stovarištu ili pošaljite upit za isporuku. Mogućnost dostave, termin i uslove provjerite s prodajom prema robi i lokaciji.', 'Collect your goods at the yard or send a delivery enquiry. Check the possibility of delivery, the date and the terms with our sales team, based on the goods and the location.')}</p>
            <Link href="/upit-za-izvodjace?vrsta=dostava" className={styles.cta}>{t('Provjerite mogućnosti dostave', 'Check delivery options')} <span aria-hidden>↗</span></Link>
          </div>
          <figure className={styles.visual}>
            <Image src="/editorial/delivery-pickup-v2.webp" alt={t('Ilustrativna fotografija materijala pripremljenog za otpremu', 'Illustrative photograph of materials prepared for dispatch')} fill priority sizes="(max-width: 900px) 100vw, 50vw" className={styles.image} />
            <figcaption>{t('Priprema materijala · ilustracija', 'Preparing materials · illustration')}</figcaption>
          </figure>
        </div>

        <div className={styles.questions}>
          {QUESTIONS.map(item => <article className={styles.question} key={item.number}>
            <span className={styles.number}>{item.number}</span>
            <h2>{t(item.title, item.titleEn)}</h2>
            <p>{t(item.body, item.bodyEn)}</p>
            {'external' in item && item.external ? <a href={item.href} target="_blank" rel="noopener noreferrer">{t(item.link, item.linkEn)} <span aria-hidden>↗</span></a> : <Link href={item.href}>{t(item.link, item.linkEn)} <span aria-hidden>↗</span></Link>}
          </article>)}
        </div>

        <StepBand as="div" tone="navy" profile="valley" steps={11} className="!z-[25]">
        <section className={styles.brief} aria-labelledby="delivery-brief-title">
          <div><p className="label">{t('Za upit prodaji', 'For your enquiry to sales')}</p><h2 id="delivery-brief-title">{t('Šta nam poslati?', 'What should you send us?')}</h2></div>
          <div className={styles.briefFields}>
            {t(['Materijal i količina', 'Adresa ili lično preuzimanje', 'Željeni termin', 'Uslovi prilaza i istovara'], ['Material and quantity', 'Address or collection in person', 'Preferred date', 'Access and unloading conditions']).map((field, index) => <p key={field}><span>0{index + 1}</span>{field}</p>)}
          </div>
          <Link href="/upit-za-izvodjace?vrsta=dostava" className={styles.briefLink}>{t('Pošaljite spisak materijala', 'Send a list of materials')} <span aria-hidden>↗</span></Link>
        </section>
        </StepBand>
      </div>
      <section className={styles.terms} aria-labelledby="delivery-terms-title">
        <div className={styles.termsIntro}><p className="label">{t('Detalji usluge', 'Service details')}</p><h2 id="delivery-terms-title">{t('Uslovi dostave i preuzimanja', 'Delivery and collection terms')}</h2><p>{t('Za konkretan termin i način isporuke kontaktirajte prodaju na', 'For a specific date and delivery method, contact sales on')} {COMPANY.phone}.</p></div>
        <div className={styles.termSections}>{doc.sections.map(section => <section id={section.id} key={section.id} className={styles.termSection}><h3>{pw(section.title)}</h3><DeliveryBlocks blocks={section.blocks} /></section>)}</div>
        <Link href="/sve-politike" className={styles.policies}>{t('Sve politike', 'All policies')} ↗</Link>
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
