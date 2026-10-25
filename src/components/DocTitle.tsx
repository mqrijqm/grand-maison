'use client'

import { useEffect } from 'react'
import { useLang } from '@/lib/i18n'
import { POSTS } from '@/lib/posts'
import { POSTS_EN } from '@/lib/posts-en'

// Metadata u Next-u ostaje statična i srpska. Kad je izabran engleski, ova komponenta prepisuje
// document.title i meta description za poznate stranice (tačno poklapanje srpskog teksta); ostalo ostaje kako jeste.
const TITLES: Record<string, string> = {
  'GRAND COMPANY — Građevinski materijal, Banja Luka': 'GRAND COMPANY — Building materials, Banja Luka',
  'Kontakt | Grand Company': 'Contact | Grand Company',
  'Vodiči | Grand Company': 'Guides | Grand Company',
  'Katalog | Grand Company': 'Catalogue | Grand Company',
  'Kalkulator materijala | Grand Company': 'Materials calculator | Grand Company',
  'Kalkulatori za krov i zid | Grand Company': 'Roof and wall calculators | Grand Company',
  'Za firme · B2B portal | Grand Company': 'For businesses · B2B portal | Grand Company',
  'Objava nije pronađena': 'Guide not found',
  'Artikal nije pronađen': 'Product not found',
}
const DESCRIPTIONS: Record<string, string> = {
  'GRAND COMPANY d.o.o. iz Banje Luke: veleprodaja i maloprodaja građevinskog materijala, sistemi suhe gradnje i kamena vuna. Pristupačne cijene i stručan savjet.':
    'GRAND COMPANY d.o.o. of Banja Luka: wholesale and retail of building materials, drywall systems and stone wool. Fair prices and expert advice.',
  'Kontakt prodaje za firme i izvođače: telefon, e-pošta, adresa stovarišta u Banjoj Luci i radno vrijeme.':
    'Sales contact for companies and contractors: phone, e-mail, yard address in Banja Luka and opening hours.',
  'Praktični vodiči o suhoj gradnji, izolaciji, fasadi i isporuci.':
    'Practical guides to drywall, insulation, facades and delivery.',
  'Upišite dužinu i visinu pregradnog zida i dobijte orijentacioni proračun materijala, zaokružen na cijela pakovanja.':
    'Enter the length and height of a partition wall and get an indicative material estimate, rounded up to whole packs.',
}
for (const post of POSTS) {
  const en = POSTS_EN[post.slug]
  if (!en) continue
  TITLES[`${post.title} | Grand Company`] = `${en.title} | Grand Company`
  DESCRIPTIONS[post.lead] = en.lead
}

export default function DocTitle() {
  const { lang } = useLang()

  useEffect(() => {
    const titleEl = document.querySelector('title')
    if (!titleEl) return
    const orig = { title: document.title, desc: '' }
    const meta = () => document.querySelector<HTMLMetaElement>('meta[name="description"]')
    let busy = false

    const apply = () => {
      if (busy) return
      busy = true
      const sr = Object.keys(TITLES).find((k) => TITLES[k] === document.title)
      if (sr) orig.title = sr
      else if (!Object.values(TITLES).includes(document.title)) orig.title = document.title
      const m = meta()
      if (m) {
        const srDesc = Object.keys(DESCRIPTIONS).find((k) => DESCRIPTIONS[k] === m.content)
        if (srDesc) orig.desc = srDesc
        else if (!Object.values(DESCRIPTIONS).includes(m.content)) orig.desc = m.content
      }
      const nextTitle = lang === 'en' ? (TITLES[orig.title] ?? orig.title) : orig.title
      if (document.title !== nextTitle) document.title = nextTitle
      if (m && orig.desc) {
        const nextDesc = lang === 'en' ? (DESCRIPTIONS[orig.desc] ?? orig.desc) : orig.desc
        if (m.content !== nextDesc) m.content = nextDesc
      }
      busy = false
    }

    apply()
    const observer = new MutationObserver(apply)
    observer.observe(document.head, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['content'] })
    return () => observer.disconnect()
  }, [lang])

  return null
}
