'use client'

import Link from 'next/link'
import { useRef } from 'react'
import BlueWipe from '@/components/ui/BlueWipe'
import Cta from '@/components/ui/Cta'
import { gsap, useGSAP } from '@/lib/gsap'
import { drawOnScroll } from '@/lib/draw'
import { MQ } from '@/lib/motion'
import { revealChars } from '@/lib/reveal'
import { axisShift } from './iso'
import WorkArt, { type WorkKind } from './WorkArt'
import styles from './WorkSections.module.css'

const WORKS: { id: WorkKind; title: string; label: string; description: string; href: string; cta: string }[] = [
  { id:'suha-gradnja', title:'Pregradni zidovi i plafoni', label:'Suha gradnja', description:'Ploče, profili, izolacija i pribor — povežite komponente prema namjeni prostora.', href:'/prodavnica?kategorija=suha-gradnja#artikli', cta:'Materijal za suhu gradnju' },
  { id:'izolacija', title:'Izolacija prostora', label:'Toplotna i zvučna', description:'Krenite od mjesta ugradnje: zid, krov ili pod. Zatim izaberite materijal.', href:'/prodavnica?kategorija=izolacija#artikli', cta:'Izolacija prema namjeni' },
  { id:'zidanje-krov', title:'Zidanje i krov', label:'Program po upitu', description:'Pošaljite specifikaciju za provjeru programa, količina i dostupnosti.', href:'/upit-za-izvodjace?program=zidni-krovni', cta:'Pošaljite specifikaciju' },
  { id:'kupatilo', title:'Opremanje kupatila', label:'Sanitarni program', description:'Istražite program i zatražite ponudu prema potrebama svog prostora.', href:'/prodavnica?kategorija=sanitarna-oprema#artikli', cta:'Istražite sanitarnu opremu' },
]

export default function UsesSplit() {
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
          if(reduce)return
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
  },{scope:root})

  return <section ref={root} id="namjena" aria-labelledby="work-heading" className="relative z-20 bg-bg md:grid md:grid-cols-2">
    <div className={styles.panel}>
      <h2 id="work-heading" data-head className={`display invisible ${styles.heading}`}>Materijal<br />prema vrsti<br />radova</h2>
      <div className={styles.foot}>
        <Cta href="/upit-za-izvodjace" solid>Pošaljite spisak</Cta>
      </div>
    </div>
    <BlueWipe from="right" className="text-bg [--art-fill:var(--navy)] [--signal:var(--accent)]">
      {WORKS.map((work,i)=><article id={`radovi-${work.id}`} key={work.id} data-use className={`scroll-mt-24 ${styles.row}`}>
        <div>
          <p className="label flex items-center justify-between gap-6 text-bg/65"><span>{String(i+1).padStart(2,'0')} / 04</span><span>{work.label}</span></p>
          <h3 data-title className={`display invisible ${styles.title}`}>{work.title}</h3>
        </div>
        <div className={styles.illustration}><WorkArt kind={work.id} /></div>
        <div className={styles.bottom}>
          <p className={styles.description}>{work.description}</p>
          <div className={styles.actions}>
            <Cta href={work.href} className={styles.button}>{work.cta}</Cta>
            {work.id==='suha-gradnja' && <Link href="/kalkulator" className="ulink inline-flex min-h-11 items-center gap-3 text-[11px]">Kalkulator za pregradni zid<span aria-hidden>→</span></Link>}
          </div>
        </div>
      </article>)}
    </BlueWipe>
  </section>
}
