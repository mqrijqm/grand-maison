'use client'

import { useRef } from 'react'
import { useLang } from '@/lib/i18n'
import BlueWipe from '@/components/ui/BlueWipe'
import Cta from '@/components/ui/Cta'
import SquareDissolve from '@/components/ui/SquareDissolve'
import { gsap, useGSAP } from '@/lib/gsap'
import { drawOnScroll } from '@/lib/draw'
import { MQ } from '@/lib/motion'
import { revealChars } from '@/lib/reveal'
import { axisShift } from './iso'
import WorkArt, { type WorkKind } from './WorkArt'
import styles from './WorkSections.module.css'

// Svaki red = jedan posao i kategorija iz verifikovanog researcha (2026-09-17). Samo kategorije, bez
// pojedinačnih artikala. Kupatilo je sanitarna oprema (registrovana djelatnost), ne pločice. Zid i krov
// su na Wienerbergerovoj listi prodajnih mjesta (2020): vode na Tondach/Porotherm u katalogu, dostupnost po upitu.
const WORKS: { id: WorkKind; title: string; label: string; description: string; href: string; cta: string; en: { title: string; label: string; description: string; cta: string } }[] = [
  { id:'suha-gradnja', title:'Pregradni zid ili spušteni plafon', label:'Suha gradnja', description:'Ploče, profili i pribor.', href:'/prodavnica?kategorija=suha-gradnja#artikli', cta:'Materijal za suhu gradnju', en:{ title:'Partition wall or suspended ceiling', label:'Drywall', description:'Boards, profiles and accessories.', cta:'Drywall materials' } },
  { id:'izolacija', title:'Toplotna i zvučna izolacija', label:'Kamena vuna', description:'Kamena vuna za zid i krov.', href:'/prodavnica?kategorija=izolacija#artikli', cta:'Materijal za izolaciju', en:{ title:'Thermal and acoustic insulation', label:'Stone wool', description:'Stone wool for walls and roofs.', cta:'Insulation materials' } },
  { id:'zidanje-krov', title:'Zidanje i pokrivanje krova', label:'Tondach i Porotherm', description:'Crijep i opeka; dostupnost modela po upitu.', href:'/prodavnica?kategorija=krovni-sistemi,zidni-blokovi#artikli', cta:'Crijep i opeka', en:{ title:'Masonry and roofing', label:'Tondach and Porotherm', description:'Roof tiles and bricks; model availability on request.', cta:'Roof tiles and bricks' } },
  { id:'kupatilo', title:'Sanitarna oprema za kupatilo', label:'Sanitarna oprema', description:'Program i dostupnost po upitu.', href:'/upit-za-izvodjace?program=sanitarna-oprema', cta:'Upit za sanitarnu opremu', en:{ title:'Bathroom sanitaryware', label:'Sanitaryware', description:'Range and availability on request.', cta:'Sanitaryware enquiry' } },
]

export default function UsesSplit() {
  const { t, lang } = useLang()
  const root=useRef<HTMLElement>(null)
  useGSAP(()=>{
    const el=root.current!
    const mm=gsap.matchMedia()
    mm.add(MQ,ctx=>{
      const { reduce }=ctx.conditions as { reduce:boolean }
      revealChars(el.querySelector('[data-head]')!,reduce,'top 75%')
      gsap.utils.toArray<HTMLElement>('[data-use]',el).forEach(row=>{
        revealChars(row.querySelector('[data-title]')!,reduce,'top 80%',row)
        row.querySelectorAll<SVGSVGElement>('[data-work-art] svg').forEach(svg=>{
          drawOnScroll(svg,reduce,{trigger:row,start:'top bottom'})
          // Telefon/tablet: bez razmicanja slojeva uz skrol (SVG bi se precrtavao svaki frejm); crtež ostaje.
          if(reduce||window.matchMedia('(hover: none), (pointer: coarse), (max-width: 1023px)').matches)return
          const axis=svg.dataset.axis as 'x'|'y'|'z'
          const gap=Number(svg.dataset.gap)
          if(!gap)return
          gsap.utils.toArray<SVGGElement>('[data-layer]',svg).forEach((layer,k)=>{
            const { x,y }=axisShift(axis,k*gap)
            gsap.fromTo(layer,{x:0,y:0},{x,y,ease:'none',scrollTrigger:{trigger:row,start:'top 60%',end:'bottom 30%',scrub:.8}})
          })
        })
      })
    })
  },{scope:root,dependencies:[lang]})

  return <section ref={root} id="namjena" aria-labelledby="work-heading" className="relative z-20 bg-bg md:grid md:grid-cols-2">
    <div className={styles.panel}>
      <h2 key={lang} id="work-heading" data-head className={`display invisible ${styles.heading}`}>{t(<>Šta<br />gradite?</>,<>What are<br />you building?</>)}</h2>
      <div className={styles.foot}>
        <p className="text-[14px] leading-[1.7] opacity-75">{t('Četiri vrste radova, od zida do kupatila.','Four types of work, from the wall to the bathroom.')}</p>
        <Cta href="/upit-za-izvodjace" solid>{t('Opišite šta gradite','Tell us what you are building')}</Cta>
      </div>
    </div>
    <BlueWipe from="right" ambient className="text-bg [--art-fill:var(--navy)] [--signal:var(--accent)]">
      {WORKS.map((work,i)=><article id={`radovi-${work.id}`} key={work.id} data-use className={`scroll-mt-24 ${styles.row} md:!min-h-[72dvh]`}>
        <div>
          <p className="label text-bg/65">{String(i+1).padStart(2,'0')} / 04</p>
          <h3 key={lang} data-title className={`display invisible ${styles.title}`}>{t(work.title,work.en.title)}</h3>
        </div>
        <div className={styles.illustration}><WorkArt kind={work.id} /></div>
        <div className={styles.bottom}>
          <p className={styles.description}>{t(work.description,work.en.description)}</p>
          <div className={styles.actions}>
            <Cta href={work.href} className={styles.button}>{t(work.cta,work.en.cta)}</Cta>
          </div>
        </div>
      </article>)}
      {/* Izlaz iz sekcije: plavo se raspe u krem kvadratiće, kao na ulazu */}
      <SquareDissolve className="h-[48vh]" />
    </BlueWipe>
  </section>
}
